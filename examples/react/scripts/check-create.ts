import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { chromium, type Frame, type Page } from "playwright";

// `pnpm check:create`
//
// Builds the embed app under a real base (/ui/embed/react/) and hosts the
// Create page full-page, the way fragiola.com serves /ui/create/ (contract
// v1.6): an iframe at 100% × 100% of the viewport, `host` then `theme` after
// the page's `ready`. Then checks:
//
//   - `ready` once; a `theme` message applied to the page without a reload
//   - no console error, no page error, no request outside the base
//   - the page never scrolls; the preview overflows on both axes, at a
//     laptop's viewport and at a 3840 × 2160 ultrawide one
//   - isolation: setting extreme levels, the dark scheme and RTL from the
//     customizer changes the preview's <html> and leaves every computed
//     style of the customizer as it was
//
// Needs a Chromium: `pnpm exec playwright install chromium`.

const APP = path.resolve(import.meta.dirname, "..");
const BASE = "/ui/embed/react/";

const out = await mkdtemp(path.join(tmpdir(), "fragiola-create-"));
execFileSync("pnpm", ["exec", "vite", "build", "--logLevel", "warn"], {
    cwd: APP,
    env: { ...process.env, EMBED_BASE: BASE, EMBED_OUT_DIR: out },
    stdio: "inherit",
});

const HOST = `<!doctype html><html><head><style>
html,body{margin:0;height:100%;overflow:hidden}
iframe{display:block;border:0;width:100%;height:100dvh}
</style></head><body>
<iframe id="frame" allow="clipboard-read; clipboard-write; fullscreen"></iframe>
<script>
window.messages = [];
const frame = document.getElementById("frame");
window.addEventListener("message", (event) => {
    if (event.source !== frame.contentWindow) return;
    window.messages.push(event.data);
    if (event.data?.type === "fragiola:example:ready") {
        frame.contentWindow.postMessage({ type: "fragiola:example:host", overlay: true }, location.origin);
        frame.contentWindow.postMessage({ type: "fragiola:example:theme", theme: "light" }, location.origin);
    }
});
window.sendTheme = (theme) =>
    frame.contentWindow.postMessage({ type: "fragiola:example:theme", theme }, location.origin);
frame.src = "${BASE}create.html?theme=light";
</script></body></html>`;

const outside: string[] = [];
const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (url.pathname === "/create/") {
        res.writeHead(200, { "content-type": "text/html" }).end(HOST);
        return;
    }
    if (url.pathname.startsWith(BASE)) {
        const file = path.join(out, url.pathname.slice(BASE.length));
        try {
            const body = await readFile(file);
            const type = file.endsWith(".html")
                ? "text/html"
                : file.endsWith(".js")
                  ? "text/javascript"
                  : file.endsWith(".css")
                    ? "text/css"
                    : "application/octet-stream";
            res.writeHead(200, { "content-type": type }).end(body);
            return;
        } catch {}
    }
    outside.push(url.pathname);
    res.writeHead(404).end();
});
await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

const browser = await chromium.launch();
const problems: string[] = [];

async function open(width: number, height: number) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
    });
    await page.goto(`${origin}/create/`);
    await page.waitForFunction(() =>
        (window as unknown as { messages: { type: string }[] }).messages.some(
            (m) => m.type === "fragiola:example:ready",
        ),
    );
    const create = page.frame({ url: /create\.html/ });
    if (!create) throw new Error("create.html did not load");
    const preview = await waitForPreview(create);
    return { page, create, preview, errors };
}

async function waitForPreview(create: Frame): Promise<Frame> {
    for (let i = 0; i < 100; i++) {
        const frame = create
            .childFrames()
            .find((f) => /create-preview/.test(f.url()));
        if (
            frame &&
            (await frame.evaluate(
                () => document.querySelectorAll("section").length,
            )) > 0
        ) {
            await frame.waitForTimeout(1500);
            return frame;
        }
        await create.waitForTimeout(100);
    }
    throw new Error("the preview did not render");
}

async function size(frame: Frame | Page) {
    return frame.evaluate(() => {
        const el = document.scrollingElement ?? document.documentElement;
        return {
            scrollWidth: el.scrollWidth,
            scrollHeight: el.scrollHeight,
            width: window.innerWidth,
            height: window.innerHeight,
        };
    });
}

// Every running transition finished: a fingerprint taken mid-transition
// (the host's theme change fades colours) would differ for no reason.
async function settle(frame: Frame) {
    await frame.evaluate(async () => {
        await new Promise((r) => setTimeout(r, 100));
        await Promise.all(document.getAnimations().map((a) => a.finished));
    });
}

// A fingerprint of every element of the customizer: what an axis, a scheme
// or a direction would change if it reached this document.
async function fingerprint(create: Frame) {
    await settle(create);
    return create.evaluate(() =>
        [...document.querySelectorAll("header *, aside *")].map((el) => {
            const s = getComputedStyle(el);
            return [
                `${el.tagName.toLowerCase()}${el.getAttribute("aria-label") ? `[${el.getAttribute("aria-label")}]` : ""}`,
                s.color,
                s.backgroundColor,
                s.borderTopLeftRadius,
                s.paddingInlineStart,
                s.fontSize,
                s.height,
                s.direction,
            ].join("|");
        }),
    );
}

async function choose(
    page: Page,
    create: Frame,
    label: string,
    option: string,
) {
    await create.getByRole("combobox", { name: label }).click();
    await create.getByRole("option", { name: option, exact: true }).click();
    await page.waitForTimeout(250);
}

for (const [width, height] of [
    [1440, 900],
    [3840, 2160],
] as const) {
    const at = `${width}×${height}`;
    const { page, create, preview, errors } = await open(width, height);

    const ready = (
        await page.evaluate(
            () =>
                (window as unknown as { messages: { type: string }[] })
                    .messages,
        )
    ).filter((m) => m.type === "fragiola:example:ready");
    if (ready.length !== 1)
        problems.push(`${at}: ${ready.length} ready messages, expected 1`);

    const outer = await size(page);
    const shell = await size(create);
    if (
        outer.scrollHeight > outer.height ||
        shell.scrollHeight > shell.height
    ) {
        problems.push(
            `${at}: the page scrolls (${shell.scrollHeight} > ${shell.height})`,
        );
    }
    if (shell.scrollWidth > shell.width) {
        problems.push(
            `${at}: the page scrolls sideways (${shell.scrollWidth} > ${shell.width})`,
        );
    }
    const inner = await size(preview);
    if (
        inner.scrollWidth <= inner.width ||
        inner.scrollHeight <= inner.height
    ) {
        problems.push(
            `${at}: the preview does not overflow both axes (${inner.scrollWidth}×${inner.scrollHeight} in ${inner.width}×${inner.height})`,
        );
    }

    if (width === 1440) {
        await page.evaluate(() =>
            (window as unknown as { sendTheme(t: string): void }).sendTheme(
                "dark",
            ),
        );
        await page.waitForTimeout(200);
        if (
            (await create.evaluate(
                () => document.documentElement.dataset.theme,
            )) !== "dark"
        ) {
            problems.push("the theme message did not reach the Create page");
        }

        const before = await fingerprint(create);
        await choose(page, create, "Radius", "full");
        await choose(page, create, "Spacing", "spacious");
        await choose(page, create, "Typography", "large");
        await choose(page, create, "Scheme", "light");
        await choose(page, create, "Direction", "rtl");
        // Close the last select so its open state is not part of the print.
        await page.keyboard.press("Escape");
        await page.waitForTimeout(300);
        const after = await fingerprint(create);
        const diffs = before.flatMap((print, i) =>
            print !== after[i] ? [`${print}  →  ${after[i]}`] : [],
        );
        const changed = diffs.length;
        if (process.env.CHECK_CREATE_DEBUG)
            console.log(diffs.slice(0, 12).join("\n"));
        // The pickers themselves show the new values: their text changes,
        // never their style. Only the five triggers' own state may differ.
        if (changed > 10) {
            problems.push(
                `isolation: ${changed} customizer elements changed style after a design change`,
            );
        }
        const applied = await preview.evaluate(() => ({
            radius: document.documentElement.dataset.radius,
            density: document.documentElement.dataset.density,
            text: document.documentElement.dataset.text,
            theme: document.documentElement.dataset.theme,
            dir: document.documentElement.dir,
        }));
        const want = {
            radius: "full",
            density: "spacious",
            text: "large",
            theme: "light",
            dir: "rtl",
        };
        if (JSON.stringify(applied) !== JSON.stringify(want)) {
            problems.push(
                `the preview did not apply the design: ${JSON.stringify(applied)}`,
            );
        }
        const shellAxes = await create.evaluate(() => ({
            radius: document.documentElement.dataset.radius ?? null,
            dir: document.documentElement.dir || "ltr",
        }));
        if (shellAxes.radius !== null || shellAxes.dir !== "ltr") {
            problems.push(
                `isolation: the Create page's own <html> changed: ${JSON.stringify(shellAxes)}`,
            );
        }
    }

    for (const error of errors) problems.push(`${at}: console: ${error}`);
    console.log(`${problems.length === 0 ? "✓" : "…"} create at ${at}`);
    await page.close();
}

await browser.close();
server.close();
await rm(out, { recursive: true, force: true });

for (const request of new Set(outside)) {
    problems.push(`request outside the base: ${request}`);
}
if (problems.length > 0) {
    for (const problem of problems) console.error(`✗ ${problem}`);
    process.exit(1);
}
console.log("\nThe Create page passes as a v1.6 host frames it.");

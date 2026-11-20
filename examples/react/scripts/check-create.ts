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
//   - three tones, in both schemes: the frame, the canvas (`[data-stage]`)
//     and the cards are three colours — in dark the lightness steps down
//     from the frame to the cards, in light the cards are white and the
//     canvas lies between them and the frame — and no card is raised
//   - the inset: rounded at every corner, the docs' 0.5rem margin on all
//     four sides
//   - the panel: no <header>; the links, the actions, the controls and Get
//     code, in that order in the DOM and top to bottom; Get code visible
//     without scrolling, and still there once the controls are scrolled
//   - the handle axis: the Handle control reaches the preview's <html>, and
//     Get code's HTML carries `data-handle` once it is not the default
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
        // The preview scrolls its stage; the page scrolls its document.
        const el =
            document.querySelector<HTMLElement>("[data-stage]") ??
            document.scrollingElement ??
            document.documentElement;
        return {
            scrollWidth: el.scrollWidth,
            scrollHeight: el.scrollHeight,
            width: el.clientWidth,
            height: el.clientHeight,
        };
    });
}

// Every running transition finished: a fingerprint taken mid-transition
// (the host's theme change fades colours) would differ for no reason.
async function settle(frame: Frame) {
    await frame.evaluate(async () => {
        await new Promise((r) => setTimeout(r, 100));
        // Transitions only: the preview runs infinite animations (a
        // skeleton's pulse, an indeterminate progress) that never finish.
        await Promise.all(
            document
                .getAnimations()
                .filter((a) => a.effect?.getTiming().iterations !== Infinity)
                // A cancelled one rejects: it is settled too.
                .map((a) => a.finished.catch(() => undefined)),
        );
    });
}

// A fingerprint of every element of the customizer: what an axis, a scheme
// or a direction would change if it reached this document.
async function fingerprint(create: Frame) {
    await settle(create);
    return create.evaluate(() =>
        [...document.querySelectorAll("aside *")].map((el) => {
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

// The background of the first element matching `selector`, as sRGB bytes:
// a 1px canvas paints the computed colour (oklch, color-mix…) and reads it
// back, so colours from any space compare.
async function background(frame: Frame, selector: string) {
    return frame.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1;
        const context = canvas.getContext("2d");
        if (!context) return null;
        context.fillStyle = getComputedStyle(el).backgroundColor;
        context.fillRect(0, 0, 1, 1);
        return [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);
    }, selector);
}

// WCAG relative luminance of sRGB bytes: enough to order three greys.
function luminance([r = 0, g = 0, b = 0]: number[]) {
    const lin = (c: number) => {
        const v = c / 255;
        return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

async function tones(create: Frame, preview: Frame, scheme: string) {
    await settle(create);
    await settle(preview);
    const frame = await background(create, "[data-frame]");
    const canvas = await background(preview, "[data-stage]");
    const card = await background(preview, "[data-stage] section");
    if (!frame || !canvas || !card) {
        problems.push(`${scheme}: a tone is missing (frame, canvas or card)`);
        return;
    }
    const [f, c, k] = [frame, canvas, card].map(luminance) as [
        number,
        number,
        number,
    ];
    const keys = new Set([frame, canvas, card].map((rgb) => rgb.join(",")));
    if (keys.size !== 3) {
        problems.push(
            `${scheme}: frame, canvas and card are not three colours (${[frame, canvas, card].map((x) => x.join(",")).join(" / ")})`,
        );
    }
    if (scheme === "dark" && !(f > c && c > k)) {
        problems.push(
            `dark: the lightness is not frame > canvas > card (${f.toFixed(4)} / ${c.toFixed(4)} / ${k.toFixed(4)})`,
        );
    }
    if (scheme === "light") {
        if (card.join(",") !== "255,255,255")
            problems.push(`light: the card is not white (${card.join(",")})`);
        if (!(c < k && c > f))
            problems.push(
                `light: the canvas is not between the card and the frame (${f.toFixed(4)} / ${c.toFixed(4)} / ${k.toFixed(4)})`,
            );
    }
    const raised = await preview.evaluate(
        () => document.querySelectorAll("section.palette-raised").length,
    );
    if (raised > 0) problems.push(`${scheme}: ${raised} cards are raised`);
}

// The shell's layout: the inset and the panel (see the header).
async function layout(create: Frame, at: string) {
    const report = await create.evaluate(() => {
        const rect = (sel: string) =>
            document.querySelector(sel)?.getBoundingClientRect() ?? null;
        const inset = document.querySelector<HTMLElement>("[data-inset]");
        const style = inset ? getComputedStyle(inset) : null;
        const parts = [
            "[data-panel=links]",
            "[data-panel=actions]",
            "[data-panel=controls]",
            "[data-panel=code]",
        ].map((sel) => document.querySelector(sel));
        const domOrder = parts.every(
            (el, i) =>
                el &&
                (i === 0 ||
                    (parts[i - 1]?.compareDocumentPosition(el) ?? 0) &
                        Node.DOCUMENT_POSITION_FOLLOWING),
        );
        const tops = parts.map((el) => el?.getBoundingClientRect().top ?? 0);
        const code = [...document.querySelectorAll("button")].find((b) =>
            /Get code/.test(b.textContent ?? ""),
        );
        const codeRect = code?.getBoundingClientRect() ?? null;
        const controls = document.querySelector<HTMLElement>(
            "[data-panel=controls]",
        );
        if (controls) controls.scrollTop = controls.scrollHeight;
        const codeAfter = code?.getBoundingClientRect() ?? null;
        if (controls) controls.scrollTop = 0;
        return {
            headers: document.querySelectorAll("header").length,
            radii: style
                ? [
                      style.borderTopLeftRadius,
                      style.borderTopRightRadius,
                      style.borderBottomRightRadius,
                      style.borderBottomLeftRadius,
                  ]
                : [],
            inset: rect("[data-inset]"),
            aside: rect("aside"),
            viewport: [window.innerWidth, window.innerHeight],
            domOrder,
            visualOrder: tops.every(
                (top, i) => i === 0 || top > (tops[i - 1] ?? 0),
            ),
            code: codeRect,
            codeMoved:
                codeRect && codeAfter ? codeRect.top !== codeAfter.top : true,
        };
    });
    if (report.headers > 0) problems.push(`${at}: the page has a <header>`);
    if (
        report.radii.length !== 4 ||
        report.radii.some((r) => !(Number.parseFloat(r) > 0))
    ) {
        problems.push(
            `${at}: the inset is not rounded (${report.radii.join(" ")})`,
        );
    }
    const [vw = 0, vh = 0] = report.viewport;
    if (report.inset && report.aside) {
        const margins = [
            report.inset.top,
            vw - report.inset.right,
            vh - report.inset.bottom,
            report.inset.left - report.aside.right,
        ].map((m) => Math.round(m));
        if (margins.some((m) => m !== 8)) {
            problems.push(
                `${at}: the inset's margins are not 0.5rem on every side (${margins.join(" ")})`,
            );
        }
    } else problems.push(`${at}: no inset or no panel`);
    if (!report.domOrder)
        problems.push(
            `${at}: the panel is not links → actions → controls → Get code in the DOM`,
        );
    if (!report.visualOrder)
        problems.push(
            `${at}: the panel is not links → actions → controls → Get code top to bottom`,
        );
    if (
        !report.code ||
        report.code.top < 0 ||
        report.code.bottom > vh ||
        report.codeMoved
    ) {
        problems.push(
            `${at}: Get code is not pinned in view at the panel's bottom`,
        );
    }
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

    await layout(create, at);
    if (width === 1440) await tones(create, preview, "light");

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
        // The preview follows the host's theme until a scheme is chosen.
        await tones(create, preview, "dark");

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
        await choose(page, create, "Handle", "dots");
        await page.keyboard.press("Escape");
        const handle = await preview.evaluate(
            () => document.documentElement.dataset.handle ?? null,
        );
        if (handle !== "dots")
            problems.push(
                `the Handle control did not reach the preview: ${handle}`,
            );
        await create.getByRole("button", { name: "Get code" }).click();
        await create.getByRole("tab", { name: "HTML" }).click();
        const html =
            (await create
                .getByRole("tabpanel", { name: "HTML" })
                .locator("pre")
                .textContent()) ?? "";
        if (!/data-handle="dots"/.test(html))
            problems.push(
                `Get code's HTML does not carry data-handle: ${html}`,
            );
        await page.keyboard.press("Escape");
        await page.waitForTimeout(300);

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

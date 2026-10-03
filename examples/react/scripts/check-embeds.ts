import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";
import { chromium, type Frame, type Locator, type Page } from "playwright";
import { THEMES } from "../../gallery.ts";

// `pnpm check:embeds [--width <px>] [--floors] [--screenshots <dir>] [id…]`
//
// Builds the embed app under a real base (/ui/embed/react/), hosts every
// example in an iframe the way the site does, and checks what the contract
// asks of it (§5):
//
//   - `ready` exactly once, before any `resize`; at least one `resize` for a
//     `flow` example (and a content height from it), none for `fill`
//   - `?theme=` applied before the example renders; missing or unknown →
//     the first light theme; a `theme` message applied without a reload
//   - no console error, no page error, no request outside the base (except
//     the avatar's deliberately broken image and its remote images)
//   - the chart draws its three charts (ECharts' SVG renderer)
//   - every popup of an overlay example opens at the manifest's `height`
//     exactly as it does in a very tall frame — same size, same side, same
//     offset from its trigger, nothing clipped or scrolling. Base UI fits a
//     popup into the space left (flip, shift, `--available-height`), so a
//     floor that is too low shows up as a moved or squeezed popup
//
// --floors      for each overlay example, report the lowest frame height at
//               which every popup passes, and each example's content height
// --screenshots write one PNG per example and theme, and one per open
//               popup, for a human to look at
// --width       the frame's width (default 720, the docs column)
//
// Needs a Chromium: `pnpm exec playwright install chromium`.
const APP = path.resolve(import.meta.dirname, "..");
const BASE = "/ui/embed/react/";
const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
        floors: { type: "boolean", default: false },
        screenshots: { type: "string" },
        // The docs column is about 720px wide; the gallery's stage is wider.
        width: { type: "string", default: "720" },
    },
});
const WIDTH = Number(values.width);
// A frame tall enough that every popup opens where it wants to.
const ROOM = 1400;
// Where the floor search starts for a `fill` example, which has no content
// height to start from: its frame IS its height.
const FILL_FROM = 240;

// How each overlay example opens its popups. `click` finds every trigger in
// the stage (`aria-haspopup`, a combobox, a navigation trigger), opens it,
// checks the popup and one level of submenus, and closes it again.
type Opener = "click" | "hover" | "contextmenu";
const OVERLAYS: Record<string, Opener> = {
    select: "click",
    combobox: "click",
    "dropdown-menu": "click",
    "context-menu": "contextmenu",
    dialog: "click",
    "alert-dialog": "click",
    drawer: "click",
    popover: "click",
    tooltip: "hover",
    "navigation-menu": "click",
    // The team switcher, the user menu and each project's actions. Its own
    // Trigger opens nothing on desktop (it collapses the column); it comes
    // last in the markup, so every menu is checked expanded first.
    sidebar: "click",
    // The overflow menu of the narrow tabset (a DropdownMenu); the other
    // header buttons open no popup.
    dockable: "click",
};

type ManifestExample = {
    id: string;
    layout: "fill" | "flow";
    height: number;
};

// ─── Build and serve ────────────────────────────────────────────────────────

const out = await mkdtemp(path.join(tmpdir(), "fragiola-embeds-"));
const env = { ...process.env, EMBED_BASE: BASE, EMBED_OUT_DIR: out };
execFileSync("pnpm", ["exec", "vite", "build", "--logLevel", "warn"], {
    cwd: APP,
    env,
    stdio: "inherit",
});
execFileSync("node", ["scripts/build-manifest.ts"], {
    cwd: APP,
    env,
    stdio: "inherit",
});
const manifest = JSON.parse(
    await readFile(path.join(out, "manifest.json"), "utf-8"),
) as { examples: ManifestExample[] };

// The host page: an iframe that stays transparent until `ready` and follows
// `resize` above the floor — what the site's frame does.
const HOST = `<!doctype html>
<html><body style="margin:0">
<iframe id="frame" style="display:block;border:0;opacity:0"></iframe>
<script>
const params = new URLSearchParams(location.search);
const frame = document.getElementById("frame");
const floor = Number(params.get("floor"));
window.messages = [];
frame.style.width = params.get("width") + "px";
frame.style.height = floor + "px";
addEventListener("message", (event) => {
    if (event.source !== frame.contentWindow) return;
    window.messages.push(event.data);
    if (event.data.type === "fragiola:example:ready") frame.style.opacity = "1";
    if (event.data.type === "fragiola:example:resize") {
        frame.style.height = Math.max(floor, event.data.height) + "px";
    }
});
const src = new URL("${BASE}index.html", location.href);
src.searchParams.set("id", params.get("id"));
if (params.has("theme")) src.searchParams.set("theme", params.get("theme"));
frame.src = src.href;
</script>
</body></html>`;

const outside: string[] = [];
const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (url.pathname === "/host.html") {
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
    // The avatar example points an image at a missing file on purpose.
    if (url.pathname !== "/broken.jpg") outside.push(url.pathname);
    res.writeHead(404).end();
});
await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

// ─── Checks ─────────────────────────────────────────────────────────────────

const browser = await chromium.launch();
const problems: string[] = [];

type Message = { type: string; id?: string; height?: number; theme?: string };

async function open(
    page: Page,
    id: string,
    floor: number,
    options: { theme?: string } = {},
): Promise<Frame> {
    const query = new URLSearchParams({
        id,
        floor: String(floor),
        width: String(WIDTH),
    });
    if (options.theme !== undefined) query.set("theme", options.theme);
    await page.goto(`${origin}/host.html?${query}`);
    await page.waitForFunction(
        () =>
            (window as unknown as { messages: Message[] }).messages.some(
                (m) => m.type === "fragiola:example:ready",
            ),
        undefined,
        { timeout: 15000 },
    );
    const frame = page.frames().find((f) => f !== page.mainFrame());
    if (!frame) throw new Error(`${id}: no frame`);
    // Let entrances and the first resizes settle.
    await page.waitForTimeout(400);
    return frame;
}

function messagesOf(page: Page): Promise<Message[]> {
    return page.evaluate(
        () => (window as unknown as { messages: Message[] }).messages,
    );
}

const theme = (frame: Frame) =>
    frame.evaluate(() => ({
        scheme: document.documentElement.dataset.theme,
        name: document.documentElement.dataset.exampleTheme,
        dark: document.documentElement.classList.contains("dark"),
        background: getComputedStyle(document.body).backgroundColor,
    }));

// Every visible popup in the frame, measured against the element that opened
// it: its offset from that element, its size, whether it is inside the
// frame's viewport, and whether any box inside it hides content (scrolls or
// clips — what a squeezed popup does).
const POPUPS =
    '[role="menu"], [role="listbox"], [role="dialog"], [role="alertdialog"], [data-slot="tooltip-content"], [data-slot="navigation-menu-popup"]';

type Popup = {
    name: string;
    dialog: boolean;
    dx: number;
    dy: number;
    width: number;
    height: number;
    inView: boolean;
    hidden: string | null;
};

async function popups(frame: Frame, anchor: Locator): Promise<Popup[]> {
    const box = await anchor.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { left: r.left, top: r.top };
    });
    return frame.evaluate(
        ({ selector, box }) =>
            [...document.querySelectorAll<HTMLElement>(selector)]
                .filter((el) => {
                    const r = el.getBoundingClientRect();
                    return r.width > 0 && r.height > 0;
                })
                .map((el) => {
                    const r = el.getBoundingClientRect();
                    const role = el.getAttribute("role");
                    let hidden: string | null = null;
                    for (const node of [
                        el,
                        ...el.querySelectorAll<HTMLElement>("*"),
                    ]) {
                        if (getComputedStyle(node).overflowY === "visible")
                            continue;
                        if (node.scrollHeight > node.clientHeight + 1) {
                            hidden = `${node.clientHeight}px shows ${node.scrollHeight}px`;
                            break;
                        }
                    }
                    return {
                        name: `${role ?? el.dataset.slot} "${(el.textContent ?? "").trim().slice(0, 24)}"`,
                        dialog: role === "dialog" || role === "alertdialog",
                        dx: Math.round(r.left - box.left),
                        dy: Math.round(r.top - box.top),
                        width: Math.round(r.width),
                        height: Math.round(r.height),
                        inView:
                            r.top >= -1 &&
                            r.left >= -1 &&
                            r.bottom <= innerHeight + 1 &&
                            r.right <= innerWidth + 1,
                        hidden,
                    };
                }),
        { selector: POPUPS, box },
    );
}

// Every trigger part carries `data-slot="<component>-trigger"`; a combobox
// opens from its input as well.
const TRIGGERS = [
    '[data-slot$="-trigger"]',
    '[role="combobox"]',
    "[aria-haspopup]",
]
    .map((s) => `main ${s}:not([disabled]):not([data-disabled])`)
    .join(", ");

async function closeAll(frame: Frame, page: Page) {
    await page.mouse.move(0, 0);
    for (let i = 0; i < 3; i++) {
        await frame.page().keyboard.press("Escape");
        await page.waitForTimeout(120);
    }
    await page.waitForTimeout(250);
}

type Observation = { key: string; popups: Popup[] };

// Opens every trigger of an overlay example, then one level of submenus,
// and measures what opened.
async function observe(
    page: Page,
    frame: Frame,
    opener: Opener,
    screenshot?: string,
): Promise<Observation[]> {
    const seen: Observation[] = [];
    const triggers = await frame.locator(TRIGGERS).all();
    for (const [i, trigger] of triggers.entries()) {
        if (!(await trigger.isVisible())) continue;
        const text =
            (await trigger.textContent())?.trim() ||
            (await trigger.getAttribute("aria-label")) ||
            "";
        const key = `trigger ${i + 1} "${text.slice(0, 20)}"`;
        if (opener === "hover") await trigger.hover();
        else if (opener === "contextmenu")
            await trigger.click({ button: "right" });
        else await trigger.click();
        // Base UI's tooltip waits 600ms before opening.
        await page.waitForTimeout(opener === "hover" ? 1000 : 450);
        if ((await frame.locator(POPUPS).count()) === 0 && opener === "click") {
            await frame.page().keyboard.press("ArrowDown");
            await page.waitForTimeout(350);
        }
        if (screenshot && (await frame.locator(POPUPS).count()) > 0) {
            await page.locator("iframe").screenshot({
                path: `${screenshot}-open-${i + 1}.png`,
            });
        }
        seen.push({ key, popups: await popups(frame, trigger) });
        const subs = await frame
            .locator(
                '[role="menu"] [aria-haspopup="menu"]:not([data-disabled])',
            )
            .all();
        for (const [j, sub] of subs.entries()) {
            if (!(await sub.isVisible())) continue;
            await sub.hover();
            await page.waitForTimeout(450);
            seen.push({
                key: `${key} › submenu ${j + 1}`,
                popups: await popups(frame, sub),
            });
        }
        await closeAll(frame, page);
    }
    return seen;
}

// A popup fits when it is inside the frame, hides none of its content and
// sits exactly where it sits with unlimited room (`reference`, measured in a
// very tall frame): same size, same offset from its trigger — not flipped,
// shifted or shrunk. A dialog is centred on the viewport and may scroll its
// body by design, so only its box is checked.
function misfits(seen: Observation[], reference: Observation[]): string[] {
    const found: string[] = [];
    if (!seen.some((o) => o.popups.length > 0)) found.push("no popup opened");
    for (const observation of seen) {
        const expected = reference.find((r) => r.key === observation.key);
        for (const popup of observation.popups) {
            const where = `${observation.key}: ${popup.name}`;
            if (!popup.inView) found.push(`${where} outside the frame`);
            if (popup.dialog) continue;
            if (popup.hidden) found.push(`${where} squeezed (${popup.hidden})`);
            const natural = expected?.popups.find((p) => p.name === popup.name);
            if (!natural) continue;
            const moved =
                Math.abs(natural.dx - popup.dx) > 2 ||
                Math.abs(natural.dy - popup.dy) > 2;
            const resized =
                Math.abs(natural.width - popup.width) > 2 ||
                Math.abs(natural.height - popup.height) > 2;
            if (moved || resized) {
                found.push(
                    `${where} ${moved ? "moved" : "resized"} (${popup.width}×${popup.height} at ${popup.dx},${popup.dy}; with room ${natural.width}×${natural.height} at ${natural.dx},${natural.dy})`,
                );
            }
        }
    }
    return found;
}

async function contentHeight(page: Page): Promise<number> {
    const resizes = (await messagesOf(page)).filter(
        (m) => m.type === "fragiola:example:resize",
    );
    return resizes.at(-1)?.height ?? 0;
}

const selected = manifest.examples.filter(
    (e) => positionals.length === 0 || positionals.includes(e.id),
);
const floors: string[] = [];

for (const example of selected) {
    // Tall enough to hold the ROOM frame: Playwright only hovers what the
    // page shows.
    const page = await browser.newPage({
        viewport: { width: WIDTH + 80, height: ROOM + 100 },
    });
    const errors: string[] = [];
    page.on("console", (message) => {
        if (message.type() !== "error") return;
        const text = message.text();
        // The avatar example's broken image, and remote avatars when offline.
        if (/Failed to load resource/.test(text)) return;
        errors.push(text);
    });
    page.on("pageerror", (error) => errors.push(error.message));
    const say = (problem: string) => problems.push(`${example.id}: ${problem}`);

    try {
        // Messages: ready once, first; resize after it (flow) or never (fill).
        const frame = await open(page, example.id, example.height, {
            theme: "light",
        });
        const messages = await messagesOf(page);
        const readies = messages.filter(
            (m) => m.type === "fragiola:example:ready",
        );
        if (readies.length !== 1) say(`${readies.length} ready messages`);
        if (messages[0]?.type !== "fragiola:example:ready") {
            say(`first message is ${messages[0]?.type}, not ready`);
        }
        if (messages.some((m) => m.id !== example.id))
            say("message with a wrong id");
        const resizes = messages.filter(
            (m) => m.type === "fragiola:example:resize",
        );
        if (example.layout === "flow" && resizes.length === 0) say("no resize");
        if (example.layout === "fill" && resizes.length > 0)
            say("resize on fill");
        // A `fill` example sends no resize, so it has no content height: the
        // frame's height is the manifest's, by contract.
        const height = await contentHeight(page);
        if (example.layout === "flow" && height < 50)
            say(`content height ${height}px`);
        const content =
            example.layout === "fill"
                ? "fills the frame"
                : `content ${height}px`;

        // Theme: light from the URL, dark from a message, no reload between.
        const light = await theme(frame);
        if (light.scheme !== "light" || light.name !== "light" || light.dark) {
            say(`?theme=light gave ${JSON.stringify(light)}`);
        }
        await frame.evaluate(() => {
            (window as unknown as { marker: boolean }).marker = true;
        });
        await page.evaluate(() => {
            const frame = document.querySelector("iframe");
            frame?.contentWindow?.postMessage(
                { type: "fragiola:example:theme", theme: "dark" },
                location.origin,
            );
        });
        await page.waitForTimeout(250);
        const dark = await theme(frame);
        const kept = await frame.evaluate(
            () => (window as unknown as { marker?: boolean }).marker === true,
        );
        if (dark.scheme !== "dark" || !dark.dark) {
            say(`theme message gave ${JSON.stringify(dark)}`);
        }
        if (dark.background === light.background) {
            say("theme message did not repaint the floor");
        }
        if (!kept) say("theme message reloaded the frame");

        if (example.id === "chart") {
            const drawn = await frame.evaluate(
                () =>
                    [
                        ...document.querySelectorAll(
                            "[_echarts_instance_] svg",
                        ),
                    ].filter((svg) => svg.querySelectorAll("path").length > 3)
                        .length,
            );
            if (drawn < 3) say(`${drawn} of 3 charts drawn`);
        }

        if (values.screenshots) {
            for (const name of THEMES.map((t) => t.name)) {
                const f = await open(page, example.id, example.height, {
                    theme: name,
                });
                await f.waitForTimeout(300);
                await page.locator("iframe").screenshot({
                    path: path.join(
                        values.screenshots,
                        `${example.id}-${name}.png`,
                    ),
                });
            }
        }

        // Defaults: no theme and an unknown theme both mean `light`.
        for (const value of [undefined, "sepia"]) {
            const f = await open(page, example.id, example.height, {
                theme: value,
            });
            const t = await theme(f);
            if (t.scheme !== "light" || t.name !== "light") {
                say(`theme ${value ?? "(none)"} gave ${JSON.stringify(t)}`);
            }
        }

        const opener = OVERLAYS[example.id];
        if (opener) {
            // With room to spare, then at the manifest's floor: the popups
            // must open exactly as they do with room. Popups are not part of
            // the measured content, so the frame does not grow to meet them.
            const tall = await open(page, example.id, ROOM, {
                theme: "light",
            });
            const reference = await observe(page, tall, opener);
            const f = await open(page, example.id, example.height, {
                theme: "light",
            });
            const found = misfits(
                await observe(
                    page,
                    f,
                    opener,
                    values.screenshots &&
                        path.join(values.screenshots, example.id),
                ),
                reference,
            );
            for (const p of found) say(`at ${example.height}px: ${p}`);

            if (values.floors) {
                let fits = 0;
                const from = example.layout === "fill" ? FILL_FROM : height;
                for (let h = from; h < ROOM; h += 20) {
                    const g = await open(page, example.id, h, {
                        theme: "light",
                    });
                    const seen = await observe(page, g, opener);
                    if (misfits(seen, reference).length === 0) {
                        fits = h;
                        break;
                    }
                }
                floors.push(
                    `${example.id.padEnd(16)} ${content}, popups fit from ${fits || `>${ROOM}`}px (manifest ${example.height})`,
                );
            }
        } else if (values.floors) {
            floors.push(
                `${example.id.padEnd(16)} ${content} (manifest ${example.height})`,
            );
        }
    } catch (error) {
        say(error instanceof Error ? error.message : String(error));
    }
    for (const error of errors) say(`console: ${error}`);
    await page.close();
    console.log(
        `${problems.some((p) => p.startsWith(`${example.id}:`)) ? "✗" : "✓"} ${example.id}`,
    );
}

await browser.close();
server.close();
await rm(out, { recursive: true, force: true });

if (floors.length) console.log(`\n${floors.join("\n")}`);
for (const path of new Set(outside))
    problems.push(`request outside the base: ${path}`);
if (problems.length) {
    console.error(`\n${problems.length} problem(s):`);
    for (const problem of problems) console.error(`  ✗ ${problem}`);
    process.exit(1);
}
console.log(`\n${selected.length} examples pass in the frame.`);

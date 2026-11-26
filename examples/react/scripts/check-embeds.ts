import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";
import { chromium, type Frame, type Locator, type Page } from "playwright";
import {
    baseFromEnv,
    baseOutputDir,
} from "../../../packages/registry/bases.ts";
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
// The selected base's app where a v1.8 host serves it (contract §5.6): the
// default base at /ui/embed/react/, another at /ui/embed/react/<base>/.
const BASE_DIR = baseOutputDir(baseFromEnv(process.env));
const BASE = `/ui/embed/react/${BASE_DIR ? `${BASE_DIR}/` : ""}`;
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

// The modal examples (dialog, alert-dialog, drawer) are not here: their
// popups cover the site's page, promoted (MODALS, below), so their frame
// needs no room for them.
//
// How each overlay example opens its popups. `click` finds every trigger in
// the stage (`aria-haspopup`, a combobox, a navigation trigger), opens it,
// checks the popup and one level of submenus, and closes it again.
type Opener = "click" | "hover" | "contextmenu";
const OVERLAYS: Record<string, Opener> = {
    select: "click",
    combobox: "click",
    // The destination's suggestions (its Trigger); the disabled one opens
    // nothing.
    autocomplete: "click",
    "dropdown-menu": "click",
    "context-menu": "contextmenu",
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
    // The sign-up card's plan Select; its Invite Dialog is promoted
    // (MODALS) and only its box is checked here.
    "component-showcase": "click",
};

// The examples whose rows are dragged in the frame: a row, and the folder it
// is dropped on.
const DRAGS: Record<string, { row: string; folder: string }> = {
    tree: { row: "README.md", folder: "components" },
    "tree-file-explorer": { row: "README.md", folder: "docs" },
};

// Drags a tree row onto the middle of a folder's row with the mouse, and
// tells whether the row is now inside the folder (an expanded one: a
// collapsed folder renders no children).
async function dragInto(
    page: Page,
    frame: Frame,
    row: string,
    folder: string,
): Promise<boolean> {
    const content = (name: string) =>
        frame
            .getByRole("treeitem", { name, exact: true })
            .locator(":scope > [data-tree-part=content]");
    const from = await content(row).boundingBox();
    const to = await content(folder).boundingBox();
    if (!from || !to) return false;
    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    await page.mouse.move(from.x + from.width / 2, from.y - 8, { steps: 4 });
    await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, {
        steps: 8,
    });
    await page.mouse.up();
    await page.waitForTimeout(150);
    return (
        (await frame
            .getByRole("treeitem", { name: folder, exact: true })
            .getByRole("treeitem", { name: row, exact: true })
            .count()) === 1
    );
}

// The Grid Layout examples, dragged in the frame: a card moved by its
// handle (the template), or a widget brought in from a drag source (the
// builder).
const GRID_DRAGS: Record<string, { handle: string } | { source: string }> = {
    "grid-layout": { handle: "Move Revenue" },
    "grid-layout-dashboard-builder": { source: "Metric widget" },
};

// Drags a card by its handle a third of the grid across (a card moved
// down would settle back up: the layout compacts), or a drag source onto the
// grid's empty bottom-end corner, with the mouse; tells whether the card
// moved, or the grid has one more item.
async function dragGrid(
    page: Page,
    frame: Frame,
    drag: { handle: string } | { source: string },
): Promise<boolean> {
    const items = frame.locator("[data-grid-layout-part=item]");
    const count = await items.count();
    const start = frame.getByLabel(
        "handle" in drag ? drag.handle : drag.source,
        { exact: true },
    );
    const from = await start.first().boundingBox();
    const grid = await frame
        .locator("[data-grid-layout-part=root]")
        .boundingBox();
    if (!from || !grid) return false;
    const card =
        "handle" in drag
            ? frame
                  .locator("[data-grid-layout-part=item]")
                  .filter({ has: start.first() })
            : undefined;
    const before = card ? await card.boundingBox() : null;
    const x = from.x + from.width / 2;
    const y = from.y + from.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 8, y + 8, { steps: 4 });
    if ("handle" in drag) {
        await page.mouse.move(x + grid.width / 3, y + 8, { steps: 10 });
    } else {
        await page.mouse.move(
            grid.x + grid.width - 80,
            grid.y + grid.height - 40,
            { steps: 10 },
        );
    }
    await page.mouse.up();
    await page.waitForTimeout(400);
    if (card && before) {
        const after = await card.boundingBox();
        return !!after && Math.abs(after.x - before.x) > 20;
    }
    return (await items.count()) === count + 1;
}

// The Data Grid examples, used in the frame: a header sorted by a click and
// a page turned (the template), a column filtered by typing (the
// directory). Each tells whether the grid answered.
const GRID_USES: Record<string, (frame: Frame) => Promise<boolean>> = {
    "data-grid": async (frame) => {
        const header = frame.getByRole("columnheader", { name: "Customer" });
        await header.click({ position: { x: 24, y: 12 } });
        await frame
            .getByRole("button", { name: "Page 2", exact: true })
            .click();
        await frame.waitForTimeout(150);
        return (
            (await header.getAttribute("aria-sort")) === "ascending" &&
            (await frame.getByText("Page 2 of 24").count()) === 1
        );
    },
    "data-grid-people-directory": async (frame) => {
        const filter = frame.getByRole("textbox", { name: "Filter Name" });
        await filter.click();
        await filter.pressSequentially("Ada");
        await frame.waitForTimeout(150);
        const count = await frame.getByTestId("count").textContent();
        return count !== null && !count.startsWith("300 of");
    },
};

// The examples a landing shows as its showcase (contract §3.5): at the
// width of a landing's content their content stays within a showcase's
// height, with nothing wider than the frame — fragiola.com's home page
// shows Fragiola UI's at that size, one slide, no scrolling.
const SHOWCASES: Record<string, { width: number; maxHeight: number }> = {
    "component-showcase": { width: 1152, maxHeight: 640 },
};

// The palettes demo's hue form, used: two hues added become `my-palette-1`
// and `my-palette-2` (with their surface twins), real CSS rules in the
// document; each is a new radio, selected when added, and hands its classes
// to the card, whose button, badge, progress bar and switch repaint; the
// code panel shows only the class swap (paletteCode).
async function drivePalettes(frame: Frame): Promise<string[]> {
    const problems: string[] = [];
    const target = frame.locator("[data-palette-target]");
    const code = frame.locator("[data-palette-code]");
    problems.push(
        ...paletteCode(
            (await code.textContent()) ?? "",
            "palette-neutral",
            "palette-surface",
        ),
    );
    const paints = () =>
        target.evaluate((root) => {
            const style = (selector: string) => {
                const el = root.querySelector<HTMLElement>(selector);
                return el ? getComputedStyle(el) : null;
            };
            return {
                button: style("footer button:last-child")?.backgroundColor,
                badge: style('[data-slot="badge"]')?.backgroundColor,
                bar: style('[data-slot="progress-indicator"]')?.backgroundColor,
                switch: style('[role="switch"]')?.backgroundColor,
            };
        });
    const before = await paints();
    const hue = frame.getByRole("slider", { name: "Hue" });
    const add = frame.getByRole("button", { name: "Add palette" });
    const seen: Array<Awaited<ReturnType<typeof paints>>> = [];
    // Hue 0, then hue 120: Home, then twelve large steps of 10.
    for (const [n, steps] of [
        [1, 0],
        [2, 12],
    ] as const) {
        await hue.focus();
        await frame.page().keyboard.press("Home");
        for (let i = 0; i < steps; i++)
            await frame.page().keyboard.press("PageUp");
        await add.click();
        await frame.waitForTimeout(400);
        const name = `my-palette-${n}`;
        const surface = `my-palette-surface-${n}`;
        const ruled = await frame.evaluate(
            (name) =>
                [...document.styleSheets].some((sheet) =>
                    [...sheet.cssRules].some(
                        (rule) =>
                            rule instanceof CSSStyleRule &&
                            rule.selectorText.endsWith(`.${name}`),
                    ),
                ),
            name,
        );
        if (!ruled) problems.push(`no CSS rule for .${name}`);
        const twin = await frame.evaluate(
            (surface) =>
                [...document.styleSheets].some((sheet) =>
                    [...sheet.cssRules].some(
                        (rule) =>
                            rule instanceof CSSStyleRule &&
                            rule.selectorText.endsWith(`.${surface}`),
                    ),
                ),
            surface,
        );
        if (!twin) problems.push(`no CSS rule for .${surface}`);
        const radio = frame.getByRole("radio", { name });
        if ((await radio.getAttribute("aria-checked")) !== "true")
            problems.push(`${name} is not selected after it is added`);
        problems.push(
            ...paletteCode((await code.textContent()) ?? "", name, surface),
        );
        seen.push(await paints());
    }
    const [first, second] = seen;
    for (const part of ["button", "badge", "bar", "switch"] as const) {
        if (!first?.[part] || first[part] === before[part])
            problems.push(`my-palette-1 did not repaint the ${part}`);
        if (!second?.[part] || second[part] === first?.[part])
            problems.push(`my-palette-2 did not repaint the ${part}`);
    }
    await frame.getByRole("radio", { name: "my-palette-1" }).click();
    await frame.waitForTimeout(400);
    if ((await paints()).button !== first?.button)
        problems.push("selecting my-palette-1 again did not repaint it");
    return problems;
}

// The palettes code panel is only the class swap: the card's components in
// the order they render, each with its palette class and nothing else — no
// text, no styling, never the palette's CSS.
function paletteCode(text: string, action: string, control: string): string[] {
    const expected = [
        "<Card>",
        `  <Badge className="${action}" />`,
        `  <Field.Root className="${control}" />`,
        `  <Switch.Root className="${control}" />`,
        `  <Checkbox.Root className="${control}" />`,
        `  <Progress.Root className="${action}" />`,
        "  <Clickable.Button />",
        `  <Clickable.Button className="${action}" />`,
        "</Card>",
    ].join("\n");
    const problems: string[] = [];
    if (/[{}]|--palette-|:root/.test(text))
        problems.push(`the code panel shows CSS (${action})`);
    if (text.trim() !== expected)
        problems.push(
            `the code panel is not the ${action} outline: ${JSON.stringify(text)}`,
        );
    return problems;
}

// The palettes demo at a landing's width: the card and the code panel side
// by side, the same height, neither scrolling — in both themes, before and
// after adding palettes (the longest class names).
const PALETTES_WIDTH = 1152;
async function palettesSideBySide(
    page: Page,
    floor: number,
    shots?: string,
): Promise<string[]> {
    const problems: string[] = [];
    for (const name of ["light", "dark"]) {
        const frame = await open(page, "palettes", floor, {
            theme: name,
            width: PALETTES_WIDTH,
        });
        for (const stage of ["presets", "added"]) {
            if (stage === "added") {
                const add = frame.getByRole("button", { name: "Add palette" });
                await add.click();
                await add.click();
                await frame.waitForTimeout(400);
            }
            const box = await frame.evaluate(() => {
                const card = document.querySelector<HTMLElement>(
                    "[data-palette-target]",
                );
                const code = document.querySelector<HTMLElement>(
                    "[data-palette-code]",
                );
                if (!card || !code) return null;
                const a = card.getBoundingClientRect();
                const b = code.getBoundingClientRect();
                const scrolls = (el: HTMLElement) =>
                    el.scrollHeight > el.clientHeight ||
                    el.scrollWidth > el.clientWidth;
                return {
                    card: [a.top, a.height, a.left],
                    code: [b.top, b.height, b.left],
                    scrolls: scrolls(card) || scrolls(code),
                    page:
                        document.documentElement.scrollWidth >
                        document.documentElement.clientWidth,
                };
            });
            const at = `at ${PALETTES_WIDTH}px, ${name}, ${stage}`;
            if (!box) {
                problems.push(`${at}: no card or code panel`);
                continue;
            }
            const [cardTop, cardHeight, cardLeft] = box.card;
            const [codeTop, codeHeight, codeLeft] = box.code;
            if ((codeLeft ?? 0) <= (cardLeft ?? 0))
                problems.push(`${at}: the code panel is not beside the card`);
            if (
                Math.abs((cardTop ?? 0) - (codeTop ?? 0)) > 1 ||
                Math.abs((cardHeight ?? 0) - (codeHeight ?? 0)) > 1
            )
                problems.push(
                    `${at}: card ${cardHeight}px and code panel ${codeHeight}px are not the same height`,
                );
            if (box.scrolls) problems.push(`${at}: the card or panel scrolls`);
            if (box.page) problems.push(`${at}: wider than the frame`);
            // The declared height is the frame's floor: above the content it
            // would leave empty space under the demo on the landing.
            const height = await contentHeight(page);
            if (stage === "presets" && floor > height)
                problems.push(
                    `${at}: the ${floor}px floor is over the content (${height}px)`,
                );
            if (shots)
                await page.locator("iframe").screenshot({
                    path: path.join(
                        shots,
                        `palettes-${PALETTES_WIDTH}-${name}-${stage}.png`,
                    ),
                });
        }
    }
    return problems;
}

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

// The v1.3 host (contract §5.4), as fragiola.com's frame does it: `host`
// after `ready`; on `overlay` open, `promote` with where the frame is and
// the viewport it is about to fill; on `armed` (or after 500 ms) the frame
// goes to the top layer at the viewport's size and `promoted` follows, in
// the same task; on `overlay` closed it goes back. The frame sits below and
// beside a spacer so `rect` is not the origin, with the rest of a page
// below it: a frame scrolled to (a trigger below the fold) keeps its place
// while the frame's height settles back after the promotion. Every animation frame,
// `window.samples` records the frame's box, the stage content's box in the
// page and every modal popup's box in the page.
const HOST_V13 = `<!doctype html>
<html><head><style>
#frame { display:block; position:static; inset:auto; margin:0; padding:0; border:0;
         overflow:visible; background:transparent; opacity:0; }
</style></head>
<body style="margin:0">
<div style="height:120px"></div>
<div id="wrapper" style="margin-left:40px">
<iframe id="frame" popover="manual"></iframe>
</div>
<div style="height:1200px"></div>
<script>
const params = new URLSearchParams(location.search);
const frame = document.getElementById("frame");
const wrapper = document.getElementById("wrapper");
const floor = Number(params.get("floor"));
const width = params.get("width") + "px";
// the wrapper is the frame's inline box, as on the site
wrapper.style.width = width;
window.messages = [];
window.samples = [];
let height = floor;
let phase = "inline";
let pending = null;
let timer;
const inline = () => {
    frame.style.position = "";
    frame.style.top = frame.style.left = "";
    frame.style.width = width;
    frame.style.height = height + "px";
};
inline();
frame.style.colorScheme = params.get("scheme") || "light";
const post = (m) => frame.contentWindow.postMessage(m, location.origin);
const measure = () => {
    const box = wrapper.getBoundingClientRect();
    const root = document.documentElement;
    return {
        rect: { x: box.left, y: box.top, width: box.width, height: frame.getBoundingClientRect().height },
        viewport: { width: root.clientWidth, height: root.clientHeight },
    };
};
const promote = () => {
    if (phase !== "arming") return;
    clearTimeout(timer);
    phase = "promoted";
    frame.style.position = "fixed";
    frame.style.top = frame.style.left = "0px";
    frame.style.width = pending.viewport.width + "px";
    frame.style.height = pending.viewport.height + "px";
    frame.showPopover();
    post({ type: "fragiola:example:promoted", ...pending });
};
addEventListener("message", (event) => {
    if (event.source !== frame.contentWindow) return;
    const data = event.data;
    window.messages.push(data);
    if (data.type === "fragiola:example:ready") {
        frame.style.opacity = "1";
        post({ type: "fragiola:example:host", overlay: true });
    } else if (data.type === "fragiola:example:resize") {
        height = Math.max(floor, data.height);
        if (phase === "inline") frame.style.height = height + "px";
    } else if (data.type === "fragiola:example:overlay" && data.open === true) {
        if (phase !== "inline") return;
        phase = "arming";
        pending = measure();
        post({ type: "fragiola:example:promote", ...pending });
        timer = setTimeout(promote, 500);
    } else if (data.type === "fragiola:example:armed") {
        promote();
    } else if (data.type === "fragiola:example:overlay" && data.open === false) {
        clearTimeout(timer);
        if (phase === "promoted") frame.hidePopover();
        phase = "inline";
        inline();
    }
});
const MODAL = '[data-slot="dialog-portal"], [data-slot="alert-dialog-portal"], [data-slot="drawer-portal"]';
const POPUP = '[role="dialog"], [role="alertdialog"]';
const sample = () => {
    const doc = frame.contentDocument;
    const f = frame.getBoundingClientRect();
    const content = doc && doc.querySelector("[data-stage] > div");
    const c = content && content.getBoundingClientRect();
    const popups = doc ? [...doc.querySelectorAll(MODAL)].flatMap((portal) =>
        [...portal.querySelectorAll(POPUP)].map((p) => {
            const b = p.getBoundingClientRect();
            return { x: f.x + b.x, y: f.y + b.y, width: b.width, height: b.height };
        })) : [];
    window.samples.push({
        promoted: frame.matches(":popover-open"),
        frame: { x: f.x, y: f.y, width: f.width, height: f.height },
        content: c && { x: f.x + c.x, y: f.y + c.y, width: c.width, height: c.height },
        popups,
    });
    requestAnimationFrame(sample);
};
const src = new URL("${BASE}index.html", location.href);
src.searchParams.set("id", params.get("id"));
if (params.has("theme")) src.searchParams.set("theme", params.get("theme"));
frame.src = src.href;
requestAnimationFrame(sample);
</script>
</body></html>`;

const outside: string[] = [];
const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (url.pathname === "/host.html") {
        res.writeHead(200, { "content-type": "text/html" }).end(HOST);
        return;
    }
    if (url.pathname === "/host-v13.html") {
        res.writeHead(200, { "content-type": "text/html" }).end(HOST_V13);
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
    options: { theme?: string; width?: number } = {},
): Promise<Frame> {
    const query = new URLSearchParams({
        id,
        floor: String(floor),
        width: String(options.width ?? WIDTH),
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

        // A drag in the frame: Tree's pointer drag (Pointer Events, a
        // threshold, the drop target hit-tested from the rows) works in an
        // iframe as on a page — the row lands in the folder it is dropped on.
        const drag = DRAGS[example.id];
        if (drag) {
            const moved = await dragInto(page, frame, drag.row, drag.folder);
            if (!moved)
                say(`dragging ${drag.row} onto ${drag.folder} moved nothing`);
        }

        // Grid Layout's pointer drag in the frame: a card follows its handle
        // and lands a third of the grid across; a drag source's item lands
        // on the grid.
        const gridDrag = GRID_DRAGS[example.id];
        if (gridDrag && !(await dragGrid(page, frame, gridDrag)))
            say(`dragging in ${example.id} changed nothing`);

        // The palettes demo's hue form, used (drivePalettes).
        if (example.id === "palettes") {
            for (const p of await drivePalettes(frame)) say(p);
            for (const p of await palettesSideBySide(
                page,
                example.height,
                values.screenshots,
            ))
                say(p);
        }

        const showcase = SHOWCASES[example.id];
        if (showcase) {
            const f = await open(page, example.id, example.height, {
                theme: "light",
                width: showcase.width,
            });
            const wide = await contentHeight(page);
            if (wide > showcase.maxHeight)
                say(
                    `at ${showcase.width}px: content ${wide}px, over the showcase's ${showcase.maxHeight}px`,
                );
            const overflow = await f.evaluate(
                () =>
                    document.documentElement.scrollWidth >
                    document.documentElement.clientWidth,
            );
            if (overflow) say(`at ${showcase.width}px: wider than the frame`);
        }

        // Data Grid in the frame: a sort and a page, or a filter, answer.
        const gridUse = GRID_USES[example.id];
        if (gridUse && !(await gridUse(frame)))
            say(`using ${example.id} changed nothing`);

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

// ─── Overlay promotion (v1.3 §5.4) ──────────────────────────────────────────
//
// Each modal trigger, opened and closed in the v1.3 host (HOST_V13), every
// animation frame sampled:
//
//   - while a modal popup exists, the frame is promoted and covers the page's
//     viewport — so no frame of the opening or the exit animation plays in
//     the inline frame (nothing cut, nothing moved mid-animation)
//   - the stage content never moves on the page (±1px), before, during and
//     after
//   - the messages: `overlay` open, `armed`, then `overlay` closed only
//     once the popup is gone; the frame back in place after it
//   - the popup is placed in the page's viewport: a dialog centred, a drawer
//     against an edge
//
// The sidebar is checked narrow (its drawer) and wide, where its trigger
// collapses the column and must promote nothing.
type Box = { x: number; y: number; width: number; height: number };
type Sample = {
    promoted: boolean;
    frame: Box;
    content?: Box;
    popups: Box[];
};
const MODALS: Record<string, { width?: number; slot: string }> = {
    dialog: { slot: "dialog-trigger" },
    "alert-dialog": { slot: "alert-dialog-trigger" },
    drawer: { slot: "drawer-trigger" },
    "component-showcase": { slot: "dialog-trigger" },
    sidebar: { width: 400, slot: "sidebar-trigger" },
};
const PAGE = { width: 1200, height: 900 };
const near = (a: number, b: number, by = 1) => Math.abs(a - b) <= by;

async function openV13(page: Page, id: string, floor: number, width: number) {
    const query = new URLSearchParams({
        id,
        floor: String(floor),
        width: String(width),
        theme: "light",
    });
    await page.goto(`${origin}/host-v13.html?${query}`);
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
    await page.waitForTimeout(400);
    return frame;
}

const samplesOf = (page: Page): Promise<Sample[]> =>
    page.evaluate(() => (window as unknown as { samples: Sample[] }).samples);
const resetSamples = (page: Page) =>
    page.evaluate(() => {
        (window as unknown as { samples: Sample[] }).samples = [];
        (window as unknown as { messages: Message[] }).messages = [];
    });

const promotionChecked = selected.filter((e) => e.id in MODALS);
for (const example of promotionChecked) {
    const modal = MODALS[example.id];
    if (!modal) continue;
    const say = (problem: string) =>
        problems.push(`${example.id} (promotion): ${problem}`);
    const page = await browser.newPage({ viewport: PAGE });
    page.on("pageerror", (error) => say(`page error: ${error.message}`));
    try {
        const width = modal.width ?? WIDTH;
        const frame = await openV13(page, example.id, example.height, width);
        const triggers = frame.locator(`main [data-slot="${modal.slot}"]`);
        const count = await triggers.count();
        if (count === 0) say("no modal trigger");
        for (let i = 0; i < count; i++) {
            const label = `trigger ${i + 1}`;
            // A trigger below the page's fold (the showcase's last card):
            // scrolled to first, so the click does not move the page.
            await triggers.nth(i).scrollIntoViewIfNeeded();
            await resetSamples(page);
            await page.waitForTimeout(100);
            const start = (await samplesOf(page)).at(-1);
            const before = start?.content;
            // where the inline frame is in the viewport (40, 120 unscrolled)
            const home = start?.frame ?? { x: 40, y: 120 };
            await triggers.nth(i).click();
            await frame
                .locator('[role="dialog"], [role="alertdialog"]')
                .first()
                .waitFor({ state: "visible", timeout: 3000 });
            await page.waitForTimeout(700);
            const opened = await samplesOf(page);
            const last = opened.at(-1);
            const popup = last?.popups[0];
            if (!popup) {
                say(`${label}: no popup measured`);
                continue;
            }
            const centred =
                near(popup.x + popup.width / 2, PAGE.width / 2, 2) &&
                near(popup.y + popup.height / 2, PAGE.height / 2, 2);
            const atEdge =
                near(popup.x, 0) ||
                near(popup.y, 0) ||
                near(popup.x + popup.width, PAGE.width) ||
                near(popup.y + popup.height, PAGE.height);
            if (/^(alert-)?dialog-/.test(modal.slot)) {
                if (!centred) say(`${label}: popup not centred in the page`);
            } else if (!atEdge) {
                say(`${label}: drawer not against an edge of the page`);
            }
            await page.keyboard.press("Escape");
            await page
                .waitForFunction(
                    () =>
                        (
                            window as unknown as { messages: Message[] }
                        ).messages.some(
                            (m) =>
                                m.type === "fragiola:example:overlay" &&
                                (m as { open?: boolean }).open === false,
                        ),
                    undefined,
                    { timeout: 3000 },
                )
                .catch(() => say(`${label}: no overlay closed message`));
            await page.waitForTimeout(200);
            const samples = await samplesOf(page);
            const types = (await messagesOf(page)).map((m) =>
                m.type === "fragiola:example:overlay"
                    ? `overlay:${(m as { open?: boolean }).open}`
                    : m.type.replace("fragiola:example:", ""),
            );
            const order = types.filter((t) => t !== "resize").join(" → ");
            if (order !== "overlay:true → armed → overlay:false") {
                say(`${label}: messages ${order}`);
            }
            const covering = (b: Box) =>
                near(b.x, 0) &&
                near(b.y, 0) &&
                near(b.width, PAGE.width) &&
                near(b.height, PAGE.height);
            const unpromoted = samples.filter(
                (x) =>
                    x.popups.length > 0 && !(x.promoted && covering(x.frame)),
            ).length;
            if (unpromoted) {
                say(
                    `${label}: ${unpromoted} frame(s) painted a popup outside a promoted frame`,
                );
            }
            if (before) {
                const moved = samples.filter(
                    (x) =>
                        x.content &&
                        !(
                            near(x.content.x, before.x) &&
                            near(x.content.y, before.y) &&
                            near(x.content.width, before.width)
                        ),
                ).length;
                if (moved) {
                    const first = samples.find(
                        (x) =>
                            x.content &&
                            !(
                                near(x.content.x, before.x) &&
                                near(x.content.y, before.y) &&
                                near(x.content.width, before.width)
                            ),
                    );
                    say(
                        `${label}: the example moved in ${moved} frame(s): ${JSON.stringify(before)} → ${JSON.stringify(first?.content)}${first?.promoted ? " (promoted)" : ""}`,
                    );
                }
            }
            const focused = await triggers
                .nth(i)
                .evaluate((trigger) => trigger === document.activeElement);
            if (!focused) say(`${label}: focus did not return to the trigger`);
            const stale = await frame.evaluate(
                () =>
                    document.querySelector("style[data-armed]")?.textContent ??
                    "",
            );
            if (stale) say(`${label}: the armed rule outlived the promotion`);
            const end = samples.at(-1);
            if (!end || end.promoted)
                say(`${label}: still promoted after closing`);
            else if (!near(end.frame.x, home.x) || !near(end.frame.y, home.y)) {
                say(`${label}: the frame did not go back in place`);
            }
        }
        if (example.id === "sidebar") {
            // Wide, the trigger collapses the column: nothing to promote.
            const wide = await openV13(page, example.id, example.height, WIDTH);
            await resetSamples(page);
            await wide
                .locator(`main [data-slot="${modal.slot}"]`)
                .first()
                .click();
            await page.waitForTimeout(500);
            const messages = (await messagesOf(page)).filter(
                (m) => m.type !== "fragiola:example:resize",
            );
            if (messages.length) {
                say(
                    `wide: the trigger sent ${messages.map((m) => m.type).join(", ")}`,
                );
            }
            if ((await samplesOf(page)).some((x) => x.promoted)) {
                say("wide: the frame was promoted");
            }
        }
    } catch (error) {
        say(error instanceof Error ? error.message : String(error));
    }
    await page.close();
    console.log(
        `${problems.some((p) => p.startsWith(`${example.id} (promotion):`)) ? "✗" : "✓"} ${example.id} (promotion)`,
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

import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { dock } from "../registry/families/dock";
import { foundation } from "../registry/families/foundation";
import { everyBase } from "./base-sources";

// ─── The dock family ────────────────────────────────────────────────────────
// ui/dockable dresses Dockable's headless primitives with `dock`. A class that
// does not exist is caught by the compile guard; what is caught here is a
// class that exists and is wrong for this layout — a second palette, geometry
// the primitives' structural style silently overrides, a border rule a Row
// would trigger, a header that shrinks below what edge docking needs.

const classes = (member: () => string) => member().split(/\s+/).filter(Boolean);

const REGISTRY = path.resolve(import.meta.dirname, "../registry");

describe("dock family", () => {
    it("has zero variants — variation is a named member", () => {
        for (const [name, member] of Object.entries(dock)) {
            const variants = (member as { variants?: object }).variants ?? {};
            expect(Object.keys(variants), name).toEqual([]);
        }
    });

    it("paints from one palette: only the root declares one", () => {
        for (const [name, member] of Object.entries(dock)) {
            const palettes = classes(member).filter((c) => /^palette-/.test(c));
            if (member === dock.root) {
                expect(palettes, name).toEqual(["palette-surface"]);
            } else {
                expect(palettes, name).toEqual([]);
            }
        }
        // A popout window's floor declares it again: the root is not its
        // ancestor in the window's document.
        expect(dock.popoutRoot).toBe(dock.root);
    });

    it("sets no geometry the primitives own structurally", () => {
        // Row, TabSet and Panel carry position, size, display and flex
        // sizing inline; those classes would compile and do nothing.
        const structural =
            /^(?:[\w-]+:)*(?:absolute|relative|fixed|static|inset-|top-|bottom-|start-|end-|left-|right-|w-|h-|size-|min-[wh]-|max-[wh]-|flex|grid|block|hidden|inline|basis-|grow|shrink)/;
        for (const name of ["row", "tabset", "panel"] as const) {
            expect(
                classes(dock[name]).filter((c) => structural.test(c)),
                name,
            ).toEqual([]);
        }
        // The root row's gutter is a margin — not structural, and only on
        // the root row: the splitter's 6px, none under `data-handle="ide"`.
        expect(classes(dock.row)).toEqual([
            "data-root:m-[calc(var(--spacing)_*_1.5_*_(1_-_var(--handle-seam,0)))]",
        ]);
    });

    it("floors the header at a fixed 2.25rem and lets tabs fill it", () => {
        // Edge docking needs a header of ~30px or more. `h-control` follows
        // the spacing axis (a compact density takes it below that), so the
        // floor is the default control height, fixed. A fixed height would
        // clip the tabs a spacious density grows: the tab fills its strip
        // instead, so the marker stays on the header's line.
        expect(classes(dock.header)).toContain("min-h-[2.25rem]");
        expect(classes(dock.header)).not.toContain("min-h-control");
        expect(classes(dock.border)).toContain(
            "data-[orientation=vertical]:min-w-[2.25rem]",
        );
        expect(classes(dock.border)).toContain(
            "data-[orientation=horizontal]:min-h-[2.25rem]",
        );
        expect(classes(dock.tab)).toContain("self-stretch");
        expect(classes(dock.tab)).toContain("min-h-8");
        expect(classes(dock.tab)).not.toContain("h-8");
    });

    it("turns border tabs through the border's named group only", () => {
        // A Row carries `data-orientation` too, and a tabset's tabs sit
        // inside rows: an unscoped orientation rule on a tab would turn them.
        for (const name of ["tab", "tabList", "scrollingTabList"] as const) {
            const unscoped = classes(dock[name]).filter((c) =>
                /(?:^|:)(?:in-|group-)?data-\[orientation/.test(
                    c.replace(/group-data-\[[^\]]+\]\/border:/g, ""),
                ),
            );
            expect(unscoped, name).toEqual([]);
        }
        expect(classes(dock.border)).toContain("group/border");
    });

    it("clips the managed strip, scrolls the one that keeps every tab", () => {
        // `overflow-hidden` on the scrolling strip would clip what it keeps.
        expect(classes(dock.tabList)).toContain("overflow-hidden");
        expect(classes(dock.scrollingTabList)).not.toContain("overflow-hidden");
        expect(classes(dock.scrollingTabList)).toContain("overflow-x-auto");
    });

    it("stacks splitters, indicators and an overlay border in order", () => {
        const z = (member: () => string) =>
            Number(
                classes(member)
                    .find((c) => /^(?:data-overlay:)?z-\d+$/.test(c))
                    ?.replace(/^.*z-/, ""),
            );
        const borderPanel = Number(
            classes(dock.panel)
                .find((c) => c.startsWith("data-[layout-path^='/border/']:z-"))
                ?.replace(/^.*z-/, ""),
        );
        expect(z(dock.splitter)).toBeLessThan(borderPanel);
        expect(borderPanel).toBeLessThan(z(dock.dropIndicator));
        expect(z(dock.dropIndicator)).toBe(z(dock.edgeIndicator));
        expect(z(dock.dropIndicator)).toBeLessThan(z(dock.borderContent));
    });

    it("gives a tab the values of ui/tabs.tsx's tab, lit by data-selected", async () => {
        // The ring and the lit state are the foundation's on both sides
        // (`focusInset`, and `selected` / `current` — one fill under each
        // library's vocabulary); the rest is pinned on both sides, and drift
        // on either fails here.
        const tabs = (await everyBase("ui/tabs.tsx"))
            .map(({ source }) => source)
            .join("\n");
        const tab = classes(dock.tab);
        for (const shared of [
            "rounded-md",
            "text-sm",
            "font-medium",
            "text-palette-accent/85",
        ]) {
            expect(tab, shared).toContain(shared);
            expect(tabs, shared).toContain(shared);
        }
        for (const shared of classes(foundation.focusInset)) {
            expect(tab, shared).toContain(shared);
        }
        expect(tabs).toContain("foundation.focusInset()");
        for (const state of ["bg-palette-soft", "text-palette-contrast"]) {
            expect(tab).toContain(`selected:${state}`);
        }
        expect(tabs).toContain("foundation.current()");
    });

    it("leaves Template.Simple with no style of its own", async () => {
        // The template rules: nothing beyond the parts — no tv(), no class
        // literal, no family member. The one className goes to Root.
        const source = await readFile(
            path.join(REGISTRY, "ui/dockable/templates/simple.tsx"),
            "utf-8",
        );
        const code = source.replace(/^\s*\/\/.*$/gm, "");
        expect(code).not.toMatch(/\btv\(/);
        expect(code).not.toMatch(/className="/);
        expect(code).not.toMatch(/#\/families\//);
        expect(code.match(/className=\{/g)).toEqual(["className={"]);
    });
});

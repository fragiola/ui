import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { dock } from "../registry/families/dock";

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
        // the root row.
        expect(classes(dock.row)).toEqual(["data-root:m-1.5"]);
    });

    it("keeps the header at the control height, whatever the density", () => {
        // Edge docking needs a header of ~30px or more; `h-control` is a
        // token, not the spacing scale a compact density shrinks.
        expect(classes(dock.header)).toContain("h-control");
        expect(classes(dock.border)).toContain(
            "data-[orientation=vertical]:w-(--height-control)",
        );
        expect(classes(dock.border)).toContain(
            "data-[orientation=horizontal]:h-control",
        );
    });

    it("turns border tabs through the border's named group only", () => {
        // A Row carries `data-orientation` too, and a tabset's tabs sit
        // inside rows: an unscoped orientation rule on a tab would turn them.
        for (const name of ["tab", "tabList"] as const) {
            const unscoped = classes(dock[name]).filter((c) =>
                /(?:^|:)(?:in-|group-)?data-\[orientation/.test(
                    c.replace(/group-data-\[[^\]]+\]\/border:/g, ""),
                ),
            );
            expect(unscoped, name).toEqual([]);
        }
        expect(classes(dock.border)).toContain("group/border");
    });

    it("stacks splitters, indicators and an overlay border in order", () => {
        const z = (member: () => string) =>
            Number(
                classes(member)
                    .find((c) => /^(?:data-overlay:)?z-\d+$/.test(c))
                    ?.replace(/^.*z-/, ""),
            );
        expect(z(dock.splitter)).toBeLessThan(z(dock.dropIndicator));
        expect(z(dock.dropIndicator)).toBe(z(dock.edgeIndicator));
        expect(z(dock.dropIndicator)).toBeLessThan(z(dock.borderContent));
    });

    it("gives a tab the values of ui/tabs.tsx's tab, lit by data-selected", async () => {
        // Not extracted into a shared member (different state vocabulary,
        // and tabs.tsx is not a family) — so the shared values are pinned on
        // both sides instead, and drift on either fails here.
        const tabs = await readFile(
            path.join(REGISTRY, "ui/tabs.tsx"),
            "utf-8",
        );
        const tab = classes(dock.tab);
        for (const shared of [
            "rounded-md",
            "text-sm",
            "font-medium",
            "text-palette-accent/85",
            "focus-visible:outline-2",
            "focus-visible:outline-palette-ring",
        ]) {
            expect(tab, shared).toContain(shared);
            expect(tabs, shared).toContain(shared);
        }
        for (const state of ["bg-palette-soft", "text-palette-contrast"]) {
            expect(tab).toContain(`data-selected:${state}`);
            expect(tabs).toContain(`data-active:${state}`);
        }
    });
});

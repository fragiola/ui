import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { dock } from "../registry/families/dock";
import { split } from "../registry/families/split";

// ─── The split family ───────────────────────────────────────────────────────
// ui/splitter dresses Splitter's headless primitives with `split`. A class
// that does not exist is caught by the compile guard; what is caught here is
// a class that exists and is wrong for a split view — a palette that would
// swallow a swap on an outer group, geometry the primitives' structural
// style silently overrides, a grip that reads a nested group's orientation,
// a hit area that stops following the spacing scale.

const classes = (member: () => string) => member().split(/\s+/).filter(Boolean);

const REGISTRY = path.resolve(import.meta.dirname, "../registry");

describe("split family", () => {
    it("has zero variants — variation is a named member", () => {
        for (const [name, member] of Object.entries(split)) {
            const variants = (member as { variants?: object }).variants ?? {};
            expect(Object.keys(variants), name).toEqual([]);
        }
    });

    it("declares no palette: a palette class on a group re-tints it", () => {
        // Groups nest: a default palette on each would be redeclared by a
        // nested group and swallow a swap on the outer one.
        for (const [name, member] of Object.entries(split)) {
            expect(
                classes(member).filter((c) => /(?:^|:)palette-/.test(c)),
                name,
            ).toEqual([]);
        }
    });

    it("sets no geometry the primitives own structurally", () => {
        // The group's display and direction, a panel's flex and overflow
        // are inline and always win: those classes would do nothing.
        const structural =
            /^(?:[\w-]+:)*(?:absolute|relative|fixed|static|inset-|top-|bottom-|start-|end-|left-|right-|w-|h-|size-|min-[wh]-|max-[wh]-|flex|grid|block|inline|basis-|grow|shrink|overflow-)/;
        for (const name of ["group", "panel"] as const) {
            expect(
                classes(split[name]).filter((c) => structural.test(c)),
                name,
            ).toEqual([]);
        }
    });

    it("draws the separator as ui/separator.tsx's 1px line rule", async () => {
        const separator = await readFile(
            path.join(REGISTRY, "ui/separator.tsx"),
            "utf-8",
        );
        const own = classes(split.separator);
        for (const shared of [
            "bg-palette-line",
            "data-[orientation=vertical]:w-px",
            "data-[orientation=horizontal]:h-px",
        ]) {
            expect(own, shared).toContain(shared);
            expect(separator, shared).toContain(shared);
        }
    });

    it("gives the separator a hit area from the spacing scale", () => {
        // The engine measures 1px; the pointer finds the ::before, which
        // follows the density axis (a spacing step, never a fixed length).
        const own = classes(split.separator);
        expect(own).toContain("before:absolute");
        expect(own).toContain(
            "data-[orientation=vertical]:before:-inset-x-1.5",
        );
        expect(own).toContain(
            "data-[orientation=horizontal]:before:-inset-y-1.5",
        );
        expect(own.filter((c) => /before:.*\[/.test(c))).toEqual([]);
    });

    it("shares dock.splitter's cursors, ring and stacking", () => {
        // S4: the values that coincide are the same; the differences (a
        // visible rule at rest, full ring on hover) are recorded in the
        // family's header.
        const own = classes(split.separator);
        const docked = classes(dock.splitter);
        for (const cursor of ["cursor-ew-resize", "cursor-ns-resize"]) {
            expect(docked.some((c) => c.endsWith(`:${cursor}`))).toBe(true);
            expect(own.some((c) => c.endsWith(`:${cursor}`))).toBe(true);
        }
        expect(docked).toContain("z-10");
        expect(own).toContain("z-10");
        expect(docked).toContain("data-dragging:after:bg-palette-ring");
        expect(own).toContain("data-dragging:bg-palette-ring");
        expect(own).toContain("focus-visible:after:bg-palette-ring");
    });

    it("never lights or turns a disabled separator", () => {
        const own = classes(split.separator);
        expect(own).toContain("not-data-disabled:hover:bg-palette-ring");
        expect(own.filter((c) => /^hover:/.test(c))).toEqual([]);
        expect(
            own.filter((c) => /^data-\[orientation=[a-z]+\]:cursor-/.test(c)),
        ).toEqual([]);
        expect(classes(split.grip)).toContain(
            "group-not-data-disabled/separator:group-hover/separator:opacity-100",
        );
    });

    it("lines the grip up through the separator's named group only", () => {
        // A nested group carries `data-orientation` too: an unscoped
        // orientation rule on the grip would read the wrong element.
        const unscoped = classes(split.grip).filter((c) =>
            /(?:^|:)(?:in-|group-)?data-\[orientation/.test(
                c.replace(/group-data-\[[^\]]+\]\/separator:/g, ""),
            ),
        );
        expect(unscoped).toEqual([]);
        expect(classes(split.separator)).toContain("group/separator");
        expect(classes(split.grip)).toContain("pointer-events-none");
        expect(classes(split.grip)).toContain("opacity-0");
    });

    it("hides content by its panel's collapsed state, both ways", () => {
        expect(classes(split.expanded)).toEqual(["in-data-collapsed:hidden"]);
        expect(classes(split.collapsed)).toEqual([
            "not-in-data-collapsed:hidden",
        ]);
    });
});

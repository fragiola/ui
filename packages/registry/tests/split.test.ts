import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { dock } from "../registry/families/dock";
import { handle } from "../registry/families/handle";
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
        // The element is 1px (the engine measures it); the rule is its
        // `::after` (the handle's), painted at rest in ui/separator.tsx's
        // `line`.
        const separator = await readFile(
            path.join(REGISTRY, "ui/separator.tsx"),
            "utf-8",
        );
        const own = classes(split.separator);
        expect(own).toContain("after:bg-palette-line");
        expect(separator).toContain("bg-palette-line");
        for (const shared of [
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

    it("takes its look from the handle family, as dock.splitter does", () => {
        // One definition (families/handle.ts): the separator extends the
        // handle's target, the grip IS the handle's mark — so Splitter and
        // Dockable cannot drift apart again.
        const own = classes(split.separator);
        for (const shared of classes(handle.target)) {
            expect(own, shared).toContain(shared);
        }
        expect(split.grip).toBe(handle.mark);
        expect(dock.splitterMark).toBe(handle.mark);
    });

    it("never lights or turns a disabled separator", () => {
        const own = classes(split.separator);
        expect(own).toContain("not-data-disabled:hover:after:bg-palette-ring");
        expect(own.filter((c) => /^hover:/.test(c))).toEqual([]);
        expect(
            own.filter((c) => /^data-\[orientation=[a-z]+\]:cursor-/.test(c)),
        ).toEqual([]);
        expect(classes(split.grip)).toContain(
            "group-not-data-disabled/handle:group-hover/handle:opacity-100",
        );
        expect(classes(split.grip)).toContain(
            "group-data-disabled/handle:opacity-0",
        );
    });

    it("lines the grip up with its own separator only", () => {
        // A nested group carries `data-orientation` too: the grip reads its
        // DIRECT parent (the handle-vertical / handle-horizontal variants),
        // never an ancestor's orientation.
        const unscoped = classes(split.grip).filter((c) =>
            /data-\[orientation/.test(c),
        );
        expect(unscoped).toEqual([]);
        expect(classes(split.separator)).toContain("group/handle");
        expect(classes(split.grip)).toContain("pointer-events-none");
        expect(classes(split.grip)).toContain("handle-vertical:h-6");
        expect(classes(split.grip)).toContain("handle-horizontal:w-6");
        // The drawer handle's shape, so the radius axis reaches it.
        expect(classes(split.grip)).toContain("rounded-pill");
    });

    it("hides content by its panel's collapsed state, both ways", () => {
        expect(classes(split.expanded)).toEqual(["in-data-collapsed:hidden"]);
        expect(classes(split.collapsed)).toEqual([
            "not-in-data-collapsed:hidden",
        ]);
    });

    it("leaves Template.Simple with no style of its own", async () => {
        // The template rules: nothing beyond the parts — no tv(), no class
        // literal, no family member. The one className goes to Group.
        const source = await readFile(
            path.join(REGISTRY, "ui/splitter/templates/simple.tsx"),
            "utf-8",
        );
        const code = source.replace(/^\s*\/\/.*$/gm, "");
        expect(code).not.toMatch(/\btv\(/);
        expect(code).not.toMatch(/className="/);
        expect(code).not.toMatch(/#\/families\//);
        expect(code.match(/className=\{/g)).toEqual(["className={"]);
        // Its own props stay under the ceiling of 7: the rest is Group's.
        const own = code.match(/& \{([\s\S]*?)\n\};/)?.[1] ?? "";
        const props = own.match(/^\s+\w+\??:/gm) ?? [];
        expect(props.length).toBeGreaterThan(0);
        expect(props.length).toBeLessThanOrEqual(7);
    });
});

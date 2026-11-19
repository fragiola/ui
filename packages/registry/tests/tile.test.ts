import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { dock } from "../registry/families/dock";
import { layer } from "../registry/families/layer";
import { split } from "../registry/families/split";
import { tile } from "../registry/families/tile";

// ─── The tile family ────────────────────────────────────────────────────────
// ui/grid-layout dresses Grid Layout's headless parts with `tile`. A class
// that does not exist is caught by the compile guard; what is caught here is
// a class that exists and is wrong for a dashboard grid — geometry the
// engine owns, a transition that would make a held item lag, a palette that
// would swallow a swap, two variants fighting over one property, a handle
// that does not mirror, a value that drifts from the family it was taken
// from.

const classes = (member: () => string) => member().split(/\s+/).filter(Boolean);

const REGISTRY = path.resolve(import.meta.dirname, "../registry");

describe("tile family", () => {
    it("has zero variants — variation is a named member", () => {
        for (const [name, member] of Object.entries(tile)) {
            const variants = (member as { variants?: object }).variants ?? {};
            expect(Object.keys(variants), name).toEqual([]);
        }
    });

    it("declares palettes only on the cards and the refused drop", () => {
        // An item and the drag preview are cards on the raised tier; a
        // refused drop is danger. Everything else paints from the palette
        // in scope, so a palette class on the root tints the grid.
        const expected: Record<string, string[]> = {
            item: ["palette-raised"],
            dragPreview: ["palette-raised"],
            refused: ["palette-danger"],
        };
        const declared = (c: string) =>
            /^palette-/.test(c.split(":").pop() ?? "");
        for (const [name, member] of Object.entries(tile)) {
            expect(classes(member).filter(declared), name).toEqual(
                expected[name] ?? [],
            );
        }
        // A palette is not a utility: behind a variant it compiles nothing.
        for (const member of Object.values(tile)) {
            expect(
                classes(member).filter((c) => declared(c) && c.includes(":")),
            ).toEqual([]);
        }
    });

    it("adds the refused member from the parts' state", async () => {
        const parts = await readFile(
            path.join(REGISTRY, "ui/grid-layout/parts.tsx"),
            "utf-8",
        );
        expect(parts).toContain("state.dropRefused && tile.refused()");
        expect(parts).toContain("state.refused && tile.refused()");
    });

    it("styles every state attribute the package documents", () => {
        // ../grid-layout/site/docs/concepts/state-attributes.mdx.
        // `data-resizable` is drawn by the resize handles, which the package
        // renders only then; `data-breakpoint` is a name and `data-x` /
        // `data-y` a cell's place, not a look.
        const written = Object.values(tile)
            .flatMap((member) => classes(member))
            .join(" ");
        for (const state of [
            "dragging",
            "resizing",
            "grabbed",
            "dropping",
            "drop-refused",
            "outside",
            "pressing",
            "static",
            "draggable",
            "disabled",
            "over",
            "side",
            "kind",
        ]) {
            expect(
                new RegExp(`data-${state}(?![\\w-])|data-\\[${state}[=*]`).test(
                    written,
                ),
                state,
            ).toBe(true);
        }
    });

    it("sets no geometry on the parts the engine places", () => {
        // Position, size, transform and the held item's z-index are the
        // engine's inline style: these classes would do nothing, or fight
        // it. A pseudo-element is the member's own.
        const structural =
            /^(?:[\w-]+:)*(?:absolute|relative|fixed|sticky|inset-|top-|bottom-|start-|end-|left-|right-|w-|h-|size-|min-[wh]-|max-[wh]-|translate-|transform|z-|box-)/;
        for (const name of [
            "root",
            "cells",
            "item",
            "placeholder",
            "dragPreview",
        ] as const) {
            expect(
                classes(tile[name]).filter(
                    (c) => structural.test(c) && !/(?:after|before):/.test(c),
                ),
                name,
            ).toEqual([]);
        }
    });

    it("never transitions an item a pointer holds", () => {
        // The engine draws the held item at the pointer every frame.
        const motion = classes(tile.item).filter((c) =>
            /(?:^|:)(?:transition|duration-|ease-)/.test(c),
        );
        expect(motion.length).toBe(3);
        for (const c of motion) {
            expect(
                c.startsWith("not-data-dragging:not-data-resizing:"),
                c,
            ).toBe(true);
        }
        // A lift composes with the engine's transform: `scale`, never a
        // translate.
        expect(classes(tile.item)).toContain("data-dragging:scale-102");
    });

    it("draws an item with layer.panel's values (S4)", () => {
        const own = classes(tile.item);
        const panel = classes(layer.panel);
        for (const shared of [
            "palette-raised",
            "bg-palette-base",
            "text-palette-contrast",
            "rounded-lg",
            "border",
            "border-palette-line",
        ]) {
            expect(own, shared).toContain(shared);
            expect(panel, shared).toContain(shared);
        }
        // At rest a lighter shadow (many cards at once); held, the panel's.
        expect(panel).toContain("shadow-lg");
        expect(own).toContain("shadow-sm");
        for (const held of ["dragging", "resizing", "grabbed"]) {
            expect(own).toContain(`data-${held}:shadow-lg`);
        }
        expect(own).toContain("text-sm");
    });

    it("draws the placeholder as dock.dropIndicator's box, dashed (S4)", () => {
        const own = classes(tile.placeholder);
        const indicator = classes(dock.dropIndicator);
        for (const shared of [
            "border-2",
            "border-palette-ring",
            "bg-palette-ring/15",
            "duration-150",
        ]) {
            expect(own, shared).toContain(shared);
            expect(indicator, shared).toContain(shared);
        }
        expect(own).toContain("border-dashed");
        expect(own).toContain("data-[kind=drop]:border-solid");
        // The card's radius, not the indicator's.
        expect(own).toContain("rounded-lg");
    });

    it("marks a resize handle with split.grip's pill and cursors (S4)", () => {
        const own = classes(tile.resizeHandle);
        expect(classes(split.grip)).toContain("rounded-pill");
        expect(own).toContain("after:rounded-pill");
        expect(own).toContain("after:bg-palette-ring/40");
        expect(own).toContain("hover:after:bg-palette-ring");
        expect(own).toContain("data-resizing:after:bg-palette-ring");
        for (const cursor of ["cursor-ew-resize", "cursor-ns-resize"]) {
            expect(
                classes(split.separator).some((c) => c.endsWith(cursor)),
            ).toBe(true);
            expect(own.some((c) => c.endsWith(cursor))).toBe(true);
        }
    });

    it("places resize handles on logical sides, mirrored corners", () => {
        // RTL is an MVP goal (rule 6): no left/right, and each diagonal
        // cursor names both directions — never one variant over another.
        const own = classes(tile.resizeHandle);
        expect(own.filter((c) => /(?:^|:)(?:left|right)-/.test(c))).toEqual([]);
        for (const side of ["top", "bottom", "start", "end"]) {
            expect(own.some((c) => c.startsWith(`data-[side=${side}]:`))).toBe(
                true,
            );
        }
        for (const corner of [
            "top-start",
            "top-end",
            "bottom-start",
            "bottom-end",
        ]) {
            const cursors = own.filter(
                (c) =>
                    c.startsWith(`data-[side=${corner}]:`) &&
                    c.includes("cursor-"),
            );
            expect(cursors.map((c) => c.split(":")[1]).sort(), corner).toEqual([
                "ltr",
                "rtl",
            ]);
        }
    });

    it("never lets two variants fight over a cursor or a fill", () => {
        // Composed with not-data-*, so the order of the CSS rules never
        // decides: a dragged item is draggable too.
        expect(classes(tile.item).filter((c) => c.includes("cursor-"))).toEqual(
            [
                "data-draggable:not-data-dragging:not-has-data-[grid-layout-part=drag-handle]:cursor-grab",
                "data-dragging:cursor-grabbing",
            ],
        );
        expect(
            classes(tile.dragHandle).filter((c) => c.includes("cursor-")),
        ).toEqual([
            "data-draggable:not-data-dragging:cursor-grab",
            "data-dragging:cursor-grabbing",
        ]);
        expect(
            classes(tile.dragSource).filter((c) => c.includes("cursor-")),
        ).toEqual([
            "not-data-disabled:not-data-dragging:cursor-grab",
            "data-dragging:cursor-grabbing",
        ]);
        expect(
            classes(tile.dragSource).filter((c) => /^hover:/.test(c)),
        ).toEqual([]);
        // Off the grid the dots hide, even while a pointer drags.
        expect(classes(tile.cells)).toContain(
            "group-data-dragging/tile:group-not-data-outside/tile:opacity-100",
        );
    });

    it("keeps the focus ring every registry part draws", () => {
        for (const name of ["item", "dragHandle", "dragSource"] as const) {
            const own = classes(tile[name]);
            expect(own, name).toContain("focus-visible:outline-2");
            expect(own, name).toContain("focus-visible:outline-palette-ring");
            // `outline-none` sets the outline style to none, which the
            // focus-visible width alone never brings back (menu.ts).
            expect(own, name).not.toContain("outline-none");
        }
    });
});

import { describe, expect, it } from "vitest";
import { menu } from "../registry/families/menu";

// ─── The menu family ────────────────────────────────────────────────────────
// Dropdown, context, select and combobox all read `menu`. When the navigation
// members arrived (for the sidebar), the row they share with `item` moved into
// a private skeleton; the members the popup lists read must come out with
// exactly the classes they had. Order is not pinned — tailwind-variants joins
// an extended base first — only the set.

const classes = (member: () => string) =>
    member().split(/\s+/).filter(Boolean).sort();

const ITEM = [
    "relative",
    "flex",
    "cursor-default",
    "items-center",
    "gap-2",
    "rounded-md",
    "py-1.5",
    "text-sm",
    "px-1.5",
    "outline-none",
    "select-none",
    "text-palette-accent/85",
    "highlighted:bg-palette-soft",
    "highlighted:text-palette-contrast",
    "data-disabled:pointer-events-none",
    "data-disabled:opacity-50",
    "data-inset:ps-7",
    "[&_svg:not([class*='size-'])]:size-4",
    "[&_svg]:pointer-events-none",
    "[&_svg]:shrink-0",
];

describe("menu family", () => {
    it("item, selectableItem and subTrigger keep the classes the popup lists had", () => {
        expect(classes(menu.item)).toEqual([...ITEM].sort());
        expect(classes(menu.selectableItem)).toEqual(
            [...ITEM, "pe-8", "ps-1.5"].sort(),
        );
        expect(classes(menu.subTrigger)).toEqual(
            [
                ...ITEM,
                "data-popup-open:bg-palette-soft",
                "data-popup-open:text-palette-contrast",
            ].sort(),
        );
    });

    it("has zero variants — variation is a named member", () => {
        for (const [name, member] of Object.entries(menu)) {
            const variants = (member as { variants?: object }).variants ?? {};
            expect(Object.keys(variants), name).toEqual([]);
        }
    });

    it("navigation members share the row and are not lit by focus", () => {
        for (const member of [menu.navItem, menu.navSubItem]) {
            const nav = classes(member);
            // The shared row: everything of item except how it is lit, its
            // padding, cursor and outline reset.
            for (const shared of ITEM.filter(
                (c) =>
                    !c.startsWith("highlighted:") &&
                    !/^(py|px)-/.test(c) &&
                    c !== "cursor-default" &&
                    c !== "outline-none",
            )) {
                expect(nav).toContain(shared);
            }
            expect(nav.filter((c) => c.startsWith("highlighted:"))).toEqual([]);
            // outline-none sets the outline style to none, which would
            // swallow the focus-visible ring.
            expect(nav).not.toContain("outline-none");
            expect(nav).toContain("focus-visible:outline-palette-ring");
            expect(nav).toContain("data-active:bg-palette-soft");
        }
        expect(classes(menu.navSubItem)).toContain("h-7");
        expect(classes(menu.navSubItem)).not.toContain("h-8");
    });
});

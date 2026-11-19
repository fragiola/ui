// .tsx without JSX, on purpose (as families/field.tsx): `ui/tree.tsx` has the
// same basename, and after installing, the shadcn CLI re-resolves
// `@/components/families/tree` by basename and prefers .tsx over .ts — every
// import of this family would be rewritten to the component. With both .tsx,
// it falls back to the path and picks this file. `pnpm registry:smoke` fails
// if that regresses.
//
// Family `tree` — a tree view (root, item, row, toggle, label, group, the
// drop indicator, the live region, the check box and the rename field, and the
// empty / loading / load-error rows).
// Consumer: ui/tree (the styled layer over @fragiola/tree-react).
//
// Decisions in docs/architecture.md §2 (style families, tv with zero
// variants), §1 (palettes) and §5 (special components, S1–S8). The tree's
// primitives are headless: every part of an item carries the item's state as
// data-* (`data-selected`, `data-expanded`, `data-focused`, `data-leaf`,
// `data-disabled`, `data-dragging`, `data-drop-target`, `data-drop-position`,
// `data-renaming`, `data-loading`, `data-load-error`, `data-checked`,
// `data-indeterminate`, `data-depth`) and its depth as the inline custom
// property `--tree-depth`; the root carries `data-dragging`,
// `data-keyboard-dragging`, `data-dragging-from-other-tree` and `data-empty`.
// Every member reads that state with Tailwind data variants — no React state
// in the styles, no custom variant in the theme.
//
// ─── NO PALETTE OF ITS OWN ──────────────────────────────────────────────────
// As in `split`, no member declares a surface palette: the parts paint from
// the one in scope (a sidebar's `palette-raised`, a page's
// `palette-surface`), so a palette class on the root — or on any element
// around it — re-tints every row, and a palette on one item re-tints its
// subtree. A default palette on the root would swallow a swap on an outer
// element. The one palette written here is semantic: `loadError` is
// `palette-danger`, as Text.Error is.
//
// ─── THE ROW (S4) ───────────────────────────────────────────────────────────
// The row is the same list row as `menu.navItem` (the Sidebar's menu
// button), so a tree in a sidebar lines up with the menu above it. Shared:
// `h-8` (spacing-based, so density reaches it), `rounded-md`, `gap-2`,
// `text-sm`, `select-none`, the `size-icon` default for icons, the
// secondary text at rest (`text-palette-accent/85`, lit to `contrast`), the
// `opacity-50` of a disabled item, and the focus treatment
// (`outline-2 outline-palette-ring`) — drawn on the row when its item, the
// element with DOM focus, shows focus (`[:focus-visible>&]`).
// They differ on purpose:
//   - padding: navItem's `px-2` becomes `pe-2` and a start padding that adds
//     the depth (below);
//   - hover is `soft/50`, not navItem's full `soft`: a tree selects, and a
//     selected row (`soft` + `contrast`, the Epic's value, navItem's
//     `data-active`) must still read as selected while its neighbour is
//     hovered. navItem has one current page; a tree has any number of
//     selected rows. A hover never lights a selected or a disabled row
//     (`not-data-*:`), so two variants never fight over one property;
//   - not `menu.item`'s `highlighted:` (which lights `:focus` and
//     `[data-selected]` alike): in a menu focus IS the lit item; in a tree,
//     focus and selection are different things and both show;
//   - no `pointer-events-none` on a disabled row: a disabled item stays
//     focusable (the APG), so a press must still reach it.
//
// ─── DEPTH ──────────────────────────────────────────────────────────────────
// A logical start padding: `--tree-depth` (the package's inline property,
// the same number as `data-depth`) times four spacing steps, plus navItem's
// two. Four steps are the toggle's width — and the package's default
// `indentation` (16px) at the default density. On the spacing scale, so
// density scales it; `ps`, so RTL mirrors it. The depth math stays in the
// package: the family only multiplies.
//
// ─── THE DROP INDICATOR ─────────────────────────────────────────────────────
// The engine positions it (inline insets, top, height): S5, no geometry here
// beyond margins that compose with those insets. A 2px `ring` line centred
// on the boundary for `before` / `after`, a `ring` box for `inside`. It
// starts where `dragAndDrop({ indentation, indicatorInset })` says, in pixels:
// the docs give the values that match these rows at the default density.
//
// Namespace object: a single `tree` export with all members.

import { tv } from "tailwind-variants";

// The tree. It names the Tailwind group `tree` (the empty row and the rows'
// grab cursor read it). A keyboard drag, and a drag from another tree of the
// drag group, outline the tree in dashed `ring`: the target tree is where
// the arrows act. No size, no scroll, no fill: a tree sits in a surface, and
// a virtualized one gets its height and `overflow-auto` from the consumer.
const root = tv({
    base: `
        group/tree rounded-md p-1
        data-dragging:select-none
        data-keyboard-dragging:outline-1 data-keyboard-dragging:outline-dashed
        data-keyboard-dragging:-outline-offset-1
        data-keyboard-dragging:outline-palette-ring
        data-dragging-from-other-tree:outline-1
        data-dragging-from-other-tree:outline-dashed
        data-dragging-from-other-tree:-outline-offset-1
        data-dragging-from-other-tree:outline-palette-ring
    `,
});

// An item (`role="treeitem"`): the element DOM focus goes to. Its own
// outline is off — the ring is drawn on its row (see `row`).
const item = tv({ base: "outline-none" });

// An item's row (Tree.ItemContent). See the header for every value.
const row = tv({
    base: `
        group/tree-row flex h-8 cursor-default items-center gap-2 rounded-md
        pe-2 ps-[calc(var(--tree-depth)*var(--spacing)*4+var(--spacing)*2)]
        text-sm text-palette-accent/85 select-none
        [&_svg:not([class*='size-'])]:size-icon
        [&_svg]:pointer-events-none [&_svg]:shrink-0
        not-data-disabled:hover:text-palette-contrast
        not-data-selected:not-data-disabled:hover:bg-palette-soft/50
        data-selected:bg-palette-soft data-selected:text-palette-contrast
        data-focused:text-palette-contrast
        data-drop-target:text-palette-contrast
        data-disabled:opacity-50 data-dragging:opacity-50
        group-data-dragging/tree:cursor-grabbing
        [:focus-visible>&]:outline-2 [:focus-visible>&]:outline-palette-ring
    `,
});

// The toggle: a chevron that points at the inline end, turns a quarter to
// point down when its item is expanded, and mirrors under RTL (flipped, then
// turned the other way). A leaf keeps its room, invisible, so labels line
// up. Four spacing steps wide: one level of indentation.
const toggle = tv({
    base: `
        flex size-4 shrink-0 items-center justify-center text-palette-accent/85
        transition-[rotate] duration-150 motion-reduce:transition-none
        data-leaf:invisible
        ltr:data-expanded:rotate-90
        rtl:-scale-x-100 rtl:data-expanded:-rotate-90
    `,
});

// The label: takes the row's remaining width and truncates. Hidden while
// its row renames — the rename field takes its place. Read through the row's
// named group: a row never contains another row.
const label = tv({
    base: "min-w-0 flex-1 truncate group-data-renaming/tree-row:hidden",
});

// An item's children (`role="group"`): a column. The indentation is on each
// child's row, not here, so a row's fill and hover keep the full width.
const group = tv({ base: "flex flex-col" });

// Where a drag would drop (see the header). Lines end where the rows do
// (the root's `p-1`). The engine starts the `inside` box at the child level
// (one `indentation` past the row's own); `-ms-3` (the root's padding minus
// one default level, 4 - 16px) brings it back to the row's own indentation,
// so the box frames the row from its depth, toggle included. An empty tree's
// `inside` (`data-depth="0"`, the only one at depth 0) starts at the root's
// edge already and keeps it.
const dropIndicator = tv({
    base: `
        pointer-events-none z-10 me-1 border-palette-ring
        not-data-[drop-position=inside]:-mt-px
        not-data-[drop-position=inside]:border-t-2
        data-[drop-position=inside]:not-data-[depth=0]:-ms-3
        data-[drop-position=inside]:rounded-md
        data-[drop-position=inside]:border-2
    `,
});

// The live region (`role="status"`): read, never seen.
const liveRegion = tv({ base: "sr-only" });

// The check box: the registry's Checkbox, plus the mixed state it does not
// paint (Checkbox fills only `data-checked`). A mixed box takes the same
// `ring` fill and `base` mark, so checked and mixed differ by their mark
// (a check, a dash) and not by their colour.
const checkbox = tv({
    base: `
        data-indeterminate:border-palette-ring
        data-indeterminate:bg-palette-ring
        data-indeterminate:text-palette-base
    `,
});

// The mixed box's dash: Checkbox.Indicator's own layout.
const checkboxDash = tv({ base: "grid place-content-center text-current" });

// The rename field: the registry's Field.Root (its `data-invalid` turns the
// field danger), taking the label's place in the row.
const rename = tv({ base: "min-w-0 flex-1" });

// Its frame: Field.Row (the box: border, fill, radius, focus ring — rule 3),
// two spacing steps shorter than the row so it sits inside it.
const renameFrame = tv({ base: "h-6" });

// Its control: the registry's Input, with a row's padding instead of a
// standalone field's.
const renameInput = tv({ base: "px-1.5 py-0" });

// A row of the tree that is not an item, one level below the item it speaks
// for: the loading and load-error rows. Their mark sits in the toggle's
// column, their text where the children's labels start.
// Not a member: on its own it is never shown.
const statusRow = tv({
    base: `
        hidden h-8 items-center gap-2 pe-2 text-sm
        ps-[calc((var(--tree-depth)+1)*var(--spacing)*4+var(--spacing)*2)]
    `,
});

// While the item's children load. Shown only when its own item — the
// parent element — carries `data-loading` (`[[data-loading]>&]`), never a
// loading ancestor further up. Secondary text; the mark pulses on the motion
// axis (the pulse follows `--motion-scale`; a spin would not).
const loading = tv({
    extend: statusRow,
    base: `
        text-palette-accent/85 [[data-loading]>&]:flex
        [&_svg]:animate-pulse motion-reduce:[&_svg]:animate-none
    `,
});

// After the item's children failed to load (`data-load-error`, its own item
// only). The danger palette, as Text.Error: its `accent` is the text.
const loadError = tv({
    extend: statusRow,
    base: `
        palette-danger text-palette-accent [[data-load-error]>&]:flex
    `,
});

// The mark of a status row: the toggle's box.
const statusMark = tv({
    base: "flex size-4 shrink-0 items-center justify-center",
});

// The retry button of a load-error row: a ghost Clickable, a row's height
// shorter (as the rename frame).
const retry = tv({ base: "ms-auto h-6 px-2 text-xs" });

// What an empty tree shows (`data-empty` on the root). Secondary text, a
// row's height and padding.
const empty = tv({
    base: `
        hidden h-8 items-center px-2 text-sm text-palette-accent/85
        group-data-empty/tree:flex
    `,
});

export const tree = {
    root,
    item,
    row,
    toggle,
    label,
    group,
    dropIndicator,
    liveRegion,
    checkbox,
    checkboxDash,
    rename,
    renameFrame,
    renameInput,
    loading,
    loadError,
    statusMark,
    retry,
    empty,
};

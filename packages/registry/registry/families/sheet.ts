// Family `sheet` — a data grid (the scroll frame, the header and its rows and
// cells, the body rows and cells, the empty state, and the pieces of the
// seven common features: the sort indicator, the column resizer, the
// selection check boxes, the header filter, the cell editor and the
// pagination footer).
// Consumer: ui/data-grid (the styled layer over @fragiola/data-grid-react).
//
// Decisions in docs/architecture.md §2 (style families, tv with zero
// variants), §1 (palettes) and §5 (special components, S1–S8). The grid's
// primitives are headless: every part carries its state as data-*
// (`data-active`, `data-interacting`, `data-editing`, `data-loading`,
// `data-empty`, `data-group`, `data-selected`, `data-pinned`,
// `data-pinned-edge`, `data-sortable`, `data-sort`, `data-sort-priority`,
// `data-resizable`, `data-resizing`, `data-filtered`) and its name as
// `data-grid-part`. Every member reads that state with Tailwind data
// variants — no React state in the styles, no custom variant in the theme.
// The one state the package does not write is the frame's horizontal
// scroll: the styled Root writes `data-overflow-start` / `data-overflow-end`
// (content hidden past that edge), which the pinned edges' shadow reads.
//
// ─── NO PALETTE OF ITS OWN ──────────────────────────────────────────────────
// As in `split` and `tree`, no member declares a palette: the grid paints
// from the one in scope (a page's `palette-surface`, a card's
// `palette-raised`), so a palette class on the root — or on any element
// around it — re-tints every part.
//
// ─── THE TABLE, MADE INTERACTIVE (S4) ───────────────────────────────────────
// Shared with ui/table.tsx: the cell padding (`px-3`), the `line` row
// dividers (`border-b border-palette-line`), the header type
// (`font-medium text-palette-contrast`, `text-sm`), the `soft` header fill
// and the body text (`text-palette-accent/85`). They differ on purpose:
//   - heights are the engine's (rowHeight, headerRowHeight), set by the
//     styled Root from the spacing scale: a row is nine steps (36px at the
//     default density), a header row ten (table's `h-10`). A table's row is
//     as tall as its padding; a virtualized row must be told its height;
//   - the hover is not table's full `soft`: a selected row is `soft` (with
//     `contrast` text, `tree.row`'s value), and must still read as selected
//     beside a hovered one. Hover — and the row holding the active cell — is
//     `soft` at half over `base`, mixed opaque (not `soft/50`): a pinned
//     cell inherits its row's fill, and must stay opaque over the cells
//     scrolling under it;
//   - the frame (`rounded-lg border border-palette-line`), which table
//     leaves to its container: a grid is its own scroll container.
//
// ─── FOCUS ──────────────────────────────────────────────────────────────────
// The active cell is the grid's tab stop: an inset `ring` outline while it
// (or a control in it) has focus, dashed while its controls have the keys
// (`data-interacting`), none while it is edited (the editor's field draws
// its own ring). Never `outline-none` on a cell: in Tailwind 4 it sets the
// outline style to none, which a later width never brings back
// (tests/sheet.test.ts pins it). The grid element (the tab stop before any
// cell is active) is as large as the dataset; its ring is drawn on the
// frame instead.
//
// ─── PINNED COLUMNS ─────────────────────────────────────────────────────────
// Pinned cells are the engine's sticky cells (S5: no geometry here). They
// sit above the cells that scroll (`z-1`), opaque from their row's fill
// (`bg-inherit`), with a `line` rule on their part's edge, and an
// elevation-axis shadow on that edge while content is hidden under it:
// `shadow-lg`, clipped to the edge's outer side and to the cell's own
// height (each row is a layer of its own, with a transform: a shadow
// cannot reach into the next one), so it reads as a soft edge, row by row;
// `data-elevation="flat"` removes it.
//
// Namespace object: a single `sheet` export with all members.

import { tv } from "tailwind-variants";

// The frame: the scroll container (the package's root, which sets
// `position` and `overflow`). It names the Tailwind group `sheet`. The
// grid's own focus ring is drawn here (see FOCUS).
const root = tv({
    base: `
        group/sheet rounded-lg border border-palette-line bg-palette-base
        text-sm text-palette-contrast
        has-[>[data-grid-part=grid]:focus-visible]:outline-2
        has-[>[data-grid-part=grid]:focus-visible]:outline-offset-2
        has-[>[data-grid-part=grid]:focus-visible]:outline-palette-ring
    `,
});

// The probe the styled Root measures the spacing scale with: ten steps
// square, never seen. Its size is the density in pixels, so a change of
// `data-density` anywhere above the grid resizes it (a ResizeObserver).
const probe = tv({
    base: "pointer-events-none invisible absolute top-0 size-10",
});

// The grid: the sizer, as large as the dataset. Its ring is the frame's.
const grid = tv({ base: "outline-none" });

// The header: sticky (the package's), opaque, so the rows scroll under it.
const header = tv({ base: "bg-palette-soft" });

// A header row: the header's fill. Its rule is drawn by each header cell
// (below), so a column spanning header rows is never crossed by one.
// It names the group `sheet-header-row`: a row holding a filter aligns its
// cells' labels at the top (see headerCell).
const headerRow = tv({ base: "group/sheet-header-row bg-palette-soft" });

// The state every cell and header cell shares: the active one's ring, the
// pinned ones' stacking, fill, edge rule and shadow (see the header).
const cellState = `
    not-data-editing:data-active:focus-within:outline-2
    not-data-editing:data-active:focus-within:-outline-offset-2
    not-data-editing:data-active:focus-within:outline-palette-ring
    data-interacting:outline-dashed
    data-pinned:z-1 data-pinned:bg-inherit
    data-pinned-edge:border-palette-line
    data-pinned-edge:data-[pinned=start]:border-e
    data-pinned-edge:data-[pinned=end]:border-s
    data-pinned-edge:data-[pinned=start]:group-data-overflow-start/sheet:shadow-lg
    data-pinned-edge:data-[pinned=end]:group-data-overflow-end/sheet:shadow-lg
    data-pinned-edge:data-[pinned=start]:ltr:[clip-path:inset(0_-1rem_0_0)]
    data-pinned-edge:data-[pinned=start]:rtl:[clip-path:inset(0_0_0_-1rem)]
    data-pinned-edge:data-[pinned=end]:ltr:[clip-path:inset(0_0_0_-1rem)]
    data-pinned-edge:data-[pinned=end]:rtl:[clip-path:inset(0_-1rem_0_0)]
`;

// A header cell: a column's or a group's, with the `line` rule below it. A
// column: from top, its label (name and sort indicator), then its filter. A group's is centred
// (`data-group`), and so is "select all", without padding (a check box
// column is narrow at any density). In a header row holding filters, every
// label sits at the top, so a column without one lines up with the others.
// A sortable one takes the pointer; it names the group
// `sheet-header` (its sort indicator and resizer read its hover).
const headerCell = tv({
    base: `
        group/sheet-header flex flex-col items-start justify-center gap-1
        border-b border-palette-line px-3 font-medium text-palette-contrast select-none
        data-group:items-center
        has-[[data-slot=data-grid-select-all-cell]]:items-center
        has-[[data-slot=data-grid-select-all-cell]]:px-0
        group-has-[[data-slot=data-grid-header-filter]]/sheet-header-row:justify-start
        group-has-[[data-slot=data-grid-header-filter]]/sheet-header-row:pt-2
        data-sortable:cursor-pointer
        ${cellState}
    `,
});

// A header cell's label: its name and its sort indicator, on one line.
const headerLabel = tv({
    base: `
        flex w-full min-w-0 items-center gap-1.5
        group-data-group/sheet-header:justify-center
        group-has-[[data-slot=data-grid-select-all-cell]]/sheet-header:justify-center
    `,
});

// The name in it: truncated, never pushing the indicator out.
const headerTitle = tv({ base: "min-w-0 truncate" });

// A body row: opaque `base` (its pinned cells inherit it), a `line` rule
// below. A hover and the row holding the active cell take `soft` at half
// (opaque, see the header); a selected one `soft` with `contrast` text — a
// hover never lights it. It names the group `sheet-row`.
const row = tv({
    base: `
        group/sheet-row border-b border-palette-line bg-palette-base
        not-data-selected:hover:bg-[color-mix(in_oklab,var(--color-palette-soft)_50%,var(--color-palette-base))]
        not-data-selected:data-active:bg-[color-mix(in_oklab,var(--color-palette-soft)_50%,var(--color-palette-base))]
        data-selected:bg-palette-soft
    `,
});

// A body cell: table's padding and secondary text, one line, truncated,
// centred on the block axis. `contrast` in a selected row. While its row
// loads it shows a `Skeleton`'s bar (`soft`, `animate-pulse`, `rounded-md`).
// A cell holding a row's check box centres it, without padding (a check
// box column is narrow at any density). An edited cell gives its editor
// the room (`p-0.5`, the ring's width).
const cell = tv({
    base: `
        content-center truncate px-3 text-palette-accent/85
        group-data-selected/sheet-row:text-palette-contrast
        has-[>[data-slot=data-grid-select-cell]]:px-0
        has-[>[data-slot=data-grid-select-cell]]:text-center
        data-loading:after:block data-loading:after:h-3
        data-loading:after:w-3/5 data-loading:after:animate-pulse
        data-loading:after:rounded-md data-loading:after:bg-palette-soft
        data-editing:p-0.5
        ${cellState}
    `,
});

// What an empty grid shows, in its cell as large as the body: centred
// secondary text.
const empty = tv({
    base: "flex items-center justify-center p-6 text-center text-palette-accent/85",
});

// ─── FEATURES ───────────────────────────────────────────────────────────────

// The sort indicator (sorting()): an arrow for the direction, at the
// label's end, in `contrast`. An unsorted sortable column shows a faint
// up-down mark while its header is hovered. Icons follow the text axis.
const sortIndicator = tv({
    base: `
        flex shrink-0 items-center gap-0.5 text-palette-accent/85
        [&_svg]:size-icon-sm
        not-data-sort:opacity-0 not-data-sort:transition-opacity
        not-data-sort:duration-150
        not-data-sort:group-hover/sheet-header:opacity-100
        data-sort:text-palette-contrast
    `,
});

// A multi-sort's priority (`data-sort-priority`): a small number beside
// the arrow, tabular.
const sortPriority = tv({ base: "text-xs tabular-nums" });

// The column resizer (columnResize()): `split.separator`'s rule — a 1px
// `line`, a `before:` hit area of 1.5 steps each side, `ring` while hovered,
// dragged or focused (with its 3px bar) — on the header cell's boundary
// with the columns that scroll: its end edge (`data-edge="end"`), its start
// edge for a column pinned at the end. Shown while the header is hovered;
// the cursor is symmetric, so it needs no `ltr:` / `rtl:` pair.
const columnResizer = tv({
    base: `
        absolute inset-y-2 z-10 w-px touch-none bg-transparent outline-none
        cursor-ew-resize select-none transition-colors
        before:absolute before:inset-y-0 before:-inset-x-1.5
        after:absolute after:inset-y-0 after:-inset-x-px after:transition-colors
        data-[edge=end]:end-0 data-[edge=start]:start-0
        group-hover/sheet-header:bg-palette-line
        hover:bg-palette-ring data-resizing:bg-palette-ring
        focus-visible:bg-palette-ring focus-visible:after:bg-palette-ring
    `,
});

// The selection check boxes (rowSelection()): the registry's Checkbox,
// plus the mixed state of "select all" it does not paint — `tree.checkbox`'s
// values: the `ring` fill and `base` mark of a checked box, a dash for a
// check. Inline in its cell's line (Checkbox sets no display: a flex row
// gives it one in a form, a cell's line does not).
const checkbox = tv({
    base: `
        inline-flex align-middle
        data-indeterminate:border-palette-line
        data-indeterminate:bg-palette-ring
        data-indeterminate:text-palette-base
    `,
});

// The mixed box's dash: Checkbox.Indicator's own layout.
const checkboxDash = tv({ base: "grid place-content-center text-current" });

// The header filter (filtering()): the registry's Field frame with Input
// (rule 3), or the registry's Select trigger, under the column's name. A
// step shorter than a standalone control (seven steps, the frame's; the
// control fills it), with a row's padding.
const filter = tv({ base: "w-full font-normal" });
const filterFrame = tv({ base: "h-7" });
const filterControl = tv({ base: "h-full px-2 py-0" });

// The cell editor (editing()): the registry's Field frame with Input, as
// large as its cell. A refused value turns the field danger (its
// `data-invalid`, Field's own).
const editor = tv({ base: "h-full w-full" });
const editorFrame = tv({ base: "h-full" });
const editorControl = tv({ base: "h-full px-2.5 py-0" });

// The pagination footer (pagination()): the registry's Pagination, with
// the page's place in secondary text at the start.
const pagination = tv({
    base: "flex flex-row flex-wrap items-center justify-between gap-2 py-2 text-sm",
});
const paginationStatus = tv({ base: "text-palette-accent/85 tabular-nums" });
const pageSize = tv({ base: "h-8 w-20 py-0" });

export const sheet = {
    root,
    probe,
    grid,
    header,
    headerRow,
    headerCell,
    headerLabel,
    headerTitle,
    row,
    cell,
    empty,
    sortIndicator,
    sortPriority,
    columnResizer,
    checkbox,
    checkboxDash,
    filter,
    filterFrame,
    filterControl,
    editor,
    editorFrame,
    editorControl,
    pagination,
    paginationStatus,
    pageSize,
};

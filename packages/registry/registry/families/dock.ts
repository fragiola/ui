// Family `dock` — the docking layout (root, row, tabset, header, tab list, tab,
// tab label, tab marker, tab action, actions, panel, splitter, drop and edge
// indicators, border strip, border content, popout root).
// Consumer: ui/dockable (the styled layer over @fragiola/dockable-react).
//
// Decisions in docs/architecture.md §2 (style families, tv with zero
// variants) and §1 (palettes). Dockable's primitives are headless: they emit
// state as data-* attributes and set only structural inline styles. Every
// member reads that state with Tailwind data variants — no React state in
// the styles, no custom variant in the theme.
//
// ─── ONE PALETTE, NO TOKENS ─────────────────────────────────────────────────
// Dockable's own example themes shape the layout with ~25 `--dk-*` tokens.
// None comes here: sizes come from Tailwind's scale, the radius from the
// radius tokens, the header from `h-control`. The whole layout paints from
// ONE palette — the one on the root (`palette-surface` by default) — so a
// palette class on the root re-tints every part, and one on a tabset only
// that tabset. Tabsets are told apart from the floor by their line and their
// radius, never by a second palette: a hardcoded `palette-raised` on the
// tabset would redeclare `ring` and swallow a `surface-*` ring swap on the
// root, and the ring is what marks the active tabset.
//
// The swaps are surface-tier only, for the reason the sidebar gives: resting
// tabs are secondary text (`text-palette-accent/85`), readable on neutral
// surfaces.
//
// ─── STRUCTURAL STYLE WINS ──────────────────────────────────────────────────
// Row, TabSet, Panel and the border frame carry structural inline styles
// (position, geometry, display, flex sizing) that always win. No member sets
// those on them: a `flex-1` or a `w-*` there would compile and do nothing.
// The root row's margin is not one of them (see `row`).
// The root has no size of its own either — the consumer gives it one.
//
// ─── TABS ───────────────────────────────────────────────────────────────────
// `tab` takes the values of ui/tabs.tsx's tab — rounded-md, text-sm,
// font-medium, secondary text at rest, a soft fill and contrast text when
// current, the ring outline on focus-visible — at `h-8`, the height of a
// `size="sm"` Clickable, so a tab and the header's buttons line up. It is not
// extracted into a shared member: the two read different state (`data-active`
// there, `data-selected` here, plus a drag), and tabs.tsx is not a family.
// The negative result is recorded in the port report.
//
// A border's tabs are the same tab in the same list: a side border turns
// them (`writing-mode`) by reading the strip's state through the named group
// `group/border`, never through `data-orientation` alone — a Row carries one
// too, and a tabset's tab sits inside rows. A tabset's tabs have no border
// ancestor, so the border rules never reach them. Two members instead would
// be the same skeleton twice.
//
// The active tabset is marked by `tabMarker`, a ring bar under its selected
// tab: `in-data-active:` reads the TabSet's `data-active`,
// `group-data-selected/tab:` the tab's own state. It sits on the header's
// line (`-bottom-0.5`, the tab list's `py-0.5`), at any density.
//
// ─── HEIGHTS AND EDGE DOCKING ───────────────────────────────────────────────
// The header is `h-control`, a token that does not follow density: Dockable
// docks to a layout edge from a band that needs a header of ~30px or more,
// and a compact `--spacing` would take a spacing-scale header below that.
//
// ─── STACKING ───────────────────────────────────────────────────────────────
// Panels are portalled into the root after the tabsets: splitters are `z-10`
// so their grab area stays above the panels' edges, the indicators `z-20`
// above the panels, and an overlay border's content `z-30` above both.
//
// Namespace object: a single `dock` export with all members.

import { tv } from "tailwind-variants";

// The layout's floor. `palette-surface` by default — merged away by any
// palette class the consumer passes (cn knows the palette group).
const root = tv({
    base: "palette-surface bg-palette-base text-sm text-palette-contrast",
});

// The layout's root row — the only row with `data-root`: a margin is the
// gutter between the floor's edge and the outer tabsets, as wide as a
// splitter, so every gap in the layout is the same. A margin, because the
// row's position and inset are structural (`absolute; inset: 0`) and the
// root's padding would not move it; a margin on an absolutely positioned box
// with both insets set shrinks it, and the engine measures what it renders.
const row = tv({ base: "data-root:m-1.5" });

// A tabset: the line and the radius set it apart from the floor. Empty, it
// keeps a dashed outline where tabs can be dropped.
const tabset = tv({
    base: `
        rounded-md border border-palette-line bg-palette-base
        data-empty:border-dashed
    `,
});

// The bar above a tabset's content: its tab list, the overflow trigger and
// the actions. The line is the one the tab marker sits on.
const header = tv({
    base: "flex h-control shrink-0 items-center border-b border-palette-line",
});

// The tab strip. `overflow-hidden` clips a tab the engine is about to hide;
// the engine reserves the overflow trigger's width beside it. In a side
// border it is a column.
const tabList = tv({
    base: `
        flex min-w-0 flex-1 items-center gap-1 self-stretch overflow-hidden
        px-1 py-0.5
        group-data-[orientation=vertical]/border:min-h-0
        group-data-[orientation=vertical]/border:flex-col
        group-data-[orientation=vertical]/border:px-0.5
        group-data-[orientation=vertical]/border:py-1
    `,
});

// The values of ui/tabs.tsx's tab (see the header), lit by Dockable's state.
// In a side border it turns: a start border reading upwards
// (`data-tab-direction=up`) turns half a turn more.
const tab = tv({
    base: `
        group/tab relative flex h-8 max-w-60 shrink-0 cursor-pointer select-none
        items-center gap-1.5 rounded-md px-2.5 text-sm font-medium
        text-palette-accent/85 transition-colors
        hover:bg-palette-soft hover:text-palette-contrast
        focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-palette-ring
        data-selected:bg-palette-soft data-selected:text-palette-contrast
        data-dragging:opacity-50
        [&_svg:not([class*='size-'])]:size-3.5
        [&_svg]:pointer-events-none [&_svg]:shrink-0
        group-data-[orientation=vertical]/border:h-auto
        group-data-[orientation=vertical]/border:max-h-60
        group-data-[orientation=vertical]/border:w-8
        group-data-[orientation=vertical]/border:px-0
        group-data-[orientation=vertical]/border:py-2.5
        group-data-[orientation=vertical]/border:[writing-mode:vertical-rl]
        group-data-[tab-direction=up]/border:rotate-180
    `,
});

// A tab's text: truncated, so a long label never pushes its action out.
const tabLabel = tv({ base: "truncate" });

// The active tabset's marker, under its selected tab (see the header).
const tabMarker = tv({
    base: `
        pointer-events-none absolute inset-x-2 -bottom-0.5 hidden h-0.5
        rounded-full bg-palette-ring
        in-data-active:group-data-selected/tab:block
    `,
});

// A button inside a tab (close). The tab is already soft when selected, so
// the button's hover steps to the line, the next step up the same palette.
const tabAction = tv({
    base: `
        -me-1 rounded-sm text-palette-accent/85
        hover:bg-palette-line hover:text-palette-contrast
    `,
});

// The header's buttons, after the tab list: pop out, maximize.
const actions = tv({
    base: "flex shrink-0 items-center gap-0.5 pe-1",
});

// A tab's content. The engine positions it over the tabset's content area,
// inside the tabset's border: it repeats the tabset's inner bottom radius.
const panel = tv({
    base: `
        rounded-b-[calc(var(--radius-md)-1px)] bg-palette-base
        text-palette-contrast
    `,
});

// The bar between two children of a row, or beside a border's panel. The
// engine measures its thickness; the visible line is its `::after`, centred
// with auto margins on the inline axis, so it needs no RTL flip.
const splitter = tv({
    base: `
        relative z-10 shrink-0 outline-none
        after:absolute after:rounded-full after:transition-colors
        hover:after:bg-palette-ring/40 focus-visible:after:bg-palette-ring
        data-dragging:after:bg-palette-ring
        data-[orientation=vertical]:w-1.5 data-[orientation=vertical]:cursor-ew-resize
        data-[orientation=vertical]:after:inset-y-1 data-[orientation=vertical]:after:inset-x-0
        data-[orientation=vertical]:after:mx-auto data-[orientation=vertical]:after:w-0.5
        data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:cursor-ns-resize
        data-[orientation=horizontal]:after:inset-x-1 data-[orientation=horizontal]:after:inset-y-0
        data-[orientation=horizontal]:after:my-auto data-[orientation=horizontal]:after:h-0.5
    `,
});

// Where a dragged tab would land. Solid inside or beside a tabset, dashed at
// the layout's outer edge (`data-drop-kind=edge`). The core hides it when a
// drop rule refuses the target.
const dropIndicator = tv({
    base: `
        z-20 rounded-md border-2 border-palette-ring bg-palette-ring/15
        transition-[left,top,width,height] duration-150
        data-[drop-kind=edge]:border-dashed
        motion-reduce:transition-none
    `,
});

// The band along a layout edge where a drop docks to that edge.
const edgeIndicator = tv({
    base: `
        z-20 rounded-full bg-palette-ring/30
        data-drop-target:bg-palette-ring
    `,
});

// A border's strip: as thick as the header (`--height-control`), on the
// floor, with a line on the layout's side. The named group its list and
// tabs read (see the header).
const border = tv({
    base: `
        group/border shrink-0 border-palette-line bg-palette-base
        data-[orientation=vertical]:w-(--height-control)
        data-[orientation=horizontal]:h-control
        data-[location=start]:border-e data-[location=end]:border-s
        data-[location=top]:border-b data-[location=bottom]:border-t
        data-drop-target:bg-palette-soft
    `,
});

// Where a border's panel opens. Docked, it sits beside the layout and needs
// nothing; overlaid, it floats over the layout's edge.
const borderContent = tv({
    base: `
        data-overlay:z-30 data-overlay:border-palette-line
        data-overlay:bg-palette-base data-overlay:shadow-lg
        data-overlay:data-[location=start]:border-e
        data-overlay:data-[location=end]:border-s
        data-overlay:data-[location=top]:border-b
        data-overlay:data-[location=bottom]:border-t
    `,
});

// A popout window's floor: the root's, in the window's own document — the
// root is not its ancestor there, so it declares the palette again.
const popoutRoot = root;

export const dock = {
    root,
    row,
    tabset,
    header,
    tabList,
    tab,
    tabLabel,
    tabMarker,
    tabAction,
    actions,
    panel,
    splitter,
    dropIndicator,
    edgeIndicator,
    border,
    borderContent,
    popoutRoot,
};

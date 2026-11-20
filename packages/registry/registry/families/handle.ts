// Family `handle` — the resize handle: the bar a pointer grabs to resize a
// split view, and the mark drawn on it.
// Consumers: families/split (Splitter's separator and grip), families/dock
// (Dockable's splitter and its mark), families/tile (Grid Layout's resize
// handles).
//
// Decisions in docs/architecture.md §2 (style families, tv with zero
// variants) and §4 (design axes) and docs/visual-language.md (the handle).
//
// ─── ONE LOOK, ONE AXIS ─────────────────────────────────────────────────────
// Splitter and Dockable used to draw their handles in their own words: a 1px
// rule with a pill on hover, and a transparent gap with a `ring/40` bar. The
// look lives here now, and both compose it:
//
// - `target` is the element the pointer grabs: the cursors, the stacking,
//   the named group `handle` the mark reads, and the rule — its `::after`,
//   transparent at rest, `ring` on hover (unless disabled), while dragged and
//   on focus-visible, where it widens into the 3px focus bar. A consumer
//   paints the rule at rest only where two panels touch (Splitter, `line`);
//   between Dockable's bordered tabsets the tabsets' own lines draw the edge
//   and a third line in the 6px gap would be noise — the one difference, and
//   it is geometry, not the mark.
// - `mark` is the decoration on it (Splitter's Grip, Dockable's splitter
//   mark, a Grid Layout card's resize mark), a child element: a `ring` pill
//   whose shape and resting visibility come from the `data-handle` axis.
//
// The axis only sets tokens (rule 9): `--handle-rest` (the mark's opacity at
// rest) and `--handle-mask` (an image that cuts the pill into dots, or
// none). Both reach the mark through `var()`, so a level on any ancestor —
// `<html>` or a subtree — re-draws every handle under it, with no re-render
// and no React reading the attribute:
//
// - `line` (the default, no attribute): the IDE look — the rule alone at
//   rest, the pill on hover, drag and focus;
// - `grip`: the pill shown at rest, faint, full `ring` on interaction;
// - `dots`: the pill cut into three dots by a radial-gradient mask, one cell
//   per third of its length, shown at rest.
//
// Hover, drag and focus light the mark fully at every level; a disabled
// handle shows none.
//
// ─── ORIENTATION ────────────────────────────────────────────────────────────
// The mark lines up with its parent through the `handle-vertical` and
// `handle-horizontal` variants (global.css): its PARENT is a bar between
// side-by-side panels (`data-orientation=vertical`, or a Grid Layout side
// `start` / `end`) or between stacked ones. A direct parent, never an
// ancestor: a nested Splitter group carries an orientation of its own. A
// Grid Layout corner matches neither and keeps a dot.
//
// Namespace object: a single `handle` export with all members.

import { tv } from "tailwind-variants";

// The element a pointer grabs (see the header). Its thickness, its hit area
// and the rule's length are the consumer's geometry; the rule is centred on
// the inline axis with auto margins, so it needs no RTL flip.
const target = tv({
    base: `
        group/handle relative z-10 flex shrink-0 items-center justify-center
        outline-none select-none
        after:absolute after:transition-colors
        not-data-disabled:hover:after:bg-palette-ring
        data-dragging:after:bg-palette-ring
        focus-visible:after:bg-palette-ring
        data-[orientation=vertical]:after:inset-x-0
        data-[orientation=vertical]:after:mx-auto
        data-[orientation=vertical]:after:w-px
        focus-visible:data-[orientation=vertical]:after:w-[3px]
        not-data-disabled:data-[orientation=vertical]:cursor-ew-resize
        data-[orientation=horizontal]:after:inset-y-0
        data-[orientation=horizontal]:after:my-auto
        data-[orientation=horizontal]:after:h-px
        focus-visible:data-[orientation=horizontal]:after:h-[3px]
        not-data-disabled:data-[orientation=horizontal]:cursor-ns-resize
    `,
});

// The mark (see the header): a `ring` pill — the drawer handle's shape
// (`rounded-pill`, which follows the radius axis), shorter — above the rule
// (`relative z-10`), letting the pointer through to the handle. Its
// opacity at rest and its mask are the axis' tokens; hover, drag and focus
// on the handle light it fully. `--handle-mask` cuts it into one dot per
// third of its length (a side) or a single dot (a corner): `mask-size`
// gives each dot its cell, the gradient draws a circle in it.
const mark = tv({
    base: `
        pointer-events-none relative z-10 size-1.5 shrink-0 rounded-pill
        bg-palette-ring opacity-[var(--handle-rest,0)] transition-opacity
        [mask-image:var(--handle-mask,none)] [mask-position:center]
        [mask-repeat:repeat] [mask-size:100%_100%]
        handle-vertical:h-6 handle-vertical:w-1.5
        handle-vertical:[mask-size:100%_calc(100%/3)]
        handle-horizontal:h-1.5 handle-horizontal:w-6
        handle-horizontal:[mask-size:calc(100%/3)_100%]
        group-not-data-disabled/handle:group-hover/handle:opacity-100
        group-data-dragging/handle:opacity-100
        group-data-resizing/handle:opacity-100
        group-focus-visible/handle:opacity-100
        group-data-disabled/handle:opacity-0
    `,
});

export const handle = {
    target,
    mark,
};

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
//   centred on the bar at a thickness of `--handle-bar` (1px; 3px on
//   focus-visible, the focus bar). Hovered (unless disabled) it turns
//   `ring`; dragged and focused, `ring`. A consumer paints the rule at rest
//   where two panels touch (Splitter, `line`); between Dockable's bordered
//   tabsets the tabsets' own lines draw the edge and a third line in the
//   6px gap would be noise — the one difference, and it is geometry.
// - `mark` is the decoration on a bar (Splitter's Grip, Dockable's splitter
//   mark), a child element centred on the rule: a pill, neutral at rest
//   (`accent`, at the level's resting opacity) and `ring` on interaction,
//   whose shape and resting visibility come from the `data-handle` axis.
// - `edgeMark` is the mark on a card's edge (a Grid Layout resize handle),
//   where there is no rule: it keeps a 40% floor at rest and is lit on
//   interaction at every level, `ide` included.
//
// The axis only sets tokens (rule 9), and they reach the classes through
// `var()`, so a level on any ancestor — `<html>` or a subtree — re-draws
// every handle under it, with no re-render and no React reading the
// attribute:
//
// - `--handle-rest`: the mark's opacity at rest;
// - `--handle-mask`: an image that cuts the pill into dots, or none;
// - `--handle-seam`: 0, or 1 for the IDE look — the panels meet at a seam,
//   and the handle is that seam. Everything `ide` changes is an expression
//   over it: the hovered rule mixes `ring` by `1 - seam` (at 1 it is the
//   `line` brightened towards `contrast`, never `ring`), the dragged rule is
//   `1px + 2px × seam` thick, the mark on a bar is lit to `1 - seam` (never
//   shown), and Dockable's gap, gutter and tabset frames scale by
//   `1 - seam` (families/dock.ts).
//
// The levels:
//
// - `line` (the default, no attribute): the rule alone at rest, the pill on
//   hover, drag and focus, the rule `ring` on hover;
// - `grip`: the pill shown at rest, faint;
// - `dots`: the pill cut into three dots by a radial-gradient mask, one cell
//   per third of its length, shown at rest;
// - `ide`: no mark and no gap; a 1px rule that brightens on hover and
//   thickens into a 3px `ring` bar while dragged or focused, an overlay
//   centred on the edge, so the panes never move.
//
// A disabled handle shows no mark.
//
// ─── ORIENTATION ────────────────────────────────────────────────────────────
// The mark lines up with its parent through the `handle-vertical` and
// `handle-horizontal` variants (global.css): its PARENT is a bar between
// side-by-side panels (`data-orientation=vertical`, or a Grid Layout side
// `start` / `end`) or between stacked ones. A direct parent, never an
// ancestor: a nested Splitter group carries an orientation of its own. A
// Grid Layout corner matches neither and keeps a dot.
//
// The rule is centred with symmetric insets (`calc(50% - bar / 2)` on both
// sides), never `mx-auto`: auto margins cannot centre a box wider than its
// 1px bar (the over-constrained box keeps its start margin at zero and
// spills to the end, and flips in RTL).
//
// Namespace object: a single `handle` export with all members.

import { tv } from "tailwind-variants";

// The element a pointer grabs (see the header). Its thickness, its hit area
// and the rule's length are the consumer's geometry. A focused bar keeps
// its 3px while dragged (`focus-visible:data-dragging:`, which outranks
// `data-dragging:`). The hover fill is kept
// off a dragged or focused bar, whose `ring` wins.
const target = tv({
    base: `
        group/handle relative z-10 flex shrink-0 items-center justify-center
        outline-none select-none
        [--handle-bar:1px]
        data-dragging:[--handle-bar:calc(1px_+_2px_*_var(--handle-seam,0))]
        focus-visible:[--handle-bar:3px]
        focus-visible:data-dragging:[--handle-bar:3px]
        after:absolute after:transition-colors
        not-data-disabled:not-data-dragging:not-focus-visible:hover:after:bg-[color-mix(in_oklch,var(--palette-ring)_calc((1_-_var(--handle-seam,0))_*_100%),color-mix(in_oklch,var(--palette-contrast)_40%,var(--palette-line)))]
        data-dragging:after:bg-palette-ring
        focus-visible:after:bg-palette-ring
        data-[orientation=vertical]:after:inset-x-[calc(50%_-_var(--handle-bar)_/_2)]
        not-data-disabled:data-[orientation=vertical]:cursor-ew-resize
        data-[orientation=horizontal]:after:inset-y-[calc(50%_-_var(--handle-bar)_/_2)]
        not-data-disabled:data-[orientation=horizontal]:cursor-ns-resize
    `,
});

// The mark on a bar (see the header): a pill — the drawer handle's shape
// (`rounded-pill`, which follows the radius axis), shorter — centred on the
// rule by the bar's flex box and above it (`relative z-10`), letting the
// pointer through to the handle. At rest it is neutral (`accent`) at the
// level's opacity; hover, drag and focus on the handle turn it `ring`, lit
// to `1 - seam`. `--handle-mask` cuts it into one dot per third of its
// length (a side) or a single dot (a corner): `mask-size` gives each dot
// its cell, the gradient draws a circle in it.
const mark = tv({
    base: `
        pointer-events-none relative z-10 size-1.5 shrink-0 rounded-pill
        bg-palette-accent opacity-[var(--handle-rest,0)]
        transition-[opacity,background-color]
        [mask-image:var(--handle-mask,none)] [mask-position:center]
        [mask-repeat:repeat] [mask-size:100%_100%]
        handle-vertical:h-6 handle-vertical:w-1.5
        handle-vertical:[mask-size:100%_calc(100%/3)]
        handle-horizontal:h-1.5 handle-horizontal:w-6
        handle-horizontal:[mask-size:calc(100%/3)_100%]
        group-not-data-disabled/handle:group-hover/handle:bg-palette-ring
        group-not-data-disabled/handle:group-hover/handle:opacity-[calc(1_-_var(--handle-seam,0))]
        group-data-dragging/handle:bg-palette-ring
        group-data-dragging/handle:opacity-[calc(1_-_var(--handle-seam,0))]
        group-data-resizing/handle:bg-palette-ring
        group-data-resizing/handle:opacity-[calc(1_-_var(--handle-seam,0))]
        group-focus-visible/handle:bg-palette-ring
        group-focus-visible/handle:opacity-[calc(1_-_var(--handle-seam,0))]
        group-data-disabled/handle:opacity-0
    `,
});

// The mark on a card's edge (see the header): the bar's mark, with a 40%
// floor at rest — the handle itself only shows while its card is hovered
// or held — and lit fully on interaction at every level: a card's edge has
// no rule to stand in for it, so `ide` keeps it.
const edgeMark = tv({
    extend: mark,
    base: `
        opacity-[max(0.4,var(--handle-rest,0))]
        group-not-data-disabled/handle:group-hover/handle:opacity-100
        group-data-dragging/handle:opacity-100
        group-data-resizing/handle:opacity-100
        group-focus-visible/handle:opacity-100
    `,
});

export const handle = {
    target,
    mark,
    edgeMark,
};

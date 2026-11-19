// Family `split` — split views (group, panel, separator, grip, and the
// content a collapsed panel shows or hides).
// Consumer: ui/splitter (the styled layer over @fragiola/splitter-react).
//
// Decisions in docs/architecture.md §2 (style families, tv with zero
// variants), §1 (palettes) and §5 (special components, S1–S8). Splitter's
// primitives are headless: they emit state as data-* attributes
// (`data-orientation`, `data-dragging`, `data-disabled`, `data-collapsible`,
// `data-collapsed`) and set only structural inline styles. Every member
// reads that state with Tailwind data variants — no React state in the
// styles, no custom variant in the theme.
//
// ─── NO PALETTE OF ITS OWN ──────────────────────────────────────────────────
// Unlike `dock.root`, no member declares a palette: the parts paint from the
// one in scope (the page's `palette-surface`), so a palette class on a group
// re-tints its panels, its separators and every group nested in it. A
// default `palette-surface` on the group would be redeclared by each nested
// group and swallow a swap on an outer one — groups nest, Dockable's root
// does not.
//
// ─── STRUCTURAL STYLE WINS ──────────────────────────────────────────────────
// The group carries `display: flex` and its direction inline, a panel its
// `flex` (its size) and `overflow: hidden`, a separator `flex-grow`,
// `flex-shrink` and `touch-action`. No member sets those on them: a `flex-1`
// or a `w-*` on a panel would compile and do nothing. The group's size is
// the consumer's (`h-80`, `h-full`). A separator's thickness is not
// structural — it is the separator member's.
//
// ─── THE SEPARATOR ──────────────────────────────────────────────────────────
// A 1px `line` rule — `ui/separator.tsx`'s values (`bg-palette-line`,
// `w-px` / `h-px`), so a split view's rule and a plain divider look the
// same — with a wider invisible hit area: its `::before`, sized from the
// spacing scale (`-inset-x-1.5`, 6px each side at the default density,
// ~5px under compact), so the engine measures 1px and the pointer finds
// 13px. Its `::after` is the 3px focus bar.
//
// Compared with `dock.splitter` (S4): the cursors (`ew-resize` /
// `ns-resize`) and the ring on drag and focus are shared. They differ on
// purpose: Dockable's splitter is a 6px transparent gap between bordered
// tabsets, so it has no line at rest and hints at hover with `ring/40` on a
// 2px bar; here two panels touch, the rule is visible at rest, and hover
// turns it to full `ring` (a `ring/40` over the line would barely change a
// 1px rule) and shows the grip. Dockable's `z-10` is shared too: the hit
// area overlaps both panels and stays above their content.
//
// Namespace object: a single `split` export with all members.

import { tv } from "tailwind-variants";

// The group: nothing visual and no geometry (see the header). It names the
// Tailwind group `splitter`, so a panel's content can read a drag anywhere
// in its group (`group-data-dragging/splitter:`), and stops text selection
// while a separator is dragged.
const group = tv({
    base: "group/splitter data-dragging:select-none",
});

// A panel: the surface tier's fill and text, from the palette in scope. A
// collapsed panel (a rail that keeps its icons) steps to `soft`, so it reads
// as a different place from an expanded neighbour. Collapsible and disabled
// panels look like any other: what they allow shows on the separator.
const panel = tv({
    base: `
        bg-palette-base text-sm text-palette-contrast
        data-collapsed:bg-palette-soft
    `,
});

// The rule between two panels (see the header). Its own `data-orientation`
// is `vertical` between side by side panels and `horizontal` between stacked
// ones. `ring` on hover (unless disabled), while dragged and on
// focus-visible — the last with the 3px bar. A disabled separator keeps its
// rule and loses its cursor and its hover. Its content (the grip) is
// centred with flex: an item larger than the 1px box overflows it evenly on
// both sides, in either direction.
const separator = tv({
    base: `
        group/separator relative z-10 flex shrink-0 items-center justify-center
        bg-palette-line outline-none transition-colors select-none
        before:absolute after:absolute after:transition-colors
        not-data-disabled:hover:bg-palette-ring
        data-dragging:bg-palette-ring
        focus-visible:bg-palette-ring focus-visible:after:bg-palette-ring
        data-[orientation=vertical]:w-px
        data-[orientation=vertical]:before:inset-y-0
        data-[orientation=vertical]:before:-inset-x-1.5
        data-[orientation=vertical]:after:inset-y-0
        data-[orientation=vertical]:after:-inset-x-px
        not-data-disabled:data-[orientation=vertical]:cursor-ew-resize
        data-[orientation=horizontal]:h-px
        data-[orientation=horizontal]:before:inset-x-0
        data-[orientation=horizontal]:before:-inset-y-1.5
        data-[orientation=horizontal]:after:inset-x-0
        data-[orientation=horizontal]:after:-inset-y-px
        not-data-disabled:data-[orientation=horizontal]:cursor-ns-resize
    `,
});

// The grip: a ring pill on the rule, hidden at rest and shown while the
// separator is hovered (unless disabled), dragged or focused. It lines up
// with the separator by reading its orientation through the named group,
// never `data-orientation` alone — a nested group carries one too. It lets
// the pointer through to the separator.
const grip = tv({
    base: `
        pointer-events-none shrink-0 rounded-full bg-palette-ring opacity-0
        transition-opacity
        group-data-[orientation=vertical]/separator:h-6
        group-data-[orientation=vertical]/separator:w-1.5
        group-data-[orientation=horizontal]/separator:h-1.5
        group-data-[orientation=horizontal]/separator:w-6
        group-not-data-disabled/separator:group-hover/separator:opacity-100
        group-data-dragging/separator:opacity-100
        group-focus-visible/separator:opacity-100
    `,
});

// Content a collapsed panel hides (a label beside a rail's icon, a list):
// hidden from sight and from assistive technology while any panel around it
// is collapsed (`in-data-collapsed`).
const expanded = tv({ base: "in-data-collapsed:hidden" });

// Content shown only while its panel is collapsed (a rail's icon-only
// variant of a header): the reverse of `expanded`.
const collapsed = tv({ base: "not-in-data-collapsed:hidden" });

export const split = {
    group,
    panel,
    separator,
    grip,
    expanded,
    collapsed,
};

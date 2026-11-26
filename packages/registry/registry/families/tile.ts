// Family `tile` — the dashboard grid (root, cells, item, the card's header,
// title and content, drag handle, resize handle, placeholder, drag source,
// drag preview, and the refused drop).
// Consumer: ui/grid-layout (the styled layer over @fragiola/grid-layout-react).
//
// Decisions in docs/architecture.md §2 (style families, tv with zero
// variants), §1 (palettes) and §5 (special components, S1–S8). Grid Layout's
// primitives are headless: they emit state as data-* attributes
// (`data-dragging`, `data-resizing`, `data-grabbed`, `data-dropping`,
// `data-drop-refused`, `data-outside`, `data-static`, `data-draggable`,
// `data-resizable`, `data-pressing`, `data-side`, `data-kind`, `data-over`,
// `data-disabled`) and set only structural inline styles. Every member reads
// that state with Tailwind data variants — one exception, the refused drop
// (see `refused`).
//
// The name is `tile`, not `grid`: Data Grid's family will want that one.
//
// ─── STRUCTURAL STYLE WINS ──────────────────────────────────────────────────
// The engine places the root (`position: relative`, its height), every item,
// cell and the placeholder (`position: absolute`, `top`/`left` 0, `width`,
// `height`, `transform: translate(…)`, `box-sizing`, the held item's
// `z-index`) and the drag preview (`position: fixed`, `z-index`). No member
// sets those on them: a `w-*`, a `translate-*` or an `absolute` there would
// compile and do nothing — or, worse, fight the engine. The lift of a held
// item uses the separate `scale` property, which composes with the engine's
// `transform` (the package's transitions guide). Sizes in pixels — the row
// height, the gap, the padding — are the engine's options, not classes: they
// do not follow the density axis (a package limit, in the port report).
//
// ─── PALETTES ───────────────────────────────────────────────────────────────
// An item is a card on the raised tier (`foundation.raised`): `palette-raised`, the values of
// `layer.panel` where they coincide (`bg-palette-base`, `text-palette-contrast`,
// `rounded-lg`, `border border-palette-line`), with a lighter shadow at rest
// (`shadow-sm`: a dashboard shows many cards at once) and `layer.panel`'s
// `shadow-lg` while held. A palette class on an Item replaces the raised one
// (cn knows the palette group). The root, the cells, the placeholder and the
// drag source declare none: they paint from the palette in scope, so a
// palette class on the root tints the dots, the placeholder and the drop
// outline. The drag preview is a card too, raised.
//
// A refused drop turns danger. A palette is a plain class, not a utility, so
// Tailwind cannot put it behind a variant (`data-drop-refused:palette-danger`
// compiles nothing, see palettes/danger.css): the parts add `refused` from
// their state (`dropRefused` on Root, `refused` on DragPreview), the one
// state read in React.
//
// ─── MOTION ─────────────────────────────────────────────────────────────────
// Items glide to their new places (`transform`, `width`, `height`), except
// the one a pointer holds — the engine draws it at the pointer every frame,
// and a transition would make it lag. The placeholder glides between cells.
// Every duration is a numeric `duration-*`, so the motion axis scales it
// (`none` and `prefers-reduced-motion` make it instant).
//
// ─── COMPARED WITH (S4) ─────────────────────────────────────────────────────
// - the placeholder is `dock.dropIndicator`'s box: `border-2`,
//   `border-palette-ring`, a `ring/15` fill, a transition at `duration-150`
//   — dashed, and with the card's radius (`rounded-lg`) instead of
//   `rounded-md`, since it stands where a card will be;
// - a resize handle's mark is the `handle` family's, Splitter's grip and
//   Dockable's splitter mark (`handle.mark`), so the `data-handle` axis
//   draws it too, with a 40% floor at rest. Its cursors are
//   `split.separator`'s (`ew-resize`, `ns-resize`), and the corners'
//   diagonal ones, mirrored for right-to-left;
// - the drag handle is Clickable's `icon` fill (transparent, `soft` on hover)
//   at `size-6`, with secondary text at rest and `size-icon`; it cannot BE a
//   Clickable — a button is exempt from dragging (the package's DRAG_EXEMPT);
// - focus is the `outline-2 outline-palette-ring` every focusable registry
//   part draws.
//
// Namespace object: a single `tile` export with all members.

import { tv } from "tailwind-variants";
import { foundation } from "./foundation";
import { handle } from "./handle";

// The grid: nothing at rest. It names the Tailwind group `tile`, which the
// cells and the placeholder read. While an item from outside is over it
// (`data-dropping`) — or a drag over it would not drop (`data-drop-refused`,
// danger, see `refused`) — a dashed outline marks the area, inside its edge
// so a scrolling ancestor never clips it. No text selection while a pointer
// holds an item.
const root = tv({
    base: `
        group/tile rounded-lg -outline-offset-2
        data-dropping:outline-2 data-dropping:outline-dashed
        data-dropping:outline-palette-ring
        data-drop-refused:outline-2 data-drop-refused:outline-dashed
        data-drop-refused:outline-palette-ring
        data-dragging:select-none data-resizing:select-none
    `,
});

// The background: a `line` dot at the centre of each cell, shown while a
// gesture is in progress (pointer, keyboard or a drop, refused included: a
// native drag `onExternalDrag` refuses has no gesture) and hidden while the
// held item is off the grid (`data-outside`: released there, it goes back).
// The dot is the cell's `::after`, centred in the box the engine gives the
// cell, sized from the spacing scale.
const cells = tv({
    base: `
        pointer-events-none opacity-0 transition-opacity duration-200
        after:absolute after:inset-0 after:m-auto after:size-1
        after:rounded-full after:bg-palette-line
        group-data-dragging/tile:group-not-data-outside/tile:opacity-100
        group-data-resizing/tile:opacity-100
        group-data-grabbed/tile:opacity-100
        group-data-dropping/tile:opacity-100
        group-data-drop-refused/tile:opacity-100
    `,
});

// An item: a card (see the header). It names the group `tile-item`, which
// its resize handles read. Held — by a pointer (`data-dragging`,
// `data-resizing`) or the keyboard (`data-grabbed`) — it takes the overlay
// shadow; moved, it lifts (`scale`), and a touch that holds it before the
// drag presses it in (`data-pressing`). Off the grid it fades: released
// there, it stays where it was. The lift snaps in rather than easing: the
// transitions are off while a pointer holds the item, so they never lag it
// (the package's guide). A static item never moves: the `soft` fill
// sets it into the floor. The grab cursor is the body's only when the item
// has no drag handle — with one, the handle is where it drags from. It
// clips nothing: its resize handles straddle its border (`resizeHandle`),
// and its content clips and rounds itself (`content`).
const item = tv({
    base: [
        foundation.focus(),
        foundation.raised(),
        `
        group/tile-item flex flex-col text-sm
        not-data-dragging:not-data-resizing:transition-[transform,width,height,scale,box-shadow,opacity]
        not-data-dragging:not-data-resizing:duration-200
        not-data-dragging:not-data-resizing:ease-out
        data-dragging:shadow-lg data-resizing:shadow-lg data-grabbed:shadow-lg
        data-dragging:scale-102 data-grabbed:scale-102
        data-pressing:scale-98
        data-outside:opacity-60
        data-static:bg-palette-soft
        data-draggable:not-data-dragging:not-has-data-[grid-layout-part=drag-handle]:cursor-grab
        data-dragging:cursor-grabbing
    `,
    ],
});

// The card's top row: the drag handle, the title and any action.
const header = tv({
    base: `
        flex min-h-9 shrink-0 items-center gap-1.5 border-b
        border-palette-line ps-1.5 pe-3
    `,
});

// The card's name, truncated so an action beside it is never pushed out.
const title = tv({ base: "min-w-0 flex-1 truncate font-medium" });

// The card's content: what is left of the card, scrolling when it overflows,
// clipped to the card's inner bottom corners (the card itself clips
// nothing, see `item`).
const content = tv({
    base: "min-h-0 flex-1 overflow-auto rounded-b-[max(0px,calc(var(--radius-lg)_-_1px))] p-3",
});

// Where an item drags from, and its tab stop: an icon at Clickable's `icon`
// fill (see the header). Lit while the pointer or the keyboard holds its
// item; dimmed, with no cursor, while its item cannot be dragged (no
// `data-draggable`).
const dragHandle = tv({
    base: [
        foundation.focus(),
        `
        inline-flex size-6 shrink-0 items-center justify-center rounded-md
        text-palette-accent/85 transition-colors duration-150
        [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-icon
        data-draggable:hover:bg-palette-soft
        data-draggable:hover:text-palette-contrast
        data-dragging:bg-palette-soft data-dragging:text-palette-contrast
        data-grabbed:bg-palette-soft data-grabbed:text-palette-contrast
        not-data-draggable:opacity-50
        data-draggable:not-data-dragging:cursor-grab
        data-dragging:cursor-grabbing
    `,
    ],
});

// A side or corner an item is resized from: a hit area across the card's
// edge — 8px centred on its 1px border (`-4.5px` from the padding box, the
// border's middle at `-0.5px`), so a side's mark sits on the border, not
// beside it — above its content, with the
// handle's mark (`resizeMark`) — a dot on a corner — shown while the card is
// hovered, focused (or holds focus) or held by the keyboard (Shift + arrows
// resize it), and while this handle is pulled. It is a `handle` target in
// name only (`group/handle`, which the mark reads): its geometry, its rule
// (none: the card's border is the edge) and its cursors are its own. Sides
// are logical: `start` and `end` mirror under `dir="rtl"`, and so do the
// corners' diagonal cursors. The package renders none while its item cannot
// be resized.
const resizeHandle = tv({
    base: `
        group/handle absolute z-10 flex items-center justify-center opacity-0
        transition-opacity duration-150
        group-hover/tile-item:opacity-100
        group-focus-visible/tile-item:opacity-100
        group-has-[:focus-visible]/tile-item:opacity-100
        group-data-grabbed/tile-item:opacity-100
        data-resizing:opacity-100
        data-[side=top]:inset-x-3 data-[side=top]:-top-[4.5px] data-[side=top]:h-2
        data-[side=bottom]:inset-x-3 data-[side=bottom]:-bottom-[4.5px] data-[side=bottom]:h-2
        data-[side=top]:cursor-ns-resize data-[side=bottom]:cursor-ns-resize
        data-[side=start]:inset-y-3 data-[side=start]:-start-[4.5px] data-[side=start]:w-2
        data-[side=end]:inset-y-3 data-[side=end]:-end-[4.5px] data-[side=end]:w-2
        data-[side=start]:cursor-ew-resize data-[side=end]:cursor-ew-resize
        data-[side=top-start]:top-0 data-[side=top-start]:start-0
        data-[side=top-end]:top-0 data-[side=top-end]:end-0
        data-[side=bottom-start]:bottom-0 data-[side=bottom-start]:start-0
        data-[side=bottom-end]:bottom-0 data-[side=bottom-end]:end-0
        data-[side=top-start]:size-3 data-[side=top-end]:size-3
        data-[side=bottom-start]:size-3 data-[side=bottom-end]:size-3
        data-[side=top-start]:ltr:cursor-nwse-resize data-[side=top-start]:rtl:cursor-nesw-resize
        data-[side=bottom-end]:ltr:cursor-nwse-resize data-[side=bottom-end]:rtl:cursor-nesw-resize
        data-[side=top-end]:ltr:cursor-nesw-resize data-[side=top-end]:rtl:cursor-nwse-resize
        data-[side=bottom-start]:ltr:cursor-nesw-resize data-[side=bottom-start]:rtl:cursor-nwse-resize
    `,
});

// The mark on a resize handle: the handle's mark for a card's edge
// (`handle.edgeMark`) — a pill along a side, centred on the card's border,
// a dot on a corner, cut into dots under `data-handle="dots"` — `ring`
// while its handle is hovered or pulled. The handle itself only shows while
// its card is hovered or held, so the mark never hides at rest there: its
// resting opacity has a floor of 40%, and `ide`, which hides a bar's mark
// behind its rule, keeps it (a card's edge has no rule).
const resizeMark = handle.edgeMark;

// Where the held item would land (see the header): a dashed `ring` box with
// a `ring/15` fill, gliding between cells. A new item coming in from outside
// (`data-kind=drop`) is drawn solid: it is the item itself, not a move. It
// never takes the pointer (the engine's style). While a held item is off the
// grid it stays where the item will go back to.
const placeholder = tv({
    base: `
        rounded-lg border-2 border-dashed border-palette-ring bg-palette-ring/15
        transition-[transform,width,height,opacity] duration-150 ease-out
        data-[kind=drop]:border-solid
    `,
});

// Something on the page that brings a new item in: a chip on the palette in
// scope, a tab stop. While it brings its item (pointer or keyboard) it dims;
// a disabled one dims and loses its cursor and hover.
const dragSource = tv({
    base: [
        foundation.focus(),
        `
        flex items-center gap-2 rounded-md border border-palette-line
        bg-palette-base px-3 py-2 text-sm text-palette-contrast select-none
        transition-[background-color,opacity] duration-150
        [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-icon
        not-data-disabled:hover:bg-palette-soft
        not-data-disabled:not-data-dragging:cursor-grab
        data-dragging:cursor-grabbing
        data-dragging:opacity-50 data-grabbed:opacity-50 data-disabled:opacity-50
    `,
    ],
});

// What follows the pointer while it brings a new item: a lifted card. Over
// the grid the placeholder shows where it lands, so the card fades out —
// unless the grid refuses it there, when it stays, in danger (`refused`).
const dragPreview = tv({
    base: `
        palette-raised rounded-lg border border-palette-line bg-palette-base
        px-3 py-2 text-sm font-medium text-palette-contrast shadow-lg
        transition-opacity duration-150
        data-over:not-data-drop-refused:opacity-0
    `,
});

// A drop the grid refuses: the danger palette, added by Root and DragPreview
// from their state (see the header).
const refused = tv({ base: "palette-danger" });

export const tile = {
    root,
    cells,
    item,
    header,
    title,
    content,
    dragHandle,
    resizeHandle,
    resizeMark,
    placeholder,
    dragSource,
    dragPreview,
    refused,
};

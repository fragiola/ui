// .tsx without JSX, on purpose: `ui/toast.tsx` has the same basename (as
// `field.tsx`, `tree.tsx` and `calendar.tsx`); the `toast` item ships both.
//
// Family `toast` — the notification stack (viewport, root, content, icon,
// title, description, actions, close).
//
// A new idea, so a family of its own (docs/architecture.md §2): a stack of
// toasts in a corner of the page, collapsed into a pile while nobody looks at
// it and spread out while the pointer or the keyboard is in it. Both bases
// describe the stack the same way (Fragiola Primitives took the names from
// Base UI): each Root carries `--toast-index` (0 the frontmost),
// `--toast-offset-y` (the heights in front of it), `--toast-height`, the
// swipe's `--toast-swipe-movement-x` / `-y`, and the Viewport
// `--toast-frontmost-height`; `data-expanded`, `data-limited`,
// `data-swiping`, `data-swipe-direction`, `data-starting-style` and
// `data-ending-style` mark the states. The family reads only those, so the
// parts stay identical on both bases.
//
// The look is the visual language's (docs/visual-language.md):
//   root         an overlay (`foundation.overlay`): raised, a `line` border,
//                `rounded-lg`, the overlay shadow — a card above the page;
//                a tab stop, with the standalone ring (`focus`).
//   content      the card's row, which clips while the toast is behind the
//                frontmost one and fades out then (`data-behind`), so a
//                peeking toast shows its edge, not its text.
//   icon         the status mark: its colour is the palette class it carries
//                (`palette-green`, `palette-danger`, …) through `accent`; the
//                card itself stays neutral.
//   title        the label type (`text-sm`, `font-medium`, `contrast`).
//   description  secondary text (`foundation.secondary`).
//
// Motion is a layer's (`duration-200`). The swipe is physical (`right` by
// default), as both bases decide. Zero variants.

import { tv } from "tailwind-variants";
import { foundation } from "./foundation";

// viewport — the fixed corner the stack grows from: the block end, the
// inline end (the bottom right in LTR, the bottom left in RTL). It is the
// F6 landmark; its toasts are its absolute children, so it has no height.
const viewport = tv({
    base: `
        fixed bottom-4 end-4 z-50 w-[min(24rem,calc(100vw-2rem))]
        outline-none
    `,
});

// root — one toast. Collapsed, each older toast sits `--peek` above the one
// in front, scaled down by a tenth per step and as tall as the frontmost;
// expanded, each one stands at its offset, at its own height. A starting
// toast comes from below the corner, an ending one leaves along its swipe
// (or downwards), and a queued one (`data-limited`) is hidden. The `::after`
// bridges the gap to the next toast, so the stack stays expanded while the
// pointer crosses it.
const root = tv({
    base: [
        foundation.overlay(),
        foundation.focus(),
        `
        group/toast absolute end-0 bottom-0 w-full origin-bottom select-none
        [--gap:0.75rem] [--peek:0.75rem]
        [--scale:max(0,calc(1-var(--toast-index)*0.1))]
        [--shrink:calc(1-var(--scale))]
        [--height:var(--toast-frontmost-height,var(--toast-height))]
        [--offset-y:calc(var(--toast-offset-y)*-1-var(--toast-index)*var(--gap)+var(--toast-swipe-movement-y))]
        z-[calc(1000-var(--toast-index))]
        h-(--height)
        [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-var(--toast-index)*var(--peek)-var(--shrink)*var(--height)))_scale(var(--scale))]
        data-expanded:h-(--toast-height)
        data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]
        data-starting-style:[transform:translateY(150%)]
        data-ending-style:opacity-0
        data-ending-style:not-data-swipe-direction:[transform:translateY(150%)]
        data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]
        data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]
        data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]
        data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]
        data-limited:opacity-0
        data-swiping:transition-none
        transition-[transform,opacity,height] duration-200 ease-out
        motion-reduce:transition-none
        after:absolute after:start-0 after:top-full after:h-[calc(var(--gap)+1px)] after:w-full
        `,
    ],
});

// content — the card's row: the icon, the text and the actions, the close
// at the end. It clips to the card, and fades out while the toast is behind
// the frontmost one and the stack is collapsed.
const content = tv({
    base: `
        flex h-full items-start gap-3 overflow-hidden p-4 pe-10
        transition-opacity duration-200
        data-behind:opacity-0 group-data-expanded/toast:data-behind:opacity-100
    `,
});

// icon — the status mark, coloured by the palette class it carries.
const icon = tv({
    base: `
        flex shrink-0 items-center text-palette-accent
        [&_svg:not([class*='size-'])]:size-icon
        h-5
    `,
});

const body = tv({
    base: "flex min-w-0 flex-1 flex-col gap-1",
});

const title = tv({
    base: "text-sm font-medium text-palette-contrast",
});

const description = tv({
    base: [foundation.secondary(), "text-sm"],
});

// actions — the toast's buttons, under its text.
const actions = tv({
    base: "mt-2 flex flex-wrap items-center gap-2",
});

// close — the icon button in the card's corner (Popover's), on the inline
// end.
const close = tv({
    base: "absolute top-2 end-2",
});

export const toast = {
    viewport,
    root,
    content,
    icon,
    body,
    title,
    description,
    actions,
    close,
};

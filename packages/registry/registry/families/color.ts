// Family `color` — the colour controls: the 2D area and its thumb, the hue
// wheel, a channel slider's gradient track and thumb, a swatch over its
// transparency checkerboard, and a swatch picker's option.
//
// A new idea, so a family of its own (docs/architecture.md §2): a control
// whose ground is the colour being picked. That ground is never a palette
// role. Each primitive sets it as a CSS variable on its own part
// (spec/color.md, "Gradients"): `--color-area-background` and its blend
// mode, `--color-wheel-track-background`, `--color-slider-track-background`,
// `--color-swatch-color`, and each thumb's `--color-*-thumb-color`. The
// family only reads them, so the drawn colour at a point is the value there.
//
// Everything else is the visual language's (docs/visual-language.md):
//   thumbs        the foundation's `knob` (the palette's `base` over a light
//                 shadow) with the colour inside it and a hairline `ring-1`
//                 in `contrast` around it: the light knob reads over black and
//                 saturated colours, the hairline over white (and the other
//                 way round in a dark theme). `scenarios/color/thumb-contrast`
//                 shows them over white, black and saturated grounds.
//   focus         the slider's and the wheel's thumb IS the focusable (a
//                 `slider` element): `focus`. The area's thumb holds two
//                 hidden range inputs it does not render: `focusNested`.
//   edge          a colour ground carries a hairline inside its edge, so a
//                 white area or swatch does not melt into a white floor.
//   checkerboard  what shows through a transparent colour: `line` and `base`
//                 squares, the palette in scope (decoration, not the colour).
//   swatch item   a swatch picker's option: the `checked` frame (`ring`) when
//                 it is the value, the `hover` fill otherwise, the standalone
//                 `focus` ring outside it.
//   disabled      the foundation's `disabled` on every root.
//
// The primitives position the thumbs and size the wheel inline (structural
// style); no member sets their geometry. Zero variants.

import { tv } from "tailwind-variants";
import { foundation } from "./foundation";

// The checkerboard behind a transparent colour: a 12px tile of four squares,
// as a variable the grounds layer under their colour.
const CHECKERBOARD = `
    [--checkerboard:repeating-conic-gradient(var(--palette-line)_0_25%,var(--palette-base)_0_50%)]
`;

// The hairline inside a colour ground's edge.
const EDGE = "ring-1 ring-inset ring-palette-contrast/10";

// A thumb: the knob, the colour inside it (`--thumb-color`, which each
// member points at its primitive's variable), the hairline around it.
const thumb = tv({
    base: [
        foundation.knob(),
        `
        absolute block size-5 rounded-full ring-1 ring-palette-contrast/50
        after:absolute after:inset-[3px] after:rounded-full
        after:bg-(--thumb-color)
        transition-transform duration-150 data-dragging:scale-110
        `,
    ],
});

// area — the 2D area: the primitive's two background layers and their blend
// mode. It is the interactive surface (the primitive sets `position` and
// `touch-action`); its size is the consumer's to change.
const area = tv({
    base: [
        foundation.disabled(),
        `
        h-48 w-full min-w-0 shrink-0 rounded-lg ${EDGE}
        [background-image:var(--color-area-background)]
        [background-blend-mode:var(--color-area-background-blend-mode)]
        `,
    ],
});

// areaThumb — the area's thumb: the focus is one of the two hidden inputs
// inside it, so the ring is `focusNested`.
const areaThumb = tv({
    base: [
        thumb(),
        foundation.focusNested(),
        "[--thumb-color:var(--color-area-thumb-color)]",
    ],
});

// wheel — the wheel's box (the primitive sizes it from its radii).
const wheel = tv({
    base: [foundation.disabled(), "shrink-0"],
});

// wheelTrack — the ring: the conic gradient of every hue, masked inside the
// inner radius (radial stops measured from the centre, in the primitive's
// px). Physical, as the primitive's: a wheel has no reading direction.
const wheelTrack = tv({
    base: `
        rounded-full
        [background:var(--color-wheel-track-background)]
        [mask:radial-gradient(circle_closest-side,transparent_calc(var(--color-wheel-inner-radius)-0.5px),#000_var(--color-wheel-inner-radius))]
    `,
});

// wheelThumb — the wheel's thumb, itself the `slider`: `focus`.
const wheelThumb = tv({
    base: [
        thumb(),
        foundation.focus(),
        "[--thumb-color:var(--color-wheel-thumb-color)]",
    ],
});

// slider — a channel slider's root: the label and the value on one line,
// the track under them across both columns. Vertical, a column.
const slider = tv({
    base: [
        foundation.disabled(),
        `
        grid w-full grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2
        data-[orientation=vertical]:flex data-[orientation=vertical]:h-full
        data-[orientation=vertical]:w-fit data-[orientation=vertical]:flex-col
        `,
    ],
});

// sliderTrack — the channel's gradient, over the checkerboard (seen only
// where the gradient is transparent: the alpha channel). It is the
// interactive area; the primitive sets `position` and `touch-action`.
const sliderTrack = tv({
    base: [
        CHECKERBOARD,
        `
        col-span-2 h-4 w-full rounded-full ${EDGE}
        [background-image:var(--color-slider-track-background),var(--checkerboard)]
        [background-size:100%_100%,12px_12px]
        data-[orientation=vertical]:h-auto data-[orientation=vertical]:min-h-40
        data-[orientation=vertical]:w-4 data-[orientation=vertical]:grow
        `,
    ],
});

// sliderThumb — the slider's thumb, itself the `slider`: `focus`.
const sliderThumb = tv({
    base: [
        thumb(),
        foundation.focus(),
        "[--thumb-color:var(--color-slider-thumb-color)]",
    ],
});

// swatch — a colour over the checkerboard, with the edge's hairline.
const swatch = tv({
    base: [
        CHECKERBOARD,
        `
        size-8 shrink-0 rounded-md ${EDGE}
        [background-image:linear-gradient(var(--color-swatch-color),var(--color-swatch-color)),var(--checkerboard)]
        [background-size:100%_100%,12px_12px]
        `,
    ],
});

// swatchPicker — the swatches' list, wrapping into rows (the primitive's
// vertical arrows read the rows from the layout). A disabled list marks
// every option disabled, and the options dim themselves: the list does not
// dim again.
const swatchPicker = tv({
    base: "flex flex-wrap gap-1 data-disabled:cursor-not-allowed",
});

// swatchItem — one option: a frame around its swatch, `checked` (the `ring`
// frame) when it is the value, the `hover` fill otherwise, the standalone
// ring outside it. The radius is the swatch's plus the frame.
const swatchItem = tv({
    base: [
        foundation.hover(),
        foundation.checked(),
        foundation.focus(),
        foundation.disabled(),
        `
        flex cursor-pointer rounded-[calc(var(--radius-md)+2px)] p-0.5
        transition-colors duration-150
        `,
    ],
});

// pickerValue — a picker's value row: its swatch beside its hex field. The
// swatch and the field row have no disabled state of their own, so the row
// dims with a disabled picker (`group/color-picker`, the picker's root).
const pickerValue = tv({
    base: `
        flex items-center gap-2
        group-data-disabled/color-picker:opacity-50
    `,
});

// pickerSwatch — the swatch in that row, as tall as the field beside it
// (`h-control` is 9 steps of the spacing).
const pickerSwatch = tv({
    base: [swatch(), "size-9"],
});

export const color = {
    area,
    areaThumb,
    wheel,
    wheelTrack,
    wheelThumb,
    slider,
    sliderTrack,
    sliderThumb,
    swatch,
    swatchPicker,
    swatchItem,
    pickerValue,
    pickerSwatch,
};

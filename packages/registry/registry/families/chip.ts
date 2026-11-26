// Family `chip` — a value shown as a small tag: a Combobox's chosen items, a
// Tags Input's tags, a Tag Group's tags (Epic #172).
//
// Origin: the Combobox's Chip wrote its look in place (a soft badge: `soft`
// fill, `contrast` text, `rounded-md`, `text-xs`). A Tags Input's tags must
// look the same, and a Tag Group's too, so the look moved here once instead
// of being copied (the Epic's risk). The type is the badge's (`text-xs
// font-medium`, docs/visual-language.md "Type").
//
//   group   the row of chips: wrapping, a small gap
//   item    one chip: the soft badge with the standalone focus ring (a
//           chip takes DOM focus on every base: Combobox's chips, a Tags
//           Input's tags); its content sits in a row with its remove button
//   tag     a chip of a Tag Group, which a user can select: the chosen one
//           is `checked` (the wrapper maps the primitive's `data-selected`
//           onto `data-checked`, as the swatch picker does), a disabled one
//           is `disabled`
//   remove  what a chip's remove button adds to the small ghost square
//           Clickable (`clickable({ variant: "ghost", shape: "square",
//           size: "xs" })`): it sits at the chip's inline end and takes the
//           chip's text colour, so it reads on a `soft` chip and on a
//           checked (`ring`) tag alike; its hover is that colour at 15%,
//           visible on both (the ghost's `soft` hover vanished on a chip)
//   input   the in-place edit of a Tags Input's tag: the bare text of the
//           chip, sized to its content; the tag shows the nested focus ring
//           around it while editing (`focusNested` on `item`)
//
// Zero variants (tests/chip.test.ts).

import { tv } from "tailwind-variants";
import { foundation } from "./foundation";

const group = tv({
    base: "flex flex-wrap items-center gap-1",
});

const item = tv({
    base: [
        foundation.focus(),
        foundation.focusNested(),
        `
        inline-flex max-w-full items-center gap-1 rounded-md bg-palette-soft
        px-2 py-0.5 text-xs font-medium text-palette-contrast
        transition-colors duration-150
        data-editing:bg-transparent
        [&_svg:not([class*='size-'])]:size-icon-xs
        `,
    ],
});

const tag = tv({
    extend: item,
    base: [foundation.checked(), foundation.disabled(), "cursor-default"],
});

const remove = tv({
    base: "-me-1 shrink-0 rounded-sm text-inherit hover:bg-current/15",
});

const input = tv({
    base: `
        min-w-8 bg-transparent text-xs font-medium text-palette-contrast
        outline-none field-sizing-content
        selection:bg-palette-base selection:text-palette-contrast
    `,
});

export const chip = { group, item, tag, remove, input };

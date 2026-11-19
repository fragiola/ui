// Family `foundation` — the visual language every other family speaks
// (docs/visual-language.md).
//
// Why it exists: each family used to restate the same ideas in its own words.
// The field drew its focus ring at offset 0, checkbox/radio/switch at
// offset 1 with a 1px outline, the slider's thumb at 2px; a checked box was
// filled with `ring`, a progress fill with `base`; the field row was a filled
// `soft` box, the outline button a transparent one. Each choice was defensible
// alone, and together they read as several design systems. This family gives
// each idea ONE home, and the families compose it instead of restating it.
// `tests/foundation.test.ts` fails when a family writes a foundation class
// itself.
//
// Zero variants, like every family. Each member is one idea; the families
// compose them by calling the member inside their own `tv()` base:
//
//     const row = tv({ base: [foundation.box(), foundation.fieldFocus(), "…"] });
//
// The state variants a member uses (`focus-visible:`, `field-focus:`,
// `data-checked:`) are the element's own; a member never reaches into a child.

import { tv } from "tailwind-variants";

// focus — a standalone focusable (button, trigger, checkbox, tab, link): a
// 2px `ring` outline drawn 2px OUTSIDE the element. Outside, because `ring`
// contrasts with what is behind the element (architecture.md §1), and so it
// never covers the element's own border.
const focus = tv({
    base: `
        outline-none focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-palette-ring
    `,
});

// focusInset — an item inside a container that clips or packs its children
// (menu item, list row, grid cell, a tab inside its list): the same ring,
// drawn INSIDE the item, so a neighbour or the container's overflow never
// hides it.
const focusInset = tv({
    base: `
        outline-none focus-visible:outline-2 focus-visible:-outline-offset-2
        focus-visible:outline-palette-ring
    `,
});

// fieldFocus — a box whose control is inside it (the field row, a select
// trigger) or is itself (checkbox, radio, switch): the ring of `focus`,
// fired by the `.field-control` marker (global.css, `field-focus`), so a
// button inside the box (an addon, an inset) does not light the whole field.
const fieldFocus = tv({
    base: `
        field-focus:outline-2 field-focus:outline-offset-2
        field-focus:outline-palette-ring
    `,
});

// focusNested — a box whose focusable is a nested native input it does not
// render itself (the slider thumb's hidden range input).
const focusNested = tv({
    base: `
        outline-none has-[input:focus-visible]:outline-2
        has-[input:focus-visible]:outline-offset-2
        has-[input:focus-visible]:outline-palette-ring
    `,
});

// box — the control surface: a `line` stroke on a transparent background,
// with the value in `accent`. Every control box is this: the field row, the
// select and combobox triggers, an outline button, an unchecked checkbox.
//
// Transparent, not `soft`: a field sits on whatever floor it is on (a page,
// a raised card) and reads as part of it, and `soft` stays free to mean a
// STATE (hover, highlighted, selected). Transparent is also what lets the
// invalid state arrive by palette inheritance: under `palette-danger` the
// box becomes a red stroke with red text, never a red fill.
const box = tv({
    base: `
        border border-palette-line bg-transparent text-palette-accent
        transition-colors duration-150
    `,
});

// hover — a transparent interactive thing under the pointer: `soft`.
const hover = tv({
    base: "hover:bg-palette-soft",
});

// highlighted — the item the pointer or the keyboard is on inside a list
// (menu, select, combobox, command). Same `soft` as hover, with the text at
// full `contrast` so it reads as the active one.
const highlighted = tv({
    base: "highlighted:bg-palette-soft highlighted:text-palette-contrast",
});

// checked — the "on" mark of a two-state control and the filled part of a
// track: `ring`, the interaction role. On a neutral palette it is the dark
// neutral; on a `surface-*` palette it is that palette's colour; on a
// chromatic palette it is its deeper tone. The content on it (a check, a
// dot) is `base`. Checkbox, radio, switch, slider and progress all use it,
// so "on" means one colour across them.
const checked = tv({
    base: `
        data-checked:border-palette-ring data-checked:bg-palette-ring
        data-checked:text-palette-base
    `,
});

// rail — the "off" ground of a track or a switch: `line`, the stroke role,
// so an empty track is visible on any floor (a `soft` track vanished on a
// white surface).
const rail = tv({
    base: "bg-palette-line",
});

// knob — what slides along a rail (a switch's thumb, a slider's thumb): the
// palette's `base` over a light shadow, so it reads as lifted above the rail.
const knob = tv({
    base: "bg-palette-base shadow-sm",
});

// disabled — dimmed and inert. Both the attribute Base UI emits and the
// native pseudo-class, so a `render`ed element and a native one agree.
const disabled = tv({
    base: `
        disabled:cursor-not-allowed disabled:opacity-50
        data-disabled:cursor-not-allowed data-disabled:opacity-50
    `,
});

// secondary — text that supports other text: descriptions, captions,
// placeholders. `accent` at 85%, the measured value that clears AA on every
// neutral surface (AGENTS.md, "Secondary text").
const secondary = tv({
    base: "text-palette-accent/85",
});

export const foundation = {
    focus,
    focusInset,
    fieldFocus,
    focusNested,
    box,
    hover,
    highlighted,
    checked,
    rail,
    knob,
    disabled,
    secondary,
};

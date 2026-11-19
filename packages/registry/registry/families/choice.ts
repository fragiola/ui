// Family `choice` — checkable controls (root, control, indicator, label,
// description). Shared by Checkbox, Radio and Switch.
//
// Origin: three components with the same visual skeleton — a box that fills
// with an icon when checked. shadcn duplicated the entire surface three
// times. This family writes it once.
//
// Decisions in docs/architecture.md §2 (orthogonal families), style families
// (tv, zero variants), and palette (palette kills colour duplication).
//
// The components compose these members; they no longer restate them. Until
// the visual-language pass (docs/visual-language.md) each of the three wrote
// its own classes and the family was installed but unused: three focus rings
// (none matching the field's), a `soft` box that vanished on white, and a
// switch whose off track could not be seen.
//
// Drift resolved — recorded in the port report:
//  - peer-peer-[data-state=checked]:border-input (radio) → eliminated;
//    palette handles it via data-checked:bg-palette-base
//  - focus-visible:ring-* on all three → field-focus:outline-2
//    field-focus:outline-palette-ring (the project's focus convention)
//  - text-primary-foreground (indicator icon) → text-palette-contrast
//  - data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground
//    → data-checked:bg-palette-base data-checked:text-palette-contrast
//  - data-[state=unchecked]:bg-transparent → eliminated (default is no bg)
//  - dark theme blocks → eliminated (palette handles both themes)
//
// ─── STATE NORMALIZATION ───────────────────────────────────────────────────
// Base UI emits data-checked and data-unchecked (not data-state=checked).
// The highlighted custom variant covers focus. The themes register
// data-checked as a state selector.
//
// ─── ZERO VARIANTS ─────────────────────────────────────────────────────────
// No size variant. Checkbox and radio are one `mark` (size-4); the radio's
// circle is `rounded-full` on top, an intrinsic shape. The switch is not a
// bigger mark: it is a `track` with a `thumb`, two named members.

import { tv } from "tailwind-variants";
import { foundation } from "./foundation";

// mark — the checkbox's and the radio's box. Unchecked it is a control box
// (`box`); checked it fills with `ring` (`checked`), the colour every "on"
// state uses. The ring, the disabled state and the icon size are shared.
const mark = tv({
    base: [
        foundation.box(),
        foundation.checked(),
        foundation.fieldFocus(),
        foundation.disabled(),
        `
        peer field-control grid size-4 shrink-0 place-content-center rounded-sm
        [&_svg:not([class*='size-'])]:size-icon-xs
    `,
    ],
});

// indicator — what appears in a checked mark: a check or a dot. It takes the
// mark's text colour (`base` on the `ring` fill).
const indicator = tv({
    base: "grid place-content-center text-current",
});

// track — the switch's body: the `rail` when off, `ring` when on. The same
// two colours as a slider's rail and fill.
const track = tv({
    base: [
        foundation.rail(),
        foundation.checked(),
        foundation.fieldFocus(),
        foundation.disabled(),
        `
        field-control inline-flex h-5 w-9 shrink-0 items-center rounded-pill
        p-0.5
    `,
    ],
});

// thumb — the knob that slides along the track. It follows the track's
// shape (`rounded-pill`), so a flat track slides a square thumb.
const thumb = tv({
    base: [
        foundation.knob(),
        `
        pointer-events-none block size-4 rounded-pill transition-transform
        duration-150 data-checked:translate-x-4 rtl:data-checked:-translate-x-4
    `,
    ],
});

// label — the control's name (Text.Label via render). Same treatment as
// field.label.
const label = tv({
    base: "font-medium text-palette-accent leading-none data-disabled:opacity-50",
});

// description — points at Text.Paragraph via render.
const description = tv({
    base: [foundation.secondary(), "data-disabled:opacity-50"],
});

export const choice = {
    mark,
    indicator,
    track,
    thumb,
    label,
    description,
};

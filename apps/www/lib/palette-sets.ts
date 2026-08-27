// Named palette sets for the preview harness. Each set is a named constant
// defined in one place — adding a palette later updates every demo that asks
// for a set by name. This is the same reasoning as style families having
// named members instead of variants.
//
// The sets are asserted against the palette directory by
// palette-contract.test.ts (five-list agreement extended to six), so a new
// palette file that is not added to the right set fails the test.

// Chromatic palettes: the colour IS the element. Used for buttons, badges,
// alerts — anything where the palette is the point.
export const CHROMATIC = [
    "blue",
    "purple",
    "green",
    "orange",
    "rose",
    "danger",
] as const;

// Surface palettes: near-neutral backgrounds, with or without a hue tint.
// Used for panels, cards, fields — anything that is a surface first.
export const SURFACES = [
    "surface",
    "raised",
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

// All palettes, in a stable order: surfaces first (the floor), then
// chromatic (the colour).
export const ALL = [...SURFACES, ...CHROMATIC] as const;

export type PaletteSet = readonly string[];

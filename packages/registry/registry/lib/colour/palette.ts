// generatePalette — a complete Fragiola palette from one hue.
//
// A palette is six roles in two themes (architecture.md §1). This builds the
// two palettes a colour needs, the way the shipped ones come in pairs:
//
//   palette-<name>          the solid one: a button, a badge, a progress bar
//   palette-surface-<name>  its surface twin: a neutral floor whose `ring` (the
//                           focus ring, every "on" state) carries the colour
//
// The curves are the shipped palettes' (`palette-blue` is the template: base
// at L 0.55, soft 0.94, line 0.85, accent 0.45 in light; 0.7 / 0.3 / 0.4 /
// 0.78 in dark), so a generated blue is the shipped blue. Chroma is NOT
// clamped to sRGB: the shipped palettes are not either (`oklch(0.55 0.2 250)`
// is outside it), and the browser maps them; clamping would make every
// generated colour duller than its shipped twin. Two corrections make any
// hue work:
//   - the warm hues (45–115: amber, yellow, orange) are only themselves light:
//     at the template's L 0.55 a yellow is olive. They take a lighter base
//     and dark text, the way `palette-orange` is built;
//   - contrast: the text on `base` must clear AA (4.5:1), `accent` must
//     clear it over `soft`, and the surface twin's secondary text (accent at
//     85%) over its base and soft — the rules the registry's contrast guard
//     enforces on every palette. A lightness that misses is stepped until it
//     clears.
//
// The output is CSS in the palette files' exact shape (`serializePalette`):
// paste it next to the other palettes, add the two names to `cn.ts`'s palette
// group, and apply the class. Nothing in a component changes.

import { AA, contrastAtAlpha, contrastOf, type Oklch } from "./contrast";

export const ROLES = [
    "base",
    "soft",
    "line",
    "contrast",
    "accent",
    "ring",
] as const;
export type Role = (typeof ROLES)[number];
export type Theme = "light" | "dark";

/** A role's value: an OKLCH colour, or `accent` (a ring that follows it). */
export type RoleValue = Oklch | "accent";
export type Roles = Record<Role, RoleValue>;
export type Themed = Record<Theme, Roles>;

export type Chroma = "muted" | "default" | "vivid";
export type Tint = "none" | "subtle" | "tinted";

export type PaletteOptions = {
    /** The class suffix: `brand` → `palette-brand` and `palette-surface-brand`. */
    name?: string;
    /** The colour's hue, 0–360. */
    hue: number;
    /** How saturated the colour is. `default` is the shipped palettes'. */
    chroma?: Chroma;
    /** The neutrals' hue (the floor, text, strokes). The shipped one is 250. */
    neutralHue?: number;
    /** How much of `neutralHue` the neutrals carry. `subtle` is the shipped. */
    tint?: Tint;
};

export type ContrastCheck = {
    palette: string;
    theme: Theme;
    pair: string;
    ratio: number;
    pass: boolean;
};

export type GeneratedPalette = {
    name: string;
    hue: number;
    solid: Themed;
    surface: Themed;
    checks: ContrastCheck[];
    pass: boolean;
};

const CHROMA: Record<Chroma, number> = { muted: 0.6, default: 1, vivid: 1.2 };
const TINT: Record<Tint, number> = { none: 0, subtle: 1, tinted: 3 };

// The template: `palette-blue`'s lightness and chroma for each role.
const SOLID: Record<
    Theme,
    Record<Exclude<Role, "contrast" | "ring">, [number, number]>
> = {
    light: {
        base: [0.55, 0.2],
        soft: [0.94, 0.06],
        line: [0.85, 0.08],
        accent: [0.45, 0.18],
    },
    dark: {
        base: [0.7, 0.18],
        soft: [0.3, 0.08],
        line: [0.4, 0.1],
        accent: [0.78, 0.15],
    },
};

// The template's neutrals: `palette-surface`'s lightness and chroma.
const NEUTRAL: Record<
    Theme,
    Record<Exclude<Role, "ring">, [number, number]>
> = {
    light: {
        base: [1, 0],
        soft: [0.96, 0.003],
        line: [0.86, 0.004],
        contrast: [0.15, 0.01],
        accent: [0.3, 0.01],
    },
    dark: {
        base: [0.15, 0.01],
        soft: [0.26, 0.012],
        line: [0.31, 0.012],
        contrast: [0.95, 0.005],
        accent: [0.88, 0.005],
    },
};

const round = (n: number) => Math.round(n * 1000) / 1000;

function fit(l: number, c: number, h: number): Oklch {
    return { l: round(l), c: round(c), h: round(h) };
}

// The hues that read as themselves only when light (amber, yellow, orange).
const isWarm = (h: number) => h >= 45 && h <= 115;

function normalizeHue(hue: number): number {
    return ((hue % 360) + 360) % 360;
}

// Steps `l` by `step` until `ok` holds or `stop` is passed; the last tried.
function search(
    from: number,
    step: number,
    stop: number,
    ok: (l: number) => boolean,
): number {
    let l = from;
    while (!ok(l) && (step < 0 ? l + step >= stop : l + step <= stop))
        l += step;
    return l;
}

function solidLight(h: number, k: number): Roles {
    const t = SOLID.light;
    const at = (l: number) => fit(l, t.base[1] * k, h);
    const white: Oklch = { l: 1, c: 0, h: 0 };
    // White text, darkening the base down to L 0.4 if it must…
    let contrast: Oklch = white;
    let baseL = search(
        t.base[0],
        -0.01,
        0.4,
        (l) => contrastOf(white, at(l)) >= AA,
    );
    // …or, for a warm hue, dark text on a lighter base (`palette-orange`).
    if (isWarm(h)) {
        contrast = fit(0.2, 0.05, h);
        baseL = search(
            0.72,
            0.01,
            0.9,
            (l) => contrastOf(contrast, at(l)) >= AA,
        );
    }
    const soft = fit(t.soft[0], t.soft[1] * k, h);
    const accentL = search(
        t.accent[0],
        -0.01,
        0.25,
        (l) => contrastOf(fit(l, t.accent[1] * k, h), soft) >= AA,
    );
    return {
        base: at(baseL),
        soft,
        line: fit(t.line[0], t.line[1] * k, h),
        contrast,
        accent: fit(accentL, t.accent[1] * k, h),
        ring: "accent",
    };
}

function solidDark(h: number, k: number): Roles {
    const t = SOLID.dark;
    const at = (l: number) => fit(l, t.base[1] * k, h);
    const contrast = fit(0.12, 0.02, h);
    const baseL = search(
        t.base[0],
        0.01,
        0.92,
        (l) => contrastOf(contrast, at(l)) >= AA,
    );
    const soft = fit(t.soft[0], t.soft[1] * k, h);
    const accentL = search(
        t.accent[0],
        0.01,
        0.95,
        (l) => contrastOf(fit(l, t.accent[1] * k, h), soft) >= AA,
    );
    return {
        base: at(baseL),
        soft,
        line: fit(t.line[0], t.line[1] * k, h),
        contrast,
        accent: fit(accentL, t.accent[1] * k, h),
        ring: "accent",
    };
}

function surface(
    theme: Theme,
    neutralHue: number,
    tint: number,
    ring: RoleValue,
): Roles {
    const n = NEUTRAL[theme];
    const at = ([l, c]: [number, number]) => fit(l, c * tint, neutralHue);
    return {
        base: at(n.base),
        soft: at(n.soft),
        line: at(n.line),
        contrast: at(n.contrast),
        accent: at(n.accent),
        ring,
    };
}

function resolve(roles: Roles, role: Role): Oklch {
    const value = roles[role];
    return value === "accent" ? (roles.accent as Oklch) : value;
}

function check(
    name: string,
    palette: Themed,
    surfaceTier: boolean,
): ContrastCheck[] {
    const checks: ContrastCheck[] = [];
    for (const theme of ["light", "dark"] as const) {
        const roles = palette[theme];
        const add = (pair: string, ratio: number) =>
            checks.push({
                palette: name,
                theme,
                pair,
                ratio: round(ratio),
                pass: ratio >= AA,
            });
        add(
            "contrast on base",
            contrastOf(resolve(roles, "contrast"), resolve(roles, "base")),
        );
        if (surfaceTier) {
            add(
                "secondary text on base",
                contrastAtAlpha(
                    resolve(roles, "accent"),
                    0.85,
                    resolve(roles, "base"),
                ),
            );
            add(
                "secondary text on soft",
                contrastAtAlpha(
                    resolve(roles, "accent"),
                    0.85,
                    resolve(roles, "soft"),
                ),
            );
        } else {
            add(
                "accent on soft",
                contrastOf(resolve(roles, "accent"), resolve(roles, "soft")),
            );
        }
    }
    return checks;
}

/** Both palettes of a colour, contrast-checked. */
export function generatePalette(options: PaletteOptions): GeneratedPalette {
    const name = options.name ?? "brand";
    const hue = normalizeHue(options.hue);
    const k = CHROMA[options.chroma ?? "default"];
    const neutralHue = normalizeHue(options.neutralHue ?? 250);
    const tint = TINT[options.tint ?? "subtle"];

    const solid: Themed = {
        light: solidLight(hue, k),
        dark: solidDark(hue, k),
    };
    const surfaceTwin: Themed = {
        light: surface("light", neutralHue, tint, resolve(solid.light, "base")),
        dark: surface("dark", neutralHue, tint, resolve(solid.dark, "base")),
    };
    const checks = [
        ...check(`palette-${name}`, solid, false),
        ...check(`palette-surface-${name}`, surfaceTwin, true),
    ];
    return {
        name,
        hue,
        solid,
        surface: surfaceTwin,
        checks,
        pass: checks.every((c) => c.pass),
    };
}

/** A role's CSS value: `oklch(L C H)`, or the ring's `var(--palette-accent)`. */
export function cssValue(value: RoleValue): string {
    if (value === "accent") return "var(--palette-accent)";
    return `oklch(${value.l} ${value.c} ${value.h})`;
}

function block(theme: Theme, className: string, roles: Roles): string {
    const lines = ROLES.map(
        (role) => `    --palette-${role}: ${cssValue(roles[role])};`,
    );
    return `:root[data-theme="${theme}"] .${className} {\n${lines.join("\n")}\n}`;
}

/** The two palettes as CSS, in the shape of `styles/palettes/*.css`. */
export function serializePalette(palette: GeneratedPalette): string {
    const solid = `palette-${palette.name}`;
    const twin = `palette-surface-${palette.name}`;
    return [
        `/* ${palette.name} — generated from hue ${palette.hue}. Two palettes, both\n   themes, all six roles: .${solid} for solid things (a button, a\n   badge), .${twin} for controls on the floor (its ring carries the\n   colour). Add both names to the palette group in lib/cn.ts. */`,
        block("light", solid, palette.solid.light),
        block("dark", solid, palette.solid.dark),
        block("light", twin, palette.surface.light),
        block("dark", twin, palette.surface.dark),
    ].join("\n\n");
}

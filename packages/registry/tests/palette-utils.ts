import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
    contrastAtAlpha,
    contrastOf,
    contrastRatio,
    oklchToRgb,
    type Rgb,
    relativeLuminance,
} from "../registry/lib/colour/contrast";

// ─── Palette directory source of truth ──────────────────────────────────────
// The palette list is derived from the contents of registry/styles/palettes/.
// Every other list (cn.ts class group, the compile-test fixture,
// registry.json items) is asserted against this directory by
// palette-contract.test.ts; the apps' stylesheets by their own tests. A new palette file is covered automatically; a
// missing entry in any of the five hardcoded lists fails the agreement test.

// Anchored to this package, not to the working directory: the apps that
// consume the registry import these helpers from their own tests.
const ROOT = path.resolve(import.meta.dirname, "..");
export const PALETTES_DIR = path.join(ROOT, "registry", "styles", "palettes");

export async function readPaletteNames(): Promise<string[]> {
    const files = await readdir(PALETTES_DIR);
    return files
        .filter((f) => f.endsWith(".css"))
        .map((f) => f.slice(0, -4))
        .sort();
}

export async function readPaletteFile(name: string): Promise<string> {
    return readFile(path.join(PALETTES_DIR, `${name}.css`), "utf-8");
}

// The six roles (architecture.md §1). The number of roles is fixed; the number
// of palettes is not.
export const SIX_ROLES = [
    "base",
    "soft",
    "line",
    "contrast",
    "accent",
    "ring",
] as const;
export type Role = (typeof SIX_ROLES)[number];

export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

// Surface-tier palettes: neutral surfaces + surface-ring palettes. These are
// the palettes where `accent` at 85% opacity must clear AA over `base` and
// `soft`, because secondary text (text-palette-accent/85) realistically
// appears only on neutral backgrounds. Chromatic palettes use `contrast` for
// their text, not a muted variant — they are deliberately excluded from the
// accent/85 assertion.
export const SURFACE_TIER = [
    "surface",
    "raised",
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
];

// ─── OKLCH → WCAG contrast maths ─────────────────────────────────────────────
// The maths lives in the registry's own `lib/colour/contrast.ts`, which the
// palette generator ships with: the guard measures the shipped palettes with
// the same functions a generated palette is checked with, so they cannot
// disagree.

export { contrastRatio, oklchToRgb, type Rgb, relativeLuminance };

// Parse an oklch(L C H) or oklch(L C H / A) string into {l, c, h, a}.
export type OklchValue = { l: number; c: number; h: number; a: number };

export function parseOklch(raw: string): OklchValue | null {
    const match = raw.match(
        /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+)\s*)?\)/,
    );
    if (!match) return null;
    return {
        l: Number(match[1]),
        c: Number(match[2]),
        h: Number(match[3]),
        a: match[4] !== undefined ? Number(match[4]) : 1,
    };
}

// Contrast of accent at 85% opacity over a background, per WCAG.
export function accent85ContrastOver(
    accent: OklchValue,
    bgOklch: OklchValue,
): number {
    return contrastAtAlpha(accent, 0.85, bgOklch);
}

// Contrast of contrast-colour over base, per WCAG.
export function contrastOverBase(
    contrast: OklchValue,
    base: OklchValue,
): number {
    return contrastOf(contrast, base);
}

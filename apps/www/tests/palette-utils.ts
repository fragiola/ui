import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

// ─── Palette directory source of truth ──────────────────────────────────────
// The palette list is derived from the contents of registry/styles/palettes/.
// Every other list (globals.css imports, cn.ts class group, the compile-test
// fixture, registry.json items) is asserted against this directory by
// palette-contract.test.ts. A new palette file is covered automatically; a
// missing entry in any of the five hardcoded lists fails the agreement test.

const ROOT = process.cwd();
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
// No colour library: this is ~40 lines of maths. OKLCH → linear sRGB → WCAG
// relative luminance → contrast ratio. The 85% compositing is alpha-over
// compositing of the accent colour over the background.

// OKLab → linear sRGB matrix (from the CSS Color 4 spec).
function oklabToLinearSrgb(
    l: number,
    a: number,
    b: number,
): [number, number, number] {
    const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = l - 0.0894841775 * a - 1.291485548 * b;

    const r = l_ ** 3;
    const g = m_ ** 3;
    const bl = s_ ** 3;

    return [
        +4.0767416621 * r - 3.3077115913 * g + 0.2309699292 * bl,
        -1.2684380041 * r + 2.6097574051 * g - 0.3413193965 * bl,
        -0.0041960863 * r - 0.7034186147 * g + 1.707614701 * bl,
    ];
}

// OKLCH → OKLab
function oklchToOklab(
    l: number,
    c: number,
    h: number,
): [number, number, number] {
    const hRad = (h * Math.PI) / 180;
    return [l, c * Math.cos(hRad), c * Math.sin(hRad)];
}

export type Rgb = { r: number; g: number; b: number };

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

export function oklchToRgb(l: number, c: number, h: number): Rgb {
    const [labL, labA, labB] = oklchToOklab(l, c, h);
    const [r, g, b] = oklabToLinearSrgb(labL, labA, labB);
    return { r, g, b };
}

// WCAG relative luminance from linear sRGB.
// The oklabToLinearSrgb matrix returns LINEAR sRGB values (already gamma-
// decoded). WCAG's standard formula expects gamma-encoded sRGB and applies
// the transfer function internally. Since we already have linear values, we
// use them directly — the transfer function is skipped, not double-applied.
export function relativeLuminance(rgb: Rgb): number {
    const channel = (v: number) => Math.max(0, Math.min(1, v));
    const r = channel(rgb.r);
    const g = channel(rgb.g);
    const b = channel(rgb.b);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Contrast ratio per WCAG. Range [1, 21].
export function contrastRatio(l1: number, l2: number): number {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

// Alpha-over compositing: composite a foreground (with alpha) over a background.
// Both are linear sRGB.
function composite(fg: Rgb, alpha: number, bg: Rgb): Rgb {
    return {
        r: fg.r * alpha + bg.r * (1 - alpha),
        g: fg.g * alpha + bg.g * (1 - alpha),
        b: fg.b * alpha + bg.b * (1 - alpha),
    };
}

// Contrast of accent at 85% opacity over a background, per WCAG.
export function accent85ContrastOver(
    accent: OklchValue,
    bgOklch: OklchValue,
): number {
    const accentRgb = oklchToRgb(accent.l, accent.c, accent.h);
    const bgRgb = oklchToRgb(bgOklch.l, bgOklch.c, bgOklch.h);
    const composited = composite(accentRgb, 0.85, bgRgb);
    return contrastRatio(
        relativeLuminance(composited),
        relativeLuminance(bgRgb),
    );
}

// Contrast of contrast-colour over base, per WCAG.
export function contrastOverBase(
    contrast: OklchValue,
    base: OklchValue,
): number {
    const contrastRgb = oklchToRgb(contrast.l, contrast.c, contrast.h);
    const baseRgb = oklchToRgb(base.l, base.c, base.h);
    return contrastRatio(
        relativeLuminance(contrastRgb),
        relativeLuminance(baseRgb),
    );
}

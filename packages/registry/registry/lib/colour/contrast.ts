// OKLCH → WCAG contrast, with no colour library: OKLCH → OKLab → linear
// sRGB → relative luminance → contrast ratio. ~60 lines of maths.
//
// This is the maths the registry's contrast guard measures every shipped
// palette with (tests/palette-contract.test.ts), so a palette generated with
// `generatePalette` passes the same test the shipped ones do.
//
// One convention to know: the guard composites and measures in LINEAR sRGB
// (the matrix below returns linear values, and the luminance uses them
// directly). Keep it: changing it here would change what every shipped
// palette measures.

export type Oklch = { l: number; c: number; h: number };
export type Rgb = { r: number; g: number; b: number };

// OKLCH → linear sRGB (CSS Color 4 matrices).
export function oklchToRgb(l: number, c: number, h: number): Rgb {
    const rad = (h * Math.PI) / 180;
    const a = c * Math.cos(rad);
    const b = c * Math.sin(rad);
    const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
    return {
        r: +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
        g: -1.2684380041 * l_ + 2.6097574051 * m_ - 0.3413193965 * s_,
        b: -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
    };
}

// Whether an OKLCH colour is inside the sRGB gamut (with a hair of slack for
// rounding).
export function inGamut({ l, c, h }: Oklch): boolean {
    const { r, g, b } = oklchToRgb(l, c, h);
    const ok = (v: number) => v >= -0.0005 && v <= 1.0005;
    return ok(r) && ok(g) && ok(b);
}

// The largest chroma at this lightness and hue that sRGB can show.
export function maxChroma(l: number, h: number): number {
    let low = 0;
    let high = 0.4;
    for (let i = 0; i < 24; i++) {
        const mid = (low + high) / 2;
        if (inGamut({ l, c: mid, h })) low = mid;
        else high = mid;
    }
    return low;
}

// WCAG relative luminance of a linear sRGB colour.
export function relativeLuminance({ r, g, b }: Rgb): number {
    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    return 0.2126 * clamp(r) + 0.7152 * clamp(g) + 0.0722 * clamp(b);
}

// WCAG contrast ratio, from 1 to 21.
export function contrastRatio(l1: number, l2: number): number {
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// Contrast of one OKLCH colour over another.
export function contrastOf(fg: Oklch, bg: Oklch): number {
    return contrastRatio(
        relativeLuminance(oklchToRgb(fg.l, fg.c, fg.h)),
        relativeLuminance(oklchToRgb(bg.l, bg.c, bg.h)),
    );
}

// Contrast of a colour at `alpha` opacity over a background: secondary text
// is `accent` at 85% (AGENTS.md, "Secondary text").
export function contrastAtAlpha(fg: Oklch, alpha: number, bg: Oklch): number {
    const f = oklchToRgb(fg.l, fg.c, fg.h);
    const b = oklchToRgb(bg.l, bg.c, bg.h);
    const mixed = {
        r: f.r * alpha + b.r * (1 - alpha),
        g: f.g * alpha + b.g * (1 - alpha),
        b: f.b * alpha + b.b * (1 - alpha),
    };
    return contrastRatio(relativeLuminance(mixed), relativeLuminance(b));
}

// The AA threshold for normal text.
export const AA = 4.5;

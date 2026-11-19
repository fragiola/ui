import { describe, expect, it } from "vitest";
import type { Oklch } from "../registry/lib/colour/contrast";
import {
    type Chroma,
    generatePalette,
    ROLES,
    serializePalette,
    type Tint,
} from "../registry/lib/colour/palette";
import {
    accent85ContrastOver,
    contrastOverBase,
    parseOklch,
    readPaletteFile,
} from "./palette-utils";

// ─── Palette generator ──────────────────────────────────────────────────────
// `generatePalette` must hand out palettes the registry's own guard would
// accept: all six roles in both themes, AA where the contract asks for it,
// colours sRGB can show — for ANY hue, not only the shipped ones. And the
// shipped hues must come back close to the shipped files, since the curves
// are theirs.

const CHROMAS: Chroma[] = ["muted", "default", "vivid"];
const TINTS: Tint[] = ["none", "subtle", "tinted"];
const HUES = Array.from({ length: 72 }, (_, i) => i * 5);

function colours(palette: ReturnType<typeof generatePalette>): Oklch[] {
    return [palette.solid, palette.surface].flatMap((themed) =>
        (["light", "dark"] as const).flatMap((theme) =>
            ROLES.map((role) => themed[theme][role]).filter(
                (v): v is Oklch => v !== "accent",
            ),
        ),
    );
}

describe("generatePalette", () => {
    it("passes every contrast rule for every hue, chroma and tint", () => {
        const failures: string[] = [];
        for (const hue of HUES) {
            for (const chroma of CHROMAS) {
                for (const tint of TINTS) {
                    const palette = generatePalette({ hue, chroma, tint });
                    for (const c of palette.checks) {
                        if (!c.pass) {
                            failures.push(
                                `hue ${hue} ${chroma} ${tint}: ${c.palette} ${c.theme} ${c.pair} ${c.ratio}`,
                            );
                        }
                    }
                }
            }
        }
        expect(failures).toEqual([]);
    });

    it("never goes past the template's chroma", () => {
        // Not clamped to sRGB (the shipped palettes are not either, and the
        // browser maps them), but never more saturated than the template at
        // `vivid`, and the neutrals stay neutral without a tint.
        for (const hue of HUES) {
            for (const colour of colours(
                generatePalette({ hue, chroma: "vivid" }),
            )) {
                expect(colour.c, JSON.stringify(colour)).toBeLessThanOrEqual(
                    0.24,
                );
            }
            const plain = generatePalette({ hue, tint: "none" });
            expect((plain.surface.light.soft as Oklch).c).toBe(0);
        }
    });

    it("declares all six roles in both themes, the ring following accent", () => {
        const palette = generatePalette({ hue: 200 });
        for (const themed of [palette.solid, palette.surface]) {
            for (const theme of ["light", "dark"] as const) {
                expect(Object.keys(themed[theme]).sort()).toEqual(
                    [...ROLES].sort(),
                );
            }
        }
        expect(palette.solid.light.ring).toBe("accent");
        // The surface twin's ring IS the colour: the solid palette's base.
        expect(palette.surface.light.ring).toEqual(palette.solid.light.base);
        expect(palette.surface.dark.ring).toEqual(palette.solid.dark.base);
    });

    it("gives back the shipped palettes for their hues", async () => {
        // The template is palette-blue; purple and danger share its curve.
        for (const [file, hue] of [
            ["blue", 250],
            ["purple", 300],
            ["danger", 25],
        ] as const) {
            const css = await readPaletteFile(file);
            const shipped = [
                ...css.matchAll(/--palette-base:\s*([^;]+);/g),
            ].map((m) => parseOklch(m[1] as string));
            const generated = generatePalette({ hue });
            for (const [i, theme] of (["light", "dark"] as const).entries()) {
                const want = shipped[i];
                const got = generated.solid[theme].base as Oklch;
                expect(want, file).not.toBeNull();
                expect(
                    Math.abs(got.l - (want?.l ?? 0)),
                    `${file} ${theme} L`,
                ).toBeLessThanOrEqual(0.03);
                expect(
                    Math.abs(got.c - (want?.c ?? 0)),
                    `${file} ${theme} C`,
                ).toBeLessThanOrEqual(0.04);
            }
        }
    });

    it("takes dark text on a hue white text cannot sit on", () => {
        const yellow = generatePalette({ hue: 95 });
        const contrast = yellow.solid.light.contrast as Oklch;
        expect(contrast.l).toBeLessThan(0.5);
    });
});

describe("serializePalette", () => {
    it("writes the palette files' shape, and the guard's maths agrees", () => {
        const palette = generatePalette({ name: "brand", hue: 160 });
        const css = serializePalette(palette);
        for (const [theme, cls, surfaceTier] of [
            ["light", "palette-brand", false],
            ["dark", "palette-brand", false],
            ["light", "palette-surface-brand", true],
            ["dark", "palette-surface-brand", true],
        ] as const) {
            const match = new RegExp(
                `:root\\[data-theme="${theme}"\\] \\.${cls} \\{([^}]+)\\}`,
            ).exec(css);
            expect(match, `${theme} ${cls}`).not.toBeNull();
            const body = match?.[1] ?? "";
            const value = (role: string) =>
                new RegExp(`--palette-${role}: ([^;]+);`).exec(body)?.[1] ?? "";
            for (const role of ROLES) expect(value(role), role).not.toBe("");
            const base = parseOklch(value("base"));
            const contrast = parseOklch(value("contrast"));
            if (!base || !contrast) throw new Error("unparsable");
            expect(contrastOverBase(contrast, base)).toBeGreaterThanOrEqual(
                4.5,
            );
            if (surfaceTier) {
                const accent = parseOklch(value("accent"));
                const soft = parseOklch(value("soft"));
                if (!accent || !soft) throw new Error("unparsable");
                expect(
                    accent85ContrastOver(accent, base),
                ).toBeGreaterThanOrEqual(4.5);
                expect(
                    accent85ContrastOver(accent, soft),
                ).toBeGreaterThanOrEqual(4.5);
            }
        }
        expect(css).toContain("--palette-ring: var(--palette-accent);");
    });
});

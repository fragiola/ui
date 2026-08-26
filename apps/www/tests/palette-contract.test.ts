import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

// ─── Palette contract guard ─────────────────────────────────────────────────
// Rules 1 & 2: The palette contract is 6 roles (base, soft, line, contrast,
// accent, ring). Every palette declares all 6, no exceptions. This test parses
// each palette CSS file and asserts the contract holds.

const ROOT = process.cwd();
const PALETTES_DIR = path.join(ROOT, "registry", "styles", "palettes");

const SIX_ROLES = [
    "base",
    "soft",
    "line",
    "contrast",
    "accent",
    "ring",
] as const;
type Role = (typeof SIX_ROLES)[number];

const CORE_PALETTES = [
    "surface",
    "raised",
    "brand",
    "success",
    "warning",
    "danger",
];

const THEMES = ["light", "dark"] as const;
type Theme = (typeof THEMES)[number];

async function readPaletteFile(name: string): Promise<string> {
    return readFile(path.join(PALETTES_DIR, `${name}.css`), "utf-8");
}

// Match blocks like:
//   :root[data-theme="light"] .palette-surface { ... }
//   :root[data-theme="light"] :is(.palette-danger, [data-invalid]) { ... }
function extractPaletteRoles(
    css: string,
    palette: string,
    theme: Theme,
): Set<string> {
    const roles = new Set<string>();
    // The selector may be .palette-X or :is(.palette-X, [data-invalid])
    const blockRe = new RegExp(
        `:root\\[data-theme="${theme}"\\]\\s*(?:\\.palette-${palette}|:is\\([^)]*\\.palette-${palette}[^)]*\\))\\s*\\{([^}]+)\\}`,
        "g",
    );
    const matches = [...css.matchAll(blockRe)];
    for (const match of matches) {
        const body = match[1] ?? "";
        for (const role of SIX_ROLES) {
            if (body.includes(`--palette-${role}`)) {
                roles.add(role);
            }
        }
    }
    return roles;
}

function countThemeBlocks(css: string, palette: string, theme: Theme): number {
    const blockRe = new RegExp(
        `:root\\[data-theme="${theme}"\\]\\s*(?:\\.palette-${palette}|:is\\([^)]*\\.palette-${palette}[^)]*\\))\\s*\\{`,
        "g",
    );
    return [...css.matchAll(blockRe)].length;
}

describe("palette contract guard", () => {
    it("all six core palette files exist", async () => {
        const files = await readdir(PALETTES_DIR);
        for (const p of CORE_PALETTES) {
            expect(files, `Missing palette file: ${p}.css`).toContain(
                `${p}.css`,
            );
        }
    });

    for (const palette of CORE_PALETTES) {
        describe(`palette-${palette}`, () => {
            for (const theme of THEMES) {
                it(`declares all 6 roles in ${theme} theme`, async () => {
                    const css = await readPaletteFile(palette);
                    const roles = extractPaletteRoles(css, palette, theme);
                    const missing = SIX_ROLES.filter((r) => !roles.has(r));
                    expect(
                        missing,
                        `palette-${palette} ${theme} is missing roles: ${missing.join(", ")}`,
                    ).toEqual([]);
                });

                it(`has exactly one ${theme} theme block`, async () => {
                    const css = await readPaletteFile(palette);
                    const count = countThemeBlocks(css, palette, theme);
                    expect(
                        count,
                        `Expected exactly 1 ${theme} block, found ${count}`,
                    ).toBe(1);
                });
            }

            it("does not declare a seventh role", async () => {
                const css = await readPaletteFile(palette);
                const allVars = [...css.matchAll(/--palette-([a-z-]+)/g)];
                const extra = new Set<string>();
                for (const match of allVars) {
                    const name = match[1] ?? "";
                    if (
                        !SIX_ROLES.includes(name as Role) &&
                        name !== "base-hover" &&
                        name !== "state-shift"
                    ) {
                        extra.add(name);
                    }
                }
                expect(
                    extra,
                    `Unknown palette custom properties: ${[...extra].join(", ")}`,
                ).toEqual(new Set());
            });
        });
    }

    it("no palette uses !important", async () => {
        for (const p of CORE_PALETTES) {
            const css = await readPaletteFile(p);
            expect(
                css.includes("!important"),
                `palette-${p}.css contains !important — rule 7 violation`,
            ).toBe(false);
        }
    });

    it("global.css does not use !important", async () => {
        const css = await readFile(
            path.join(ROOT, "registry", "styles", "global.css"),
            "utf-8",
        );
        expect(
            css.includes("!important"),
            "global.css contains !important — rule 7 violation",
        ).toBe(false);
    });

    it("global.css declares the highlighted custom variant", async () => {
        const css = await readFile(
            path.join(ROOT, "registry", "styles", "global.css"),
            "utf-8",
        );
        expect(css).toContain("@custom-variant highlighted");
    });

    it("global.css declares the field-focus custom variant", async () => {
        const css = await readFile(
            path.join(ROOT, "registry", "styles", "global.css"),
            "utf-8",
        );
        expect(css).toContain("@custom-variant field-focus");
    });

    it("global.css declares @theme inline with palette roles", async () => {
        const css = await readFile(
            path.join(ROOT, "registry", "styles", "global.css"),
            "utf-8",
        );
        expect(css).toContain("@theme inline");
        for (const role of SIX_ROLES) {
            expect(css).toContain(`--color-palette-${role}`);
        }
    });

    it("global.css declares --palette-state-shift for both themes", async () => {
        const css = await readFile(
            path.join(ROOT, "registry", "styles", "global.css"),
            "utf-8",
        );
        expect(css).toContain("--palette-state-shift");
        // Light should darken (negative), dark should lighten (positive)
        expect(css).toMatch(
            /data-theme="light"[^}]*--palette-state-shift:\s*-0\.1/,
        );
        expect(css).toMatch(
            /data-theme="dark"[^}]*--palette-state-shift:\s*\+?0\.1/,
        );
    });

    it("global.css declares chart token axes", async () => {
        const css = await readFile(
            path.join(ROOT, "registry", "styles", "global.css"),
            "utf-8",
        );
        expect(css).toContain("--chart-1");
        expect(css).toContain("--chart-5");
        expect(css).toContain("--chart-ramp-1");
        expect(css).toContain("--chart-ramp-5");
    });

    it("global.css declares --height-control", async () => {
        const css = await readFile(
            path.join(ROOT, "registry", "styles", "global.css"),
            "utf-8",
        );
        expect(css).toContain("--height-control");
    });

    it("global.css declares density custom properties", async () => {
        const css = await readFile(
            path.join(ROOT, "registry", "styles", "global.css"),
            "utf-8",
        );
        expect(css).toContain('data-density="compact"');
        expect(css).toContain('data-density="spacious"');
    });
});

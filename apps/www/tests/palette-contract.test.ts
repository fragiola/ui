import { readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
    accent85ContrastOver,
    contrastOverBase,
    type OklchValue,
    PALETTES_DIR,
    parseOklch,
    type Role,
    readPaletteFile,
    SIX_ROLES,
    SURFACE_TIER,
    THEMES,
    type Theme,
} from "./palette-utils";

// ─── Palette contract guard ─────────────────────────────────────────────────
// Rules 1 & 2: The palette contract is 6 roles (base, soft, line, contrast,
// accent, ring). Every palette declares all 6, no exceptions. This test parses
// each palette CSS file and asserts the contract holds.
//
// The palette list is derived from the contents of registry/styles/palettes/ —
// a new palette file is covered automatically. The agreement test below
// asserts that globals.css, cn.ts, the compile fixture and registry.json all
// agree with this directory, so no list can drift.

const ROOT = process.cwd();

// Read the palette directory synchronously at module load time so the
// `for` loops below can register a test per palette. vitest's `describe`/`it`
// run at load time, before any `beforeAll` — a directory read in `beforeAll`
// would leave the loops empty.
const paletteNames: string[] = readdirSync(PALETTES_DIR)
    .filter((f) => f.endsWith(".css"))
    .map((f) => f.slice(0, -4))
    .sort();

// Match blocks like:
//   :root[data-theme="light"] .palette-surface { ... }
//   :root[data-theme="light"] :is(.palette-danger, [data-invalid]) { ... }
//
// The selector is anchored so a palette name cannot match a longer name:
// `surface` must not match `.palette-surface-purple`. The `(?:-|$)` boundary
// after the palette name ensures `.palette-surface` matches only when the
// class name ends there or is followed by a non-identifier character.
function extractPaletteRoles(
    css: string,
    palette: string,
    theme: Theme,
): Set<string> {
    const roles = new Set<string>();
    // Escape the palette name for regex (handles the hyphen in surface-*).
    const escaped = palette.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const blockRe = new RegExp(
        `:root\\[data-theme="${theme}"\\]\\s*(?:\\.palette-${escaped}(?![\\w-])|:is\\([^)]*\\.palette-${escaped}(?![\\w-])[^)]*\\))\\s*\\{([^}]+)\\}`,
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
    const escaped = palette.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const blockRe = new RegExp(
        `:root\\[data-theme="${theme}"\\]\\s*(?:\\.palette-${escaped}(?![\\w-])|:is\\([^)]*\\.palette-${escaped}(?![\\w-])[^)]*\\))\\s*\\{`,
        "g",
    );
    return [...css.matchAll(blockRe)].length;
}

// Extract the oklch value of a role from a palette file for a given theme.
function extractRoleValue(
    css: string,
    palette: string,
    theme: Theme,
    role: Role,
): OklchValue | null {
    const escaped = palette.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const blockRe = new RegExp(
        `:root\\[data-theme="${theme}"\\]\\s*(?:\\.palette-${escaped}(?![\\w-])|:is\\([^)]*\\.palette-${escaped}(?![\\w-])[^)]*\\))\\s*\\{([^}]+)\\}`,
        "g",
    );
    const matches = [...css.matchAll(blockRe)];
    for (const match of matches) {
        const body = match[1] ?? "";
        // Resolve --palette-ring: var(--palette-accent) indirection.
        const ringRe = new RegExp(
            `--palette-${role}:\\s*var\\(--palette-(\\w+)\\)`,
        );
        const ringMatch = body.match(ringRe);
        if (ringMatch) {
            const sourceRole = ringMatch[1] ?? "";
            return extractRoleValue(css, palette, theme, sourceRole as Role);
        }
        const valueRe = new RegExp(`--palette-${role}:\\s*(oklch\\([^)]+\\))`);
        const valueMatch = body.match(valueRe);
        if (valueMatch) {
            return parseOklch(valueMatch[1] ?? "");
        }
    }
    return null;
}

describe("palette contract guard", () => {
    it("derives the palette list from the directory", async () => {
        expect(paletteNames.length).toBeGreaterThanOrEqual(11);
        // The three removed palettes are gone.
        expect(paletteNames).not.toContain("brand");
        expect(paletteNames).not.toContain("success");
        expect(paletteNames).not.toContain("warning");
        // The new palettes are present.
        expect(paletteNames).toContain("blue");
        expect(paletteNames).toContain("green");
        expect(paletteNames).toContain("orange");
        expect(paletteNames).toContain("purple");
        expect(paletteNames).toContain("rose");
        expect(paletteNames).toContain("surface-blue");
        expect(paletteNames).toContain("surface-purple");
        expect(paletteNames).toContain("surface-green");
        expect(paletteNames).toContain("surface-orange");
        expect(paletteNames).toContain("surface-rose");
    });

    for (const palette of paletteNames) {
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
        for (const p of paletteNames) {
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

// ─── Five-list agreement ────────────────────────────────────────────────────
// The palette name list is hardcoded in five places. Missing one produces no
// error. This test asserts that globals.css, cn.ts, the compile fixture and
// registry.json all agree with the palettes directory — no list may drift.

describe("five-list agreement", () => {
    it("globals.css imports every palette file", async () => {
        const css = await readFile(
            path.join(ROOT, "app", "globals.css"),
            "utf-8",
        );
        for (const p of paletteNames) {
            expect(css, `globals.css does not import ${p}.css`).toContain(
                `palettes/${p}.css`,
            );
        }
    });

    it("cn.ts lists every palette in the tailwind-merge group", async () => {
        const cn = await readFile(
            path.join(ROOT, "registry", "lib", "cn.ts"),
            "utf-8",
        );
        for (const p of paletteNames) {
            expect(
                cn,
                `cn.ts does not list palette "${p}" in the class group`,
            ).toContain(`"${p}"`);
        }
    });

    it("compile fixture declares every palette class", async () => {
        const fixture = await readFile(
            path.join(ROOT, "tests", "fixtures", "palette-classes.tsx"),
            "utf-8",
        );
        for (const p of paletteNames) {
            expect(fixture, `fixture does not declare palette-${p}`).toContain(
                `palette-${p}`,
            );
        }
    });

    it("registry.json has a palette-* item for every palette file", async () => {
        const json = await readFile(path.join(ROOT, "registry.json"), "utf-8");
        const parsed = JSON.parse(json);
        const itemNames = new Set(
            (parsed.items as { name: string }[]).map((i) => i.name),
        );
        for (const p of paletteNames) {
            expect(
                itemNames,
                `registry.json does not have item palette-${p}`,
            ).toContain(`palette-${p}`);
        }
    });

    it("registry.json has no palette item for a removed palette", async () => {
        const json = await readFile(path.join(ROOT, "registry.json"), "utf-8");
        const parsed = JSON.parse(json);
        const itemNames = (parsed.items as { name: string }[]).map(
            (i) => i.name,
        );
        expect(itemNames).not.toContain("palette-brand");
        expect(itemNames).not.toContain("palette-success");
        expect(itemNames).not.toContain("palette-warning");
    });
});

// ─── Surface-ring tier guard ────────────────────────────────────────────────
// The surface-* palettes (surface-blue, surface-purple, surface-green,
// surface-orange, surface-rose) are neutral surfaces whose ONLY difference
// from `surface` is --palette-ring, which is a literal chromatic value (not
// var(--palette-accent)) taken from the corresponding chromatic palette's
// base. This guard makes drift impossible: the neutrals must be byte-identical
// to surface, and the ring must be literal and must differ from surface's
// (resolved) ring.
//
// See Epic #39 / Issue #40. This is a values change, not a contract change:
// every surface-* palette still declares all six roles (asserted above).

const SURFACE_RING_TIER = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
];

// Extract the RAW (unresolved) declaration string for a role — e.g.
// "var(--palette-accent)" or "oklch(0.55 0.2 250)". Unlike extractRoleValue,
// this does NOT resolve var() indirection, so it can distinguish a literal
// chromatic value from a var() reference.
function extractRawRoleDeclaration(
    css: string,
    palette: string,
    theme: Theme,
    role: Role,
): string | null {
    const escaped = palette.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const blockRe = new RegExp(
        `:root\\[data-theme="${theme}"\\]\\s*(?:\\.palette-${escaped}(?![\\w-])|:is\\([^)]*\\.palette-${escaped}(?![\\w-])[^)]*\\))\\s*\\{([^}]+)\\}`,
        "g",
    );
    const matches = [...css.matchAll(blockRe)];
    for (const match of matches) {
        const body = match[1] ?? "";
        const valueRe = new RegExp(`--palette-${role}:\\s*([^;]+);`);
        const valueMatch = body.match(valueRe);
        if (valueMatch) {
            return (valueMatch[1] ?? "").trim();
        }
    }
    return null;
}

describe("surface-ring tier guard", () => {
    for (const palette of SURFACE_RING_TIER) {
        describe(`palette-${palette}`, () => {
            for (const theme of THEMES) {
                // Neutrals identical to surface: base, soft, line, contrast, accent.
                for (const role of [
                    "base",
                    "soft",
                    "line",
                    "contrast",
                    "accent",
                ] as const) {
                    it(`${theme}: ${role} is byte-identical to surface`, async () => {
                        const surfaceCss = await readPaletteFile("surface");
                        const css = await readPaletteFile(palette);
                        const surfaceVal = extractRawRoleDeclaration(
                            surfaceCss,
                            "surface",
                            theme,
                            role,
                        );
                        const val = extractRawRoleDeclaration(
                            css,
                            palette,
                            theme,
                            role,
                        );
                        expect(val).not.toBeNull();
                        expect(surfaceVal).not.toBeNull();
                        expect(
                            val,
                            `palette-${palette} ${theme} ${role} = "${val}" but surface ${role} = "${surfaceVal}"`,
                        ).toBe(surfaceVal);
                    });
                }

                it(`${theme}: ring is a literal oklch (not var)`, async () => {
                    const css = await readPaletteFile(palette);
                    const raw = extractRawRoleDeclaration(
                        css,
                        palette,
                        theme,
                        "ring",
                    );
                    expect(raw).not.toBeNull();
                    expect(
                        raw,
                        `palette-${palette} ${theme} ring is "${raw}", expected a literal oklch(...)`,
                    ).toMatch(/^oklch\(/);
                    expect(
                        raw,
                        `palette-${palette} ${theme} ring must not be var(--palette-accent)`,
                    ).not.toContain("var(");
                });

                it(`${theme}: ring differs from surface's (resolved) ring`, async () => {
                    const surfaceCss = await readPaletteFile("surface");
                    const css = await readPaletteFile(palette);
                    const surfaceRing = extractRoleValue(
                        surfaceCss,
                        "surface",
                        theme,
                        "ring",
                    );
                    const ring = extractRoleValue(css, palette, theme, "ring");
                    expect(ring).not.toBeNull();
                    expect(surfaceRing).not.toBeNull();
                    expect(
                        ring,
                        `palette-${palette} ${theme} ring resolved to the same value as surface's ring`,
                    ).not.toEqual(surfaceRing);
                });
            }
        });
    }
});

// ─── Contrast guard ─────────────────────────────────────────────────────────
// AGENTS.md and docs/architecture.md §6 both state that the palette-contract
// guard asserts the contrast floor. This is that guard.
//
// For EVERY palette and BOTH themes: contrast on base ≥ 4.5:1 (AA).
// For every SURFACE-tier palette and both themes: accent at 85% opacity over
// base and over soft ≥ 4.5:1 (AA).
//
// Chromatic palettes are deliberately excluded from the accent/85 assertion:
// they use `contrast` for their text, not a muted variant. Secondary text
// (text-palette-accent/85) realistically appears only on neutral backgrounds.
// Do NOT "fix" this exclusion — it is intentional.

describe("contrast guard", () => {
    for (const palette of paletteNames) {
        for (const theme of THEMES) {
            it(`palette-${palette} ${theme}: contrast on base ≥ 4.5:1`, async () => {
                const css = await readPaletteFile(palette);
                const contrast = extractRoleValue(
                    css,
                    palette,
                    theme,
                    "contrast",
                );
                const base = extractRoleValue(css, palette, theme, "base");
                expect(contrast).not.toBeNull();
                expect(base).not.toBeNull();
                const ratio = contrastOverBase(
                    contrast as OklchValue,
                    base as OklchValue,
                );
                expect(
                    ratio,
                    `palette-${palette} ${theme}: contrast/base = ${ratio.toFixed(2)}:1 (need ≥ 4.5)`,
                ).toBeGreaterThanOrEqual(4.5);
            });
        }
    }

    // Surface-tier palettes only: accent@85% over base and over soft.
    // The 85% figure is settled (text-palette-accent/85) and is NOT a variable
    // this test may adjust. If a surface-tier palette cannot clear the floor at 85%,
    // the palette's numbers move, not the opacity.
    for (const palette of SURFACE_TIER) {
        for (const theme of THEMES) {
            it(`palette-${palette} ${theme}: accent@85% over base ≥ 4.5:1`, async () => {
                const css = await readPaletteFile(palette);
                const accent = extractRoleValue(css, palette, theme, "accent");
                const base = extractRoleValue(css, palette, theme, "base");
                expect(accent).not.toBeNull();
                expect(base).not.toBeNull();
                const ratio = accent85ContrastOver(
                    accent as OklchValue,
                    base as OklchValue,
                );
                expect(
                    ratio,
                    `palette-${palette} ${theme}: accent@85%/base = ${ratio.toFixed(2)}:1 (need ≥ 4.5)`,
                ).toBeGreaterThanOrEqual(4.5);
            });

            it(`palette-${palette} ${theme}: accent@85% over soft ≥ 4.5:1`, async () => {
                const css = await readPaletteFile(palette);
                const accent = extractRoleValue(css, palette, theme, "accent");
                const soft = extractRoleValue(css, palette, theme, "soft");
                expect(accent).not.toBeNull();
                expect(soft).not.toBeNull();
                const ratio = accent85ContrastOver(
                    accent as OklchValue,
                    soft as OklchValue,
                );
                expect(
                    ratio,
                    `palette-${palette} ${theme}: accent@85%/soft = ${ratio.toFixed(2)}:1 (need ≥ 4.5)`,
                ).toBeGreaterThanOrEqual(4.5);
            });
        }
    }
});

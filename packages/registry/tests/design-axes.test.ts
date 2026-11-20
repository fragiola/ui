import { execSync } from "node:child_process";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { cn } from "../registry/lib/cn";
import { readPaletteNames } from "./palette-utils";

// ─── Design axes guard ──────────────────────────────────────────────────────
// Every axis (global.css, architecture.md §4) is a `data-*` attribute whose
// levels only set tokens. Two things can silently break it, and both are
// invisible by reading (rule 8):
//
// - a level's value drifts → pinned below, level by level;
// - a token reaches its utility INLINED (`border-radius: 8px`) instead of
//   through `var()` → overriding it in a subtree does nothing. Each utility
//   the registry uses is asserted against the compiled CSS.
//
// The default level is the absence of the attribute: its values are the
// tokens on :root, pinned too, so "no attribute" renders as before the axes.

const ROOT = path.resolve(import.meta.dirname, "..");
const REGISTRY_DIR = path.join(ROOT, "registry");
const TMP_DIR = path.join(ROOT, ".tmp-design-axes-test");
const OUTPUT_CSS = path.join(TMP_DIR, "out.css");

type Tokens = Record<string, string>;
type Axis = {
    attribute: string;
    defaults: Tokens;
    levels: Record<string, Tokens>;
};

const AXES: Record<string, Axis> = {
    spacing: {
        attribute: "data-density",
        defaults: { "--spacing": "0.25rem" },
        levels: {
            compact: { "--spacing": "0.2rem" },
            snug: { "--spacing": "0.225rem" },
            comfortable: { "--spacing": "0.275rem" },
            spacious: { "--spacing": "0.3rem" },
        },
    },
    radius: {
        attribute: "data-radius",
        defaults: radius("4px", "8px", "16px", "8px", "9999px"),
        levels: {
            flat: radius("0px", "0px", "0px", "0px", "0px"),
            subtle: radius("2px", "4px", "8px", "4px", "4px"),
            rounded: radius("6px", "12px", "20px", "12px", "9999px"),
            full: radius("8px", "16px", "24px", "9999px", "9999px"),
        },
    },
    elevation: {
        attribute: "data-elevation",
        defaults: {
            "--elevation-sm":
                "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            "--elevation-md":
                "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            "--elevation-lg":
                "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        },
        levels: {
            flat: elevation(
                "0 0 #0000",
                "0 0 #0000",
                "0 0 #0000",
                "0 0 #0000",
                "0 0 #0000",
                "0 0 #0000",
                "0 0 #0000",
            ),
            subtle: elevation(
                "0 0 #0000",
                "0 1px rgb(0 0 0 / 0.05)",
                "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
            ),
            raised: elevation(
                "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                "0 25px 50px -12px rgb(0 0 0 / 0.25)",
                "0 35px 60px -15px rgb(0 0 0 / 0.3)",
            ),
        },
    },
    motion: {
        attribute: "data-motion",
        defaults: { "--motion-scale": "1" },
        levels: {
            none: { "--motion-scale": "0" },
            fast: { "--motion-scale": "0.5" },
            expressive: { "--motion-scale": "1.5" },
        },
    },
    handle: {
        // The one axis whose default level has a name (`line`), written out
        // so a subtree can return to it; no attribute renders the same.
        attribute: "data-handle",
        defaults: {
            "--handle-rest": "0",
            "--handle-mask": "none",
            "--handle-seam": "0",
        },
        levels: {
            line: {
                "--handle-rest": "0",
                "--handle-mask": "none",
                "--handle-seam": "0",
            },
            grip: {
                "--handle-rest": "0.5",
                "--handle-mask": "none",
                "--handle-seam": "0",
            },
            dots: {
                "--handle-rest": "0.7",
                "--handle-mask":
                    "radial-gradient(circle closest-side, #000 62%, #0000 74%)",
                "--handle-seam": "0",
            },
            // The IDE look: no mark, no gap, the seam is the handle.
            ide: {
                "--handle-rest": "0",
                "--handle-mask": "none",
                "--handle-seam": "1",
            },
        },
    },
    typography: {
        attribute: "data-text",
        defaults: { "--text-scale": "1" },
        levels: {
            small: { "--text-scale": "0.875" },
            large: { "--text-scale": "1.125" },
        },
    },
};

// Tailwind's type scale, in rem, scaled by the typography axis.
const TEXT_SIZES: Record<string, string> = {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
    "8xl": "6rem",
    "9xl": "8rem",
};

// Icon sizes follow text, not spacing: size-3, -3.5, -4 and -6 at the default.
const ICON_SIZES: Record<string, string> = {
    "size-icon-xs": "0.75rem",
    "size-icon-sm": "0.875rem",
    "size-icon": "1rem",
    "size-icon-lg": "1.5rem",
};

// Utility → the declaration it must compile to.
const UTILITIES: Record<string, [property: string, value: string]> = {
    "rounded-sm": ["border-radius", "var(--radius-sm)"],
    "rounded-md": ["border-radius", "var(--radius-md)"],
    "rounded-lg": ["border-radius", "var(--radius-lg)"],
    "rounded-control": ["border-radius", "var(--radius-control)"],
    "rounded-pill": ["border-radius", "var(--radius-pill)"],
    "rounded-full": ["border-radius", "var(--radius-full)"],
    "h-control": ["height", "calc(var(--spacing) * 9)"],
    ...Object.fromEntries(
        // The sizes the registry writes (an unused one compiles to nothing).
        ["xs", "sm", "lg", "xl", "2xl"].map((size) => [
            `text-${size}`,
            ["font-size", `calc(${TEXT_SIZES[size]} * var(--text-scale, 1))`],
        ]),
    ),
    "shadow-sm": ["--tw-shadow", "var(--elevation-sm)"],
    "shadow-md": ["--tw-shadow", "var(--elevation-md)"],
    "shadow-lg": ["--tw-shadow", "var(--elevation-lg)"],
    "transition-colors": [
        "transition-duration",
        "var(--tw-duration, calc(300ms * var(--motion-scale, 1)))",
    ],
    "duration-150": [
        "transition-duration",
        "calc(150ms * var(--motion-scale, 1))",
    ],
    "duration-200": [
        "transition-duration",
        "calc(200ms * var(--motion-scale, 1))",
    ],
    "duration-300": [
        "transition-duration",
        "calc(300ms * var(--motion-scale, 1))",
    ],
    "animate-pulse": [
        "animation",
        "pulse calc(2s * var(--motion-scale, 1))\n        cubic-bezier(0.4, 0, 0.6, 1) infinite",
    ],
    // The handle's mark (families/handle.ts) reads both handle tokens.
    "opacity-\\[var\\(--handle-rest\\,0\\)\\]": [
        "opacity",
        "var(--handle-rest,0)",
    ],
    "\\[mask-image\\:var\\(--handle-mask\\,none\\)\\]": [
        "mask-image",
        "var(--handle-mask,none)",
    ],
    // `ide`'s seam reaches the mark, the tabsets' frames and radius as an
    // expression over the token, never a value.
    "opacity-\\[calc\\(1_-_var\\(--handle-seam\\,0\\)\\)\\]": [
        "opacity",
        "calc(1 - var(--handle-seam,0))",
    ],
    "border-\\[length\\:calc\\(\\(1_-_var\\(--handle-seam\\,0\\)\\)_\\*_1px\\)\\]":
        ["border-width", "calc((1 - var(--handle-seam,0)) * 1px)"],
    "rounded-\\[calc\\(var\\(--radius-md\\)_\\*_\\(1_-_var\\(--handle-seam\\,0\\)\\)\\)\\]":
        [
            "border-radius",
            "calc(var(--radius-md) * (1 - var(--handle-seam,0)))",
        ],
    ...Object.fromEntries(
        Object.entries(ICON_SIZES).map(([name, rem]) => [
            name,
            ["width", `calc(${rem} * var(--text-scale, 1))`],
        ]),
    ),
};

function elevation(
    xxs: string,
    xs: string,
    sm: string,
    md: string,
    lg: string,
    xl: string,
    xxl: string,
): Tokens {
    return {
        "--elevation-2xs": xxs,
        "--elevation-xs": xs,
        "--elevation-sm": sm,
        "--elevation-md": md,
        "--elevation-lg": lg,
        "--elevation-xl": xl,
        "--elevation-2xl": xxl,
    };
}

function radius(
    sm: string,
    md: string,
    lg: string,
    control: string,
    pill: string,
): Tokens {
    return {
        "--radius-sm": sm,
        "--radius-md": md,
        "--radius-lg": lg,
        "--radius-control": control,
        "--radius-pill": pill,
    };
}

async function sourceFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) files.push(...(await sourceFiles(full)));
        else if (/\.tsx?$/.test(entry.name)) files.push(full);
    }
    return files;
}

let css = "";

beforeAll(async () => {
    await mkdir(TMP_DIR, { recursive: true });
    const palettes = await readPaletteNames();
    const imports = [
        path.join(REGISTRY_DIR, "styles", "global.css"),
        ...palettes.map((p) =>
            path.join(REGISTRY_DIR, "styles", "palettes", `${p}.css`),
        ),
    ];
    const input = path.join(TMP_DIR, "input.css");
    await writeFile(
        input,
        `${imports.map((p) => `@import "${p}";`).join("\n")}\n@source "${REGISTRY_DIR}/**/*.{ts,tsx}";\n`,
    );
    execSync(
        `pnpm exec tailwindcss --input "${input}" --output "${OUTPUT_CSS}"`,
        {
            cwd: ROOT,
            stdio: "pipe",
        },
    );
    css = await readFile(OUTPUT_CSS, "utf-8");
});

afterAll(async () => {
    await rm(TMP_DIR, { recursive: true, force: true });
});

// The declarations of the first rule whose selector is exactly `selector`.
function declarations(selector: string): Tokens {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = css.match(
        new RegExp(`(?:^|[\\s}])${escaped}\\s*\\{([^}]*)\\}`, "m"),
    );
    if (!match) return {};
    const out: Tokens = {};
    for (const line of (match[1] ?? "").split(";")) {
        const i = line.indexOf(":");
        if (i > 0) out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
    return out;
}

describe("design axes", () => {
    it("the default level is the tokens on :root", () => {
        // Tailwind's theme layer, and the axes' own variables.
        const root = {
            ...declarations(":root, :host"),
            ...declarations(":root"),
        };
        for (const axis of Object.values(AXES)) {
            for (const [token, value] of Object.entries(axis.defaults)) {
                expect(root[token], `${token} on :root`).toBe(value);
            }
        }
    });

    for (const [name, axis] of Object.entries(AXES)) {
        it(`${name}: every level of [${axis.attribute}] is pinned`, () => {
            for (const [level, tokens] of Object.entries(axis.levels)) {
                const block = declarations(`[${axis.attribute}="${level}"]`);
                expect(block, `[${axis.attribute}="${level}"]`).toEqual(tokens);
            }
        });

        it(`${name}: there is no "default" level — the default is no attribute`, () => {
            expect(declarations(`[${axis.attribute}="default"]`)).toEqual({});
        });
    }

    it("every axis utility reads its token through var(), never inlined", () => {
        for (const [utility, [property, value]] of Object.entries(UTILITIES)) {
            expect(declarations(`.${utility}`)[property], utility).toBe(value);
        }
    });

    it("no radius utility the registry compiles has an inlined length", () => {
        const inlined = [
            ...css.matchAll(
                /\.(rounded-[\w-]+)\s*\{\s*border-radius:\s*([^;]+);/g,
            ),
        ]
            .filter(([, , value]) => !/var\(|^0$/.test((value ?? "").trim()))
            .map(([, name, value]) => `${name}: ${value}`);
        expect(inlined).toEqual([]);
    });

    it("every rounded-* step the sources write is on the radius scale", async () => {
        // `--radius-*: initial` leaves only the steps global.css defines, so
        // a `rounded-xl` compiles to nothing at all: no error, square
        // corners (rule 8). That is how the Create page's inset lost its
        // radius. Arbitrary values (`rounded-b-[…]`) are explicit and pass.
        const theme = await readFile(
            path.join(REGISTRY_DIR, "styles", "global.css"),
            "utf-8",
        );
        const steps = new Set([
            "none",
            ...[...theme.matchAll(/^\s*--radius-([a-z]+):/gm)].map(
                ([, step]) => step,
            ),
        ]);
        expect([...steps].sort()).toEqual(
            ["control", "full", "lg", "md", "none", "pill", "sm"].sort(),
        );
        const dirs = [
            REGISTRY_DIR,
            path.resolve(ROOT, "../../examples/react/src"),
            path.resolve(ROOT, "../../apps/playground/src"),
        ];
        const offenders: string[] = [];
        for (const dir of dirs) {
            for (const file of await sourceFiles(dir)) {
                const text = (await readFile(file, "utf-8"))
                    .replace(/\/\*[\s\S]*?\*\//g, "")
                    .replace(/\/\/.*$/gm, "");
                for (const [, step] of text.matchAll(
                    /(?<![\w-])rounded(?:-(?:[tblrse]|ss|se|es|ee|tl|tr|bl|br|x|y))?-([a-z0-9]+)(?![\w[-])/g,
                )) {
                    if (!steps.has(step ?? "")) {
                        offenders.push(
                            `${path.relative(ROOT, file)}: rounded-…-${step}`,
                        );
                    }
                }
            }
        }
        expect(offenders).toEqual([]);
    });

    it("no icon default in the registry is spacing-based", async () => {
        const spacingIcons: string[] = [];
        for (const file of await sourceFiles(REGISTRY_DIR)) {
            const content = await readFile(file, "utf-8");
            for (const [token] of content.matchAll(
                /\[&[^\s]*svg[^\s]*\]:size-[\d.]+(?![\w-])/g,
            )) {
                spacingIcons.push(
                    `${path.relative(REGISTRY_DIR, file)}: ${token}`,
                );
            }
        }
        expect(spacingIcons).toEqual([]);
    });

    it("no shadow or duration utility the registry compiles is inlined", () => {
        const inlined = [
            ...[
                ...css.matchAll(
                    /\.(shadow-[\w-]+)\s*\{\s*--tw-shadow:\s*([^;]+);/g,
                ),
            ]
                .filter(
                    ([, , value]) => !/^var\(--elevation-/.test(value ?? ""),
                )
                .map(([, name, value]) => `${name}: ${value}`),
            ...[
                ...css.matchAll(
                    /\.(duration-\d+)\s*\{\s*--tw-duration:\s*([^;]+);/g,
                ),
            ]
                // duration-0 is zero at every level.
                .filter(
                    ([, name, value]) =>
                        name !== "duration-0" &&
                        !/--motion-scale/.test(value ?? ""),
                )
                .map(([, name, value]) => `${name}: ${value}`),
        ];
        expect(inlined).toEqual([]);
    });

    it("every animation and arbitrary duration the registry writes follows motion", () => {
        const animations = [...css.matchAll(/^\s*animation:\s*([^;]+);/gm)].map(
            ([, value]) => value ?? "",
        );
        expect(animations.length).toBeGreaterThan(0);
        for (const value of animations) {
            // tw-animate-css's enter/exit read --tw-duration (a duration-* class).
            if (/^(enter|exit) var\(--tw-animation-duration/.test(value))
                continue;
            if (value === "none") continue;
            expect(value, value).toMatch(/--motion-scale/);
        }
        const arbitrary = [...css.matchAll(/--tw-duration:\s*(calc\([^;]+);/g)]
            .map(([, value]) => value ?? "")
            .filter((value) => !/--motion-scale/.test(value));
        expect(arbitrary).toEqual([]);
    });

    it("reduced motion forces --motion-scale: 0 over every level", () => {
        const media = css.match(
            /@media \(prefers-reduced-motion: reduce\)\s*\{\s*:root,\s*\[data-motion\]\s*\{\s*--motion-scale:\s*0;/,
        );
        expect(media).not.toBeNull();
        // Later than the levels, at the same specificity.
        expect(
            css.indexOf("prefers-reduced-motion: reduce) {\n  :root"),
        ).toBeGreaterThan(css.indexOf('[data-motion="expressive"]'));
    });

    it("cn() resolves the icon sizes against size-*", () => {
        expect(cn("size-icon", "size-6")).toBe("size-6");
        expect(cn("size-4", "size-icon-sm")).toBe("size-icon-sm");
    });

    it("cn() resolves the radius members against the scale", () => {
        expect(cn("rounded-sm", "rounded-pill")).toBe("rounded-pill");
        expect(cn("rounded-control", "rounded-none")).toBe("rounded-none");
        expect(cn("rounded-md", "rounded-control")).toBe("rounded-control");
    });
});

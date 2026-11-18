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
    ...Object.fromEntries(
        Object.entries(ICON_SIZES).map(([name, rem]) => [
            name,
            ["width", `calc(${rem} * var(--text-scale, 1))`],
        ]),
    ),
};

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

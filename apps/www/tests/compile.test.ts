import { execSync } from "node:child_process";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { readPaletteNames } from "./palette-utils";

// ─── Class compilation guard ────────────────────────────────────────────────
// Rule 8: "Verify by compiling, not by reading." A class that does not exist
// fails silently. This test compiles the registry CSS with Tailwind and asserts
// that every palette utility class used in the registry source files actually
// generates a CSS rule.

const ROOT = process.cwd();
const REGISTRY_DIR = path.join(ROOT, "registry");
const EXAMPLES_DIR = path.join(ROOT, "examples");
// App code is bound by the palette contract too (architecture.md §1: the site
// is an instance of the contract), and it is not published — so nothing else
// checks it. The landing page is the most palette-class-dense non-registry
// code in the repository; unguarded, an invented decorative class would fail
// silently (Rule 8).
const APP_DIR = path.join(ROOT, "app");
const COMPONENTS_DIR = path.join(ROOT, "components");
const TMP_DIR = path.join(ROOT, ".tmp-tailwind-test");
const OUTPUT_CSS = path.join(TMP_DIR, "out.css");

let compiledCss = "";
let paletteNames: string[] = [];

async function collectSourceFiles(dir: string): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true });
    const files: string[] = [];
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await collectSourceFiles(full)));
        } else if (/\.(ts|tsx|css)$/.test(entry.name)) {
            files.push(full);
        }
    }
    return files;
}

async function extractClasses(files: string[]): Promise<Set<string>> {
    const classes = new Set<string>();
    for (const file of files) {
        const content = await readFile(file, "utf-8");
        // Extract className="..." and className={cn("...", ...)} strings
        const classNameMatches = content.matchAll(
            /className\s*[:=]?\s*["'`{]([^"'`}]*)["'`}/]/g,
        );
        for (const match of classNameMatches) {
            const str = match[1] ?? "";
            for (const token of str.split(/\s+/)) {
                if (token.includes("palette-") || token.includes("h-control")) {
                    classes.add(token);
                }
            }
        }
        // Also pick up palette classes from CSS @apply
        const applyMatches = content.matchAll(/@apply\s+([^;]+);/g);
        for (const match of applyMatches) {
            const str = match[1] ?? "";
            for (const token of str.split(/\s+/)) {
                if (token.includes("palette-")) {
                    classes.add(token);
                }
            }
        }
    }
    return classes;
}

beforeAll(async () => {
    await mkdir(TMP_DIR, { recursive: true });

    // Derive the palette import list from the directory — no second hardcoded
    // copy. The agreement test in palette-contract.test.ts asserts this stays
    // in sync with globals.css and the other lists.
    paletteNames = await readPaletteNames();
    const importPaths = [
        path.join(REGISTRY_DIR, "styles", "global.css"),
        ...paletteNames.map((p) =>
            path.join(REGISTRY_DIR, "styles", "palettes", `${p}.css`),
        ),
    ];

    const inputCss =
        importPaths.map((p) => `@import "${p}";`).join("\n") +
        `\n@source "${REGISTRY_DIR}/**/*.{ts,tsx}";` +
        `\n@source "${EXAMPLES_DIR}/**/*.{ts,tsx}";` +
        `\n@source "${APP_DIR}/**/*.{ts,tsx}";` +
        `\n@source "${COMPONENTS_DIR}/**/*.{ts,tsx}";` +
        `\n@source "${path.join(ROOT, "tests", "fixtures")}/**/*.{ts,tsx}";\n`;

    const inputPath = path.join(TMP_DIR, "input.css");
    await writeFile(inputPath, inputCss);

    execSync(
        `npx @tailwindcss/cli --input "${inputPath}" --output "${OUTPUT_CSS}"`,
        { cwd: ROOT, stdio: "pipe" },
    );

    compiledCss = await readFile(OUTPUT_CSS, "utf-8");
});

afterAll(async () => {
    await rm(TMP_DIR, { recursive: true, force: true });
});

describe("class compilation guard", () => {
    it("compiles registry CSS with Tailwind without errors", () => {
        expect(compiledCss).toBeTruthy();
        expect(compiledCss.length).toBeGreaterThan(100);
    });

    it("generates palette utility classes for all six roles", () => {
        const roles = ["base", "soft", "line", "contrast", "accent", "ring"];
        for (const role of roles) {
            expect(compiledCss).toContain(`.bg-palette-${role}`);
            expect(compiledCss).toContain(`.text-palette-${role}`);
            expect(compiledCss).toContain(`.border-palette-${role}`);
        }
    });

    it("generates palette class declarations for every palette in the directory", () => {
        for (const p of paletteNames) {
            expect(compiledCss).toContain(`.palette-${p}`);
        }
    });

    it("generates the highlighted custom variant", () => {
        expect(compiledCss).toContain("highlighted");
    });

    it("generates the field-focus custom variant", () => {
        expect(compiledCss).toContain("field-focus");
    });

    it("generates h-control utility", () => {
        expect(compiledCss).toContain("h-control");
    });

    it("generates text-palette-accent/85 (secondary text)", () => {
        expect(compiledCss).toContain("text-palette-accent\\/85");
    });

    it("generates chart token custom properties", () => {
        expect(compiledCss).toContain("--chart-1");
        expect(compiledCss).toContain("--chart-ramp-1");
    });

    it("generates palette-base-hover derivation", () => {
        expect(compiledCss).toContain("palette-base-hover");
    });

    it("every palette class used in source files compiles to a CSS rule", async () => {
        const sourceFiles = await collectSourceFiles(REGISTRY_DIR);
        // Also collect from the examples directory — it moved out of
        // registry/ in Issue #34 and is the most class-dense tree.
        const exampleFiles = await collectSourceFiles(EXAMPLES_DIR);
        // …and from the app itself: routes and app-level components (the
        // landing page, the docs chrome) paint through the same roles.
        const appFiles = await collectSourceFiles(APP_DIR);
        const componentFiles = await collectSourceFiles(COMPONENTS_DIR);
        const usedClasses = await extractClasses([
            ...sourceFiles,
            ...exampleFiles,
            ...appFiles,
            ...componentFiles,
        ]);

        // Build a regex that skips plain palette class names (palette-X) for
        // every palette in the directory — those are plain CSS classes, not
        // Tailwind utilities.
        const paletteNamePattern = paletteNames
            .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .join("|");
        const plainPaletteRe = new RegExp(`^palette-(${paletteNamePattern})$`);

        const missing: string[] = [];
        for (const cls of usedClasses) {
            // Skip non-palette classes or template fragments
            if (!cls.includes("palette-") && !cls.includes("h-control"))
                continue;
            // Skip classes with template literals or dynamic parts
            if (cls.includes("${") || cls.includes("{")) continue;
            // Skip classes that are just the palette name (e.g. "palette-surface")
            // — those are plain CSS classes, not Tailwind utilities
            if (plainPaletteRe.test(cls)) continue;

            // For utility classes, check that the escaped version exists in CSS.
            // Tailwind escapes special characters in selectors: `/` → `\/`,
            // `:` → `\:`, etc.
            const escaped = cls.replace(/[/:]/g, "\\$&");
            if (!compiledCss.includes(escaped)) {
                missing.push(cls);
            }
        }

        expect(
            missing,
            `Classes used in source but not compiled: ${missing.join(", ")}`,
        ).toEqual([]);
    });
});

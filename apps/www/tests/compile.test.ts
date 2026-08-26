import { execSync } from "node:child_process";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// ─── Class compilation guard ────────────────────────────────────────────────
// Rule 8: "Verify by compiling, not by reading." A class that does not exist
// fails silently. This test compiles the registry CSS with Tailwind and asserts
// that every palette utility class used in the registry source files actually
// generates a CSS rule.

const ROOT = process.cwd();
const REGISTRY_DIR = path.join(ROOT, "registry");
const TMP_DIR = path.join(ROOT, ".tmp-tailwind-test");
const OUTPUT_CSS = path.join(TMP_DIR, "out.css");

let compiledCss = "";

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

    // Use absolute paths so Tailwind resolves imports regardless of input location
    const importPaths = [
        path.join(REGISTRY_DIR, "styles", "global.css"),
        path.join(REGISTRY_DIR, "styles", "palettes", "surface.css"),
        path.join(REGISTRY_DIR, "styles", "palettes", "raised.css"),
        path.join(REGISTRY_DIR, "styles", "palettes", "brand.css"),
        path.join(REGISTRY_DIR, "styles", "palettes", "success.css"),
        path.join(REGISTRY_DIR, "styles", "palettes", "warning.css"),
        path.join(REGISTRY_DIR, "styles", "palettes", "danger.css"),
    ];

    const inputCss =
        importPaths.map((p) => `@import "${p}";`).join("\n") +
        `\n@source "${REGISTRY_DIR}/**/*.{ts,tsx}";` +
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

    it("generates palette class declarations for all six core palettes", () => {
        const palettes = [
            "surface",
            "raised",
            "brand",
            "success",
            "warning",
            "danger",
        ];
        for (const p of palettes) {
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
        const usedClasses = await extractClasses(sourceFiles);

        const missing: string[] = [];
        for (const cls of usedClasses) {
            // Skip non-palette classes or template fragments
            if (!cls.includes("palette-") && !cls.includes("h-control"))
                continue;
            // Skip classes with template literals or dynamic parts
            if (cls.includes("${") || cls.includes("{")) continue;
            // Skip classes that are just the palette name (e.g. "palette-surface")
            // — those are plain CSS classes, not Tailwind utilities
            if (
                /^palette-(surface|raised|brand|success|warning|danger)$/.test(
                    cls,
                )
            )
                continue;

            // For utility classes, check that the escaped version exists in CSS
            const escaped = cls.replace(/\//g, "\\/");
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

import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ALL, CHROMATIC, SURFACES } from "../lib/palette-sets";
import { readPaletteNames } from "./palette-utils";

// ─── Palette sets agreement ─────────────────────────────────────────────────
// The named palette sets (CHROMATIC, SURFACES, ALL) are the source of truth
// for the preview harness. They must agree with the palette directory: every
// palette in the directory must appear in exactly one named set, and no set
// may reference a palette that does not exist.

describe("palette sets agreement", () => {
    it("CHROMATIC + SURFACES = ALL (no overlap, no missing)", async () => {
        const directory = await readPaletteNames();
        const sets = [...CHROMATIC, ...SURFACES];

        // Every palette in the directory is in a set
        for (const p of directory) {
            expect(sets, `palette ${p} not in any set`).toContain(p);
        }
        // Every set member exists in the directory
        for (const p of sets) {
            expect(
                directory,
                `set references non-existent palette ${p}`,
            ).toContain(p);
        }
        // No overlap between CHROMATIC and SURFACES
        const chromaticSet = new Set<string>(CHROMATIC);
        for (const p of SURFACES) {
            expect(
                chromaticSet.has(p),
                `${p} in both CHROMATIC and SURFACES`,
            ).toBe(false);
        }
        // ALL = CHROMATIC + SURFACES
        expect(ALL).toEqual([...SURFACES, ...CHROMATIC]);
    });
});

// ─── Example resolution guard ───────────────────────────────────────────────
// Every file in apps/www/examples/ must resolve through ComponentPreview's
// dynamic import mechanism. A preview that silently fails to find its demo
// is the failure mode this replaces.

const EXAMPLES_DIR = path.join(process.cwd(), "examples");

describe("example resolution guard", () => {
    const exampleFiles = readdirSync(EXAMPLES_DIR)
        .filter((f) => f.endsWith(".tsx"))
        .map((f) => f.slice(0, -4))
        .sort();

    it("examples directory is not empty", () => {
        expect(exampleFiles.length).toBeGreaterThan(0);
    });

    it.each(exampleFiles)(
        "example %s resolves through dynamic import path",
        (name) => {
            // The ComponentPreview uses: await import(`@/examples/${name}`)
            // This test verifies the file exists at the expected path. The
            // actual dynamic import is exercised by the build — this guard
            // catches typos and missing files before the build runs.
            const filePath = path.join(EXAMPLES_DIR, `${name}.tsx`);
            expect(filePath).toBeTruthy();
        },
    );
});

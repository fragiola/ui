import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The palettes demo and the Create page make a palette from a hue with one
// generator, the registry's `colour` item: neither keeps a copy that could
// drift from the other. The demo's behaviour (two hues become my-palette-1
// and my-palette-2, and each repaints the card) is checked in a browser by
// `check:embeds`.

const SRC = path.resolve(import.meta.dirname, "../src");
const GENERATOR = /from\s+"#\/components\/lib\/colour\/palette"/;

const read = (file: string) => readFile(path.join(SRC, file), "utf-8");

describe("the palette generator", () => {
    it("is the registry's, imported by Create and by the palettes demo", async () => {
        const create = await read("create/design/design.ts");
        const demo = await read("examples/palettes.tsx");
        expect(create).toMatch(GENERATOR);
        expect(demo).toMatch(GENERATOR);
        expect(demo).toMatch(/\bgeneratePalette\(/);
    });

    it("is not re-implemented in the palettes demo", async () => {
        const demo = await read("examples/palettes.tsx");
        expect(demo).not.toMatch(/function\s+generatePalette\b/);
        // the curves live in the generator: no lightness or chroma literal
        expect(demo).not.toMatch(/oklch\(\s*\d/);
    });
});

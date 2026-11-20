import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The palette maker and the Create page make a palette from a hue with one
// generator, the registry's `colour` item: neither keeps a copy that could
// drift from the other. The maker's behaviour (two hues become my-palette-1
// and my-palette-2, and each repaints the target) is checked in a browser
// by `check:embeds`.

const SRC = path.resolve(import.meta.dirname, "../src");
const GENERATOR = /from\s+"#\/components\/lib\/colour\/palette"/;

const read = (file: string) => readFile(path.join(SRC, file), "utf-8");

describe("the palette generator", () => {
    it("is the registry's, imported by Create and by the palette maker", async () => {
        const create = await read("create/design/design.ts");
        const maker = await read("examples/palette-maker.tsx");
        expect(create).toMatch(GENERATOR);
        expect(maker).toMatch(GENERATOR);
        expect(maker).toMatch(/\bgeneratePalette\(/);
    });

    it("is not re-implemented in the palette maker", async () => {
        const maker = await read("examples/palette-maker.tsx");
        expect(maker).not.toMatch(/function\s+generatePalette\b/);
        // the curves live in the generator: no lightness or chroma literal
        expect(maker).not.toMatch(/oklch\(\s*\d/);
    });
});

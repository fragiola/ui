import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The palettes demo and the Create page make a palette from a hue with one
// generator, the registry's `colour` item: neither keeps a copy that could
// drift from the other. The demo's behaviour (two hues become my-palette-1
// and my-palette-2, and each repaints the card) is checked in a browser by
// `check:embeds`, which also checks the code panel's text and layout.

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

describe("the palettes code panel", () => {
    // The components that carry a palette class, as `<Name` tags.
    const TAGS =
        /<(Badge|Field\.Root|Switch\.Root|Checkbox\.Root|Progress\.Root|Clickable\.Button)\b/g;

    it("outlines the card's components in the order the card renders them", async () => {
        const demo = await read("examples/palettes.tsx");
        const card = demo.slice(demo.indexOf("function InviteCard"));
        const rendered = [...card.matchAll(TAGS)].map((m) => m[1]);
        const outline = demo.slice(
            demo.indexOf("function outline"),
            demo.indexOf("function InviteCard"),
        );
        const listed = [...outline.matchAll(/\["([\w.]+)",/g)].map((m) => m[1]);
        expect(listed).toEqual(rendered);
        expect(listed).toHaveLength(7);
    });

    it("never shows the palette's CSS", async () => {
        const demo = await read("examples/palettes.tsx");
        const panel = demo.slice(
            demo.indexOf("data-palette-code"),
            demo.indexOf("function InviteCard"),
        );
        expect(panel).not.toMatch(/\.css\b|--palette-|:root/);
    });
});

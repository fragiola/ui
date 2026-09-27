import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { readPaletteNames } from "../../../packages/registry/tests/palette-utils";

// ─── Stylesheet agreement ───────────────────────────────────────────────────
// One of the five hardcoded palette lists is this app's stylesheet. The
// registry asserts the lists it owns (packages/registry/tests); this one
// belongs to the app. A palette missing here compiles to nothing, silently.

describe("globals.css", () => {
    it("imports every palette file", async () => {
        const css = await readFile(
            path.join(process.cwd(), "app", "globals.css"),
            "utf-8",
        );
        for (const p of await readPaletteNames()) {
            expect(css, `globals.css does not import ${p}.css`).toContain(
                `palettes/${p}.css`,
            );
        }
    });
});

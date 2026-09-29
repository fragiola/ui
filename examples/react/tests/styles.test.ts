import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { readPaletteNames } from "../../../packages/registry/tests/palette-utils";
import { compileStylesheets, type Stylesheets } from "./stylesheet";

// ─── The stylesheet ─────────────────────────────────────────────────────────
// Rule 8 (see ./stylesheet.ts): src/styles.css must compile every class the
// registry and the examples use, although the registry lives outside this
// app and is only reached through `@source`.

const APP = path.resolve(import.meta.dirname, "..");
const REGISTRY = path.resolve(APP, "../../packages/registry/registry");

let stylesheets: Stylesheets;

beforeAll(async () => {
    stylesheets = await compileStylesheets(APP, "src/styles.css", [
        REGISTRY,
        path.join(APP, "src"),
    ]);
});

describe("src/styles.css", () => {
    it("compiles every class the registry and the examples use", () => {
        const { missing } = stylesheets;
        expect(missing, `dropped silently: ${missing.join(", ")}`).toEqual([]);
    });

    it("compiles classes only the registry uses", () => {
        // Written in registry sources, in no example: present only because
        // of `@source`. A sanity check that the comparison above has teeth.
        for (const utility of ["field-focus", "h-control", "highlighted"]) {
            expect(stylesheets.real).toContain(utility);
        }
    });

    it("imports every palette file", async () => {
        const css = await readFile(
            path.join(APP, "src", "styles.css"),
            "utf-8",
        );
        for (const palette of await readPaletteNames()) {
            expect(css, `styles.css does not import ${palette}.css`).toContain(
                `palettes/${palette}.css`,
            );
        }
    });
});

describe("src/examples", () => {
    it("lists every example file, and every listed example has a file", async () => {
        const { examples } = await import("../src/examples/index.ts");
        const files = (await readdir(path.join(APP, "src", "examples")))
            .filter((f) => f.endsWith(".tsx"))
            .map((f) => f.slice(0, -4))
            .sort();
        expect(examples.map((e) => e.id).sort()).toEqual(files);
    });
});

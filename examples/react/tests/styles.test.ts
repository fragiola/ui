import { execFileSync } from "node:child_process";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { readPaletteNames } from "../../../packages/registry/tests/palette-utils";

// ─── The stylesheet ─────────────────────────────────────────────────────────
// Rule 8: a class that does not compile fails silently. Tailwind scans this
// app on its own, and the registry the examples render lives outside it; the
// POC showed that without `@source` pointing at it, every class the
// components use compiles to nothing — no build error, no type error, a
// page of unstyled boxes.
//
// So the app's real stylesheet (src/styles.css, compiled from the app's
// root as the Vite plugin does) is compared with the same stylesheet given
// the registry and the examples as explicit sources. Anything the second
// has and the first lacks is a class the app would silently drop.

const APP = path.resolve(import.meta.dirname, "..");
const REGISTRY = path.resolve(APP, "../../packages/registry/registry");
const TMP = path.join(APP, ".tmp-styles-test");

let real = "";
let reference = "";

function compile(input: string, output: string) {
    execFileSync(
        "pnpm",
        ["exec", "tailwindcss", "--input", input, "--output", output],
        { cwd: APP, stdio: "pipe" },
    );
}

function classSelectors(css: string): Set<string> {
    return new Set(
        [...css.matchAll(/\.((?:\\.|[\w-])+)/g)].map(([, name]) => name ?? ""),
    );
}

beforeAll(async () => {
    await mkdir(TMP, { recursive: true });
    compile("src/styles.css", path.join(TMP, "real.css"));
    const input = path.join(TMP, "reference.css");
    await writeFile(
        input,
        [
            `@import "${path.join(APP, "src", "styles.css")}";`,
            `@source "${REGISTRY}";`,
            `@source "${path.join(APP, "src")}";`,
            "",
        ].join("\n"),
    );
    compile(input, path.join(TMP, "reference.css.out"));
    real = await readFile(path.join(TMP, "real.css"), "utf-8");
    reference = await readFile(path.join(TMP, "reference.css.out"), "utf-8");
});

afterAll(async () => {
    await rm(TMP, { recursive: true, force: true });
});

describe("src/styles.css", () => {
    it("compiles every class the registry and the examples use", () => {
        const compiled = classSelectors(real);
        const missing = [...classSelectors(reference)].filter(
            (name) => !compiled.has(name),
        );
        expect(missing, `dropped silently: ${missing.join(", ")}`).toEqual([]);
    });

    it("compiles classes only the registry uses", () => {
        // Written in registry sources, in no example: present only because
        // of `@source`. A sanity check that the comparison above has teeth.
        for (const utility of ["field-focus", "h-control", "highlighted"]) {
            expect(real).toContain(utility);
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

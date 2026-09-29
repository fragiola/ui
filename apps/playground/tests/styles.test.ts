import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import {
    compileStylesheets,
    type Stylesheets,
} from "../../../examples/react/tests/stylesheet.ts";

// ─── The stylesheet ─────────────────────────────────────────────────────────
// Rule 8 (see examples/react/tests/stylesheet.ts): src/styles.css must
// compile every class of everything the playground renders — the registry,
// the examples and the shell — although only the shell lives in this app.

const APP = path.resolve(import.meta.dirname, "..");
const ROOT = path.resolve(APP, "../..");

let stylesheets: Stylesheets;

beforeAll(async () => {
    stylesheets = await compileStylesheets(APP, "src/styles.css", [
        path.join(ROOT, "packages/registry/registry"),
        path.join(ROOT, "examples/react/src/examples"),
        path.join(APP, "src"),
    ]);
});

describe("src/styles.css", () => {
    it("compiles every class the registry, the examples and the shell use", () => {
        const { missing } = stylesheets;
        expect(missing, `dropped silently: ${missing.join(", ")}`).toEqual([]);
    });

    it("compiles classes only the registry uses", () => {
        // Present only because of the `@source` examples/react's stylesheet
        // carries: proof that it reaches this app through the import.
        for (const utility of ["field-focus", "h-control", "highlighted"]) {
            expect(stylesheets.real).toContain(utility);
        }
    });
});

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BASES } from "../../packages/registry/bases.ts";

const root = join(import.meta.dirname, "../..");
const read = (path: string) => readFileSync(join(root, path), "utf8");

// The Site export job runs in Playwright's image instead of installing Chromium (Epic #129, as
// fragiola/data-grid Epic #162): its browsers are the ones of its version, so the tag follows
// the `playwright` package `check:embeds` uses.
describe("the CI workflow", () => {
    it("runs the Playwright jobs in the image of the Playwright check:embeds uses", () => {
        const version = JSON.parse(read("examples/react/package.json"))
            .devDependencies.playwright;
        expect(version).toMatch(/^\d+\.\d+\.\d+$/);
        const images = [
            ...read(".github/workflows/ci.yml").matchAll(
                /mcr\.microsoft\.com\/playwright:v([\d.]+)-noble/g,
            ),
        ].map((match) => match[1]);
        expect(images.length).toBeGreaterThan(0);
        expect(new Set(images)).toEqual(new Set([version]));
    });

    it("installs no browser", () => {
        expect(read(".github/workflows/ci.yml")).not.toContain(
            "playwright install",
        );
    });

    it("runs the per-base job on every base of the registry", () => {
        const matrix = read(".github/workflows/ci.yml").match(
            /^ {8}base: \[([^\]]*)\]$/m,
        );
        expect(matrix, "the bases job's matrix").not.toBeNull();
        const listed = (matrix?.[1] ?? "").split(",").map((b) => b.trim());
        expect(listed.sort()).toEqual(BASES.map((base) => base.name).sort());
    });
});

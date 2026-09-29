import { readdir } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LEVELS } from "../../../examples/gallery.ts";
import { entries, scenarioPath, scenarioTitle } from "../src/catalog.ts";

// ─── The scenario convention ────────────────────────────────────────────────
// src/scenarios/<level>/<id>.tsx, default export only. The sidebar reads
// everything from the path, and a module that exports anything beside its
// component loses Fast Refresh (a full reload on every save). So the
// convention is the whole contract, and this file enforces it.

const SCENARIOS = path.resolve(import.meta.dirname, "../src/scenarios");
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*\.tsx$/;

async function scenarioFiles() {
    const found: { level: string; file: string }[] = [];
    for (const level of await readdir(SCENARIOS, { withFileTypes: true })) {
        expect(
            level.isDirectory(),
            `${level.name}: a scenario lives in a level's directory, src/scenarios/<level>/<id>.tsx`,
        ).toBe(true);
        for (const file of await readdir(path.join(SCENARIOS, level.name))) {
            found.push({ level: level.name, file });
        }
    }
    return found;
}

describe("src/scenarios", () => {
    it("has one directory per level, named as in LEVELS", async () => {
        const levels: string[] = LEVELS.map((l) => l.id);
        for (const dir of await readdir(SCENARIOS)) {
            expect(levels, `${dir} is not a level`).toContain(dir);
        }
    });

    it("names every scenario <kebab-id>.tsx", async () => {
        for (const { level, file } of await scenarioFiles()) {
            expect(file, `${level}/${file}`).toMatch(KEBAB);
        }
    });

    it("exports a component as default, and nothing else", async () => {
        for (const { level, file } of await scenarioFiles()) {
            const module: Record<string, unknown> = await import(
                path.join(SCENARIOS, level, file)
            );
            expect(Object.keys(module), `${level}/${file}`).toEqual([
                "default",
            ]);
            expect(typeof module.default, `${level}/${file}`).toBe("function");
        }
    });

    it("lists every scenario in the catalog", async () => {
        const files = (await scenarioFiles())
            .map(({ level, file }) => `${level}/${file.slice(0, -4)}`)
            .sort();
        const listed = entries
            .filter((e) => e.kind === "scenario")
            .map((e) => e.id)
            .sort();
        expect(listed).toEqual(files);
    });
});

describe("scenario paths", () => {
    it("reads level and id from the path", () => {
        expect(scenarioPath("./scenarios/atoms/clickable-matrix.tsx")).toEqual({
            level: "atoms",
            id: "clickable-matrix",
        });
        expect(scenarioPath("./scenarios/loose.tsx")).toBeUndefined();
    });

    it("titles a scenario from its id", () => {
        expect(scenarioTitle("clickable-matrix")).toBe("Clickable matrix");
        expect(scenarioTitle("motion")).toBe("Motion");
    });
});

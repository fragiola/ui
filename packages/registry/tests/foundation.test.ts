import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

// ─── Foundation guard ───────────────────────────────────────────────────────
// The visual language (docs/visual-language.md) lives in ONE family,
// `families/foundation.ts`. A family or component that writes one of its
// ideas itself — a focus ring, the soft hover, the highlighted item, the
// checked fill — is how the registry drifted into several designs: each copy
// was written in its own words (offset 0, offset 1, a 1px outline…). So the
// classes that spell those ideas may appear in the foundation only; every
// other file composes the member.
//
// PENDING lists the files the visual-language pass has not reached yet. It
// only shrinks: a file leaves it when it composes the foundation, and a new
// file never joins it.

const ROOT = path.resolve(import.meta.dirname, "..");
const REGISTRY = path.join(ROOT, "registry");

// Each idea, and the classes that would restate it.
// The focus ring is matched on the standard focus variants only. A library's
// own focus target (the grid's focused cell, `[:focus-visible>&]` on a tree
// row) and its drag-and-drop outlines are its own vocabulary (architecture.md
// §2, "Normalize state before sharing"); they keep the ring's values by
// review. A conditional hover (`data-draggable:hover:`) is the same case.
const RESTATED: { idea: string; pattern: RegExp }[] = [
    {
        idea: "focus ring",
        pattern: /(?<![\w:\]-])(?:focus-visible|field-focus|focus):outline-/,
    },
    { idea: "hover", pattern: /(?<![\w:\]-])hover:bg-palette-soft/ },
    { idea: "highlighted", pattern: /highlighted:bg-palette-soft/ },
    {
        idea: "current",
        pattern: /(?<![\w-])(?:current|data-active):bg-palette-soft/,
    },
    {
        idea: "selected",
        pattern: /(?<![\w-])(?:selected|data-selected):bg-palette-soft/,
    },
    { idea: "checked", pattern: /data-checked:bg-palette-/ },
];

const PENDING = new Set<string>();

async function sources(dir: string): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true });
    const files: string[] = [];
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) files.push(...(await sources(full)));
        else if (/\.tsx?$/.test(entry.name)) files.push(full);
    }
    return files;
}

// Comments explain the drift they replaced, so they may name the classes.
function code(source: string): string {
    return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

describe("foundation", () => {
    it("is the only file that spells the visual language's ideas", async () => {
        const offenders: string[] = [];
        for (const file of await sources(REGISTRY)) {
            const name = path.relative(REGISTRY, file);
            if (name === "families/foundation.ts" || PENDING.has(name)) {
                continue;
            }
            const text = code(await readFile(file, "utf-8"));
            for (const { idea, pattern } of RESTATED) {
                if (pattern.test(text)) offenders.push(`${name}: ${idea}`);
            }
        }
        expect(offenders).toEqual([]);
    });

    it("spells every idea it owns", async () => {
        const text = code(
            await readFile(
                path.join(REGISTRY, "families/foundation.ts"),
                "utf-8",
            ),
        );
        for (const { idea, pattern } of RESTATED) {
            expect(pattern.test(text), idea).toBe(true);
        }
    });

    it("lists only files that still restate an idea as pending", async () => {
        for (const name of PENDING) {
            const text = code(
                await readFile(path.join(REGISTRY, name), "utf-8"),
            );
            expect(
                RESTATED.some(({ pattern }) => pattern.test(text)),
                `${name} composes the foundation: remove it from PENDING`,
            ).toBe(true);
        }
    });

    it("is composed by the control families", async () => {
        for (const name of [
            "families/field.tsx",
            "families/choice.ts",
            "families/track.ts",
            "atoms/clickable/index.tsx",
        ]) {
            const text = await readFile(path.join(REGISTRY, name), "utf-8");
            expect(text, name).toMatch(/from "(\.\/|#\/families\/)foundation"/);
        }
    });

    it("is used by checkbox, radio and switch through the choice family", async () => {
        for (const name of [
            "ui/checkbox.tsx",
            "ui/radio.tsx",
            "ui/switch.tsx",
        ]) {
            const text = await readFile(path.join(REGISTRY, name), "utf-8");
            expect(text, name).toContain('from "#/families/choice"');
        }
    });
});

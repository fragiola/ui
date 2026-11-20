import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { dock } from "../registry/families/dock";
import { handle } from "../registry/families/handle";
import { split } from "../registry/families/split";
import { tile } from "../registry/families/tile";

// ─── The handle family ──────────────────────────────────────────────────────
// Splitter's separator and Dockable's splitter drew their handles in their
// own words until families/handle.ts. This guard keeps one definition: both
// compose it, nobody else spells the mark, and the mark only reaches the
// `data-handle` axis through its tokens.

const classes = (member: () => string) => member().split(/\s+/).filter(Boolean);

const REGISTRY = path.resolve(import.meta.dirname, "../registry");

// The classes that spell the mark: its mask, its orientation, its states.
const MARK = [
    /\[mask-image:/,
    /(?<![\w-])handle-(?:vertical|horizontal):/,
    /\/handle:opacity-/,
    /--handle-mask/,
];

async function sources(dir: string): Promise<string[]> {
    const files: string[] = [];
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) files.push(...(await sources(full)));
        else if (/\.tsx?$/.test(entry.name)) files.push(full);
    }
    return files;
}

const code = (source: string) =>
    source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

describe("handle family", () => {
    it("has zero variants — variation is a named member", () => {
        for (const [name, member] of Object.entries(handle)) {
            const variants = (member as { variants?: object }).variants ?? {};
            expect(Object.keys(variants), name).toEqual([]);
        }
    });

    it("is the target of Splitter's separator and Dockable's splitter", () => {
        const target = classes(handle.target);
        for (const [name, member] of [
            ["split.separator", split.separator],
            ["dock.splitter", dock.splitter],
        ] as const) {
            const own = classes(member);
            expect(
                target.filter((c) => !own.includes(c)),
                name,
            ).toEqual([]);
        }
    });

    it("is the mark of a Splitter grip, a Dockable splitter and a Grid Layout resize handle", () => {
        expect(split.grip).toBe(handle.mark);
        expect(dock.splitterMark).toBe(handle.mark);
        const mark = classes(tile.resizeMark);
        for (const c of classes(handle.mark).filter(
            (c) => !c.startsWith("opacity-"),
        )) {
            expect(mark, c).toContain(c);
        }
    });

    it("is the only file that spells the mark", async () => {
        const offenders: string[] = [];
        for (const file of await sources(REGISTRY)) {
            const name = path.relative(REGISTRY, file);
            if (name === "families/handle.ts") continue;
            const text = code(await readFile(file, "utf-8"));
            for (const pattern of MARK) {
                if (pattern.test(text)) offenders.push(`${name}: ${pattern}`);
            }
        }
        expect(offenders).toEqual([]);
    });

    it("reads the axis through its tokens, with a fallback", () => {
        const mark = classes(handle.mark);
        expect(mark).toContain("opacity-[var(--handle-rest,0)]");
        expect(mark).toContain("[mask-image:var(--handle-mask,none)]");
        // No level is named in a class: an axis only sets tokens.
        expect(
            classes(handle.mark).filter((c) => /data-handle/.test(c)),
        ).toEqual([]);
    });

    it("lights the mark on hover, drag, resize and focus, never when disabled", () => {
        const mark = classes(handle.mark);
        for (const state of [
            "group-not-data-disabled/handle:group-hover/handle:opacity-100",
            "group-data-dragging/handle:opacity-100",
            "group-data-resizing/handle:opacity-100",
            "group-focus-visible/handle:opacity-100",
            "group-data-disabled/handle:opacity-0",
        ]) {
            expect(mark, state).toContain(state);
        }
    });

    it("draws the parts' marks by default", async () => {
        for (const [file, member] of [
            ["ui/splitter/templates/simple.tsx", "Grip"],
            ["ui/dockable/parts.tsx", "dock.splitterMark()"],
            ["ui/grid-layout/parts.tsx", "tile.resizeMark()"],
        ] as const) {
            const text = await readFile(path.join(REGISTRY, file), "utf-8");
            expect(text, file).toContain(member);
        }
    });
});

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
        expect(tile.resizeMark).toBe(handle.edgeMark);
        // The edge mark is the bar's mark but for its opacities.
        const mark = classes(handle.edgeMark);
        for (const c of classes(handle.mark).filter(
            (c) => !/(?:^|:)opacity-/.test(c),
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
        // Neutral at rest, `ring` on interaction; lit to `1 - seam`, so
        // `ide` never shows a bar's mark. A card's edge mark is lit fully.
        const states = [
            "group-not-data-disabled/handle:group-hover/handle:",
            "group-data-dragging/handle:",
            "group-data-resizing/handle:",
            "group-focus-visible/handle:",
        ];
        const mark = classes(handle.mark);
        const edge = classes(handle.edgeMark);
        expect(mark).toContain("bg-palette-accent");
        for (const state of states) {
            expect(mark, state).toContain(
                `${state}opacity-[calc(1_-_var(--handle-seam,0))]`,
            );
            expect(mark, state).toContain(`${state}bg-palette-ring`);
            expect(edge, state).toContain(`${state}opacity-100`);
        }
        expect(mark).toContain("group-data-disabled/handle:opacity-0");
        expect(edge).toContain("group-data-disabled/handle:opacity-0");
        expect(edge).toContain("opacity-[max(0.4,var(--handle-rest,0))]");
    });

    it("centres the rule with symmetric insets at the bar's thickness", () => {
        // Auto margins cannot centre a 3px rule on a 1px bar: the box
        // spills to its end, and flips in RTL.
        const target = classes(handle.target);
        expect(target.filter((c) => /m[xy]-auto/.test(c))).toEqual([]);
        expect(target).toContain(
            "data-[orientation=vertical]:after:inset-x-[calc(50%_-_var(--handle-bar)_/_2)]",
        );
        expect(target).toContain(
            "data-[orientation=horizontal]:after:inset-y-[calc(50%_-_var(--handle-bar)_/_2)]",
        );
        expect(target).toContain("[--handle-bar:1px]");
        expect(target).toContain("focus-visible:[--handle-bar:3px]");
        // Dragged: 1px, or the 3px bar under `ide` (seam 1).
        expect(target).toContain(
            "data-dragging:[--handle-bar:calc(1px_+_2px_*_var(--handle-seam,0))]",
        );
        // Hovered: `ring`, or under `ide` the line brightened towards
        // contrast — never while dragged or focused, whose `ring` wins.
        const hover = target.filter((c) => /hover:after:bg-/.test(c));
        expect(hover).toHaveLength(1);
        expect(hover[0]).toMatch(
            /^not-data-disabled:not-data-dragging:not-focus-visible:hover:/,
        );
        expect(hover[0]).toContain("var(--handle-seam,0)");
        expect(hover[0]).toContain("var(--palette-contrast)");
    });

    it("gives Dockable a seam under ide: no gap, no frames, a rule at rest, a 9px hit area", () => {
        const splitter = classes(dock.splitter);
        const seam = (c: string) => c.includes("var(--handle-seam,0)");
        expect(
            splitter.filter(
                (c) => /orientation=vertical\]:w-/.test(c) && seam(c),
            ),
        ).toHaveLength(1);
        expect(splitter).toContain(
            "after:bg-palette-line/[calc(var(--handle-seam,0)_*_100%)]",
        );
        expect(splitter).toContain(
            "data-[orientation=vertical]:before:inset-x-[min(0px,calc(50%_-_4.5px))]",
        );
        expect(classes(dock.tabset).filter(seam)).toHaveLength(2);
        expect(classes(dock.row).filter(seam)).toHaveLength(1);
        expect(classes(dock.panel).filter(seam)).toHaveLength(1);
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

import type { ComponentType } from "react";
import { LEVELS, type LevelId } from "../../../examples/gallery.ts";
import { examples } from "../../../examples/react/src/examples/index.ts";
import type { ItemRef, Kind } from "./view.ts";

// Everything the playground can show, read where it lives, grouped by the
// docs' levels. Components and sources are loaded only when shown.
//
//   examples   examples/react's own list (no second one here) — public,
//              contract-bound, what the docs show
//   scenarios  src/scenarios/<level>/<id>.tsx, found by path — dev-only,
//              never shipped; a file is all it takes to add one

export type Entry = {
    kind: Kind;
    id: string;
    title: string;
    level: LevelId;
    load: () => Promise<{ default: ComponentType }>;
    /** How the stage frames it: `fill` takes the whole stage (an app shell),
     * `flow` is padded and centred. Scenarios flow. */
    layout: "fill" | "flow";
    /** Where the file lives, from the repository root. */
    file: string;
    /** The file, verbatim — what the source panel shows. */
    source: () => Promise<string>;
};

export type Section = {
    kind: Kind;
    title: string;
    groups: { level: LevelId; title: string; entries: Entry[] }[];
};

// Glob keys are relative to this file, which is apps/playground/src.
function repositoryPath(key: string): string {
    return new URL(key, "file:///apps/playground/src/").pathname.slice(1);
}

// ─── Examples ───────────────────────────────────────────────────────────────

const exampleSources = import.meta.glob<string>(
    "../../../examples/react/src/examples/*.tsx",
    { query: "?raw", import: "default" },
);

function exampleSource(id: string) {
    const key = `../../../examples/react/src/examples/${id}.tsx`;
    return {
        file: repositoryPath(key),
        source:
            exampleSources[key] ??
            (() => Promise.reject(new Error(`No source file for ${id}`))),
    };
}

const exampleEntries: Entry[] = [...examples]
    .sort((a, b) => a.order - b.order)
    .map((example) => ({
        kind: "example",
        id: example.id,
        title: example.title,
        level: example.level,
        load: example.load,
        layout: example.layout,
        ...exampleSource(example.id),
    }));

// ─── Scenarios ──────────────────────────────────────────────────────────────

const scenarioModules = import.meta.glob<{ default: ComponentType }>(
    "./scenarios/*/*.tsx",
);
const scenarioSources = import.meta.glob<string>("./scenarios/*/*.tsx", {
    query: "?raw",
    import: "default",
});

/** `./scenarios/<level>/<id>.tsx` → its level and id, or nothing. */
export function scenarioPath(
    key: string,
): { level: string; id: string } | undefined {
    const match = /^\.\/scenarios\/([^/]+)\/([^/]+)\.tsx$/.exec(key);
    if (!match?.[1] || !match[2]) return undefined;
    return { level: match[1], id: match[2] };
}

/** `clickable-matrix` → `Clickable matrix`. */
export function scenarioTitle(id: string): string {
    const words = id.replaceAll("-", " ");
    return words.charAt(0).toUpperCase() + words.slice(1);
}

function isLevel(level: string): level is LevelId {
    return LEVELS.some((l) => l.id === level);
}

// A file outside a level's directory is not listed; tests/scenarios.test.ts
// fails on it instead.
const scenarioEntries: Entry[] = Object.entries(scenarioModules)
    .flatMap(([key, load]) => {
        const path = scenarioPath(key);
        const source = scenarioSources[key];
        if (!path || !isLevel(path.level) || !source) return [];
        return [
            {
                kind: "scenario" as const,
                id: `${path.level}/${path.id}`,
                title: scenarioTitle(path.id),
                level: path.level,
                load,
                layout: "flow" as const,
                file: repositoryPath(key),
                source,
            },
        ];
    })
    .sort((a, b) => a.title.localeCompare(b.title));

// ─── Sections ───────────────────────────────────────────────────────────────

function section(kind: Kind, title: string, entries: Entry[]): Section {
    return {
        kind,
        title,
        groups: LEVELS.map((level) => ({
            level: level.id,
            title: level.title,
            entries: entries.filter((entry) => entry.level === level.id),
        })).filter((group) => group.entries.length > 0),
    };
}

export const sections: Section[] = [
    section("example", "Examples", exampleEntries),
    section("scenario", "Scenarios", scenarioEntries),
].filter((s) => s.groups.length > 0);

export const entries: Entry[] = sections.flatMap((s) =>
    s.groups.flatMap((g) => g.entries),
);

export function findEntry(ref: ItemRef | null): Entry | undefined {
    if (!ref) return undefined;
    return entries.find((e) => e.kind === ref.kind && e.id === ref.id);
}

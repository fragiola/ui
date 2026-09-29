import type { ComponentType } from "react";
import { LEVELS, type LevelId } from "../../../examples/gallery.ts";
import { examples } from "../../../examples/react/src/examples/index.ts";
import type { ItemRef, Kind } from "./view.ts";

// Everything the playground can show, read where it lives: the examples from
// examples/react's own list (no second one here), grouped by the docs'
// levels. Components and sources are loaded only when shown.

export type Entry = {
    kind: Kind;
    id: string;
    title: string;
    level: LevelId;
    load: () => Promise<{ default: ComponentType }>;
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

const exampleSources = import.meta.glob<string>(
    "../../../examples/react/src/examples/*.tsx",
    { query: "?raw", import: "default" },
);

type SourceFile = { file: string; source: () => Promise<string> };

// Glob keys are relative to this file; the id is the file name.
function byId(
    files: Record<string, () => Promise<string>>,
): Map<string, SourceFile> {
    return new Map(
        Object.entries(files).map(([key, source]) => [
            key.slice(key.lastIndexOf("/") + 1, -".tsx".length),
            { file: key.replace(/^(\.\.\/)+/, ""), source },
        ]),
    );
}

const exampleFiles = byId(exampleSources);

const exampleEntries: Entry[] = [...examples]
    .sort((a, b) => a.order - b.order)
    .map((example) => ({
        kind: "example",
        id: example.id,
        title: example.title,
        level: example.level,
        load: example.load,
        ...(exampleFiles.get(example.id) ?? {
            file: `${example.id}.tsx`,
            source: () =>
                Promise.reject(new Error(`No source file for ${example.id}`)),
        }),
    }));

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
];

export const entries: Entry[] = sections.flatMap((s) =>
    s.groups.flatMap((g) => g.entries),
);

export function findEntry(ref: ItemRef | null): Entry | undefined {
    if (!ref) return undefined;
    return entries.find((e) => e.kind === ref.kind && e.id === ref.id);
}

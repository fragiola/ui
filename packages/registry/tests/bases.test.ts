import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
    BASES,
    BASES_DIR,
    DEFAULT_BASE,
    PRIMITIVES_BACKED,
    type PrimitivesBackedFile,
    resolveBaseFile,
} from "../bases";
import { baseImportProblems } from "../scripts/base-imports";
import {
    type BaseFiles,
    dataSlots,
    exportShape,
    parityProblems,
} from "../scripts/bases-parity";
import { pathsForBase } from "../scripts/typecheck-bases";

// The bases (bases.ts, docs/architecture.md "Bases"): every base has the
// same base-dependent files, each exporting the same names and namespace
// members and rendering the same data-slot names, and each importing only its
// own primitive library. The UI adapts to a base; it never drops a part.

const ROOT = path.resolve(import.meta.dirname, "..");
const REGISTRY = path.join(ROOT, "registry");
const WORKSPACE = path.resolve(ROOT, "../..");

async function walk(dir: string): Promise<string[]> {
    const files: string[] = [];
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) files.push(...(await walk(full)));
        else if (/\.tsx?$/.test(entry.name)) files.push(full);
    }
    return files;
}

async function baseFiles(name: string): Promise<BaseFiles> {
    const dir = path.join(ROOT, BASES_DIR, name);
    const files = new Map<string, string>();
    for (const file of await walk(dir)) {
        files.set(path.relative(dir, file), await readFile(file, "utf-8"));
    }
    return { base: name, files };
}

const IMPORT = /(?:from\s+|import\s*\(\s*|import\s+)["']([^"']+)["']/g;

/** The entries Base UI ships: its package.json `exports` (`./toggle` → `toggle`). */
async function baseUiEntries(): Promise<Set<string>> {
    const manifest = JSON.parse(
        await readFile(
            path.join(ROOT, "node_modules/@base-ui/react/package.json"),
            "utf-8",
        ),
    ) as { exports: Record<string, unknown> };
    return new Set(
        Object.keys(manifest.exports)
            .filter((key) => key.startsWith("./"))
            .map((key) => key.slice(2)),
    );
}

describe("bases", () => {
    it("declares exactly one default base, with unique names", () => {
        expect(BASES.filter((base) => base.default)).toHaveLength(1);
        expect(new Set(BASES.map((base) => base.name)).size).toBe(BASES.length);
    });

    it("has a folder for every base and none for an undeclared one", async () => {
        const folders = (
            await readdir(path.join(ROOT, BASES_DIR), { withFileTypes: true })
        )
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name)
            .sort();
        expect(folders).toEqual(BASES.map((base) => base.name).sort());
    });

    it("imports a base's library only from that base's files, or from a listed primitives-backed file", async () => {
        const files = new Map<string, string>();
        for (const file of await walk(REGISTRY)) {
            files.set(
                path.relative(REGISTRY, file),
                await readFile(file, "utf-8"),
            );
        }
        expect(
            baseImportProblems({ files, baseUiEntries: await baseUiEntries() }),
        ).toEqual([]);
    });

    it("keeps every base in parity with the default base", async () => {
        const reference = await baseFiles(DEFAULT_BASE.name);
        expect(reference.files.size).toBeGreaterThan(0);
        const problems: string[] = [];
        for (const base of BASES.filter((b) => !b.default)) {
            problems.push(
                ...parityProblems(reference, await baseFiles(base.name)),
            );
        }
        expect(problems).toEqual([]);
    });

    it("resolves a logical path to the base's copy, else the shared file", () => {
        expect(
            resolveBaseFile(ROOT, DEFAULT_BASE, "registry/ui/dialog.tsx"),
        ).toBe(path.join(ROOT, BASES_DIR, DEFAULT_BASE.name, "ui/dialog.tsx"));
        expect(resolveBaseFile(ROOT, DEFAULT_BASE, "registry/lib/cn.ts")).toBe(
            path.join(REGISTRY, "lib/cn.ts"),
        );
    });

    it("gives editors the default base's paths in every tsconfig", async () => {
        for (const dir of [
            "packages/registry",
            "examples/react",
            "apps/playground",
        ]) {
            const config = JSON.parse(
                await readFile(
                    path.join(WORKSPACE, dir, "tsconfig.json"),
                    "utf-8",
                ),
            ) as { compilerOptions: { paths: Record<string, string[]> } };
            const { paths } = config.compilerOptions;
            expect(paths, dir).toEqual(pathsForBase(paths, DEFAULT_BASE));
        }
    });
});

describe("the parity check", () => {
    const dialog = `
        import { Dialog as P } from "lib/dialog";
        function Root(props) { return <P.Root data-slot="dialog" {...props} />; }
        function Close(props) { return <P.Close {...props} data-slot="dialog-close" />; }
        export const Dialog = { Root, Close };
        export type DialogProps = {};
    `;
    const reference = (source: string): BaseFiles => ({
        base: "one",
        files: new Map([["ui/dialog.tsx", source]]),
    });
    const other = (files: [string, string][]): BaseFiles => ({
        base: "two",
        files: new Map(files),
    });

    it("reads exports, namespace members and data-slots", () => {
        expect(exportShape(dialog)).toEqual([
            "Dialog",
            "Dialog.Close",
            "Dialog.Root",
            "type DialogProps",
        ]);
        expect(dataSlots(dialog)).toEqual(["dialog", "dialog-close"]);
        expect(
            exportShape(
                "const Input = Object.assign(Control, { Template }); export { Input };",
            ),
        ).toEqual(["Input", "Input.Template"]);
        expect(dataSlots(`const p = { "data-slot": "x" };`)).toEqual(["x"]);
    });

    it("passes identical files", () => {
        expect(
            parityProblems(
                reference(dialog),
                other([["ui/dialog.tsx", dialog]]),
            ),
        ).toEqual([]);
    });

    it("fails on a missing file, naming the base and the file", () => {
        expect(parityProblems(reference(dialog), other([]))).toEqual([
            "registry/bases/two/ui/dialog.tsx is missing (one has it)",
        ]);
    });

    it("fails on a missing namespace member", () => {
        const planted = dialog.replace("{ Root, Close }", "{ Root }");
        expect(
            parityProblems(
                reference(dialog),
                other([["ui/dialog.tsx", planted]]),
            ),
        ).toContain(
            'registry/bases/two/ui/dialog.tsx: export "Dialog.Close" is missing (one has it)',
        );
    });

    it("fails on a changed data-slot", () => {
        const planted = dialog.replace('"dialog-close"', '"dialog-x"');
        expect(
            parityProblems(
                reference(dialog),
                other([["ui/dialog.tsx", planted]]),
            ),
        ).toEqual([
            'registry/bases/two/ui/dialog.tsx: data-slot "dialog-close" is missing (one has it)',
            'registry/bases/two/ui/dialog.tsx: data-slot "dialog-x" is not in one',
        ]);
    });
});

describe("the bases guard", () => {
    const segmented = `import { SegmentedControl } from "@fragiola/primitives-react/segmented-control";`;
    const listed: PrimitivesBackedFile[] = [
        {
            file: "registry/ui/segmented-control.tsx",
            entry: "segmented-control",
            reason: "Base UI has no segmented control",
        },
    ];
    const run = (
        files: [string, string][],
        allowed = listed,
        baseUiEntries = new Set(["dialog", "toggle"]),
    ) =>
        baseImportProblems({
            files: new Map([["ui/segmented-control.tsx", segmented], ...files]),
            baseUiEntries,
            allowed,
        });

    it("lets a listed shared file import Fragiola Primitives", () => {
        expect(run([])).toEqual([]);
    });

    it("lists every primitives-backed file with a reason", () => {
        expect(PRIMITIVES_BACKED.length).toBeGreaterThan(0);
        for (const entry of PRIMITIVES_BACKED) {
            expect(entry.reason, entry.file).not.toBe("");
        }
    });

    it("fails on a shared file that imports Fragiola Primitives without being listed", () => {
        expect(
            run([
                [
                    "ui/planted.tsx",
                    `import { Toggle } from "@fragiola/primitives-react/toggle";`,
                ],
            ]),
        ).toEqual([
            "registry/ui/planted.tsx imports @fragiola/primitives-react but is not on the primitives-backed list (bases.ts)",
        ]);
    });

    it("fails on a shared or listed file that imports Base UI", () => {
        expect(
            run([
                [
                    "ui/planted.tsx",
                    `import { Dialog } from "@base-ui/react/dialog";`,
                ],
                [
                    "ui/segmented-control.tsx",
                    `${segmented}\nimport { Toggle } from "@base-ui/react/toggle";`,
                ],
            ]),
        ).toEqual([
            "registry/ui/segmented-control.tsx imports @base-ui/react",
            "registry/ui/planted.tsx imports @base-ui/react",
        ]);
    });

    it("fails on a Base UI file that imports Fragiola Primitives", () => {
        expect(
            run([
                [
                    "bases/base/ui/dialog.tsx",
                    `import { Dialog } from "@fragiola/primitives-react/dialog";`,
                ],
            ]),
        ).toEqual([
            "registry/bases/base/ui/dialog.tsx imports @fragiola/primitives-react",
        ]);
    });

    it("fails on a listed file Base UI could serve", () => {
        expect(
            run(
                [
                    [
                        "ui/toggle.tsx",
                        `import { Toggle } from "@fragiola/primitives-react/toggle";`,
                    ],
                ],
                [
                    ...listed,
                    {
                        file: "registry/ui/toggle.tsx",
                        entry: "toggle",
                        reason: "planted",
                    },
                ],
            ),
        ).toEqual([
            'registry/ui/toggle.tsx: Base UI ships "toggle", so it is a per-base pair, not primitives-backed',
        ]);
    });

    it("fails on a listed file that is per base, or that wraps another entry", () => {
        expect(
            run(
                [
                    [
                        "ui/meter.tsx",
                        `import { Meter } from "@fragiola/primitives-react/progress";`,
                    ],
                    ["bases/base/ui/meter.tsx", ""],
                ],
                [
                    ...listed,
                    {
                        file: "registry/ui/meter.tsx",
                        entry: "meter",
                        reason: "planted",
                    },
                ],
                new Set(),
            ),
        ).toEqual([
            "registry/ui/meter.tsx is primitives-backed but has a copy in bases/base/",
            "registry/ui/meter.tsx does not import @fragiola/primitives-react/meter, the entry the list names",
        ]);
    });

    it("fails on a listed file that also imports an entry Base UI ships", () => {
        expect(
            run([
                [
                    "ui/segmented-control.tsx",
                    `${segmented}\nimport { mergeProps } from "@fragiola/primitives-react/render";\nimport { Toggle } from "@fragiola/primitives-react/toggle";`,
                ],
            ]),
        ).toEqual([
            "registry/ui/segmented-control.tsx imports @fragiola/primitives-react/toggle, which Base UI ships: compose the registry's own component instead",
        ]);
    });

    it("lets the bridge import only the direction and render entries", () => {
        const bridge = {
            file: "registry/lib/primitives-backed.tsx",
            reason: "the bridge",
        };
        expect(
            run(
                [
                    [
                        "lib/primitives-backed.tsx",
                        `import { DirectionProvider } from "@fragiola/primitives-react/direction";\nimport { mergeProps } from "@fragiola/primitives-react/render";\nimport { Dialog } from "@fragiola/primitives-react/dialog";`,
                    ],
                ],
                [...listed, bridge],
            ),
        ).toEqual([
            "registry/lib/primitives-backed.tsx is the bridge and may import only @fragiola/primitives-react/direction and /render (it imports dialog)",
        ]);
    });
});

describe("every base's items", () => {
    type Item = {
        name: string;
        files?: { path: string }[];
        registryDependencies?: string[];
    };
    const EXTENSIONS = [".tsx", ".ts", "/index.tsx", "/index.ts"];

    it("ship every #/ module their files import, themselves or through their registry dependencies", async () => {
        const { items } = JSON.parse(
            await readFile(path.join(ROOT, "registry.json"), "utf-8"),
        ) as { items: Item[] };
        const byName = new Map(items.map((item) => [item.name, item]));
        const shipped = (name: string, seen = new Set<string>()): string[] => {
            if (seen.has(name)) return [];
            seen.add(name);
            const item = byName.get(name);
            if (!item) return [];
            return [
                ...(item.files ?? []).map((file) => file.path),
                ...(item.registryDependencies ?? []).flatMap((dep) =>
                    shipped(dep.replace(/^@fragiola\//, ""), seen),
                ),
            ];
        };
        const problems: string[] = [];
        for (const base of BASES) {
            for (const item of items) {
                const available = new Set(shipped(item.name));
                for (const file of item.files ?? []) {
                    if (!/\.tsx?$/.test(file.path)) continue;
                    const source = await readFile(
                        resolveBaseFile(ROOT, base, file.path),
                        "utf-8",
                    );
                    for (const [, specifier = ""] of source.matchAll(IMPORT)) {
                        if (!specifier.startsWith("#/")) continue;
                        const rest = specifier.slice(2);
                        const found = EXTENSIONS.map(
                            (ext) => `registry/${rest}${ext}`,
                        ).some((candidate) => available.has(candidate));
                        if (!found) {
                            problems.push(
                                `${base.name}: ${item.name} (${file.path}) imports ${specifier}, which neither it nor its registry dependencies ship`,
                            );
                        }
                    }
                }
            }
        }
        expect(problems).toEqual([]);
    });
});

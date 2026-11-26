import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
    BASE_PACKAGES,
    BASES,
    BASES_DIR,
    DEFAULT_BASE,
    findBase,
    resolveBaseFile,
} from "../bases";
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

function importedPackages(source: string): string[] {
    return [...source.matchAll(IMPORT)].flatMap(([, specifier = ""]) => {
        const parts = specifier.split("/");
        const name = specifier.startsWith("@")
            ? parts.slice(0, 2).join("/")
            : parts[0];
        return name ? [name] : [];
    });
}

function packagesOf(baseName: string): Set<string> {
    return new Set(
        findBase(baseName).dependencies.map((dep) => {
            const at = dep.indexOf("@", dep.startsWith("@") ? 1 : 0);
            return at > 0 ? dep.slice(0, at) : dep;
        }),
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

    it("imports a base's library only from that base's files", async () => {
        const offenders: string[] = [];
        for (const file of await walk(REGISTRY)) {
            const relative = path.relative(REGISTRY, file);
            const [, owner] = relative.match(/^bases\/([^/]+)\//) ?? [];
            const allowed = owner ? packagesOf(owner) : new Set<string>();
            const source = await readFile(file, "utf-8");
            for (const name of importedPackages(source)) {
                if (BASE_PACKAGES.has(name) && !allowed.has(name)) {
                    offenders.push(`registry/${relative} imports ${name}`);
                }
            }
        }
        expect(offenders).toEqual([]);
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

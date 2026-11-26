import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { z } from "zod";
import {
    BASE_PACKAGES,
    BASES,
    type Base,
    baseFilePath,
    baseOutputDir,
    isPrimitivesBacked,
    PRIMITIVES_BACKED_DEPENDENCIES,
    resolveBaseFile,
} from "../bases.ts";
import { ecosystemRangeProblems, splitDependency } from "./dependencies.ts";
import { rootTargetRefused } from "./targets.ts";

// `node scripts/build-registry.ts [--out <dir>]` — validates registry.json and
// writes, once per base (bases.ts), one JSON file per item plus index.json:
// the default base at <out>/, every other base at <out>/<base>/. Every base
// gets every item, under the same names and registryDependencies, so a
// reader switches base by pointing the @fragiola namespace at another URL.
// A file is read from the base's copy when it has one (resolveBaseFile), and
// an item with a base-dependent file gets the base's packages as
// dependencies, and an item with a primitives-backed file (bases.ts) gets
// Fragiola Primitives' on every base; registry.json names neither. The output defaults to
// dist/r; callers pass their own (the site export ships it as r/). A relative --out is resolved against the working
// directory, so each caller names a path of its own.
//
// Runs with Node's own type stripping: erasable syntax only.

// ─── Schema (mirrors shadcn's registry schema, closed type enum) ─────────────
const registryItemTypeSchema = z.enum([
    "registry:lib",
    "registry:block",
    "registry:component",
    "registry:ui",
    "registry:hook",
    "registry:page",
    "registry:file",
    "registry:theme",
    "registry:style",
    "registry:item",
    "registry:base",
    "registry:font",
]);

const registryItemFileSchema = z.discriminatedUnion("type", [
    z.object({
        path: z.string(),
        content: z.string().optional(),
        type: z.enum(["registry:file", "registry:page"]),
        target: z.string(),
    }),
    z.object({
        path: z.string(),
        content: z.string().optional(),
        type: registryItemTypeSchema.exclude([
            "registry:file",
            "registry:page",
        ]),
        target: z.string().optional(),
    }),
]);

const registryItemSchema = z.object({
    name: z.string(),
    type: registryItemTypeSchema,
    title: z.string().optional(),
    description: z.string().optional(),
    dependencies: z.array(z.string()).optional(),
    devDependencies: z.array(z.string()).optional(),
    registryDependencies: z.array(z.string()).optional(),
    files: z.array(registryItemFileSchema).optional(),
});

const registrySchema = z.object({
    name: z.string().optional(),
    homepage: z.string().optional(),
    items: z.array(registryItemSchema),
});

type Item = z.infer<typeof registryItemSchema>;
type FileEntry = z.infer<typeof registryItemFileSchema>;

// ─── Import rewriting ───────────────────────────────────────────────────────
// Source uses the app's alias `#/` (maps to registry/). The emitted content
// must use the consumer's alias `@/` so files resolve in their project.
// Cover: atoms, families, lib, hooks, ui, styles.
const ALIAS_REPLACEMENTS: Array<{ from: string; to: string }> = [
    { from: "#/atoms/", to: "@/components/atoms/" },
    { from: "#/families/", to: "@/components/families/" },
    { from: "#/lib/", to: "@/lib/" },
    { from: "#/hooks/", to: "@/hooks/" },
    { from: "#/ui/", to: "@/components/ui/" },
    { from: "#/styles/", to: "@/styles/" },
];

function rewriteImports(source: string): string {
    let result = source;
    for (const { from, to } of ALIAS_REPLACEMENTS) {
        result = result.replaceAll(from, to);
    }
    return result;
}

// ─── Registry dependencies ──────────────────────────────────────────────────
// The shadcn CLI resolves a bare name ("cn") against its own default registry,
// so a bare dependency silently installs shadcn's file of the same name — or
// fails when there is none. Only `@namespace/name` and full URLs are accepted;
// dependencies inside our own namespace must exist in this registry.
const NAMESPACE = "@fragiola";
const NAMESPACED_DEPENDENCY = /^(@[a-zA-Z0-9][a-zA-Z0-9-_]*)\/(.+)$/;

type Dependency =
    | { kind: "local"; name: string }
    | { kind: "external" }
    | { kind: "bare" };

function parseDependency(dep: string): Dependency {
    if (URL.canParse(dep) && /^https?:\/\//.test(dep))
        return { kind: "external" };
    const [, namespace, name] = dep.match(NAMESPACED_DEPENDENCY) ?? [];
    if (!namespace || !name) return { kind: "bare" };
    return namespace === NAMESPACE
        ? { kind: "local", name }
        : { kind: "external" };
}

// ─── Build ──────────────────────────────────────────────────────────────────
const ROOT = path.resolve(import.meta.dirname, "..");
const REGISTRY_JSON = path.join(ROOT, "registry.json");
const { values } = parseArgs({ options: { out: { type: "string" } } });
const OUTPUT_DIR = values.out
    ? path.resolve(values.out)
    : path.join(ROOT, "dist", "r");

async function buildRegistry() {
    const raw = await readFile(REGISTRY_JSON, "utf-8");
    const parsed = registrySchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
        console.error("registry.json failed validation:");
        console.error(parsed.error.issues);
        process.exit(1);
    }

    const { items } = parsed.data;

    // Check for duplicate names
    const seen = new Set<string>();
    for (const item of items) {
        if (seen.has(item.name)) {
            console.error(`Duplicate item name: "${item.name}"`);
            process.exit(1);
        }
        seen.add(item.name);
    }

    // Check registryDependencies: namespaced or URL only, and no dangling
    // references into our own namespace.
    const names = new Set(items.map((i) => i.name));
    for (const item of items) {
        for (const dep of item.registryDependencies ?? []) {
            const parsed = parseDependency(dep);
            if (parsed.kind === "bare") {
                console.error(
                    `Item "${item.name}" depends on "${dep}" without a namespace. ` +
                        `The shadcn CLI resolves a bare name against its own default ` +
                        `registry, never ${NAMESPACE}. Write "${NAMESPACE}/${dep}".`,
                );
                process.exit(1);
            }
            if (parsed.kind === "local" && !names.has(parsed.name)) {
                console.error(
                    `Item "${item.name}" depends on "${dep}" which is not in the registry.`,
                );
                process.exit(1);
            }
        }
    }

    // Check targets: `~/` is the project root, not the source root — in a
    // project with `src/` it writes outside of it. Only `~/public/` may
    // (see scripts/targets.ts).
    for (const item of items) {
        for (const file of item.files ?? []) {
            if (rootTargetRefused(file.target)) {
                console.error(
                    `Item "${item.name}": target "${file.target}" starts with "~/", ` +
                        `which the shadcn CLI resolves to the project root. Use a ` +
                        `placeholder (@ui/, @components/, @lib/, @hooks/) or a ` +
                        `relative path, which lands under src/ when the project has one. ` +
                        `Only static files under ~/public/ may target the root.`,
                );
                process.exit(1);
            }
        }
    }

    // Check npm dependencies: the base's packages are the build's to add, and
    // an ecosystem package carries the range this package builds against
    // (see scripts/dependencies.ts) — checked on every base's items.
    for (const item of items) {
        for (const dep of item.dependencies ?? []) {
            if (BASE_PACKAGES.has(splitDependency(dep).name)) {
                console.error(
                    `Item "${item.name}" lists "${dep}", a base's package. ` +
                        `The build adds the base's packages to an item with a ` +
                        `base-dependent file (bases.ts); remove it from registry.json.`,
                );
                process.exit(1);
            }
        }
    }
    const manifest = JSON.parse(
        await readFile(path.join(ROOT, "package.json"), "utf-8"),
    ) as { dependencies?: Record<string, string> };
    const rangeProblems = BASES.flatMap((base) =>
        items.flatMap((item) =>
            ecosystemRangeProblems(
                { name: item.name, dependencies: dependenciesFor(item, base) },
                manifest.dependencies ?? {},
            ),
        ),
    );
    if (rangeProblems.length) {
        for (const problem of rangeProblems) console.error(problem);
        process.exit(1);
    }

    // Check for dependency cycles
    checkCycles(items);

    for (const base of BASES) {
        await writeBase(items, base);
    }
    console.log(`\nRegistry built to ${OUTPUT_DIR}`);
}

async function writeBase(items: Item[], base: Base): Promise<void> {
    const dir = path.join(OUTPUT_DIR, baseOutputDir(base));
    await mkdir(dir, { recursive: true });

    // Clean the previous output: this base's files, never another base's
    // folder (the default base's output is the root, the others' parent).
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        if (entry.isFile()) await unlink(path.join(dir, entry.name));
    }

    const index: Item[] = [];
    for (const item of items) {
        const built = await buildItem(item, base);
        await writeFile(
            path.join(dir, `${item.name}.json`),
            `${JSON.stringify(built, null, 2)}\n`,
            "utf-8",
        );
        index.push(stripContent(built));
    }

    await writeFile(
        path.join(dir, "index.json"),
        `${JSON.stringify({ name: "fragiola", items: index }, null, 2)}\n`,
        "utf-8",
    );
    console.log(
        `  ✓ ${base.name}${base.default ? " (default)" : ""}: ${items.length} items → ${path.relative(OUTPUT_DIR, dir) || "."}`,
    );
}

/** Whether one of an item's files has a copy in the base. */
function isBaseDependent(item: Item, base: Base): boolean {
    return (item.files ?? []).some((file) =>
        existsSync(baseFilePath(ROOT, base, file.path)),
    );
}

/** Whether one of an item's files is a primitives-backed shared file (bases.ts). */
function isPrimitivesBackedItem(item: Item): boolean {
    return (item.files ?? []).some((file) => isPrimitivesBacked(file.path));
}

/**
 * An item's dependencies on a base: the base's packages first when it needs
 * them, and Fragiola Primitives' on every base when a file is primitives-backed.
 */
function dependenciesFor(item: Item, base: Base): string[] | undefined {
    const added = [
        ...(isBaseDependent(item, base) ? base.dependencies : []),
        ...(isPrimitivesBackedItem(item) ? PRIMITIVES_BACKED_DEPENDENCIES : []),
    ];
    if (!added.length) return item.dependencies;
    return [...new Set([...added, ...(item.dependencies ?? [])])];
}

// An item's keys keep registry.json's order; `dependencies`, when the item
// only gets the base's, goes after the item's description.
function withDependencies(
    item: Item,
    dependencies: string[] | undefined,
): Item {
    if (!dependencies || "dependencies" in item) {
        return dependencies ? { ...item, dependencies } : item;
    }
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(item)) {
        result[key] = value;
        if (key === "description") result.dependencies = dependencies;
    }
    if (!("dependencies" in result)) result.dependencies = dependencies;
    return result as Item;
}

function stripContent(item: Item): Item {
    return {
        ...item,
        files: item.files?.map((f) => ({ ...f, content: undefined })),
    };
}

async function buildItem(item: Item, base: Base): Promise<Item> {
    const files: FileEntry[] = [];
    for (const file of item.files ?? []) {
        const srcPath = resolveBaseFile(ROOT, base, file.path);
        let content: string;
        try {
            content = await readFile(srcPath, "utf-8");
        } catch {
            console.error(`Item "${item.name}": file not found: ${file.path}`);
            process.exit(1);
        }
        files.push({
            ...file,
            content: rewriteImports(content),
        });
    }
    return withDependencies({ ...item, files }, dependenciesFor(item, base));
}

function checkCycles(items: Item[]): void {
    const graph = new Map<string, string[]>();
    for (const item of items) {
        const local = (item.registryDependencies ?? []).flatMap((dep) => {
            const parsed = parseDependency(dep);
            return parsed.kind === "local" ? [parsed.name] : [];
        });
        graph.set(item.name, local);
    }

    const WHITE = 0,
        GRAY = 1,
        BLACK = 2;
    const color = new Map<string, number>();
    for (const name of graph.keys()) color.set(name, WHITE);

    function dfs(node: string, path: string[]): void {
        color.set(node, GRAY);
        for (const dep of graph.get(node) ?? []) {
            const c = color.get(dep);
            if (c === GRAY) {
                console.error(
                    `Dependency cycle detected: ${[...path, dep].join(" → ")}`,
                );
                process.exit(1);
            }
            if (c === WHITE) {
                dfs(dep, [...path, dep]);
            }
        }
        color.set(node, BLACK);
    }

    for (const name of graph.keys()) {
        if (color.get(name) === WHITE) {
            dfs(name, [name]);
        }
    }
}

buildRegistry().catch((err) => {
    console.error(err);
    process.exit(1);
});

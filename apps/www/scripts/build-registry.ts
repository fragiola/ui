import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

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

// ─── Build ──────────────────────────────────────────────────────────────────
const ROOT = process.cwd();
const REGISTRY_JSON = path.join(ROOT, "registry.json");
const OUTPUT_DIR = path.join(ROOT, "public", "r");

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

    // Check for dangling registryDependencies
    const names = new Set(items.map((i) => i.name));
    for (const item of items) {
        for (const dep of item.registryDependencies ?? []) {
            if (!names.has(dep)) {
                console.error(
                    `Item "${item.name}" depends on "${dep}" which is not in the registry.`,
                );
                process.exit(1);
            }
        }
    }

    // Check for dependency cycles
    checkCycles(items);

    // Build each item
    await mkdir(OUTPUT_DIR, { recursive: true });

    // Clean previous output
    try {
        const existing = await readdir(OUTPUT_DIR);
        for (const file of existing) {
            const filePath = path.join(OUTPUT_DIR, file);
            const { unlink } = await import("node:fs/promises");
            await unlink(filePath);
        }
    } catch {
        // directory doesn't exist yet
    }

    const index: Item[] = [];

    for (const item of items) {
        const built = await buildItem(item);
        const outPath = path.join(OUTPUT_DIR, `${item.name}.json`);
        await writeFile(
            outPath,
            JSON.stringify(built, null, 2) + "\n",
            "utf-8",
        );
        index.push(stripContent(built));
        console.log(`  ✓ ${item.name}`);
    }

    // Write index
    const indexPath = path.join(OUTPUT_DIR, "index.json");
    await writeFile(
        indexPath,
        JSON.stringify({ name: "fragiola", items: index }, null, 2) + "\n",
        "utf-8",
    );
    console.log(`  ✓ index (${items.length} items)`);
    console.log(`\nRegistry built to ${path.relative(ROOT, OUTPUT_DIR)}/`);
}

function stripContent(item: Item): Item {
    return {
        ...item,
        files: item.files?.map((f) => ({ ...f, content: undefined })),
    };
}

async function buildItem(item: Item): Promise<Item> {
    const files: FileEntry[] = [];
    for (const file of item.files ?? []) {
        const srcPath = path.join(ROOT, file.path);
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
    return { ...item, files };
}

function checkCycles(items: Item[]): void {
    const graph = new Map<string, string[]>();
    for (const item of items) {
        graph.set(item.name, item.registryDependencies ?? []);
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

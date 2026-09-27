import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { LEVELS } from "../../gallery.ts";
import { examples } from "../src/examples/index.ts";

// Writes manifest.json next to the built app (contract §5.3): every file an
// example shows, once, and one entry per example. Runs after `vite build`,
// into the same EMBED_OUT_DIR. Runs with Node's own type stripping.
//
// The files are published verbatim, `#/` imports included (§6). What the
// reader has to install is derived from them, never listed by hand:
//
//   registry   the item that ships each `#/…` module the file imports, plus
//              a `palette-<name>` item for every palette class it uses —
//              written out, or built as `palette-${name}` from a list of
//              names, in which case every string literal naming a palette
//              counts
//   packages   every bare import except React itself
//
// Anything that does not resolve fails the build: a `#/` import no item
// ships, an unknown level, a docs link that is not base-free.
const APP = path.resolve(import.meta.dirname, "..");
const EXAMPLES_DIR = path.join(APP, "src", "examples");
const REGISTRY = path.resolve(APP, "../../packages/registry");
const OUT = path.resolve(APP, process.env.EMBED_OUT_DIR ?? "dist");

type RegistryJson = {
    items: Array<{ name: string; files?: Array<{ path: string }> }>;
};

const registry = JSON.parse(
    await readFile(path.join(REGISTRY, "registry.json"), "utf-8"),
) as RegistryJson;
const itemByFile = new Map(
    registry.items.flatMap((item) =>
        (item.files ?? []).map((file) => [file.path, item.name] as const),
    ),
);
const itemNames = new Set(registry.items.map((item) => item.name));

// `#/components/ui/select` is what the reader writes as
// `@/components/ui/select`; the registry ships it from `registry/ui/select`.
// Same mapping as the vite alias.
function registryFile(specifier: string): string | undefined {
    const rest = specifier.replace(/^#\/(components\/)?/, "");
    for (const ext of [".tsx", ".ts", "/index.tsx", "/index.ts"]) {
        const file = `registry/${rest}${ext}`;
        if (existsSync(path.join(REGISTRY, file))) return file;
    }
    return undefined;
}

const IMPORT = /(?:from\s+|import\s*\(\s*|import\s+)["']([^"']+)["']/g;
const PALETTE_CLASS = /\bpalette-([a-z]+(?:-[a-z]+)*)\b/g;
const STRING_LITERAL = /["'`]([a-z]+(?:-[a-z]+)*)["'`]/g;

function stripComments(source: string): string {
    return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

function requirements(file: string, source: string) {
    const code = stripComments(source);
    const items = new Set<string>();
    const packages = new Set<string>();
    for (const [, specifier = ""] of code.matchAll(IMPORT)) {
        if (specifier.startsWith("#/")) {
            const shipped = registryFile(specifier);
            const item = shipped && itemByFile.get(shipped);
            if (!item) {
                throw new Error(
                    `${file}: "${specifier}" is not shipped by any registry item`,
                );
            }
            items.add(item);
        } else if (!specifier.startsWith(".")) {
            const name = specifier.startsWith("@")
                ? specifier.split("/").slice(0, 2).join("/")
                : (specifier.split("/")[0] ?? specifier);
            if (name !== "react" && name !== "react-dom") packages.add(name);
        } else {
            throw new Error(
                `${file}: relative import "${specifier}" — an example is one file`,
            );
        }
    }
    const names = [...code.matchAll(PALETTE_CLASS)].map(([, name]) => name);
    if (code.includes("palette-${")) {
        names.push(
            ...[...code.matchAll(STRING_LITERAL)].map(([, name]) => name),
        );
    }
    for (const name of names) {
        if (itemNames.has(`palette-${name}`)) items.add(`palette-${name}`);
    }
    return { registry: [...items].sort(), packages: [...packages].sort() };
}

const levels = new Set<string>(LEVELS.map((level) => level.id));
const ids = new Set<string>();
const files: Record<string, { lang: string; content: string }> = {};

const entries = await Promise.all(
    examples.map(async (example) => {
        const { load: _load, ...meta } = example;
        if (ids.has(meta.id)) throw new Error(`duplicate id "${meta.id}"`);
        ids.add(meta.id);
        if (!levels.has(meta.level)) {
            throw new Error(`${meta.id}: unknown level "${meta.level}"`);
        }
        if (!meta.docs.startsWith("/docs/")) {
            throw new Error(`${meta.id}: docs "${meta.docs}" is not /docs/…`);
        }
        const file = `${meta.id}.tsx`;
        const content = await readFile(path.join(EXAMPLES_DIR, file), "utf-8");
        files[file] = { lang: "tsx", content };
        return { ...meta, files: [file], ...requirements(file, content) };
    }),
);

await writeFile(
    path.join(OUT, "manifest.json"),
    `${JSON.stringify({ files, examples: entries }, null, 4)}\n`,
);
console.log(`manifest.json: ${entries.length} examples → ${OUT}`);

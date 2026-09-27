import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { LEVELS, type Scheme, THEMES } from "../../examples/gallery.ts";
import { PROJECT } from "./project.ts";
import { CONTRACT, type ProjectJson, validateExport } from "./validate.ts";

// `pnpm site:export --base /<slug> --out <dir>` — the site export, contract
// v1 (../www/CONTRACT.md). fragiola.com is built elsewhere; this repo only
// provides:
//
//   <out>/project.json      who this project is
//   <out>/docs/             the pages and the sidebar, from site/docs
//   <out>/examples.json     the gallery's levels and themes (examples/gallery.ts)
//   <out>/embed/react/      the examples app, built for <base>/embed/react/
//   <out>/r/                the registry, built from packages/registry
//
// The output is validated against the contract before the command succeeds
// (validate.ts); any violation exits non-zero. Runs with Node's own type
// stripping: erasable syntax only, relative imports carry their extension.
const ROOT = path.resolve(import.meta.dirname, "../..");
const SLUG = PROJECT.slug;

const { values } = parseArgs({
    options: {
        base: { type: "string" },
        out: { type: "string" },
    },
});
if (values.base === undefined || !values.out) {
    console.error("usage: pnpm site:export --base /<slug> --out <dir>");
    process.exit(1);
}
// "/ui", "/ui/" and "ui" all mean /ui; "" and "/" mean the domain root.
const base = `/${values.base.replace(/^\/+|\/+$/g, "")}`.replace(/^\/$/, "");
// pnpm runs scripts from the package root; a relative --out means relative
// to where the command was typed.
const out = path.resolve(process.env.INIT_CWD ?? process.cwd(), values.out);

// Only ever delete a previous export (§1): a folder that is not one, and is
// not empty, is somebody's data.
if (existsSync(out) && (await readdir(out)).length > 0) {
    let previous: Partial<ProjectJson> = {};
    try {
        previous = JSON.parse(
            await readFile(path.join(out, "project.json"), "utf-8"),
        );
    } catch {}
    // Any contract version: a v0 export has no `contract` field yet.
    if (previous.slug !== SLUG) {
        console.error(
            `site:export: ${out} is not empty and does not hold a previous export — refusing to delete it`,
        );
        process.exit(1);
    }
    await rm(out, { recursive: true });
}
await mkdir(out, { recursive: true });

function run(
    command: string,
    args: string[],
    env: Record<string, string> = {},
) {
    execFileSync(command, args, {
        cwd: ROOT,
        stdio: "inherit",
        env: { ...process.env, ...env },
    });
}

// ─── r/ ─────────────────────────────────────────────────────────────────────
run("node", [
    "packages/registry/scripts/build-registry.ts",
    "--out",
    path.join(out, "r"),
]);

// ─── embed/react ────────────────────────────────────────────────────────────
run("pnpm", ["--filter", "examples-react", "build"], {
    EMBED_BASE: `${base}/embed/react/`,
    EMBED_OUT_DIR: path.join(out, "embed", "react"),
});

// ─── docs ───────────────────────────────────────────────────────────────────
await cp(path.join(ROOT, "site", "docs"), path.join(out, "docs"), {
    recursive: true,
});

// ─── examples.json ──────────────────────────────────────────────────────────
// The swatches are read from the palette files, so they cannot drift from
// what the example renders: the floor, its text, and the blue palette.
const PALETTES = path.join(ROOT, "packages/registry/registry/styles/palettes");

async function role(palette: string, scheme: Scheme, name: string) {
    const css = await readFile(path.join(PALETTES, `${palette}.css`), "utf-8");
    const block = css.match(
        new RegExp(
            `:root\\[data-theme="${scheme}"\\]\\s*\\.palette-${palette}\\s*\\{([^}]*)\\}`,
        ),
    )?.[1];
    const value = block?.match(
        new RegExp(`--palette-${name}:\\s*([^;]+);`),
    )?.[1];
    if (!value) {
        throw new Error(
            `${palette}.css declares no --palette-${name} for ${scheme}`,
        );
    }
    return value.trim();
}

const examplesJson = {
    levels: LEVELS.map(({ id, title }) => ({ id, title })),
    themes: await Promise.all(
        THEMES.map(async (theme) => ({
            ...theme,
            swatch: [
                await role("surface", theme.scheme, "base"),
                await role("surface", theme.scheme, "contrast"),
                await role("blue", theme.scheme, "base"),
            ],
        })),
    ),
};
await writeFile(
    path.join(out, "examples.json"),
    `${JSON.stringify(examplesJson, null, 4)}\n`,
);

// ─── project.json ───────────────────────────────────────────────────────────
// Written last: it is what marks the folder as an export.
await writeFile(
    path.join(out, "project.json"),
    `${JSON.stringify(PROJECT, null, 4)}\n`,
);

// ─── Validate ───────────────────────────────────────────────────────────────
const problems = await validateExport(out);
if (problems.length > 0) {
    console.error(`\nsite:export — ${problems.length} problem(s):`);
    for (const problem of problems) console.error(`  ✗ ${problem}`);
    process.exit(1);
}

const manifest = JSON.parse(
    await readFile(path.join(out, "embed/react/manifest.json"), "utf-8"),
) as { examples: unknown[] };
const pages = (
    await readdir(path.join(out, "docs"), { recursive: true })
).filter((f) => f.endsWith(".mdx"));
const items = JSON.parse(
    await readFile(path.join(out, "r/index.json"), "utf-8"),
) as { items: unknown[] };
console.log(
    `\nsite:export → ${out}\n  base ${base || "/"} · ${pages.length} pages · ${manifest.examples.length} examples · ${items.items.length} registry items · valid (contract v${CONTRACT})`,
);

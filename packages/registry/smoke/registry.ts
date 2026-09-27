// Registry smoke test: install every item with the real shadcn CLI into
// throwaway Next and Vite projects (with and without src/) and check that
// nothing leaves for another registry and every file lands where its imports
// expect it. See smoke/README.md.
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import {
    mkdir,
    mkdtemp,
    readdir,
    readFile,
    rm,
    writeFile,
} from "node:fs/promises";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";

const PACKAGE = path.resolve(import.meta.dirname, "..");
const BUILT_R = path.join(PACKAGE, "dist", "r");
const SHADCN_BIN = path.join(PACKAGE, "node_modules", ".bin", "shadcn");
const KEEP = process.argv.includes("--keep");

type Framework = "next" | "vite";
type Variant = { framework: Framework; src: boolean };

const VARIANTS: Variant[] = [
    { framework: "next", src: true },
    { framework: "next", src: false },
    { framework: "vite", src: true },
    { framework: "vite", src: false },
];

type RegistryFile = { path: string; type: string; target?: string };
type RegistryItem = {
    name: string;
    dependencies?: string[];
    devDependencies?: string[];
    files?: RegistryFile[];
};

// Where a source file must land, relative to the project's source root
// (`src/` or the project root). This mirrors ALIAS_REPLACEMENTS in
// scripts/build-registry.ts — the emitted imports point here, so a file
// anywhere else is a broken install even if the CLI reports success.
const EXPECTED_DIRS: Array<{ from: string; to: string }> = [
    { from: "registry/atoms/", to: "components/atoms/" },
    { from: "registry/families/", to: "components/families/" },
    { from: "registry/ui/", to: "components/ui/" },
    { from: "registry/lib/", to: "lib/" },
    { from: "registry/hooks/", to: "hooks/" },
    { from: "registry/styles/", to: "styles/" },
];

function expectedPath(file: RegistryFile, srcRoot: string): string {
    const dir = EXPECTED_DIRS.find(({ from }) => file.path.startsWith(from));
    if (!dir) throw new Error(`No expected location for ${file.path}`);
    return srcRoot + dir.to + file.path.slice(dir.from.length);
}

// ─── Servers ────────────────────────────────────────────────────────────────
// The registry is served from dist/r. Every other request goes through a
// proxy (HTTP_PROXY/HTTPS_PROXY, honoured by the CLI's fetch) that records and
// refuses it: the registry must install with no other host reachable.

function listen(server: Server): Promise<number> {
    return new Promise((resolve) => {
        server.listen(0, "127.0.0.1", () =>
            resolve((server.address() as AddressInfo).port),
        );
    });
}

function registryServer(missing: string[]): Server {
    return createServer(async (req, res) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        const name = url.pathname.replace(/^\/r\//, "");
        if (!url.pathname.startsWith("/r/") || name.includes("/")) {
            missing.push(url.pathname);
            res.writeHead(404).end();
            return;
        }
        try {
            const body = await readFile(path.join(BUILT_R, name));
            res.writeHead(200, { "content-type": "application/json" }).end(
                body,
            );
        } catch {
            missing.push(url.pathname);
            res.writeHead(404).end();
        }
    });
}

function blockingProxy(external: string[]): Server {
    const server = createServer((req, res) => {
        external.push(req.url ?? "?");
        res.writeHead(403).end();
    });
    server.on("connect", (req, socket) => {
        external.push(`https://${req.url}`);
        socket.end("HTTP/1.1 403 Forbidden\r\n\r\n");
    });
    return server;
}

// ─── Scaffolds ──────────────────────────────────────────────────────────────
// Minimal projects the CLI detects as Next (App Router) or Vite: the config
// file, a tsconfig with the `@/*` path, a CSS entry importing Tailwind v4 and
// a components.json. Every npm dependency the registry declares is already in
// package.json, so the CLI skips `npm install` and the run needs no network.

async function scaffold(
    dir: string,
    variant: Variant,
    registryUrl: string,
    npmDependencies: string[],
): Promise<void> {
    const srcRoot = variant.src ? "src/" : "";
    const css =
        variant.framework === "next"
            ? `${srcRoot}app/globals.css`
            : `${srcRoot}index.css`;

    const files: Record<string, string> = {
        [css]: '@import "tailwindcss";\n',
        "tsconfig.json": json({
            compilerOptions: {
                jsx: variant.framework === "next" ? "preserve" : "react-jsx",
                baseUrl: ".",
                paths: { "@/*": [variant.src ? "./src/*" : "./*"] },
            },
        }),
        "components.json": json({
            $schema: "https://ui.shadcn.com/schema.json",
            style: "new-york",
            rsc: variant.framework === "next",
            tsx: true,
            tailwind: {
                config: "",
                css,
                // Empty on purpose: a base colour makes every `add` fetch
                // ui.shadcn.com/r/colors/<name>.json, which is unrelated
                // to this registry and would mask a real leak.
                baseColor: "",
                cssVariables: true,
                prefix: "",
            },
            aliases: {
                components: "@/components",
                utils: "@/lib/utils",
                ui: "@/components/ui",
                lib: "@/lib",
                hooks: "@/hooks",
            },
            registries: {
                "@fragiola": { url: `${registryUrl}/r/{name}.json` },
            },
        }),
    };

    const dependencies: Record<string, string> = {
        react: "*",
        "react-dom": "*",
    };
    for (const dep of npmDependencies) dependencies[dep] = "*";

    if (variant.framework === "next") {
        dependencies.next = "*";
        files["next.config.mjs"] = "export default {};\n";
        files["postcss.config.mjs"] =
            'export default { plugins: { "@tailwindcss/postcss": {} } };\n';
        files[`${srcRoot}app/layout.tsx`] =
            'import "./globals.css";\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n    return <html lang="en"><body>{children}</body></html>;\n}\n';
        files[`${srcRoot}app/page.tsx`] =
            "export default function Page() {\n    return null;\n}\n";
    } else {
        dependencies.vite = "*";
        dependencies["@tailwindcss/vite"] = "*";
        files["vite.config.ts"] =
            'import tailwindcss from "@tailwindcss/vite";\nimport { defineConfig } from "vite";\n\nexport default defineConfig({ plugins: [tailwindcss()] });\n';
        files["index.html"] =
            `<!doctype html>\n<html lang="en">\n<body><div id="root"></div><script type="module" src="/${srcRoot}main.tsx"></script></body>\n</html>\n`;
        files[`${srcRoot}main.tsx`] = 'import "./index.css";\n';
    }

    files["package.json"] = json({
        name: `smoke-${variant.framework}-${variant.src ? "src" : "root"}`,
        private: true,
        type: "module",
        dependencies,
        devDependencies: { tailwindcss: "^4.0.0", typescript: "*" },
    });

    for (const [file, content] of Object.entries(files)) {
        await mkdir(path.dirname(path.join(dir, file)), { recursive: true });
        await writeFile(path.join(dir, file), content, "utf-8");
    }
}

function json(value: unknown): string {
    return `${JSON.stringify(value, null, 4)}\n`;
}

// ─── Checks ─────────────────────────────────────────────────────────────────

async function snapshot(dir: string): Promise<Map<string, string>> {
    const result = new Map<string, string>();
    async function walk(current: string) {
        for (const entry of await readdir(current, { withFileTypes: true })) {
            if (entry.name === "node_modules") continue;
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) await walk(full);
            else {
                const content = await readFile(full);
                const hash = createHash("sha256").update(content).digest("hex");
                result.set(
                    path.relative(dir, full).split(path.sep).join("/"),
                    hash,
                );
            }
        }
    }
    await walk(dir);
    return result;
}

const IMPORT = /(?:from\s+|import\s*\(\s*|import\s+)["']([^"']+)["']/g;
const EXTENSIONS = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"];

function specifiers(source: string): string[] {
    return [...source.matchAll(IMPORT)].flatMap(([, specifier]) =>
        specifier ? [specifier] : [],
    );
}

// Every `@/…` and relative import in an installed file must resolve to a file
// the install produced (or the scaffold had).
function unresolvedImports(
    files: Map<string, string>,
    installed: string[],
    srcRoot: string,
    readSource: (file: string) => Promise<string>,
): Promise<string[]> {
    return Promise.all(
        installed
            .filter((file) => /\.tsx?$/.test(file))
            .map(async (file) => {
                const broken: string[] = [];
                for (const specifier of specifiers(await readSource(file))) {
                    let base: string;
                    if (specifier.startsWith("@/"))
                        base = srcRoot + specifier.slice(2);
                    else if (specifier.startsWith(".")) {
                        base = path.posix.join(
                            path.posix.dirname(file),
                            specifier,
                        );
                    } else continue;
                    if (!EXTENSIONS.some((ext) => files.has(base + ext))) {
                        broken.push(`${file}: "${specifier}"`);
                    }
                }
                return broken;
            }),
    ).then((lists) => lists.flat());
}

// The scaffold uses shadcn's default aliases, so the CLI has no reason to
// touch an import the registry emitted. It still does: after writing, it
// re-resolves alias imports and can pick another planned file with the same
// basename (e.g. `families/field` → `ui/field.tsx`). That import resolves, so
// only a comparison with the emitted content catches it.
function rewrittenImports(
    emitted: string,
    installed: string,
    file: string,
): string[] {
    const aliased = (source: string) =>
        specifiers(source).filter((specifier) => specifier.startsWith("@/"));
    const before = aliased(emitted);
    const after = aliased(installed);
    return before.flatMap((specifier, i) =>
        after[i] === specifier
            ? []
            : [`${file}: "${specifier}" became "${after[i]}"`],
    );
}

function run(
    command: string,
    args: string[],
    env: NodeJS.ProcessEnv,
): Promise<{ code: number | null; output: string }> {
    return new Promise((resolve) => {
        const child = spawn(command, args, {
            env,
            stdio: ["ignore", "pipe", "pipe"],
        });
        let output = "";
        child.stdout.on("data", (chunk) => {
            output += chunk;
        });
        child.stderr.on("data", (chunk) => {
            output += chunk;
        });
        child.on("close", (code) => resolve({ code, output }));
    });
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
    const registry = JSON.parse(
        await readFile(path.join(PACKAGE, "registry.json"), "utf-8"),
    ) as { items: RegistryItem[] };
    const items = registry.items;
    const npmDependencies = [
        ...new Set(
            items.flatMap((item) => [
                ...(item.dependencies ?? []),
                ...(item.devDependencies ?? []),
            ]),
        ),
    ];

    const missing: string[] = [];
    const external: string[] = [];
    const registryHttp = registryServer(missing);
    const proxy = blockingProxy(external);
    const registryUrl = `http://127.0.0.1:${await listen(registryHttp)}`;
    const proxyUrl = `http://127.0.0.1:${await listen(proxy)}`;

    const env: NodeJS.ProcessEnv = { ...process.env, CI: "1" };
    for (const key of Object.keys(env)) {
        if (/^(https?|all|no)_proxy$/i.test(key)) delete env[key];
    }
    Object.assign(env, {
        HTTP_PROXY: proxyUrl,
        HTTPS_PROXY: proxyUrl,
        http_proxy: proxyUrl,
        https_proxy: proxyUrl,
        NO_PROXY: "127.0.0.1,localhost",
        no_proxy: "127.0.0.1,localhost",
    });

    const workspace = await mkdtemp(path.join(tmpdir(), "fragiola-smoke-"));
    let failed = false;

    for (const variant of VARIANTS) {
        const label = `${variant.framework} ${variant.src ? "with src/" : "without src/"}`;
        const dir = path.join(
            workspace,
            `${variant.framework}-${variant.src ? "src" : "root"}`,
        );
        const srcRoot = variant.src ? "src/" : "";
        missing.length = 0;
        external.length = 0;

        await scaffold(dir, variant, registryUrl, npmDependencies);
        const before = await snapshot(dir);

        const { code, output } = await run(
            SHADCN_BIN,
            [
                "add",
                "--cwd",
                dir,
                "--yes",
                ...items.map((item) => `@fragiola/${item.name}`),
            ],
            env,
        );

        const after = await snapshot(dir);
        const created = [...after.keys()].filter((file) => !before.has(file));
        const modified = [...before.keys()].filter(
            (file) => after.has(file) && after.get(file) !== before.get(file),
        );
        const expected = new Set(
            items.flatMap((item) =>
                (item.files ?? []).map((f) => expectedPath(f, srcRoot)),
            ),
        );
        const misplaced = created.filter((file) => !expected.has(file));
        const absent = [...expected].filter((file) => !after.has(file));
        // The CLI may record the registry in components.json; nothing else
        // the scaffold wrote should change.
        const touched = modified.filter((file) => file !== "components.json");
        const broken = await unresolvedImports(
            after,
            created,
            srcRoot,
            (file) => readFile(path.join(dir, file), "utf-8"),
        );
        const rewritten: string[] = [];
        for (const item of items) {
            const built = JSON.parse(
                await readFile(
                    path.join(BUILT_R, `${item.name}.json`),
                    "utf-8",
                ),
            ) as { files: Array<RegistryFile & { content: string }> };
            for (const file of built.files) {
                const installedPath = expectedPath(file, srcRoot);
                if (!/\.tsx?$/.test(installedPath) || !after.has(installedPath))
                    continue;
                const installed = await readFile(
                    path.join(dir, installedPath),
                    "utf-8",
                );
                rewritten.push(
                    ...rewrittenImports(file.content, installed, installedPath),
                );
            }
        }

        const problems: string[] = [];
        if (code !== 0) problems.push(`shadcn exited with ${code}`);
        for (const url of external) problems.push(`external request: ${url}`);
        for (const url of missing) problems.push(`registry 404: ${url}`);
        for (const file of misplaced) problems.push(`unexpected file: ${file}`);
        for (const file of absent) problems.push(`missing file: ${file}`);
        for (const file of touched)
            problems.push(`modified scaffold file: ${file}`);
        for (const entry of broken)
            problems.push(`unresolved import: ${entry}`);
        for (const entry of new Set(rewritten))
            problems.push(`rewritten import: ${entry}`);

        if (problems.length) {
            failed = true;
            console.log(`✗ ${label}`);
            for (const problem of problems) console.log(`    ${problem}`);
            if (code !== 0) console.log(output.replace(/^/gm, "    | "));
        } else {
            console.log(
                `✓ ${label}: ${items.length} items, ${created.length} files under ${srcRoot || "./"}, no external requests`,
            );
        }
    }

    registryHttp.close();
    proxy.close();
    if (KEEP) console.log(`\nProjects kept in ${workspace}`);
    else await rm(workspace, { recursive: true, force: true });

    if (failed) {
        console.log("\nRegistry smoke test failed.");
        process.exit(1);
    }
    console.log("\nRegistry smoke test passed.");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

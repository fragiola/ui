import path from "node:path";
import type { Plugin, UserConfig } from "vite";
import {
    BASES,
    type Base,
    baseFromEnv,
} from "../../packages/registry/bases.ts";
import { THEMES } from "../gallery.ts";

// How an app renders the registry in place — shared by this app's Vite
// config and apps/playground's, so the two cannot drift.
//
// The examples import the registry the way a reader's project does after
// installing it, with `#/` in place of `@/` (contract §6):
// `#/components/ui/select`, `#/lib/cn`. The registry's own sources import
// each other by their source layout (`#/ui/…`, `#/families/…`). Both
// resolve to packages/registry/registry, read in place, through
// `registryBases` below.
export const REGISTRY = path.resolve(
    import.meta.dirname,
    "../../packages/registry/registry",
);

// Static files a registry item ships to the project root's public/ (the
// `~/public/` target): Dockable's popout host page. Served from the registry
// in place, as a reader's project serves its copy.
export const REGISTRY_PUBLIC = path.join(REGISTRY, "public");

// The registry is authored per base (packages/registry/bases.ts): a file that
// imports a primitive library lives at `registry/bases/<base>/<its path>`,
// every other file at `registry/<its path>`. A `#/` import resolves to the
// selected base's copy when there is one, else to the shared file, so the
// examples are one source on every base. FRAGIOLA_BASE selects the base
// (default: the registry's default base).
export const BASE = baseFromEnv(process.env);

// The dev server can switch base without a restart (the playground's base
// switch): `/__fragiola-base?name=<base>` selects it, every module is
// invalidated, and the page reloads, resolving `#/` against the new base.
// `virtual:registry-bases` tells the page which base it runs on.
export const BASE_SWITCH_PATH = "/__fragiola-base";
const VIRTUAL_BASES = "virtual:registry-bases";

export function registryBases(initial: Base = BASE): Plugin {
    let base = initial;
    const dirs = () => [path.join(REGISTRY, "bases", base.name), REGISTRY];
    return {
        name: "registry-bases",
        enforce: "pre",
        async resolveId(source, importer, options) {
            if (source === VIRTUAL_BASES) return `\0${VIRTUAL_BASES}`;
            const match = /^#\/(?:components\/)?(.*)$/.exec(source);
            if (!match) return null;
            for (const dir of dirs()) {
                const resolved = await this.resolve(
                    path.join(dir, match[1] ?? ""),
                    importer,
                    { ...options, skipSelf: true },
                );
                if (resolved) return resolved;
            }
            return null;
        },
        load(id) {
            if (id !== `\0${VIRTUAL_BASES}`) return null;
            const bases = BASES.map(({ name, title }) => ({ name, title }));
            return `export const BASE = ${JSON.stringify(base.name)};\nexport const BASES = ${JSON.stringify(bases)};\n`;
        },
        configureServer(server) {
            server.middlewares.use(BASE_SWITCH_PATH, (req, res) => {
                const name = new URL(
                    req.url ?? "",
                    "http://localhost",
                ).searchParams.get("name");
                const next = BASES.find((candidate) => candidate.name === name);
                if (!next) {
                    res.statusCode = 400;
                    res.end(`Unknown base "${name}"`);
                    return;
                }
                base = next;
                server.moduleGraph.invalidateAll();
                res.statusCode = 204;
                res.end();
            });
        },
    };
}

export const registryResolve = {
    // The registry's React resolves from its own package; one renderer.
    dedupe: ["react", "react-dom"],
} satisfies UserConfig["resolve"];

// The pre-paint script in index.html needs the theme list before any module
// runs; it is written into the page instead of kept in a second copy.
export function exampleThemes(): Plugin {
    const themes = THEMES.map(({ name, scheme }) => ({ name, scheme }));
    return {
        name: "example-themes",
        transformIndexHtml: (html) =>
            html.replace("__EXAMPLE_THEMES__", JSON.stringify(themes)),
    };
}

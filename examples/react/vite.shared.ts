import path from "node:path";
import type { Plugin, UserConfig } from "vite";
import { THEMES } from "../gallery.ts";

// How an app renders the registry in place — shared by this app's Vite
// config and apps/playground's, so the two cannot drift.
//
// The examples import the registry the way a reader's project does after
// installing it, with `#/` in place of `@/` (contract §6):
// `#/components/ui/select`, `#/lib/cn`. The registry's own sources import
// each other by their source layout (`#/ui/…`, `#/families/…`). Both
// resolve to packages/registry/registry, read in place.
export const REGISTRY = path.resolve(
    import.meta.dirname,
    "../../packages/registry/registry",
);

export const registryResolve = {
    alias: [
        { find: /^#\/components\//, replacement: `${REGISTRY}/` },
        { find: /^#\//, replacement: `${REGISTRY}/` },
    ],
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

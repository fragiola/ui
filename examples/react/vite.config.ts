import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { THEMES } from "../gallery.ts";

// The embed app (contract §5). The examples import the registry the way a
// reader's project does after installing it, with `#/` in place of `@/`
// (§6): `#/components/ui/select`, `#/lib/cn`. The registry's own sources
// import each other by their source layout (`#/ui/…`, `#/families/…`).
// Both resolve to packages/registry/registry, read in place.
//
//   EMBED_BASE      public base, `<base>/embed/react/` in an export
//   EMBED_OUT_DIR   where the build lands (default dist/)
const REGISTRY = path.resolve(
    import.meta.dirname,
    "../../packages/registry/registry",
);

// The pre-paint script in index.html needs the theme list before any module
// runs; it is written into the page instead of kept in a second copy.
function exampleThemes(): Plugin {
    const themes = THEMES.map(({ name, scheme }) => ({ name, scheme }));
    return {
        name: "example-themes",
        transformIndexHtml: (html) =>
            html.replace("__EXAMPLE_THEMES__", JSON.stringify(themes)),
    };
}

export default defineConfig({
    base: process.env.EMBED_BASE ?? "/",
    plugins: [react(), tailwindcss(), exampleThemes()],
    resolve: {
        alias: [
            { find: /^#\/components\//, replacement: `${REGISTRY}/` },
            { find: /^#\//, replacement: `${REGISTRY}/` },
        ],
        // The registry's React resolves from its own package; one renderer.
        dedupe: ["react", "react-dom"],
    },
    build: {
        outDir: process.env.EMBED_OUT_DIR ?? "dist",
        emptyOutDir: true,
        // ECharts is the chart example's own chunk (~1.1 MB), fetched only
        // when that example is shown: every example is a lazy import.
        chunkSizeWarningLimit: 1200,
    },
});

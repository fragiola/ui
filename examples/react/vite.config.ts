import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import {
    exampleThemes,
    REGISTRY_PUBLIC,
    registryBases,
    registryResolve,
} from "./vite.shared.ts";

// The embed app (contract §5). The registry wiring and the theme injection
// live in vite.shared.ts, which apps/playground reads too.
//
//   EMBED_BASE      public base, `<base>/embed/react/` in an export
//   EMBED_OUT_DIR   where the build lands (default dist/)
export default defineConfig({
    base: process.env.EMBED_BASE ?? "/",
    plugins: [registryBases(), react(), tailwindcss(), exampleThemes()],
    resolve: registryResolve,
    publicDir: REGISTRY_PUBLIC,
    build: {
        outDir: process.env.EMBED_OUT_DIR ?? "dist",
        emptyOutDir: true,
        // ECharts is the chart example's own chunk (~1.1 MB), fetched only
        // when that example is shown: every example is a lazy import.
        chunkSizeWarningLimit: 1200,
        // Three pages: the examples (index.html), and the Create page
        // (create.html) with its preview document (create-preview.html),
        // served by fragiola.com at /<slug>/create/ (contract v1.6).
        rollupOptions: {
            input: {
                index: "index.html",
                create: "create.html",
                "create-preview": "create-preview.html",
            },
        },
    },
});

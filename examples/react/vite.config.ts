import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import {
    exampleThemes,
    REGISTRY_PUBLIC,
    registryResolve,
} from "./vite.shared.ts";

// The embed app (contract §5). The registry wiring and the theme injection
// live in vite.shared.ts, which apps/playground reads too.
//
//   EMBED_BASE      public base, `<base>/embed/react/` in an export
//   EMBED_OUT_DIR   where the build lands (default dist/)
export default defineConfig({
    base: process.env.EMBED_BASE ?? "/",
    plugins: [react(), tailwindcss(), exampleThemes()],
    resolve: registryResolve,
    publicDir: REGISTRY_PUBLIC,
    build: {
        outDir: process.env.EMBED_OUT_DIR ?? "dist",
        emptyOutDir: true,
        // ECharts is the chart example's own chunk (~1.1 MB), fetched only
        // when that example is shown: every example is a lazy import.
        chunkSizeWarningLimit: 1200,
    },
});

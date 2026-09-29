import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import {
    exampleThemes,
    registryResolve,
} from "../../examples/react/vite.shared.ts";

// The playground renders the registry in place, exactly as the embed app
// does: the same aliases, the same React, the same theme list, from one
// module. It is never deployed; `build` exists so CI catches a playground
// that no longer compiles.
export default defineConfig({
    plugins: [react(), tailwindcss(), exampleThemes()],
    resolve: registryResolve,
    build: {
        // ECharts is the chart example's own chunk (~1.1 MB), fetched only
        // when that example is shown.
        chunkSizeWarningLimit: 1200,
    },
});

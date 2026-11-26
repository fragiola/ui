import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import {
    exampleThemes,
    REGISTRY_PUBLIC,
    registryBases,
    registryResolve,
} from "../../examples/react/vite.shared.ts";
import { AXES } from "./src/axes.ts";

// The axes' levels for index.html's pre-paint script (src/axes.ts).
const designAxes = (): Plugin => ({
    name: "design-axes",
    transformIndexHtml: (html) =>
        html.replace("__DESIGN_AXES__", JSON.stringify(AXES)),
});

// The playground renders the registry in place, exactly as the embed app
// does: the same aliases, the same React, the same theme list, from one
// module. It is never deployed; `build` exists so CI catches a playground
// that no longer compiles.
export default defineConfig({
    plugins: [
        registryBases(),
        react(),
        tailwindcss(),
        exampleThemes(),
        designAxes(),
    ],
    resolve: registryResolve,
    publicDir: REGISTRY_PUBLIC,
    build: {
        // ECharts is the chart example's own chunk (~1.1 MB), fetched only
        // when that example is shown.
        chunkSizeWarningLimit: 1200,
    },
});

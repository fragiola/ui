import { defineConfig } from "vitest/config";
import {
    registryBases,
    registryResolve,
} from "../../examples/react/vite.shared.ts";

export default defineConfig({
    plugins: [registryBases()],
    resolve: registryResolve,
    test: {
        include: ["tests/**/*.test.ts"],
        testTimeout: 60000,
    },
});

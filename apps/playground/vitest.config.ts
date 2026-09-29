import { defineConfig } from "vitest/config";
import { registryResolve } from "../../examples/react/vite.shared.ts";

export default defineConfig({
    resolve: registryResolve,
    test: {
        include: ["tests/**/*.test.ts"],
        testTimeout: 60000,
    },
});

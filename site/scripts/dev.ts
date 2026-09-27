import { spawn } from "node:child_process";
import path from "node:path";
import { parseArgs } from "node:util";

// `pnpm site:dev --base /<slug> --port <n>` — serves the embed app with hot
// reload under `<base>/embed/react/`, so fragiola.com's dev server can proxy
// `/<slug>/embed/**` to it (contract §1). The pages are read by the site
// from an export; only the examples need a live server.
const ROOT = path.resolve(import.meta.dirname, "../..");

const { values } = parseArgs({
    options: {
        base: { type: "string", default: "/ui" },
        port: { type: "string", default: "5174" },
    },
});
const base = `/${values.base.replace(/^\/+|\/+$/g, "")}`.replace(/^\/$/, "");

const child = spawn(
    "pnpm",
    [
        "--filter",
        "examples-react",
        "exec",
        "vite",
        "--port",
        values.port,
        "--strictPort",
    ],
    {
        cwd: ROOT,
        stdio: "inherit",
        env: { ...process.env, EMBED_BASE: `${base}/embed/react/` },
    },
);
child.on("exit", (code) => process.exit(code ?? 1));
for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, () => child.kill(signal));
}

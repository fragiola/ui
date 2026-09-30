import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { describe, expect, it } from "vitest";

// ─── The sidebar's mobile threshold ─────────────────────────────────────────
// ui/sidebar.tsx decides desktop vs mobile twice: in CSS, with the
// `@2xl/sidebar:` container variant (first paint, no JS), and in JS, with a
// ResizeObserver that decides whether the Drawer mounts. They are one
// decision in two languages; if they drift, a band of widths shows neither
// the desktop sidebar nor a way to open the Drawer.

const ROOT = path.resolve(import.meta.dirname, "..");
const SIDEBAR = path.join(ROOT, "registry", "ui", "sidebar.tsx");

async function tailwindContainer(size: string): Promise<string> {
    const require = createRequire(import.meta.url);
    const theme = await readFile(
        path.join(
            path.dirname(require.resolve("tailwindcss/package.json")),
            "theme.css",
        ),
        "utf-8",
    );
    const value = theme.match(new RegExp(`--container-${size}:\\s*([^;]+);`));
    if (!value?.[1])
        throw new Error(`theme.css declares no --container-${size}`);
    return value[1].trim();
}

describe("sidebar mobile threshold", () => {
    it("the JS threshold equals the container variant the classes use", async () => {
        const source = await readFile(SIDEBAR, "utf-8");
        const constant = source.match(
            /const SIDEBAR_MOBILE_THRESHOLD_REM = (\d+(?:\.\d+)?);/,
        );
        expect(
            constant,
            "SIDEBAR_MOBILE_THRESHOLD_REM not found",
        ).not.toBeNull();

        const sizes = new Set(
            [...source.matchAll(/@([\w-]+)\/sidebar:/g)].map(
                ([, size]) => size,
            ),
        );
        expect([...sizes]).toEqual(["2xl"]);
        expect(await tailwindContainer("2xl")).toBe(`${constant?.[1]}rem`);
    });
});

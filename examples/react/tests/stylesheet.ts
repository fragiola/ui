import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

// Rule 8: a class that does not compile fails silently. An app's Tailwind
// scans the app on its own, and what it renders from outside it — the
// registry, the examples — is only seen through an explicit `@source`. The
// POC showed that without one every class the components use compiles to
// nothing — no build error, no type error, a page of unstyled boxes.
//
// So an app's real stylesheet (compiled from the app's root, as the Vite
// plugin does) is compared with the same stylesheet given every directory
// it renders as an explicit source. Anything the second has and the first
// lacks is a class the app would silently drop. Shared by this app's guard
// and apps/playground's.

function compile(app: string, input: string, output: string) {
    execFileSync(
        "pnpm",
        ["exec", "tailwindcss", "--input", input, "--output", output],
        { cwd: app, stdio: "pipe" },
    );
}

function classSelectors(css: string): Set<string> {
    return new Set(
        [...css.matchAll(/\.((?:\\.|[\w-])+)/g)].map(([, name]) => name ?? ""),
    );
}

export type Stylesheets = {
    /** The app's stylesheet as the app compiles it. */
    real: string;
    /** The classes the reference has and the real one lacks. */
    missing: string[];
};

/**
 * Compiles `stylesheet` (relative to `app`) from the app's root, and again
 * with every directory in `sources` added as an explicit `@source`.
 */
export async function compileStylesheets(
    app: string,
    stylesheet: string,
    sources: string[],
): Promise<Stylesheets> {
    const tmp = await mkdtemp(path.join(app, ".tmp-styles-test-"));
    try {
        compile(app, stylesheet, path.join(tmp, "real.css"));
        const input = path.join(tmp, "reference.css");
        await writeFile(
            input,
            [
                `@import "${path.join(app, stylesheet)}";`,
                ...sources.map((source) => `@source "${source}";`),
                "",
            ].join("\n"),
        );
        compile(app, input, path.join(tmp, "reference.css.out"));
        const real = await readFile(path.join(tmp, "real.css"), "utf-8");
        const reference = await readFile(
            path.join(tmp, "reference.css.out"),
            "utf-8",
        );
        const compiled = classSelectors(real);
        const missing = [...classSelectors(reference)].filter(
            (name) => !compiled.has(name),
        );
        return { real, missing };
    } finally {
        await rm(tmp, { recursive: true, force: true });
    }
}

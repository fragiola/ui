import { execFileSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { BASES, BASES_DIR, type Base } from "../bases.ts";

// `node <registry>/scripts/typecheck-bases.ts` — the `typecheck` script of
// every package that compiles the registry (the registry, the examples, the
// playground). It type-checks the package once per base (bases.ts): for each
// base it writes a tsconfig next to the package's own, whose `#/` paths try
// the base's copy of a file first (`registry/bases/<base>/…`) and then the
// shared one, runs `tsc -p` on it and removes it.
//
// The package's tsconfig.json carries the default base's paths, for editors;
// tests/bases.test.ts checks them. Erasable syntax only (Node type stripping).

type TsConfig = { compilerOptions?: { paths?: Record<string, string[]> } };

const BASE_SEGMENT = new RegExp(`${BASES_DIR.replace("/", "\\/")}\\/[^/]+\\/`);
const REGISTRY_SOURCES = /(^|\/)registry\/\*$/;

/** A `paths` map whose registry entries try `base` first, then the shared file. */
export function pathsForBase(
    paths: Record<string, string[]>,
    base: Base,
): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    for (const [key, targets] of Object.entries(paths)) {
        const shared = targets.filter((target) => !BASE_SEGMENT.test(target));
        result[key] = shared.flatMap((target) =>
            REGISTRY_SOURCES.test(target)
                ? [
                      target.replace(
                          /registry\/\*$/,
                          `${BASES_DIR}/${base.name}/*`,
                      ),
                      target,
                  ]
                : [target],
        );
    }
    return result;
}

function main(): void {
    const cwd = process.cwd();
    const config = JSON.parse(
        readFileSync(path.join(cwd, "tsconfig.json"), "utf-8"),
    ) as TsConfig;
    const paths = config.compilerOptions?.paths ?? {};
    const tsc = path.join(cwd, "node_modules", ".bin", "tsc");
    let failed = false;
    for (const base of BASES) {
        const file = path.join(cwd, `tsconfig.${base.name}.tmp.json`);
        writeFileSync(
            file,
            `${JSON.stringify(
                {
                    extends: "./tsconfig.json",
                    compilerOptions: { paths: pathsForBase(paths, base) },
                },
                null,
                4,
            )}\n`,
        );
        console.log(`typecheck (${base.name})`);
        try {
            execFileSync(tsc, ["--noEmit", "-p", file], { stdio: "inherit" });
        } catch {
            failed = true;
        } finally {
            rmSync(file, { force: true });
        }
    }
    if (failed) process.exit(1);
}

if (import.meta.main) main();

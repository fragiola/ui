import { existsSync } from "node:fs";
import path from "node:path";

// The bases: the primitive libraries the registry's components are built on,
// as shadcn/ui offers Base UI, Radix and React Aria (docs/architecture.md,
// "Bases"). Fragiola has one style, so the base is the registry's only
// dimension.
//
// A file that imports a primitive library is authored once per base, at
// `registry/bases/<base>/<its path>` (`registry/bases/base/ui/dialog.tsx`).
// Every other file is shared and stays at `registry/<its path>`. Sources,
// registry.json and the built items name a file by its logical path
// (`registry/ui/dialog.tsx`); `resolveBaseFile` finds the base's copy.
//
// The UI adapts to each base: a base file differs from its twins only in the
// primitive wiring (imports, prop and type mapping), never in classes,
// families or `data-slot` names, and the base library is never changed to
// match another (tests/bases.test.ts holds the parity).
//
// Runs with Node's own type stripping (the build, the smoke): erasable
// syntax only.

export type Base = {
    /** The base's name: its folder under registry/bases/ and its registry path. */
    name: string;
    title: string;
    /**
     * The npm packages an item gets when one of its files is base-dependent,
     * written as an item's `dependencies` entry (an ecosystem package carries
     * its range, scripts/dependencies.ts).
     */
    dependencies: string[];
    /** The default base is served at the registry's root (`r/`). */
    default?: true;
};

export const BASES: Base[] = [
    {
        name: "base",
        title: "Base UI",
        dependencies: ["@base-ui/react"],
        default: true,
    },
];

export const DEFAULT_BASE: Base = BASES.find((base) => base.default) as Base;

/** Where every base's sources live, relative to the registry package. */
export const BASES_DIR = "registry/bases";

export function findBase(name: string): Base {
    const base = BASES.find((candidate) => candidate.name === name);
    if (!base) {
        throw new Error(
            `Unknown base "${name}". Bases: ${BASES.map((b) => b.name).join(", ")}.`,
        );
    }
    return base;
}

/** The base selected by FRAGIOLA_BASE, or the default one. */
export function baseFromEnv(env: Record<string, string | undefined>): Base {
    const name = env.FRAGIOLA_BASE;
    return name ? findBase(name) : DEFAULT_BASE;
}

/** Where a base's output lands under the registry's output: the default at the root. */
export function baseOutputDir(base: Base): string {
    return base.default ? "" : base.name;
}

/**
 * A logical path (`registry/ui/dialog.tsx`, relative to the registry package)
 * to the file the base builds from: its own copy when it has one, else the
 * shared file.
 */
export function resolveBaseFile(
    root: string,
    base: Base,
    logicalPath: string,
): string {
    const own = baseFilePath(root, base, logicalPath);
    return existsSync(own) ? own : path.join(root, logicalPath);
}

/** The base's own copy of a logical path, whether or not it exists. */
export function baseFilePath(
    root: string,
    base: Base,
    logicalPath: string,
): string {
    const rest = path.relative("registry", logicalPath);
    return path.join(root, BASES_DIR, base.name, rest);
}

/** Every package any base brings (the build swaps them per base). */
export const BASE_PACKAGES: Set<string> = new Set(
    BASES.flatMap((base) =>
        base.dependencies.map((dep) => {
            const at = dep.indexOf("@", dep.startsWith("@") ? 1 : 0);
            return at > 0 ? dep.slice(0, at) : dep;
        }),
    ),
);

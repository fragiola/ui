import {
    BASE_PACKAGES,
    BASES,
    findBase,
    PRIMITIVES_BACKED,
    type PrimitivesBackedFile,
} from "../bases.ts";

// The bases guard (tests/bases.test.ts, docs/architecture.md §5 "Bases"):
// which registry files may import which base's library.
//
// - A base's own file (`bases/<base>/…`) imports its base's library, never
//   another base's.
// - A shared file imports no base library, except the primitives-backed
//   files listed in bases.ts, which import Fragiola Primitives on every base.
// - A listed component wraps a Fragiola Primitives entry Base UI does not
//   ship (its `entry`); one Base UI ships is a per-base pair instead. Beside
//   it, it imports no entry Base UI ships (only `render` and `direction`). The
//   bridge (no `entry`) imports only the direction entry.
//
// Pure: the test feeds it the registry's files, and planted ones.
// Erasable syntax only (Node type stripping).

const IMPORT = /(?:from\s+|import\s*\(\s*|import\s+)["']([^"']+)["']/g;

const PRIMITIVES_PACKAGE = "@fragiola/primitives-react";

// Entries that are no component: a listed file may import them beside its own.
const SHARED_ENTRIES = new Set(["render", "direction"]);

/** The specifiers a source imports (`@fragiola/primitives-react/toggle`). */
export function importSpecifiers(source: string): string[] {
    return [...source.matchAll(IMPORT)].flatMap(([, specifier = ""]) =>
        specifier ? [specifier] : [],
    );
}

/** A specifier's package (`@base-ui/react/dialog` → `@base-ui/react`). */
export function packageOf(specifier: string): string {
    const parts = specifier.split("/");
    return specifier.startsWith("@")
        ? parts.slice(0, 2).join("/")
        : (parts[0] ?? specifier);
}

function packagesOf(baseName: string): Set<string> {
    return new Set(
        findBase(baseName).dependencies.map((dep) => {
            const at = dep.indexOf("@", dep.startsWith("@") ? 1 : 0);
            return at > 0 ? dep.slice(0, at) : dep;
        }),
    );
}

export type BaseImportInput = {
    /** Every registry file, by its path under registry/ (`ui/dialog.tsx`). */
    files: Map<string, string>;
    /** The entries Base UI ships (`toggle`, `dialog`, …: its package.json exports). */
    baseUiEntries: Set<string>;
    /** The allow-list (default: bases.ts's). */
    allowed?: PrimitivesBackedFile[];
};

/** Every import a file may not make, and every list entry that is not justified. */
export function baseImportProblems({
    files,
    baseUiEntries,
    allowed = PRIMITIVES_BACKED,
}: BaseImportInput): string[] {
    const problems: string[] = [];
    const listed = new Map(
        allowed.map((entry) => [entry.file.replace(/^registry\//, ""), entry]),
    );

    for (const [relative, source] of files) {
        const [, owner] = relative.match(/^bases\/([^/]+)\//) ?? [];
        const entry = owner ? undefined : listed.get(relative);
        const own = owner ? packagesOf(owner) : new Set<string>();
        for (const specifier of importSpecifiers(source)) {
            const name = packageOf(specifier);
            if (!BASE_PACKAGES.has(name) || own.has(name)) continue;
            if (entry && name === PRIMITIVES_PACKAGE) continue;
            problems.push(
                owner || name !== PRIMITIVES_PACKAGE
                    ? `registry/${relative} imports ${name}`
                    : `registry/${relative} imports ${name} but is not on the primitives-backed list (bases.ts)`,
            );
        }
    }

    for (const [relative, entry] of listed) {
        const source = files.get(relative);
        if (source === undefined) {
            problems.push(
                `registry/${relative} is on the primitives-backed list but is not a shared file`,
            );
            continue;
        }
        if (!entry.reason.trim()) {
            problems.push(`registry/${relative}: the list names no reason`);
        }
        for (const base of BASES) {
            if (files.has(`bases/${base.name}/${relative}`)) {
                problems.push(
                    `registry/${relative} is primitives-backed but has a copy in bases/${base.name}/`,
                );
            }
        }
        const entries = importSpecifiers(source)
            .filter((specifier) => packageOf(specifier) === PRIMITIVES_PACKAGE)
            .map((specifier) => specifier.slice(PRIMITIVES_PACKAGE.length + 1));
        if (entry.entry === undefined) {
            const others = entries.filter((name) => name !== "direction");
            if (others.length) {
                problems.push(
                    `registry/${relative} is the bridge and may import only ${PRIMITIVES_PACKAGE}/direction (it imports ${others.join(", ")})`,
                );
            }
            continue;
        }
        if (baseUiEntries.has(entry.entry)) {
            problems.push(
                `registry/${relative}: Base UI ships "${entry.entry}", so it is a per-base pair, not primitives-backed`,
            );
        }
        const served = entries.filter(
            (name) =>
                name !== entry.entry &&
                !SHARED_ENTRIES.has(name) &&
                baseUiEntries.has(name),
        );
        if (served.length) {
            problems.push(
                `registry/${relative} imports ${served.map((name) => `${PRIMITIVES_PACKAGE}/${name}`).join(", ")}, which Base UI ships: compose the registry's own component instead`,
            );
        }
        if (!entries.includes(entry.entry)) {
            problems.push(
                `registry/${relative} does not import ${PRIMITIVES_PACKAGE}/${entry.entry}, the entry the list names`,
            );
        }
    }
    return problems;
}

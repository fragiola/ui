import { readFile } from "node:fs/promises";
import path from "node:path";
import { BASES, resolveBaseFile } from "../bases";

// A registry file as every base builds it (bases.ts): the base's own copy
// when it has one, else the shared file. A test that pins a file's content
// pins it on every base.

const ROOT = path.resolve(import.meta.dirname, "..");

export type BaseSource = { base: string; label: string; source: string };

/** `name` is the file's path under registry/ (`ui/tabs.tsx`). */
export async function everyBase(name: string): Promise<BaseSource[]> {
    return Promise.all(
        BASES.map(async (base) => ({
            base: base.name,
            label: `${name} (${base.name})`,
            source: await readFile(
                resolveBaseFile(ROOT, base, path.join("registry", name)),
                "utf-8",
            ),
        })),
    );
}

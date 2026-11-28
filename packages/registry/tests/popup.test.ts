import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { popup } from "../registry/families/popup";

// ─── The popup family ───────────────────────────────────────────────────────
// Every popup (menus, select, combobox, popover, the pickers, the hover card,
// the command palette's lists) is `popup.content`. Its stacking and its
// focus outline are the box's own: they used to be passed as an argument,
// `popup.content("z-50 outline-none")`, which tailwind-variants ignores (a
// member takes `{ class }`), so every popup silently lost them (Epic #166).
// This pins the box, and refuses a family member called with a bare string
// anywhere in the sources a reader copies or the playground runs.

const ROOT = path.resolve(import.meta.dirname, "../../..");
const DIRS = [
    "packages/registry/registry",
    "examples/react/src",
    "apps/playground/src",
];

async function sources(dir: string): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true });
    const files: string[] = [];
    for (const entry of entries) {
        if (entry.name === "node_modules") continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) files.push(...(await sources(full)));
        else if (/\.tsx?$/.test(entry.name)) files.push(full);
    }
    return files;
}

// Every member of every family, as `family.member`.
async function familyMembers(): Promise<string[]> {
    const dir = path.join(ROOT, "packages/registry/registry/families");
    const members: string[] = [];
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        if (!entry.isFile() || !/\.tsx?$/.test(entry.name)) continue;
        const module = (await import(path.join(dir, entry.name))) as Record<
            string,
            unknown
        >;
        for (const [name, value] of Object.entries(module)) {
            if (!value || typeof value !== "object") continue;
            for (const [member, fn] of Object.entries(value)) {
                if (typeof fn === "function") members.push(`${name}.${member}`);
            }
        }
    }
    return members;
}

describe("popup family", () => {
    it("content carries its stacking and drops the browser outline", () => {
        const classes = popup.content().split(/\s+/);
        expect(classes).toContain("z-50");
        expect(classes).toContain("outline-none");
    });

    it("no source calls a family member with a string (tailwind-variants ignores it)", async () => {
        const members = await familyMembers();
        expect(members).toContain("popup.content");
        const call = new RegExp(
            `\\b(?:${members.map((m) => m.replace(".", "\\.")).join("|")})\\(\\s*["'\`]`,
        );
        const offenders: string[] = [];
        for (const dir of DIRS) {
            for (const file of await sources(path.join(ROOT, dir))) {
                const source = await readFile(file, "utf-8");
                source.split("\n").forEach((line, i) => {
                    if (/^\s*\/\//.test(line)) return;
                    if (call.test(line)) {
                        offenders.push(
                            `${path.relative(ROOT, file)}:${i + 1}: ${line.trim()}`,
                        );
                    }
                });
            }
        }
        expect(offenders).toEqual([]);
    });
});

// ─── Keyframe exits hold their last frame ───────────────────────────────────
// tw-animate-css's `animate-out` fills with `var(--tw-animation-fill-mode,
// none)`: once the exit ends, the element is back at its resting style
// (opacity 1) until the base unmounts it. Fragiola Primitives 0.2.0 unmounted
// a paint later, so every popup reappeared for a frame (Epic #186); 0.3.0
// unmounts before the next paint, but the rule stays base-agnostic, so a
// base that unmounts late can never flash again. Every
// class string with an `animate-out` therefore also carries
// `fill-mode-forwards` under the same variant (gated on `data-closed`, so
// the fill never leaks into the next open). `check:embeds` measures it.

// The exits of one class string that do not hold their last frame.
function unheldExits(literal: string): string[] {
    const tokens = literal.split(/\s+/).filter(Boolean);
    return tokens
        .filter((token) => token.endsWith("animate-out"))
        .filter(
            (token) =>
                !tokens.includes(
                    `${token.slice(0, -"animate-out".length)}fill-mode-forwards`,
                ),
        );
}

describe("keyframe exits", () => {
    it("the guard refuses an exit without fill-mode-forwards", () => {
        expect(
            unheldExits("data-closed:animate-out data-closed:fade-out-0"),
        ).toEqual(["data-closed:animate-out"]);
        expect(
            unheldExits("data-closed:animate-out data-open:fill-mode-forwards"),
        ).toEqual(["data-closed:animate-out"]);
        expect(
            unheldExits(
                "data-closed:animate-out data-closed:fill-mode-forwards",
            ),
        ).toEqual([]);
    });

    it("popup.content holds its exit", () => {
        expect(unheldExits(popup.content())).toEqual([]);
        expect(popup.content().split(/\s+/)).toContain(
            "data-closed:animate-out",
        );
    });

    it("every animate-out in the sources holds its last frame", async () => {
        const offenders: string[] = [];
        let exits = 0;
        for (const dir of DIRS) {
            for (const file of await sources(path.join(ROOT, dir))) {
                const source = await readFile(file, "utf-8");
                for (const match of source.matchAll(
                    /"([^"\n]*)"|'([^'\n]*)'|`([^`]*)`/g,
                )) {
                    const literal = match[1] ?? match[2] ?? match[3] ?? "";
                    if (!literal.includes("animate-out")) continue;
                    exits++;
                    for (const token of unheldExits(literal)) {
                        const line = source
                            .slice(0, match.index)
                            .split("\n").length;
                        offenders.push(
                            `${path.relative(ROOT, file)}:${line}: ${token}`,
                        );
                    }
                }
            }
        }
        // popup.content and the navigation menu's backdrop on each base.
        expect(exits).toBeGreaterThanOrEqual(3);
        expect(offenders).toEqual([]);
    });
});

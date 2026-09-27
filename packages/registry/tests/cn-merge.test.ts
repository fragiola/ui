import { describe, expect, it } from "vitest";
import { cn } from "../registry/lib/cn";
import { readPaletteNames } from "./palette-utils";

// ─── cn() palette merge guard ───────────────────────────────────────────────
// This is the test that protects the whole Epic: for every ordered pair of
// palette classes, cn(a, b) returns only b. tailwind-merge needs to know that
// both classes belong to one group so the later wins. A palette absent from
// the list in cn.ts leaves both classes in the output, source order wins, and
// the component silently stays the earlier palette.
//
// The prefix-sharing pairs (surface / surface-purple) are exactly where
// tailwind-merge's trie can surprise you — they are included explicitly.

describe("cn() palette merge", () => {
    it("cn(palette-a, palette-b) resolves to only palette-b for every pair", async () => {
        const palettes = await readPaletteNames();
        const failures: string[] = [];
        for (const a of palettes) {
            for (const b of palettes) {
                if (a === b) continue;
                const result = cn(`palette-${a}`, `palette-${b}`);
                // The result must contain palette-b and NOT palette-a. Using
                // word-boundary split so palette-surface does not match as a
                // substring of palette-surface-rose.
                const classList = result.split(/\s+/);
                if (!classList.includes(`palette-${b}`)) {
                    failures.push(`palette-${a} → palette-${b}: missing b`);
                }
                if (classList.includes(`palette-${a}`)) {
                    failures.push(`palette-${a} → palette-${b}: a survived`);
                }
            }
        }
        expect(failures, `Merge failures:\n${failures.join("\n")}`).toEqual([]);
    });

    it("cn(palette-surface, palette-surface-purple) resolves to palette-surface-purple", () => {
        // The prefix-sharing pair — surface must not match surface-purple in
        // the merge group, and vice versa.
        expect(cn("palette-surface", "palette-surface-purple")).toBe(
            "palette-surface-purple",
        );
        expect(cn("palette-surface-purple", "palette-surface")).toBe(
            "palette-surface",
        );
    });

    it("cn(palette-surface, palette-surface-blue) resolves to palette-surface-blue", () => {
        expect(cn("palette-surface", "palette-surface-blue")).toBe(
            "palette-surface-blue",
        );
    });

    it("cn(palette-blue, palette-danger) resolves to palette-danger", () => {
        expect(cn("palette-blue", "palette-danger")).toBe("palette-danger");
    });

    it("cn resolves a palette class against the hardcoded palette-raised in popup/layer", () => {
        // popup.content and layer.panel hardcode palette-raised. A consumer
        // passing a different palette must win.
        expect(cn("palette-raised", "palette-surface-purple")).toBe(
            "palette-surface-purple",
        );
        expect(cn("palette-raised", "palette-blue")).toBe("palette-blue");
    });

    it("cn preserves non-palette classes alongside palette classes", () => {
        const result = cn("px-4 py-2", "palette-blue", "rounded-sm");
        expect(result).toContain("palette-blue");
        expect(result).toContain("px-4");
        expect(result).toContain("py-2");
        expect(result).toContain("rounded-sm");
    });
});

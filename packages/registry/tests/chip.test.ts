import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { chip } from "../registry/families/chip";
import { foundation } from "../registry/families/foundation";

// ─── The chip family ────────────────────────────────────────────────────────
// A value shown as a small tag (Epic #172). Zero variants. A Combobox's
// chips, a Tags Input's tags and a Tag Group's tags are one chip: they
// compose the family's members and never write the chip's look themselves
// (the Epic's risk: duplicated chip styling).

const ROOT = path.resolve(import.meta.dirname, "..");

const classes = (member: () => string) => member().split(/\s+/).filter(Boolean);

const contains = (member: () => string, of: () => string) => {
    const own = classes(member);
    return classes(of).every((c) => own.includes(c));
};

describe("chip family", () => {
    it("has zero variants", () => {
        for (const [name, member] of Object.entries(chip)) {
            const variants = (member as { variants?: object }).variants ?? {};
            expect(Object.keys(variants), name).toEqual([]);
        }
    });

    it("is a soft badge with the badge's type", () => {
        for (const c of ["bg-palette-soft", "text-xs", "font-medium"]) {
            expect(classes(chip.item)).toContain(c);
        }
    });

    it("rings a chip for itself, and around its in-place edit", () => {
        expect(contains(chip.item, foundation.focus)).toBe(true);
        expect(contains(chip.item, foundation.focusNested)).toBe(true);
    });

    it("makes a Tag Group's tag a chip that is checked when chosen", () => {
        expect(contains(chip.tag, chip.item)).toBe(true);
        expect(contains(chip.tag, foundation.checked)).toBe(true);
        expect(contains(chip.tag, foundation.disabled)).toBe(true);
    });

    it("is the only home of the chip's look", async () => {
        const users = {
            "registry/bases/primitives/ui/combobox.tsx": [
                "chip.group()",
                "chip.item()",
                "chip.remove()",
            ],
            "registry/bases/base/ui/combobox.tsx": [
                "chip.group()",
                "chip.item()",
                "chip.remove()",
            ],
            "registry/ui/combobox-virtual.tsx": [
                "chip.group()",
                "chip.item()",
                "chip.remove()",
            ],
            "registry/ui/tags-input.tsx": [
                "chip.group()",
                "chip.item()",
                "chip.remove()",
                "chip.input()",
            ],
            "registry/ui/tag-group.tsx": [
                "chip.group()",
                "chip.tag()",
                "chip.remove()",
            ],
        };
        for (const [file, members] of Object.entries(users)) {
            const text = await readFile(path.join(ROOT, file), "utf-8");
            for (const member of members) {
                expect(text, `${file}: ${member}`).toContain(member);
            }
            // the chip's fill, written in place, is a copy of the family
            expect(text, file).not.toMatch(/["'`\s]bg-palette-soft\b/);
        }
    });
});

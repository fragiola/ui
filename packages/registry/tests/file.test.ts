import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { file } from "../registry/families/file";
import { foundation } from "../registry/families/foundation";
import { tile } from "../registry/families/tile";

// ─── The file family ────────────────────────────────────────────────────────
// Dropping and listing files (Epic #172). Zero variants. The drop target's
// drag-over is the libraries' drop outline (dashed `ring`, Grid Layout's
// placeholder), a file is a control box, and a rejected file is
// `palette-danger` added from its state.

const ROOT = path.resolve(import.meta.dirname, "..");

const classes = (member: () => string) => member().split(/\s+/).filter(Boolean);

const contains = (member: () => string, of: () => string) => {
    const own = classes(member);
    return classes(of).every((c) => own.includes(c));
};

describe("file family", () => {
    it("has zero variants", () => {
        for (const [name, member] of Object.entries(file)) {
            const variants = (member as { variants?: object }).variants ?? {};
            expect(Object.keys(variants), name).toEqual([]);
        }
    });

    it("draws the drag-over as the libraries' dashed ring drop outline", () => {
        const own = classes(file.dropZone);
        expect(own).toContain("border-dashed");
        expect(own).toContain("data-drop-target:border-palette-ring");
        expect(own).toContain("data-drop-target:bg-palette-ring/15");
        // the same stroke and fill as Grid Layout's placeholder
        expect(classes(tile.placeholder)).toEqual(
            expect.arrayContaining([
                "border-dashed",
                "border-palette-ring",
                "bg-palette-ring/15",
            ]),
        );
    });

    it("speaks the foundation on the drop target", () => {
        for (const member of [
            foundation.focus,
            foundation.hover,
            foundation.disabled,
        ]) {
            expect(contains(file.dropZone, member)).toBe(true);
        }
    });

    it("makes a file a control box, red by palette when rejected", () => {
        expect(contains(file.item, foundation.box)).toBe(true);
        expect(file.rejected()).toBe("palette-danger");
    });

    it("dresses Drop Zone's target and File Upload's Dropzone alike", async () => {
        for (const name of ["drop-zone", "file-upload"]) {
            const text = await readFile(
                path.join(ROOT, `registry/ui/${name}.tsx`),
                "utf-8",
            );
            expect(text, name).toContain("file.dropZone()");
            expect(text, name).toContain("file.icon()");
        }
    });
});

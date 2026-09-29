import { describe, expect, it } from "vitest";
import { LEVELS } from "../../../examples/gallery.ts";
import { examples } from "../../../examples/react/src/examples/index.ts";
import { entries, findEntry, sections } from "../src/catalog.ts";

describe("the catalog", () => {
    it("lists every example once, from examples/react's own list", () => {
        const listed = entries
            .filter((e) => e.kind === "example")
            .map((e) => e.id)
            .sort();
        expect(listed).toEqual(examples.map((e) => e.id).sort());
    });

    it("groups each section by level, in the docs' order", () => {
        const order = LEVELS.map((l) => l.id);
        for (const section of sections) {
            const levels = section.groups.map((g) => g.level);
            expect(levels).toEqual(order.filter((l) => levels.includes(l)));
        }
    });

    it("orders examples within a level by `order`", () => {
        const example = sections.find((s) => s.kind === "example");
        for (const group of example?.groups ?? []) {
            const orders = group.entries.map(
                (e) => examples.find((x) => x.id === e.id)?.order ?? 0,
            );
            expect(orders).toEqual([...orders].sort((a, b) => a - b));
        }
    });

    it("reads every entry's source file", async () => {
        for (const entry of entries) {
            const source = await entry.source();
            expect(source, entry.file).toContain("export default");
        }
    });

    it("finds an entry by kind and id, and nothing for an unknown one", () => {
        expect(findEntry({ kind: "example", id: "dialog" })?.title).toBe(
            "Dialog",
        );
        expect(findEntry({ kind: "example", id: "nope" })).toBeUndefined();
        expect(findEntry(null)).toBeUndefined();
    });
});

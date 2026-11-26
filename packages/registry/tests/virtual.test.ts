import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

// ─── The virtual twins ──────────────────────────────────────────────────────
// A virtual list is primitives-backed (Fragiola Primitives' component on
// every base) and must look like its twin (Epic #166): the same family
// members in the same parts, and the same classes where a part spells its
// own layout. The twin of Select, Combobox and Autocomplete is the default
// base's file, which wraps the same primitive; Command's and Listbox's twin
// is the shared file itself.

const REGISTRY = path.resolve(import.meta.dirname, "../registry");
const read = (name: string) => readFile(path.join(REGISTRY, name), "utf-8");

// Every `className={cn(...)}` of a part, by its data-slot, as written.
function classesBySlot(source: string): Map<string, string> {
    const found = new Map<string, string>();
    const parts = source.split(/data-slot=/).slice(1);
    for (const part of parts) {
        const slot = part.match(/^["{`]([^"}`]+)/)?.[1];
        const classes = part.match(/className=\{cn\(([\s\S]*?)className/)?.[1];
        if (slot && classes && !found.has(slot)) {
            found.set(slot, classes.replace(/\s+/g, " ").trim());
        }
    }
    return found;
}

const TWINS: { virtual: string; twin: string }[] = [
    {
        virtual: "ui/select-virtual.tsx",
        twin: "bases/primitives/ui/select.tsx",
    },
    {
        virtual: "ui/combobox-virtual.tsx",
        twin: "bases/primitives/ui/combobox.tsx",
    },
    {
        virtual: "ui/autocomplete-virtual.tsx",
        twin: "bases/primitives/ui/autocomplete.tsx",
    },
];

describe("virtual twins", () => {
    for (const { virtual, twin } of TWINS) {
        it(`${virtual} dresses every part as ${twin} does`, async () => {
            const mine = classesBySlot(await read(virtual));
            const theirs = classesBySlot(await read(twin));
            expect(mine.size).toBeGreaterThan(3);
            for (const [slot, classes] of mine) {
                // The list is the virtual one's own part (a flow column).
                if (slot.endsWith("-list")) continue;
                expect(theirs.get(slot), slot).toBe(classes);
            }
        });
    }

    it("CommandVirtual.List has Command.List's classes", async () => {
        const command = await read("ui/command.tsx");
        const virtual = await read("ui/command-virtual.tsx");
        const list = command.match(
            /data-slot="command-list"[\s\S]*?cn\(\s*"([^"]+)"/,
        )?.[1];
        expect(list).toBeTruthy();
        expect(virtual).toContain(`"${list}"`);
    });

    it("ListboxVirtual's root is Listbox's, its rows Listbox.Item", async () => {
        const virtual = await read("ui/listbox-virtual.tsx");
        expect(virtual).toContain("menu.list()");
        expect(virtual).toContain("Item: Listbox.Item");
        expect(await read("ui/listbox.tsx")).toContain("menu.list()");
    });
});

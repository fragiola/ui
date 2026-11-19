import type { ItemOf, TreeJson } from "@fragiola/tree-react";
import { selection } from "@fragiola/tree-react/selection";
import { typeAhead } from "@fragiola/tree-react/type-ahead";
import { virtualization } from "@fragiola/tree-react/virtualization";
import { FileIcon, FolderIcon } from "lucide-react";
import { Tree } from "#/components/ui/tree";

// A large virtualized tree: 500 folders of 40 files, all expanded — 20 500
// rows, a few dozen in the DOM. The same tree under compact, default and
// spacious density: a row's height follows the spacing scale, so the rows
// are measured (`estimateRowSize`), not fixed. Scroll, or Tab in and use
// End, Home, PageDown / PageUp and type-ahead: the focus moves to rows not
// rendered yet, which scroll into view.

type Types = { items: { folder: undefined; file: undefined } };

const features = [
    selection({ mode: "multiple" }),
    typeAhead(),
    virtualization({ estimateRowSize: 32 }),
] as const;

function largeTree(): TreeJson<Types> {
    const items: TreeJson<Types>["items"] = {};
    const rootItemIds: string[] = [];
    for (let f = 0; f < 500; f++) {
        const id = `folder-${f}`;
        const childItemIds: string[] = [];
        for (let i = 0; i < 40; i++) {
            const child = `${id}-file-${i}`;
            childItemIds.push(child);
            items[child] = { kind: "file", label: `file ${f}.${i}.ts` };
        }
        items[id] = { kind: "folder", label: `folder ${f}`, childItemIds };
        rootItemIds.push(id);
    }
    return { version: 1, rootItemIds, items, expandedItemIds: rootItemIds };
}

// Read once by each root, at mount.
const json = largeTree();

const densities = ["compact", "default", "spacious"] as const;

export default function TreeLarge() {
    return (
        <div className="grid w-[54rem] max-w-full grid-cols-1 gap-4 sm:grid-cols-3">
            {densities.map((density) => (
                <figure
                    key={density}
                    className="flex flex-col gap-1"
                    data-density={density === "default" ? undefined : density}
                >
                    <figcaption className="text-xs text-palette-accent/85">
                        density {density}
                    </figcaption>
                    <Tree.Root<Types, typeof features>
                        defaultTree={json}
                        features={features}
                        aria-label={`Large tree, ${density}`}
                        className="h-80 overflow-auto rounded-lg border border-palette-line"
                    >
                        <Tree.VirtualItems<Types>>
                            {(item) => <Row item={item} />}
                        </Tree.VirtualItems>
                    </Tree.Root>
                </figure>
            ))}
        </div>
    );
}

// A row: no Group, a virtualized tree is flat.
function Row({ item }: { item: ItemOf<Types> }) {
    return (
        <Tree.Item item={item} aria-label={item.label}>
            <Tree.ItemContent>
                <Tree.Toggle />
                {item.kind === "folder" ? (
                    <FolderIcon aria-hidden />
                ) : (
                    <FileIcon aria-hidden />
                )}
                <Tree.Label>{item.label}</Tree.Label>
            </Tree.ItemContent>
        </Tree.Item>
    );
}

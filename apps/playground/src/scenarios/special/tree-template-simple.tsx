import type { LoadChildren, TreeJson } from "@fragiola/tree-react";
import { asyncChildren } from "@fragiola/tree-react/async-children";
import { checkboxes } from "@fragiola/tree-react/checkboxes";
import { dragAndDrop } from "@fragiola/tree-react/drag-and-drop";
import { rename } from "@fragiola/tree-react/rename";
import { selection } from "@fragiola/tree-react/selection";
import { typeAhead } from "@fragiola/tree-react/type-ahead";
import { virtualization } from "@fragiola/tree-react/virtualization";
import { Tree } from "#/components/ui/tree";

// Tree.Template.Simple under four sets of features: what it renders follows
// the model's features, never a prop. "Everything": selection, type-ahead,
// checks (a box per row), rename (F2) and drag and drop (the indicator).
// "Async": the loading row, then a load error with Retry ("Shared" fails
// once). "Virtualized": 2 000 rows, flat. "Empty": the empty row. Use the
// keyboard on each: arrows, Home, End, `*`, type-ahead, Enter.

type Types = { items: { folder: undefined; file: undefined } };

const everything = [
    selection({ mode: "multiple" }),
    typeAhead(),
    checkboxes(),
    rename(),
    // the line starts past the toggle, at the box: 4 + 8 + 16 + 8 pixels
    dragAndDrop({ indicatorInset: 36 }),
] as const;

const json: TreeJson<Types> = {
    version: 1,
    settings: { renamable: true },
    rootItemIds: ["src", "docs", "readme"],
    items: {
        src: { kind: "folder", label: "src", childItemIds: ["app", "main"] },
        app: { kind: "file", label: "app.tsx" },
        main: { kind: "file", label: "main.tsx" },
        docs: { kind: "folder", label: "docs", childItemIds: ["guide"] },
        guide: { kind: "file", label: "guide.md" },
        readme: { kind: "file", label: "README.md" },
    },
    expandedItemIds: ["src"],
};

const asyncFeatures = [selection(), asyncChildren()] as const;

const remote: TreeJson<Types> = {
    version: 1,
    rootItemIds: ["photos", "shared"],
    items: {
        photos: { kind: "folder", label: "Photos", childrenStatus: "unloaded" },
        shared: { kind: "folder", label: "Shared", childrenStatus: "unloaded" },
    },
};

let failed = false;
const loadChildren: LoadChildren<Types> = async (item) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    if (item.id === "shared" && !failed) {
        failed = true;
        throw new Error("HTTP 503");
    }
    return [
        { kind: "file", label: `${item.label} 1.jpg` },
        { kind: "file", label: `${item.label} 2.jpg` },
    ];
};

const virtualFeatures = [
    selection(),
    typeAhead(),
    virtualization({ estimateRowSize: 32 }),
] as const;

const large: TreeJson<Types> = (() => {
    const items: TreeJson<Types>["items"] = {};
    const rootItemIds: string[] = [];
    for (let f = 0; f < 100; f++) {
        const childItemIds = Array.from({ length: 19 }, (_, i) => {
            const id = `f${f}-${i}`;
            items[id] = { kind: "file", label: `file ${f}.${i}` };
            return id;
        });
        items[`f${f}`] = { kind: "folder", label: `folder ${f}`, childItemIds };
        rootItemIds.push(`f${f}`);
    }
    return { version: 1, rootItemIds, items, expandedItemIds: rootItemIds };
})();

const frame = "rounded-lg border border-palette-line";

export default function TreeTemplateSimple() {
    return (
        <div className="grid w-[48rem] max-w-full grid-cols-1 gap-6 sm:grid-cols-2">
            <section className="flex flex-col gap-1">
                <h2 className="text-xs text-palette-accent/85">Everything</h2>
                <Tree.Template.Simple<Types, typeof everything>
                    defaultTree={json}
                    features={everything}
                    aria-label="Everything"
                    className={frame}
                />
            </section>
            <section className="flex flex-col gap-1">
                <h2 className="text-xs text-palette-accent/85">Async</h2>
                <Tree.Template.Simple<Types, typeof asyncFeatures>
                    defaultTree={remote}
                    features={asyncFeatures}
                    loadChildren={loadChildren}
                    announce={(event) =>
                        event.type === "load-error"
                            ? "Could not load this folder."
                            : undefined
                    }
                    aria-label="Async"
                    className={frame}
                />
            </section>
            <section className="flex flex-col gap-1">
                <h2 className="text-xs text-palette-accent/85">Virtualized</h2>
                <Tree.Template.Simple<Types, typeof virtualFeatures>
                    defaultTree={large}
                    features={virtualFeatures}
                    aria-label="Virtualized"
                    className={`h-64 overflow-auto ${frame}`}
                />
            </section>
            <section className="flex flex-col gap-1">
                <h2 className="text-xs text-palette-accent/85">Empty</h2>
                <Tree.Template.Simple<Types>
                    defaultTree={{ version: 1, rootItemIds: [], items: {} }}
                    aria-label="Empty"
                    empty="Nothing in this folder"
                    className={frame}
                />
            </section>
        </div>
    );
}

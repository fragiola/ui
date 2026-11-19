import { type ItemOf, type TreeJson, useTreeState } from "@fragiola/tree-react";
import { selection } from "@fragiola/tree-react/selection";
import { typeAhead } from "@fragiola/tree-react/type-ahead";
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
import { Tree } from "#/components/ui/tree";

// The parts assembled by hand: a file tree with multiple selection and
// type-ahead, an icon per kind, a disabled item and an empty tree. Click
// (Shift extends, Ctrl/Cmd toggles), or Tab in and use the arrows, Home,
// End, `*`, Enter / Space, Shift+arrows, Ctrl/Cmd+A, and type a name
// ("re" finds README.md). The ring is on the focused row; selected rows take
// the `soft` fill. Theme, direction and the design axes come from the
// toolbar.

type Types = { items: { folder: undefined; file: undefined } };

const features = [selection({ mode: "multiple" }), typeAhead()] as const;

const json: TreeJson<Types> = {
    version: 1,
    rootItemIds: ["src", "public", "locked", "package", "readme"],
    items: {
        src: {
            kind: "folder",
            label: "src",
            childItemIds: ["components", "app", "main"],
        },
        components: {
            kind: "folder",
            label: "components",
            childItemIds: ["button", "tree-view"],
        },
        button: { kind: "file", label: "button.tsx" },
        "tree-view": { kind: "file", label: "tree-view.tsx" },
        app: { kind: "file", label: "app.tsx" },
        main: { kind: "file", label: "main.tsx" },
        public: {
            kind: "folder",
            label: "public",
            childItemIds: ["favicon"],
        },
        favicon: { kind: "file", label: "favicon.svg" },
        locked: {
            kind: "file",
            label: "secrets.env (disabled)",
            disabled: true,
        },
        package: { kind: "file", label: "package.json" },
        readme: { kind: "file", label: "README.md" },
    },
    expandedItemIds: ["src", "components"],
    selectedItemIds: ["app"],
};

export default function TreeParts() {
    return (
        <div className="grid w-[40rem] max-w-full grid-cols-1 gap-6 sm:grid-cols-2">
            <Tree.Root<Types, typeof features>
                defaultTree={json}
                features={features}
                aria-label="Project files"
                className="rounded-lg border border-palette-line"
            >
                <Tree.Items<Types>>
                    {(item) => <FileItem item={item} />}
                </Tree.Items>
                <Tree.Empty />
                <Tree.LiveRegion />
            </Tree.Root>
            <Tree.Root<Types>
                defaultTree={{ version: 1, rootItemIds: [], items: {} }}
                aria-label="An empty tree"
                className="rounded-lg border border-palette-line"
            >
                <Tree.Items<Types>>
                    {(item) => <FileItem item={item} />}
                </Tree.Items>
                <Tree.Empty>Nothing here yet</Tree.Empty>
            </Tree.Root>
        </div>
    );
}

function FileItem({ item }: { item: ItemOf<Types> }) {
    return (
        <Tree.Item item={item} aria-label={item.label}>
            <Tree.ItemContent>
                <Tree.Toggle />
                <KindIcon item={item} />
                <Tree.Label>{item.label}</Tree.Label>
            </Tree.ItemContent>
            <Tree.Group<Types>>
                {(child) => <FileItem item={child} />}
            </Tree.Group>
        </Tree.Item>
    );
}

function KindIcon({ item }: { item: ItemOf<Types> }) {
    const expanded = useTreeState<Types, boolean>((_state, model) =>
        model.is("item-expanded", { itemId: item.id }),
    );
    if (item.kind === "file") return <FileIcon aria-hidden />;
    return expanded ? (
        <FolderOpenIcon aria-hidden />
    ) : (
        <FolderIcon aria-hidden />
    );
}

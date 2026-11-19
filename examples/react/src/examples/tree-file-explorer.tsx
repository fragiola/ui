"use client";

import {
    type AnnounceEvent,
    createTreeModel,
    type DropTarget,
    type ItemOf,
    type TreeJson,
    type TreeModel,
    useTree,
    useTreeState,
    veto,
} from "@fragiola/tree-react";
import { dragAndDrop } from "@fragiola/tree-react/drag-and-drop";
import { rename } from "@fragiola/tree-react/rename";
import { selection } from "@fragiola/tree-react/selection";
import { typeAhead } from "@fragiola/tree-react/type-ahead";
import {
    FileCodeIcon,
    FileIcon,
    FileImageIcon,
    FileJsonIcon,
    FileTextIcon,
    FolderIcon,
    FolderOpenIcon,
    type LucideIcon,
} from "lucide-react";
import { useId, useState } from "react";
import { Tree } from "#/components/ui/tree";

// A file explorer composed from the parts, for what Template.Simple does not
// do: an icon per kind (a folder opens with its item), a file's size beside
// its name (a description, not part of its name), rename by double click as
// well as F2, and announcements in the app's own words. Select with a click
// (Shift / Ctrl extend) and drag the selection onto a folder, or between two
// rows; press Ctrl+Shift+D to move it with the keyboard. F2 renames; a name
// with "/" is refused. Copy it and change what your app needs.

type Types = { items: { folder: undefined; file: { size: number } } };

const features = [
    selection({ mode: "multiple" }),
    typeAhead(),
    rename(),
    // the drop line starts at the icon: 4 + 8 + 16 + 8 pixels at the
    // default density (the root's and the row's padding, the toggle, a gap)
    dragAndDrop({ indicatorInset: 36 }),
] as const;

const file = (label: string, size: number) =>
    ({ kind: "file", label, data: { size } }) as const;

const json: TreeJson<Types> = {
    version: 1,
    settings: { renamable: true },
    rootItemIds: ["src", "docs", "public", "package", "readme"],
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
        button: file("button.tsx", 1840),
        "tree-view": file("tree-view.tsx", 6020),
        app: file("app.tsx", 2480),
        main: file("main.tsx", 310),
        docs: { kind: "folder", label: "docs", childItemIds: ["guide"] },
        guide: file("guide.md", 5120),
        public: {
            kind: "folder",
            label: "public",
            childItemIds: ["logo"],
        },
        logo: file("logo.svg", 920),
        package: file("package.json", 1130),
        readme: file("README.md", 3400),
    },
    expandedItemIds: ["src", "components", "docs"],
};

export default function TreeFileExplorer() {
    const [model] = useState(() => {
        const created = createTreeModel<Types, typeof features>(json, {
            features,
        });
        created.use((ctx, next) =>
            ctx.command === "item.rename" && ctx.payload.label.includes("/")
                ? veto("A name cannot contain “/”.")
                : next(),
        );
        return created;
    });
    return (
        <div className="p-4">
            <Tree.Root
                model={model}
                announce={announcer(model)}
                aria-label="Project files"
                className="max-w-sm rounded-lg border border-palette-line"
            >
                <Tree.Items<Types>>
                    {(item) => <FileItem item={item} />}
                </Tree.Items>
                <Tree.DropIndicator />
                <Tree.LiveRegion />
            </Tree.Root>
        </div>
    );
}

function FileItem({ item }: { item: ItemOf<Types> }) {
    const sizeId = useId();
    const { model } = useTree<Types, typeof features>();
    return (
        <Tree.Item
            item={item}
            aria-label={item.label}
            aria-describedby={item.kind === "file" ? sizeId : undefined}
        >
            <Tree.ItemContent
                onDoubleClick={() =>
                    model.run("item.start-rename", { itemId: item.id })
                }
            >
                <Tree.Toggle />
                <KindIcon item={item} />
                <Tree.Label>{item.label}</Tree.Label>
                <Tree.Rename item={item} />
                {item.kind === "file" && (
                    <span id={sizeId} className="shrink-0 text-xs tabular-nums">
                        {formatSize(item.data.size)}
                    </span>
                )}
            </Tree.ItemContent>
            <Tree.Group<Types>>
                {(child) => <FileItem item={child} />}
            </Tree.Group>
        </Tree.Item>
    );
}

/** A folder opens with its item; a file's icon follows its extension. */
function KindIcon({ item }: { item: ItemOf<Types> }) {
    const expanded = useTreeState<Types, boolean>((_state, model) =>
        model.is("item-expanded", { itemId: item.id }),
    );
    if (item.kind === "folder") {
        const Icon = expanded ? FolderOpenIcon : FolderIcon;
        return <Icon aria-hidden="true" />;
    }
    const Icon = ICONS[item.label.split(".").pop() ?? ""] ?? FileIcon;
    return <Icon aria-hidden="true" />;
}

const ICONS: Record<string, LucideIcon> = {
    ts: FileCodeIcon,
    tsx: FileCodeIcon,
    json: FileJsonIcon,
    md: FileTextIcon,
    svg: FileImageIcon,
};

const formatSize = (bytes: number) =>
    bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;

// The package writes no text: every sentence is the app's.
function announcer(model: TreeModel<Types, typeof features>) {
    const label = (itemId: string | null) =>
        itemId === null
            ? "the tree"
            : (model.get("item-by", { id: itemId })?.label ?? itemId);
    const where = (target: DropTarget) =>
        target.position === "inside"
            ? `into ${label(target.itemId)}`
            : `${target.position} ${label(target.itemId)}`;
    const names = (itemIds: readonly string[]) => itemIds.map(label).join(", ");
    return (event: AnnounceEvent): string | undefined => {
        switch (event.type) {
            case "drag-start":
                return event.target
                    ? `Picked up ${names(event.itemIds)}. Drop ${where(event.target)}.`
                    : `Picked up ${names(event.itemIds)}.`;
            case "drag-over":
                return event.target
                    ? `Drop ${where(event.target)}.`
                    : "No place to drop here.";
            case "drop":
                return `Moved ${names(event.itemIds)} ${where(event.target)}.`;
            case "drag-cancel":
                return "Cancelled.";
            default:
                return undefined;
        }
    };
}

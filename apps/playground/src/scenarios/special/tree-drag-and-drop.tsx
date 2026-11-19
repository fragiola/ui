import {
    type AnnounceEvent,
    createTreeModel,
    type DropTarget,
    type ItemOf,
    type TreeJson,
    type TreeModel,
} from "@fragiola/tree-react";
import { dragAndDrop } from "@fragiola/tree-react/drag-and-drop";
import { selection } from "@fragiola/tree-react/selection";
import { FileIcon, FolderIcon } from "lucide-react";
import { useState } from "react";
import { Tree } from "#/components/ui/tree";

// Drag and drop, with the pointer and the keyboard. Drag a row (a selected
// row takes the rest of the selection along): the top third of a row drops
// before it, the bottom third after, the middle inside a folder; at the end
// of a list, the pointer's inline position picks the level. A collapsed
// folder opens after a moment. Keyboard: focus a row, Ctrl/Cmd+Shift+D picks
// it up (the tree gets a dashed outline), ArrowUp / ArrowDown step through
// the targets, Enter drops, Escape cancels. The live region (visually
// hidden) says each step; its last text is mirrored below.
//
// `indentation` (16) and `indicatorInset` (36) are the rows' pixels at the
// default density: four spacing steps a level, and the root's and the row's
// padding (4 + 8), the toggle (16) and a gap (8) before the icon, where a
// line starts.

type Types = { items: { folder: undefined; file: undefined } };

const features = [
    selection({ mode: "multiple" }),
    dragAndDrop({ indentation: 16, indicatorInset: 36 }),
] as const;

const json: TreeJson<Types> = {
    version: 1,
    rootItemIds: ["src", "docs", "assets", "license"],
    items: {
        src: {
            kind: "folder",
            label: "src",
            childItemIds: ["lib", "index", "app"],
        },
        lib: { kind: "folder", label: "lib", childItemIds: ["utils"] },
        utils: { kind: "file", label: "utils.ts" },
        index: { kind: "file", label: "index.ts" },
        app: { kind: "file", label: "app.tsx" },
        docs: {
            kind: "folder",
            label: "docs",
            childItemIds: ["guide", "api"],
        },
        guide: { kind: "file", label: "guide.md" },
        api: { kind: "file", label: "api.md" },
        assets: {
            kind: "folder",
            label: "assets (collapsed)",
            childItemIds: ["logo"],
        },
        logo: { kind: "file", label: "logo.svg" },
        license: { kind: "file", label: "LICENSE" },
    },
    expandedItemIds: ["src", "lib", "docs"],
};

export default function TreeDragAndDrop() {
    const [model] = useState(() =>
        createTreeModel<Types, typeof features>(json, { features }),
    );
    const [said, setSaid] = useState("");
    const announce = (event: AnnounceEvent) => {
        const text = announcer(model)(event);
        if (text) setSaid(text);
        return text;
    };
    return (
        <div className="flex w-[22rem] max-w-full flex-col gap-3">
            <Tree.Root
                model={model}
                announce={announce}
                aria-label="Project files"
                className="rounded-lg border border-palette-line"
            >
                <Tree.Items<Types>>
                    {(item) => <FileItem item={item} />}
                </Tree.Items>
                <Tree.DropIndicator />
                <Tree.LiveRegion />
            </Tree.Root>
            <p className="text-xs text-palette-accent/85" data-testid="said">
                {said || "Nothing said yet."}
            </p>
        </div>
    );
}

function FileItem({ item }: { item: ItemOf<Types> }) {
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
            <Tree.Group<Types>>
                {(child) => <FileItem item={child} />}
            </Tree.Group>
        </Tree.Item>
    );
}

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
    return (event: AnnounceEvent): string | undefined => {
        switch (event.type) {
            case "drag-start":
                return event.target
                    ? `Picked up ${event.itemIds.map(label).join(", ")}. Drop ${where(event.target)}.`
                    : `Picked up ${event.itemIds.map(label).join(", ")}.`;
            case "drag-over":
                return event.target
                    ? `Drop ${where(event.target)}.`
                    : "No place to drop here.";
            case "drop":
                return `Moved ${event.itemIds.map(label).join(", ")} ${where(event.target)}.`;
            case "drag-cancel":
                return "Cancelled.";
            default:
                return undefined;
        }
    };
}

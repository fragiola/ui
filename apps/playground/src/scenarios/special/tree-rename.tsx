import {
    createTreeModel,
    type ItemOf,
    type TreeJson,
    veto,
} from "@fragiola/tree-react";
import { rename } from "@fragiola/tree-react/rename";
import { selection } from "@fragiola/tree-react/selection";
import { useState } from "react";
import { Tree } from "#/components/ui/tree";

// Inline rename. Focus a row and press F2 (or double click it): the label
// becomes a field, opened with the name selected. Enter commits, Escape
// cancels, and focus goes back to the item. A middleware refuses a name with
// "/" or one a sibling has: the field turns danger (`data-invalid` on
// Field.Root) and the reason shows below it. "README.md" is not renamable.

type Types = { items: { folder: undefined; file: undefined } };

const features = [selection(), rename()] as const;

const json: TreeJson<Types> = {
    version: 1,
    settings: { renamable: true },
    rootItemIds: ["notes", "readme"],
    items: {
        notes: {
            kind: "folder",
            label: "notes",
            childItemIds: ["monday", "tuesday"],
        },
        monday: { kind: "file", label: "monday.md" },
        tuesday: { kind: "file", label: "tuesday.md" },
        readme: { kind: "file", label: "README.md", renamable: false },
    },
    expandedItemIds: ["notes"],
};

export default function TreeRename() {
    const [error, setError] = useState<string>();
    const [model] = useState(() => {
        const created = createTreeModel<Types, typeof features>(json, {
            features,
        });
        created.use((ctx, next) => {
            if (ctx.command !== "item.rename") return next();
            const label = ctx.payload.label.trim();
            if (label.includes("/")) return veto("A name cannot contain “/”.");
            const parent = ctx.get("item-parent-by", {
                itemId: ctx.payload.itemId,
            });
            const siblings = parent
                ? (parent.childItemIds ?? [])
                : ctx.state.rootItemIds;
            const taken = siblings.some(
                (id) =>
                    id !== ctx.payload.itemId &&
                    ctx.get("item-by", { id })?.label === label,
            );
            if (taken) return veto(`“${label}” is already in this folder.`);
            ctx.payload = { ...ctx.payload, label };
            return next();
        });
        return created;
    });
    const item = (node: ItemOf<Types>) => (
        <FileItem
            item={node}
            onError={setError}
            onStart={(itemId) => model.run("item.start-rename", { itemId })}
        />
    );
    return (
        <div className="flex w-[20rem] max-w-full flex-col gap-2">
            <Tree.Root
                model={model}
                aria-label="Notes"
                className="rounded-lg border border-palette-line"
            >
                <Tree.Items<Types>>{item}</Tree.Items>
            </Tree.Root>
            <p
                role="alert"
                className="palette-danger min-h-4 text-xs text-palette-accent"
            >
                {error}
            </p>
        </div>
    );
}

function FileItem({
    item,
    onError,
    onStart,
}: {
    item: ItemOf<Types>;
    onError: (message: string | undefined) => void;
    onStart: (itemId: string) => void;
}) {
    return (
        <Tree.Item item={item} aria-label={item.label}>
            <Tree.ItemContent onDoubleClick={() => onStart(item.id)}>
                <Tree.Toggle />
                <Tree.Label>{item.label}</Tree.Label>
                <Tree.Rename
                    item={item}
                    onRenameError={(failure) => onError(failure.message)}
                    onChange={() => onError(undefined)}
                />
            </Tree.ItemContent>
            <Tree.Group<Types>>
                {(child) => (
                    <FileItem
                        item={child}
                        onError={onError}
                        onStart={onStart}
                    />
                )}
            </Tree.Group>
        </Tree.Item>
    );
}

import type { ItemOf, TreeJson } from "@fragiola/tree-react";
import { checkboxes } from "@fragiola/tree-react/checkboxes";
import { selection } from "@fragiola/tree-react/selection";
import { FileIcon, FolderIcon } from "lucide-react";
import { Tree } from "#/components/ui/tree";
import { cn } from "#/lib/cn";

// The same tree under each condition, side by side with the default: a
// surface-tier palette class on the root (it re-tints every row: the fill of a selected
// row, the checks, the focus ring), one on an outer element, each density
// (the row height, the indentation and the toggle follow the spacing scale),
// right-to-left (rows indent from the right, the chevron points left and
// turns down the other way), and the other design axes set on a frame. Each
// tree has an expanded and a collapsed folder, a selected row, a checked, a
// mixed and an unchecked box, and a disabled item. Tab into one to see the
// ring.
const frames: {
    label: string;
    className?: string;
    outer?: string;
    attrs?: Record<string, string>;
}[] = [
    { label: "default" },
    { label: "palette-surface-blue (root)", className: "palette-surface-blue" },
    { label: "palette-surface-rose (outer)", outer: "palette-surface-rose" },
    {
        label: "palette-surface-green (root)",
        className: "palette-surface-green",
    },
    { label: "dir=rtl", attrs: { dir: "rtl" } },
    { label: "density compact", attrs: { "data-density": "compact" } },
    { label: "density spacious", attrs: { "data-density": "spacious" } },
    { label: "radius flat", attrs: { "data-radius": "flat" } },
    { label: "radius full", attrs: { "data-radius": "full" } },
    { label: "text large", attrs: { "data-text": "large" } },
    { label: "motion none", attrs: { "data-motion": "none" } },
];

type Types = { items: { folder: undefined; file: undefined } };

const features = [selection({ mode: "multiple" }), checkboxes()] as const;

const json: TreeJson<Types> = {
    version: 1,
    rootItemIds: ["src", "docs", "locked"],
    items: {
        src: { kind: "folder", label: "src", childItemIds: ["lib", "app"] },
        lib: { kind: "folder", label: "lib", childItemIds: ["utils", "math"] },
        utils: { kind: "file", label: "utils.ts" },
        math: { kind: "file", label: "math.ts" },
        app: { kind: "file", label: "app.tsx" },
        docs: { kind: "folder", label: "docs", childItemIds: ["guide"] },
        guide: { kind: "file", label: "guide.md" },
        locked: { kind: "file", label: "locked.env", disabled: true },
    },
    expandedItemIds: ["src", "lib"],
    selectedItemIds: ["app"],
    checkedItemIds: ["utils"],
};

export default function TreeMatrix() {
    return (
        <div className="grid w-[60rem] max-w-full grid-cols-1 gap-4 sm:grid-cols-3">
            {frames.map(({ label, className, outer, attrs }) => (
                <figure
                    key={label}
                    className={cn("flex flex-col gap-1", outer)}
                    {...attrs}
                >
                    <figcaption className="text-xs text-palette-accent/85">
                        {label}
                    </figcaption>
                    <Tree.Root<Types, typeof features>
                        defaultTree={json}
                        features={features}
                        aria-label={`Files, ${label}`}
                        className={cn(
                            "rounded-lg border border-palette-line bg-palette-base",
                            className,
                        )}
                    >
                        <Tree.Items<Types>>
                            {(item) => <FileItem item={item} />}
                        </Tree.Items>
                    </Tree.Root>
                </figure>
            ))}
        </div>
    );
}

function FileItem({ item }: { item: ItemOf<Types> }) {
    return (
        <Tree.Item item={item} aria-label={item.label}>
            <Tree.ItemContent>
                <Tree.Toggle />
                <Tree.Checkbox item={item} />
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

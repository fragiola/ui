"use client";

import type { TreeJson } from "@fragiola/tree-react";
import { dragAndDrop } from "@fragiola/tree-react/drag-and-drop";
import { selection } from "@fragiola/tree-react/selection";
import { typeAhead } from "@fragiola/tree-react/type-ahead";
import { FileIcon, FolderIcon } from "lucide-react";
import { Tree } from "#/components/ui/tree";

// A tree in one line: Tree.Template.Simple renders every item, its toggle
// and its children, and the UI of each feature the model has: here
// multiple selection, type-ahead and drag and drop (the drop indicator).
// Click a row (Shift / Ctrl extend), or Tab in and use the arrows, Home,
// End and Enter, and type a name. Drag a row onto a folder, or press
// Ctrl+Shift+D, the arrows and Enter to move it with the keyboard.
//
// `indicatorInset: 36` starts the drop line at the icon (the root's and the
// row's padding, the toggle and a gap: 4 + 8 + 16 + 8 pixels).

type Types = { items: { folder: undefined; file: undefined } };

const features = [
    selection({ mode: "multiple" }),
    typeAhead(),
    dragAndDrop({ indicatorInset: 36 }),
] as const;

const json: TreeJson<Types> = {
    version: 1,
    rootItemIds: ["src", "public", "package", "readme"],
    items: {
        src: {
            kind: "folder",
            label: "src",
            childItemIds: ["components", "app", "main"],
        },
        components: {
            kind: "folder",
            label: "components",
            childItemIds: ["button", "dialog"],
        },
        button: { kind: "file", label: "button.tsx" },
        dialog: { kind: "file", label: "dialog.tsx" },
        app: { kind: "file", label: "app.tsx" },
        main: { kind: "file", label: "main.tsx" },
        public: {
            kind: "folder",
            label: "public",
            childItemIds: ["favicon"],
        },
        favicon: { kind: "file", label: "favicon.svg" },
        package: { kind: "file", label: "package.json" },
        readme: { kind: "file", label: "README.md" },
    },
    expandedItemIds: ["src", "components"],
};

export default function TreeExample() {
    return (
        <div className="p-4">
            <Tree.Template.Simple<Types, typeof features>
                defaultTree={json}
                features={features}
                aria-label="Project files"
                icon={(item) =>
                    item.kind === "folder" ? (
                        <FolderIcon aria-hidden="true" />
                    ) : (
                        <FileIcon aria-hidden="true" />
                    )
                }
                className="max-w-sm rounded-lg border border-palette-line"
            />
        </div>
    );
}

import {
    createTreeModel,
    type ItemOf,
    type TreeJson,
    type TreeModel,
    useTreeState,
} from "@fragiola/tree-react";
import { checkboxes } from "@fragiola/tree-react/checkboxes";
import { selection } from "@fragiola/tree-react/selection";
import { useState } from "react";
import { Tree } from "#/components/ui/tree";

// Tri-state checks beside multiple selection. A press on a box checks it
// (in cascade: a parent checks its children, and a parent with only some
// checked children is mixed); a press on the rest of the row selects
// (Shift / Ctrl/Cmd extend). With both features Space selects, so this
// scenario binds checking to Space (`checkboxes({ space: "check" })`) and
// selection to Enter and Ctrl/Cmd+Space. The box never takes focus: the
// item does, and says `aria-checked`. "Audit" is disabled: it can be neither
// checked nor selected.

type Types = { items: { group: undefined; permission: undefined } };

const features = [
    selection({ mode: "multiple" }),
    checkboxes({ space: "check" }),
] as const;

const json: TreeJson<Types> = {
    version: 1,
    rootItemIds: ["billing", "projects", "audit"],
    items: {
        billing: {
            kind: "group",
            label: "Billing",
            childItemIds: ["invoices", "cards"],
        },
        invoices: { kind: "permission", label: "Read invoices" },
        cards: { kind: "permission", label: "Manage cards" },
        projects: {
            kind: "group",
            label: "Projects",
            childItemIds: ["create", "delete", "settings"],
        },
        create: { kind: "permission", label: "Create projects" },
        delete: { kind: "permission", label: "Delete projects" },
        settings: {
            kind: "group",
            label: "Settings",
            childItemIds: ["general", "danger"],
        },
        general: { kind: "permission", label: "General" },
        danger: { kind: "permission", label: "Danger zone" },
        audit: { kind: "permission", label: "Audit log", disabled: true },
    },
    expandedItemIds: ["billing", "projects", "settings"],
    checkedItemIds: ["invoices", "general"],
};

export default function TreeCheckboxes() {
    const [model] = useState(() =>
        createTreeModel<Types, typeof features>(json, { features }),
    );
    return (
        <div className="flex w-[24rem] max-w-full flex-col gap-3">
            <Tree.Root
                model={model}
                aria-label="Permissions"
                className="rounded-lg border border-palette-line"
            >
                <Tree.Items<Types>>
                    {(item) => <PermissionItem item={item} />}
                </Tree.Items>
            </Tree.Root>
            <Summary model={model} />
        </div>
    );
}

function PermissionItem({ item }: { item: ItemOf<Types> }) {
    return (
        <Tree.Item item={item} aria-label={item.label}>
            <Tree.ItemContent>
                <Tree.Toggle />
                <Tree.Checkbox item={item} />
                <Tree.Label>{item.label}</Tree.Label>
            </Tree.ItemContent>
            <Tree.Group<Types>>
                {(child) => <PermissionItem item={child} />}
            </Tree.Group>
        </Tree.Item>
    );
}

// What is checked and selected, read from the model (a string, so an
// unchanged answer is equal).
function Summary({ model }: { model: TreeModel<Types, typeof features> }) {
    const text = useTreeState<Types, string, typeof features>(
        (state) =>
            `checked: ${state.checkedItemIds.join(", ") || "none"} · selected: ${
                state.selectedItemIds.join(", ") || "none"
            }`,
        { model },
    );
    return (
        <p
            className="px-2 py-1 text-xs text-palette-accent/85"
            data-testid="summary"
        >
            {text}
        </p>
    );
}

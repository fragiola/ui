import {
    createModel,
    type LayoutJson,
    type RowNode,
    type TabsetNode,
} from "@fragiola/dockable-react";
import { useState } from "react";
import { Dockable } from "#/components/ui/dockable";

// The core parts only, assembled by hand — Dockable's hello-layout, in
// Fragiola. Drag a tab to another tabset, beside one, or to the layout's
// outer edge (the dashed outline); resize with the splitters (Tab onto one
// and use the arrows). The active tabset's selected tab carries the ring
// marker. Theme, direction and density come from the toolbar.

type Types = { tabs: { note: { text: string } } };

const json: LayoutJson<Types> = {
    version: 1,
    root: {
        type: "row",
        children: [
            {
                type: "tabset",
                weight: 60,
                children: [
                    note("Welcome", "Drag me into the other tabset."),
                    note("Notes", "A second tab in the same tabset."),
                    note("A tab with a long label that truncates", "…"),
                ],
            },
            {
                type: "row",
                weight: 40,
                children: [
                    {
                        type: "tabset",
                        children: [note("Inspector", "Stacked above.")],
                    },
                    {
                        type: "tabset",
                        deleteWhenEmpty: false,
                        children: [note("Console", "Stacked below.")],
                    },
                ],
            },
        ],
    },
};

function note(label: string, text: string) {
    return { component: "note" as const, label, data: { text } };
}

export default function DockableParts() {
    const [model] = useState(() => createModel<Types>(json));
    return (
        <div className="h-[30rem] w-[56rem] max-w-full overflow-hidden rounded-lg border border-palette-line">
            <Dockable.Root model={model} className="size-full">
                <Dockable.Row<Types>>{renderNode}</Dockable.Row>
                <Dockable.Panels<Types>>
                    {(tab) => (
                        <Dockable.Panel node={tab} className="p-4">
                            <p className="text-palette-accent/85">
                                {tab.data.text}
                            </p>
                        </Dockable.Panel>
                    )}
                </Dockable.Panels>
                <Dockable.DropIndicator />
            </Dockable.Root>
        </div>
    );
}

function renderNode(node: TabsetNode<Types> | RowNode<Types>) {
    if (node.type === "row") {
        return <Dockable.Row node={node}>{renderNode}</Dockable.Row>;
    }
    return (
        <Dockable.TabSet node={node}>
            <Dockable.TabSetHeader>
                <Dockable.TabList<Types> aria-label="Tabs">
                    {(tab) => (
                        <Dockable.Tab node={tab}>
                            <Dockable.TabLabel>{tab.label}</Dockable.TabLabel>
                        </Dockable.Tab>
                    )}
                </Dockable.TabList>
            </Dockable.TabSetHeader>
            <Dockable.TabSetContent />
        </Dockable.TabSet>
    );
}

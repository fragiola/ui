import {
    type BorderNode,
    createModel,
    type LayoutJson,
    type RowNode,
    type TabsetNode,
} from "@fragiola/dockable-react";
import { useState } from "react";
import { Dockable } from "#/components/ui/dockable";

// Borders on every side: docked on the start (it shrinks the layout) and on
// the top, overlaid on the bottom and the end (they open over it). Click a
// border tab to open its panel, click it again to close it. The side
// strips turn their labels; the start strip reads upwards. Drag a tab into a
// strip, or out of one. Under RTL the start border moves to the right.

type Types = { tabs: { note: undefined } };

const tab = (label: string) => ({ component: "note" as const, label });

const json: LayoutJson<Types> = {
    version: 1,
    defaults: { border: { size: 200 } },
    borders: [
        {
            location: "start",
            selected: 0,
            children: [tab("Explorer"), tab("Search")],
        },
        { location: "top", children: [tab("Toolbar")] },
        {
            location: "bottom",
            mode: "overlay",
            size: 140,
            children: [tab("Terminal"), tab("Output")],
        },
        { location: "end", mode: "overlay", children: [tab("Outline")] },
    ],
    root: {
        type: "row",
        children: [
            {
                type: "tabset",
                children: [tab("app.ts"), tab("store.ts")],
            },
        ],
    },
};

export default function DockableBorders() {
    const [model] = useState(() => createModel<Types>(json));
    return (
        <div className="h-[30rem] w-[56rem] max-w-full overflow-hidden rounded-lg border border-palette-line">
            <Dockable.Root model={model} className="size-full">
                <Dockable.Borders<Types>
                    renderBar={(border) => <Bar node={border} />}
                >
                    <Dockable.Row<Types>>{renderNode}</Dockable.Row>
                </Dockable.Borders>
                <Dockable.Panels<Types>>
                    {(node) => (
                        <Dockable.Panel node={node} className="p-4">
                            <p className="text-palette-accent/85">
                                {node.label}
                            </p>
                        </Dockable.Panel>
                    )}
                </Dockable.Panels>
                <Dockable.DropIndicator />
            </Dockable.Root>
        </div>
    );
}

function Bar({ node }: { node: BorderNode<Types> }) {
    return (
        <Dockable.Border node={node}>
            <Dockable.TabList<Types> aria-label={`${node.location} panels`}>
                {(item) => (
                    <Dockable.Tab node={item}>
                        <Dockable.TabLabel>{item.label}</Dockable.TabLabel>
                    </Dockable.Tab>
                )}
            </Dockable.TabList>
        </Dockable.Border>
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
                    {(item) => (
                        <Dockable.Tab node={item}>
                            <Dockable.TabLabel>{item.label}</Dockable.TabLabel>
                        </Dockable.Tab>
                    )}
                </Dockable.TabList>
            </Dockable.TabSetHeader>
            <Dockable.TabSetContent />
        </Dockable.TabSet>
    );
}

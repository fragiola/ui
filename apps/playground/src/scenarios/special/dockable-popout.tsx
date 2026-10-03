import {
    createModel,
    type LayoutJson,
    type RowNode,
    type TabsetNode,
} from "@fragiola/dockable-react";
import { useState } from "react";
import { Dockable } from "#/components/ui/dockable";

// Popout windows. The button in a tabset's header pops the whole tabset out
// into a native window (`target="tabset"`; the host page is
// public/popout.html); in the window the same button docks it back.
// `popoutMirrorRoot` copies <html> and <body>'s attributes into each window
// and keeps them in sync: switch the theme in the toolbar while a window is
// open and the window follows. The window's floor declares the same palette
// as the root (the root is not its ancestor there).
//
// Pop out the narrow tabset: in the window its strip scrolls instead of
// hiding tabs behind the overflow menu — a DropdownMenu portals into the main
// document, so it would open in the other window.

type Types = { tabs: { note: undefined } };

const tab = (label: string) => ({ component: "note" as const, label });

const json: LayoutJson<Types> = {
    version: 1,
    defaults: { tab: { enablePopout: true } },
    root: {
        type: "row",
        children: [
            {
                type: "tabset",
                weight: 60,
                children: [tab("Chart"), tab("Notes")],
            },
            {
                type: "tabset",
                weight: 40,
                children: [
                    tab("Inspector"),
                    tab("Log"),
                    tab("Network"),
                    tab("Memory"),
                    tab("Sources"),
                    tab("Console"),
                ],
            },
        ],
    },
};

const popoutURL = `${import.meta.env.BASE_URL}popout.html`;

export default function DockablePopout() {
    const [model] = useState(() => createModel<Types>(json));
    return (
        <div className="h-[26rem] w-[56rem] max-w-full overflow-hidden rounded-lg border border-palette-line">
            <Dockable.Root
                model={model}
                popoutURL={popoutURL}
                popoutMirrorRoot
                className="size-full"
            >
                <Dockable.Row<Types>>{renderNode}</Dockable.Row>
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
                <Dockable.Popout<Types>>
                    {() => (
                        <>
                            <Dockable.Row<Types>>{renderNode}</Dockable.Row>
                            <Dockable.DropIndicator />
                        </>
                    )}
                </Dockable.Popout>
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
                    {(item) => (
                        <Dockable.Tab node={item}>
                            <Dockable.TabLabel>{item.label}</Dockable.TabLabel>
                        </Dockable.Tab>
                    )}
                </Dockable.TabList>
                <Dockable.TabOverflowMenu node={node} />
                <Dockable.TabSetActions>
                    <Dockable.PopoutTrigger target="tabset" />
                </Dockable.TabSetActions>
            </Dockable.TabSetHeader>
            <Dockable.TabSetContent />
        </Dockable.TabSet>
    );
}

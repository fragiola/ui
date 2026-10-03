"use client";

import {
    type BorderNode,
    createModel,
    type LayoutJson,
    type Model,
    type RowNode,
    type TabOf,
    type TabsetNode,
} from "@fragiola/dockable-react";
import {
    FileCodeIcon,
    FileTextIcon,
    FolderTreeIcon,
    type LucideIcon,
    SearchIcon,
    TerminalIcon,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { Dockable } from "#/components/ui/dockable";

// Your own template. When Template.Simple is not the layout you want, write
// the one you want from the same parts — once, in your project — and use it
// as a one-liner everywhere, as Template.Simple is used:
//
//   <Workbench model={model}>{(tab) => <Editor tab={tab} />}</Workbench>
//
// This one is an editor's workbench: an icon on every tab (from its
// component), a start border of tool panels, close buttons and the overflow
// menu, and no maximize or popout. It is only the parts, assembled: no
// class of its own, so the palette, density and direction reach it as they
// reach Template.Simple. Copy it and change what your app needs.

type Types = {
    tabs: {
        file: { source: string };
        doc: { text: string };
        explorer: undefined;
        search: undefined;
        terminal: undefined;
    };
};

const ICONS: Record<TabOf<Types>["component"], LucideIcon> = {
    file: FileCodeIcon,
    doc: FileTextIcon,
    explorer: FolderTreeIcon,
    search: SearchIcon,
    terminal: TerminalIcon,
};

// ─── The template ───────────────────────────────────────────────────────────

function Workbench({
    model,
    children,
}: {
    model: Model<Types>;
    children: (tab: TabOf<Types>) => ReactNode;
}) {
    return (
        <Dockable.Root model={model} className="h-full">
            <Dockable.Borders<Types>
                renderBar={(border) => <ToolBar node={border} />}
            >
                <Dockable.Row<Types>>{renderNode}</Dockable.Row>
            </Dockable.Borders>
            <Dockable.Panels<Types>>
                {(tab) => (
                    <Dockable.Panel node={tab}>{children(tab)}</Dockable.Panel>
                )}
            </Dockable.Panels>
            <Dockable.DropIndicator />
        </Dockable.Root>
    );
}

function renderNode(node: TabsetNode<Types> | RowNode<Types>): ReactNode {
    if (node.type === "row") {
        return <Dockable.Row node={node}>{renderNode}</Dockable.Row>;
    }
    return (
        <Dockable.TabSet node={node}>
            <Dockable.TabSetHeader>
                <Dockable.TabList<Types> aria-label="Open files">
                    {(tab) => (
                        <Dockable.Tab node={tab}>
                            <TabIcon tab={tab} />
                            <Dockable.TabLabel>{tab.label}</Dockable.TabLabel>
                            <Dockable.TabClose node={tab} />
                        </Dockable.Tab>
                    )}
                </Dockable.TabList>
                <Dockable.TabOverflowMenu node={node} />
            </Dockable.TabSetHeader>
            <Dockable.TabSetContent />
        </Dockable.TabSet>
    );
}

function ToolBar({ node }: { node: BorderNode<Types> }) {
    return (
        <Dockable.Border node={node}>
            <Dockable.TabList<Types> aria-label="Tools">
                {(tab) => (
                    <Dockable.Tab node={tab}>
                        <TabIcon tab={tab} />
                        <Dockable.TabLabel>{tab.label}</Dockable.TabLabel>
                    </Dockable.Tab>
                )}
            </Dockable.TabList>
        </Dockable.Border>
    );
}

function TabIcon({ tab }: { tab: TabOf<Types> }) {
    const Icon = ICONS[tab.component];
    return <Icon aria-hidden="true" />;
}

// ─── Using it ───────────────────────────────────────────────────────────────

const file = (label: string, source: string) => ({
    component: "file" as const,
    label,
    data: { source },
});

const json: LayoutJson<Types> = {
    version: 1,
    borders: [
        {
            location: "start",
            selected: 0,
            size: 200,
            children: [
                { component: "explorer", label: "Explorer" },
                { component: "search", label: "Search" },
            ],
        },
        {
            location: "bottom",
            size: 120,
            children: [{ component: "terminal", label: "Terminal" }],
        },
    ],
    root: {
        type: "row",
        children: [
            {
                type: "tabset",
                weight: 60,
                children: [
                    file(
                        "app.tsx",
                        "export function App() {\n    return <Layout />;\n}",
                    ),
                    file("store.ts", "export const store = createStore();"),
                ],
            },
            {
                type: "tabset",
                weight: 40,
                children: [
                    {
                        component: "doc",
                        label: "README.md",
                        data: { text: "Run `pnpm dev` and open the app." },
                    },
                ],
            },
        ],
    },
};

const FILES = ["src/app.tsx", "src/store.ts", "README.md"];

export default function DockableCustomTemplate() {
    const [model] = useState(() => createModel<Types>(json));
    return (
        <Workbench model={model}>
            {(tab) => {
                switch (tab.component) {
                    case "file":
                        return (
                            <pre className="p-4 font-mono text-xs leading-relaxed">
                                {tab.data.source}
                            </pre>
                        );
                    case "doc":
                        return (
                            <p className="p-4 text-palette-accent/85">
                                {tab.data.text}
                            </p>
                        );
                    case "explorer":
                        return (
                            <ul className="flex flex-col gap-1 p-3 font-mono text-xs text-palette-accent/85">
                                {FILES.map((name) => (
                                    <li key={name}>{name}</li>
                                ))}
                            </ul>
                        );
                    case "search":
                        return (
                            <p className="p-3 text-palette-accent/85">
                                No results yet.
                            </p>
                        );
                    case "terminal":
                        return (
                            <pre className="p-3 font-mono text-xs text-palette-accent/85">
                                $ pnpm dev{"\n"}ready in 412 ms
                            </pre>
                        );
                }
            }}
        </Workbench>
    );
}

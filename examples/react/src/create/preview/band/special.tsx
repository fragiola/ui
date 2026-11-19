import type { Column } from "@fragiola/data-grid-react";
import { useLocalRows } from "@fragiola/data-grid-react/local";
import { navigation } from "@fragiola/data-grid-react/navigation";
import { pagination } from "@fragiola/data-grid-react/pagination";
import { rowSelection } from "@fragiola/data-grid-react/row-selection";
import { sorting } from "@fragiola/data-grid-react/sorting";
import { createModel, type LayoutJson } from "@fragiola/dockable-react";
import type { Layout } from "@fragiola/grid-layout-react";
import type { TreeJson } from "@fragiola/tree-react";
import { selection } from "@fragiola/tree-react/selection";
import { typeAhead } from "@fragiola/tree-react/type-ahead";
import { FileIcon, FolderIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Badge } from "#/components/atoms/badge";
import { DataGrid } from "#/components/ui/data-grid";
import { Dockable } from "#/components/ui/dockable";
import { GridLayout } from "#/components/ui/grid-layout";
import { Splitter } from "#/components/ui/splitter";
import { Tree } from "#/components/ui/tree";
import { Card, useTone } from "../card";
import { COLUMN_WIDTH, GAP } from "../layout";

// The band: the special components — the libraries Fragiola UI styles — in
// panels several columns wide, at the top of the canvas where they are seen
// first. Each is interactive and follows the design like every card.

const span = (columns: number) => COLUMN_WIDTH * columns + GAP * (columns - 1);

function Panel({
    columns,
    title,
    description,
    children,
}: {
    columns: number;
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <div style={{ width: span(columns) }} className="shrink-0">
            <Card title={title} description={description} className="h-[30rem]">
                <div className="h-[23rem] min-h-0">{children}</div>
            </Card>
        </div>
    );
}

export function SpecialBand() {
    return (
        <div className="flex items-start" style={{ gap: GAP }}>
            <Panel
                columns={3}
                title="Dockable"
                description="Drag a tab to another tabset, or to an edge."
            >
                <Workspace />
            </Panel>
            <Panel
                columns={2}
                title="Data Grid"
                description="Sort, select, page — 300 rows."
            >
                <Orders />
            </Panel>
            <Panel
                columns={3}
                title="Grid Layout"
                description="Drag and resize the tiles."
            >
                <Dashboard />
            </Panel>
            <Panel
                columns={2}
                title="Tree · Splitter"
                description="Resize the rule; expand the folders."
            >
                <Explorer />
            </Panel>
        </div>
    );
}

// ─── Dockable ───────────────────────────────────────────────────────────────

type DockTypes = { tabs: { note: { text: string } } };
const note = (label: string, text: string) => ({
    component: "note" as const,
    label,
    data: { text },
});
const WORKSPACE: LayoutJson<DockTypes> = {
    version: 1,
    root: {
        type: "row",
        children: [
            {
                type: "tabset",
                weight: 60,
                children: [
                    note("app.tsx", "export function App() { … }"),
                    note("theme.css", ".palette-brand { … }"),
                    note("README.md", "# Fragiola"),
                ],
            },
            {
                type: "row",
                weight: 40,
                children: [
                    {
                        type: "tabset",
                        children: [
                            note("Problems", "No problems in the workspace."),
                            note("Output", "Build finished in 1.2s."),
                        ],
                    },
                    {
                        type: "tabset",
                        children: [note("Terminal", "$ pnpm dev")],
                    },
                ],
            },
        ],
    },
};

function Workspace() {
    const [model] = useState(() => createModel<DockTypes>(WORKSPACE));
    return (
        <Dockable.Template.Simple model={model} className="h-full">
            {(tab) => (
                <p className="p-3 font-mono text-xs text-palette-accent/85">
                    {tab.data.text}
                </p>
            )}
        </Dockable.Template.Simple>
    );
}

// ─── Data Grid ──────────────────────────────────────────────────────────────

type Order = { id: number; customer: string; status: string; total: number };
const CUSTOMERS = ["Acme", "Globex", "Initech", "Umbrella", "Hooli", "Stark"];
const STATUSES = ["Paid", "Pending", "Refunded"];
const ORDERS: Order[] = Array.from({ length: 300 }, (_, i) => ({
    id: 5001 + i,
    customer: CUSTOMERS[(i * 5) % CUSTOMERS.length] ?? "",
    status: STATUSES[(i * 7) % STATUSES.length] ?? "",
    total: 40 + ((i * 397) % 2400),
}));
const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

function Orders() {
    const { action } = useTone();
    const columns: Column<Order>[] = [
        { key: "id", name: "Order", width: 90, sortable: true },
        { key: "customer", name: "Customer", width: 130, sortable: true },
        {
            key: "status",
            name: "Status",
            width: 110,
            sortable: true,
            renderCell: ({ row }) => (
                <Badge
                    variant={row.status === "Paid" ? "soft" : "outline"}
                    className={row.status === "Paid" ? action : undefined}
                >
                    {row.status}
                </Badge>
            ),
        },
        {
            key: "total",
            name: "Total",
            width: 120,
            sortable: true,
            renderCell: ({ row }) => money.format(row.total),
        },
    ];
    const features = [navigation(), sorting(), rowSelection(), pagination()];
    const local = useLocalRows(ORDERS, columns, { features, pageSize: 25 });
    return (
        <DataGrid.Template.Simple
            features={features}
            {...local.props}
            columns={columns}
            rowKey={(order) => order.id}
            rowSelection="multiple"
            aria-label="Orders"
            className="h-full"
        />
    );
}

// ─── Grid Layout ────────────────────────────────────────────────────────────

const TILES: Layout = [
    { id: "revenue", x: 0, y: 0, w: 4, h: 2 },
    { id: "orders", x: 4, y: 0, w: 4, h: 2 },
    { id: "uptime", x: 8, y: 0, w: 4, h: 2 },
    { id: "traffic", x: 0, y: 2, w: 8, h: 3 },
    { id: "notes", x: 8, y: 2, w: 4, h: 3 },
];
const WIDGETS: Record<string, [string, string, string]> = {
    revenue: ["Revenue", "$48.2k", "+12% this week"],
    orders: ["Orders", "1,284", "+4% this week"],
    uptime: ["Uptime", "99.98%", "30 days"],
    traffic: ["Traffic", "312k", "Page views, last 30 days"],
    notes: ["Notes", "3", "Ship the Q3 report."],
};

function Dashboard() {
    return (
        <GridLayout.Template.Simple
            defaultLayout={TILES}
            rowHeight={56}
            itemTitle={(item) => WIDGETS[item.id]?.[0] ?? item.id}
            aria-label="Dashboard"
            className="w-full"
        >
            {(item) => (
                <div className="flex flex-col gap-1">
                    <span className="text-xl font-semibold tabular-nums">
                        {WIDGETS[item.id]?.[1]}
                    </span>
                    <span className="text-xs text-palette-accent/85">
                        {WIDGETS[item.id]?.[2]}
                    </span>
                </div>
            )}
        </GridLayout.Template.Simple>
    );
}

// ─── Tree · Splitter ────────────────────────────────────────────────────────

type Files = { items: { folder: undefined; file: undefined } };
const TREE_FEATURES = [selection({ mode: "multiple" }), typeAhead()] as const;
const PROJECT: TreeJson<Files> = {
    version: 1,
    rootItemIds: ["src", "public", "package", "readme"],
    items: {
        src: {
            kind: "folder",
            label: "src",
            childItemIds: ["components", "lib", "app"],
        },
        components: {
            kind: "folder",
            label: "components",
            childItemIds: ["button", "dialog", "field"],
        },
        button: { kind: "file", label: "button.tsx" },
        dialog: { kind: "file", label: "dialog.tsx" },
        field: { kind: "file", label: "field.tsx" },
        lib: { kind: "folder", label: "lib", childItemIds: ["cn", "palette"] },
        cn: { kind: "file", label: "cn.ts" },
        palette: { kind: "file", label: "palette.ts" },
        app: { kind: "file", label: "app.tsx" },
        public: { kind: "folder", label: "public", childItemIds: ["favicon"] },
        favicon: { kind: "file", label: "favicon.svg" },
        package: { kind: "file", label: "package.json" },
        readme: { kind: "file", label: "README.md" },
    },
    expandedItemIds: ["src", "components"],
    selectedItemIds: ["dialog"],
};

function Explorer() {
    const { control } = useTone();
    return (
        <Splitter.Template.Simple
            className={`${control} h-full rounded-md border border-palette-line`}
        >
            <Splitter.Panel
                id="files"
                defaultSize="45%"
                minSize="25%"
                collapsible
            >
                <div className="h-full overflow-auto p-1">
                    <Tree.Template.Simple<Files, typeof TREE_FEATURES>
                        defaultTree={PROJECT}
                        features={TREE_FEATURES}
                        aria-label="Project files"
                        icon={(item) =>
                            item.kind === "folder" ? (
                                <FolderIcon aria-hidden="true" />
                            ) : (
                                <FileIcon aria-hidden="true" />
                            )
                        }
                    />
                </div>
            </Splitter.Panel>
            <Splitter.Panel id="editor">
                <pre className="h-full overflow-auto p-3 font-mono text-xs leading-relaxed text-palette-accent/85">
                    {`import { Dialog } from "@/components/ui/dialog";

export function Confirm() {
    return (
        <Dialog.Root>
            <Dialog.Trigger>Open</Dialog.Trigger>
        </Dialog.Root>
    );
}`}
                </pre>
            </Splitter.Panel>
        </Splitter.Template.Simple>
    );
}

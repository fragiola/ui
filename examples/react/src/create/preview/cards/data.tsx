import type { Column } from "@fragiola/data-grid-react";
import { useLocalRows } from "@fragiola/data-grid-react/local";
import { navigation } from "@fragiola/data-grid-react/navigation";
import { rowSelection } from "@fragiola/data-grid-react/row-selection";
import { sorting } from "@fragiola/data-grid-react/sorting";
import type { TreeJson } from "@fragiola/tree-react";
import { selection } from "@fragiola/tree-react/selection";
import {
    CarIcon,
    CoffeeIcon,
    FileIcon,
    FolderIcon,
    MoreHorizontalIcon,
    ShoppingCartIcon,
    TvIcon,
    WalletIcon,
} from "lucide-react";
import { Badge } from "#/components/atoms/badge";
import { Clickable } from "#/components/atoms/clickable";
import { Avatar } from "#/components/ui/avatar";
import { Checkbox } from "#/components/ui/checkbox";
import { DataGrid } from "#/components/ui/data-grid";
import { DropdownMenu } from "#/components/ui/dropdown-menu";
import { Pagination } from "#/components/ui/pagination";
import { Table } from "#/components/ui/table";
import { Tree } from "#/components/ui/tree";
import { Card, useTone } from "../card";

// Data: lists, tables, a data grid and a tree — selection, row menus and
// pagination in the design's colours.

function RowMenu() {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger
                render={
                    <Clickable.Button
                        variant="icon"
                        shape="square"
                        size="sm"
                        aria-label="More"
                    />
                }
            >
                <MoreHorizontalIcon />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
                <DropdownMenu.Item>View details</DropdownMenu.Item>
                <DropdownMenu.Item>Download receipt</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item className="palette-danger">
                    Report a problem
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}

export function RecentTransactions() {
    const rows = [
        [CoffeeIcon, "Blue Bottle Coffee", "Food & drink · Today", "−$6.50"],
        [ShoppingCartIcon, "Whole Foods", "Groceries · Yesterday", "−$142.30"],
        [WalletIcon, "Stripe payout", "Income · Oct 12", "+$4,200.00"],
        [CarIcon, "Uber", "Transport · Oct 11", "−$24.10"],
        [TvIcon, "Netflix", "Entertainment · Oct 10", "−$19.99"],
    ] as const;
    return (
        <Card
            title="Recent transactions"
            description="Your latest account activity."
            action={
                <Clickable.Button variant="outline" size="sm">
                    View all
                </Clickable.Button>
            }
        >
            <ul className="-mx-2 flex flex-col">
                {rows.map(([Icon, name, category, amount]) => (
                    <li
                        key={name}
                        className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-palette-soft"
                    >
                        <span className="grid size-8 shrink-0 place-content-center rounded-md border border-palette-line">
                            <Icon className="size-icon-sm" />
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-sm font-medium">
                                {name}
                            </span>
                            <span className="text-xs text-palette-accent/85">
                                {category}
                            </span>
                        </span>
                        <span
                            className={`w-20 text-end text-sm font-semibold tabular-nums ${amount.startsWith("+") ? "palette-green text-palette-accent" : ""}`}
                        >
                            {amount}
                        </span>
                        <RowMenu />
                    </li>
                ))}
            </ul>
        </Card>
    );
}

const INVOICES = [
    ["INV-1042", "Northwind", "Paid", "$1,280.00"],
    ["INV-1043", "Contoso", "Due", "$640.00"],
    ["INV-1044", "Fabrikam", "Draft", "$2,150.00"],
    ["INV-1045", "Tailspin", "Paid", "$980.00"],
] as const;

export function Invoices() {
    const { action, control } = useTone();
    return (
        <Card
            title="Invoices"
            description="2 of 48 selected"
            footer={
                <Pagination.Root className="mx-0">
                    <Pagination.Content>
                        <Pagination.Item>
                            <Pagination.Previous href="#" />
                        </Pagination.Item>
                        {[1, 2, 3].map((page) => (
                            <Pagination.Item key={page}>
                                <Pagination.Link href="#" active={page === 1}>
                                    {page}
                                </Pagination.Link>
                            </Pagination.Item>
                        ))}
                        <Pagination.Item>
                            <Pagination.Next href="#" />
                        </Pagination.Item>
                    </Pagination.Content>
                </Pagination.Root>
            }
        >
            <Table.Root className={control}>
                <Table.Header>
                    <Table.Row>
                        <Table.Head className="w-8" />
                        <Table.Head>Invoice</Table.Head>
                        <Table.Head>Status</Table.Head>
                        <Table.Head className="text-end">Amount</Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {INVOICES.map(([id, client, status, amount], i) => (
                        <Table.Row
                            key={id}
                            data-state={i < 2 ? "selected" : undefined}
                        >
                            <Table.Cell>
                                <Checkbox.Root
                                    defaultChecked={i < 2}
                                    aria-label={`Select ${id}`}
                                >
                                    <Checkbox.Indicator />
                                </Checkbox.Root>
                            </Table.Cell>
                            <Table.Cell>
                                <span className="font-medium text-palette-contrast">
                                    {id}
                                </span>
                                <span className="block text-xs">{client}</span>
                            </Table.Cell>
                            <Table.Cell>
                                <Badge
                                    variant={
                                        status === "Paid" ? "soft" : "outline"
                                    }
                                    className={
                                        status === "Paid" ? action : undefined
                                    }
                                >
                                    {status}
                                </Badge>
                            </Table.Cell>
                            <Table.Cell className="text-end">
                                {amount}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Card>
    );
}

type Person = { id: number; name: string; team: string; role: string };
const STAFF: Person[] = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    name:
        ["Ada", "Alan", "Grace", "Katherine", "Linus", "Margaret"][i % 6] +
        ` ${i + 1}`,
    team: ["Core", "Data", "Design", "Growth"][i % 4] ?? "",
    role: ["Engineer", "Designer", "Manager"][i % 3] ?? "",
}));
const COLUMNS: Column<Person>[] = [
    { key: "name", name: "Name", width: 130, sortable: true },
    { key: "team", name: "Team", width: 90, sortable: true },
    { key: "role", name: "Role", width: 110, sortable: true },
];
const GRID_FEATURES = [navigation(), sorting(), rowSelection()];

export function PeopleGrid() {
    const { control } = useTone();
    const local = useLocalRows(STAFF, COLUMNS, { features: GRID_FEATURES });
    return (
        <Card
            title="People"
            description="A data grid: sort, select, move with the keys."
        >
            <DataGrid.Template.Simple
                features={GRID_FEATURES}
                {...local.props}
                columns={COLUMNS}
                rowKey={(person) => person.id}
                rowSelection="multiple"
                aria-label="People"
                className={`${control} h-72`}
            />
        </Card>
    );
}

type Files = { items: { folder: undefined; file: undefined } };
const TREE_FEATURES = [selection({ mode: "multiple" })] as const;
const PROJECT: TreeJson<Files> = {
    version: 1,
    rootItemIds: ["src", "public", "package"],
    items: {
        src: {
            kind: "folder",
            label: "src",
            childItemIds: ["components", "app"],
        },
        components: {
            kind: "folder",
            label: "components",
            childItemIds: ["button", "dialog"],
        },
        button: { kind: "file", label: "button.tsx" },
        dialog: { kind: "file", label: "dialog.tsx" },
        app: { kind: "file", label: "app.tsx" },
        public: { kind: "folder", label: "public", childItemIds: ["favicon"] },
        favicon: { kind: "file", label: "favicon.svg" },
        package: { kind: "file", label: "package.json" },
    },
    expandedItemIds: ["src", "components"],
    selectedItemIds: ["dialog"],
};

export function FileTree() {
    const { control } = useTone();
    return (
        <Card title="Files" description="A tree: expand, select, type ahead.">
            <div className={control}>
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
        </Card>
    );
}

export function TeamMembers() {
    const { action } = useTone();
    const members = [
        ["AL", "Ada Lovelace", "ada@example.com", "Owner"],
        ["GH", "Grace Hopper", "grace@example.com", "Admin"],
        ["AT", "Alan Turing", "alan@example.com", "Member"],
        ["KJ", "Katherine Johnson", "katherine@example.com", "Member"],
    ] as const;
    return (
        <Card
            title="Team members"
            description="Invite your team to collaborate."
            action={
                <Clickable.Button className={action} size="sm">
                    Invite
                </Clickable.Button>
            }
        >
            {members.map(([initials, name, email, role]) => (
                <div key={name} className="flex items-center gap-3">
                    <Avatar.Root>
                        <Avatar.Fallback>{initials}</Avatar.Fallback>
                    </Avatar.Root>
                    <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium">
                            {name}
                        </span>
                        <span className="truncate text-xs text-palette-accent/85">
                            {email}
                        </span>
                    </span>
                    <Badge
                        variant={role === "Owner" ? "solid" : "outline"}
                        className={role === "Owner" ? action : undefined}
                    >
                        {role}
                    </Badge>
                </div>
            ))}
        </Card>
    );
}

import {
    CarIcon,
    CoffeeIcon,
    MoreHorizontalIcon,
    ShoppingCartIcon,
    TvIcon,
    WalletIcon,
} from "lucide-react";
import { Badge } from "#/components/atoms/badge";
import { Clickable } from "#/components/atoms/clickable";
import { Avatar } from "#/components/ui/avatar";
import { Checkbox } from "#/components/ui/checkbox";
import { DropdownMenu } from "#/components/ui/dropdown-menu";
import { Pagination } from "#/components/ui/pagination";
import { Table } from "#/components/ui/table";
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

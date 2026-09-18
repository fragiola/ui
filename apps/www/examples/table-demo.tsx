"use client";

import type { ReactNode } from "react";
import { Badge } from "#/atoms/badge";
import { cn } from "#/lib/cn";
import { Table } from "#/ui/table";

// The floor is palette-surface. The table — header, rows, footer, caption —
// reads roles from the floor: `border-palette-line` for the grid,
// `bg-palette-soft` for hover and the selected row, `text-palette-contrast`
// for headings, `text-palette-accent/85` for body text.
//
// The second table is the point of the component: a table has no colour
// props. A column, a row or a single cell is tinted by putting a palette
// class ON THAT ELEMENT and painting a role — the same move as a badge.
//   column   palette-blue on the head and on every cell of the column
//   row      palette-danger on the <tr>: its hover and text turn red
//   cell     a Badge per status, each with its own palette
type Status = "Paid" | "Pending" | "Overdue";

const STATUS_PALETTE: Record<Status, string> = {
    Paid: "palette-green",
    Pending: "palette-orange",
    Overdue: "palette-danger",
};

const invoices: Array<{
    invoice: string;
    customer: string;
    status: Status;
    method: string;
    amount: string;
}> = [
    {
        invoice: "INV001",
        customer: "Acme Corp",
        status: "Paid",
        method: "Credit Card",
        amount: "$250.00",
    },
    {
        invoice: "INV002",
        customer: "Globex",
        status: "Pending",
        method: "PayPal",
        amount: "$150.00",
    },
    {
        invoice: "INV003",
        customer: "Initech",
        status: "Overdue",
        method: "Bank Transfer",
        amount: "$350.00",
    },
    {
        invoice: "INV004",
        customer: "Umbrella",
        status: "Paid",
        method: "Credit Card",
        amount: "$450.00",
    },
    {
        invoice: "INV005",
        customer: "Hooli",
        status: "Pending",
        method: "Credit Card",
        amount: "$550.00",
    },
];

// The tinted column: palette-blue scopes the six roles to the cell, then
// soft + accent paint it. Head and cells carry the same classes so the
// column reads as one stripe.
const AMOUNT_COLUMN = "palette-blue bg-palette-soft text-palette-accent";

export default function TableDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-8 rounded-lg border border-palette-line bg-palette-base p-6">
            {/* roles from the floor — hover a row; INV002 is selected */}
            <Row label="roles from the floor · hover · selected row">
                <Table.Root>
                    <Table.Caption>A list of recent invoices.</Table.Caption>
                    <Table.Header>
                        <Table.Row>
                            <Table.Head>Invoice</Table.Head>
                            <Table.Head>Customer</Table.Head>
                            <Table.Head>Status</Table.Head>
                            <Table.Head>Method</Table.Head>
                            <Table.Head className="text-end">Amount</Table.Head>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {invoices.map((inv) => (
                            <Table.Row
                                key={inv.invoice}
                                data-state={
                                    inv.invoice === "INV002"
                                        ? "selected"
                                        : undefined
                                }
                            >
                                <Table.Cell className="font-medium text-palette-contrast">
                                    {inv.invoice}
                                </Table.Cell>
                                <Table.Cell>{inv.customer}</Table.Cell>
                                <Table.Cell>{inv.status}</Table.Cell>
                                <Table.Cell>{inv.method}</Table.Cell>
                                <Table.Cell className="text-end">
                                    {inv.amount}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.Cell colSpan={4}>Total</Table.Cell>
                            <Table.Cell className="text-end">
                                $1,750.00
                            </Table.Cell>
                        </Table.Row>
                    </Table.Footer>
                </Table.Root>
            </Row>

            {/* palettes on cells — a column, a row and a badge, each with
                its own palette class */}
            <Row label="palette per column · per row · per cell">
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.Head>Invoice</Table.Head>
                            <Table.Head>Customer</Table.Head>
                            <Table.Head>Status</Table.Head>
                            <Table.Head>Method</Table.Head>
                            <Table.Head
                                className={cn("text-end", AMOUNT_COLUMN)}
                            >
                                Amount
                            </Table.Head>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {invoices.map((inv) => {
                            const overdue = inv.status === "Overdue";
                            return (
                                // The overdue row carries palette-danger:
                                // the row's own hover:bg-palette-soft now
                                // paints the danger tint, and every cell's
                                // text-palette-accent/85 reads as danger
                                // accent. Nothing on the row changed but
                                // the palette.
                                <Table.Row
                                    key={inv.invoice}
                                    className={cn(overdue && "palette-danger")}
                                >
                                    <Table.Cell
                                        className={cn(
                                            "font-medium",
                                            // contrast is content on a base
                                            // you painted — on the floor it
                                            // is the heading colour, inside
                                            // palette-danger it would be
                                            // white. Accent is the role for
                                            // text on a foreign background.
                                            overdue
                                                ? "text-palette-accent"
                                                : "text-palette-contrast",
                                        )}
                                    >
                                        {inv.invoice}
                                    </Table.Cell>
                                    <Table.Cell>{inv.customer}</Table.Cell>
                                    <Table.Cell>
                                        <Badge
                                            className={
                                                STATUS_PALETTE[inv.status]
                                            }
                                        >
                                            {inv.status}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>{inv.method}</Table.Cell>
                                    <Table.Cell
                                        className={cn(
                                            "text-end font-medium tabular-nums",
                                            AMOUNT_COLUMN,
                                        )}
                                    >
                                        {inv.amount}
                                    </Table.Cell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.Cell colSpan={4}>Total</Table.Cell>
                            <Table.Cell
                                className={cn(
                                    "text-end tabular-nums",
                                    AMOUNT_COLUMN,
                                )}
                            >
                                $1,750.00
                            </Table.Cell>
                        </Table.Row>
                    </Table.Footer>
                </Table.Root>
            </Row>
        </div>
    );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-palette-accent/85">
                {label}
            </span>
            {children}
        </div>
    );
}

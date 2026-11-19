"use client";

import type { ReactNode } from "react";
import { Badge } from "#/components/atoms/badge";
import { Table } from "#/components/ui/table";

// An invoice list in the default look. The table carries no palette class
// and reads its roles from the floor: `line` for the rules, `soft` for the
// header, a row's hover and the selected row (INV002, `data-state`),
// `contrast` for the headings and `accent/85` for the body.
//
// The one colour is what an app would colour: each status badge wears its
// own palette class. A table has no colour props; a column, a row or a cell
// is tinted the same way, with a palette class on that element. Then the
// empty state.
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

export default function TableDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-8 bg-palette-base text-palette-contrast">
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
                            <Table.Cell>
                                <Badge className={STATUS_PALETTE[inv.status]}>
                                    {inv.status}
                                </Badge>
                            </Table.Cell>
                            <Table.Cell>{inv.method}</Table.Cell>
                            <Table.Cell className="text-end tabular-nums">
                                {inv.amount}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
                <Table.Footer>
                    <Table.Row>
                        <Table.Cell colSpan={4}>Total</Table.Cell>
                        <Table.Cell className="text-end tabular-nums">
                            $1,750.00
                        </Table.Cell>
                    </Table.Row>
                </Table.Footer>
            </Table.Root>

            {/* no rows: one cell spans the columns */}
            <Row label="empty">
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.Head>Invoice</Table.Head>
                            <Table.Head>Customer</Table.Head>
                            <Table.Head className="text-end">Amount</Table.Head>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell
                                colSpan={3}
                                className="h-20 text-center"
                            >
                                No invoices yet.
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table.Root>
            </Row>
        </div>
    );
}

// Row — a captioned row. The caption is a <span>, not a heading.
function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-palette-accent/85">
                {label}
            </span>
            {children}
        </div>
    );
}

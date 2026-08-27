"use client";

import { Table } from "#/ui/table";
import { PaletteGrid } from "@/components/preview/palette-grid";
import { SURFACES } from "@/lib/palette-sets";

// Each cell is a tinted surface palette. The table — header, rows, footer —
// reads roles from the cell. Stacked vertically because a table needs
// horizontal space.
const invoices = [
    {
        invoice: "INV001",
        status: "Paid",
        method: "Credit Card",
        amount: "$250.00",
    },
    {
        invoice: "INV002",
        status: "Pending",
        method: "PayPal",
        amount: "$150.00",
    },
    {
        invoice: "INV003",
        status: "Unpaid",
        method: "Bank Transfer",
        amount: "$350.00",
    },
    {
        invoice: "INV004",
        status: "Paid",
        method: "Credit Card",
        amount: "$450.00",
    },
];

function DemoContent() {
    return (
        <Table.Root>
            <Table.Caption>A list of recent invoices.</Table.Caption>
            <Table.Header>
                <Table.Row>
                    <Table.Head>Invoice</Table.Head>
                    <Table.Head>Status</Table.Head>
                    <Table.Head>Method</Table.Head>
                    <Table.Head className="text-end">Amount</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {invoices.map((inv) => (
                    <Table.Row key={inv.invoice}>
                        <Table.Cell className="font-medium text-palette-contrast">
                            {inv.invoice}
                        </Table.Cell>
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
                    <Table.Cell colSpan={3}>Total</Table.Cell>
                    <Table.Cell className="text-end">$1,200.00</Table.Cell>
                </Table.Row>
            </Table.Footer>
        </Table.Root>
    );
}

export default function TableDemo() {
    return (
        <PaletteGrid palettes={SURFACES} className="flex flex-col gap-4">
            <DemoContent />
        </PaletteGrid>
    );
}

"use client";

import type { Column } from "@fragiola/data-grid-react";
import { useLocalRows } from "@fragiola/data-grid-react/local";
import { navigation } from "@fragiola/data-grid-react/navigation";
import { pagination } from "@fragiola/data-grid-react/pagination";
import { rowSelection } from "@fragiola/data-grid-react/row-selection";
import { sorting } from "@fragiola/data-grid-react/sorting";
import { useState } from "react";
import { DataGrid } from "#/components/ui/data-grid";

// A data grid in one line: DataGrid.Template.Simple renders the header,
// the virtualized rows and, for each feature the grid installs, its piece —
// here the sort arrows (click a header; Ctrl or ⌘ adds a column), a check
// box column ("select all" covers the page) and the pages below. Click a
// cell or Tab in, then the arrows, Home / End and PageUp / PageDown move
// the active cell; Shift+Space selects its row. The rows are sorted and
// paged in memory by the package's `useLocalRows`. The grid needs a height
// (here `h-80`): it is a scroll container.

type Invoice = {
    id: number;
    customer: string;
    status: "Paid" | "Pending" | "Overdue";
    amount: number;
    due: string;
};

const CUSTOMERS = ["Acme", "Globex", "Initech", "Umbrella", "Hooli", "Stark"];
const STATUSES = ["Paid", "Pending", "Overdue"] as const;

const INVOICES: Invoice[] = Array.from({ length: 480 }, (_, i) => ({
    id: 1001 + i,
    customer: CUSTOMERS[(i * 5) % CUSTOMERS.length] ?? "",
    status: STATUSES[(i * 7) % STATUSES.length] ?? "Paid",
    amount: 120 + ((i * 397) % 4800),
    due: `2026-${String(1 + (i % 12)).padStart(2, "0")}-${String(1 + ((i * 3) % 28)).padStart(2, "0")}`,
}));

const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const columns: Column<Invoice>[] = [
    { key: "id", name: "Invoice", width: 110, sortable: true },
    { key: "customer", name: "Customer", width: 160, sortable: true },
    { key: "status", name: "Status", width: 120, sortable: true },
    {
        key: "amount",
        name: "Amount",
        width: 130,
        sortable: true,
        renderCell: ({ row }) => money.format(row.amount),
    },
    { key: "due", name: "Due", width: 130, sortable: true },
];

// Made once: a grid installs its features when it mounts.
const features = [navigation(), sorting(), rowSelection(), pagination()];

export default function DataGridExample() {
    const local = useLocalRows(INVOICES, columns, { features, pageSize: 20 });
    const [selected, setSelected] = useState<readonly unknown[]>([]);
    return (
        <div className="flex w-full flex-col gap-2">
            <p className="text-sm text-palette-accent/85">
                {selected.length} of {INVOICES.length} invoices selected
            </p>
            <DataGrid.Template.Simple
                features={features}
                {...local.props}
                columns={columns}
                rowKey={(invoice) => invoice.id}
                rowSelection="multiple"
                onSelectedRowKeysChange={setSelected}
                aria-label="Invoices"
                className="h-80"
            />
        </div>
    );
}

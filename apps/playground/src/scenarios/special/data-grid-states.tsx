import type { ColumnOrGroup } from "@fragiola/data-grid-react";
import { navigation } from "@fragiola/data-grid-react/navigation";
import { useId } from "react";
import { DataGrid } from "#/components/ui/data-grid";

// The core states, one grid each: rows still loading (a `getRow` that has
// only the first three rows: the others shimmer like a Skeleton), an empty grid
// ("No rows", or the consumer's children, centred below the header), and
// column groups (a header row per level, the groups centred over their
// columns, a column without a group spanning both rows).

type Order = {
    id: number;
    customer: string;
    city: string;
    country: string;
    items: number;
    total: number;
};

const ORDERS: Order[] = Array.from({ length: 500 }, (_, i) => ({
    id: 1000 + i,
    customer: `Customer ${i + 1}`,
    city: ["Lisbon", "Recife", "Osaka"][i % 3] ?? "",
    country: ["Portugal", "Brazil", "Japan"][i % 3] ?? "",
    items: 1 + (i % 9),
    total: 20 + ((i * 37) % 900),
}));

const grouped: ColumnOrGroup<Order>[] = [
    { key: "id", name: "Order", width: 100 },
    {
        key: "who",
        name: "Customer",
        children: [
            { key: "customer", name: "Name", width: 160 },
            {
                key: "where",
                name: "Address",
                children: [
                    { key: "city", name: "City", width: 120 },
                    { key: "country", name: "Country", width: 120 },
                ],
            },
        ],
    },
    {
        key: "figures",
        name: "Figures",
        children: [
            { key: "items", name: "Items", width: 90 },
            { key: "total", name: "Total", width: 110 },
        ],
    },
];

const flat: ColumnOrGroup<Order>[] = [
    { key: "id", name: "Order", width: 100 },
    { key: "customer", name: "Name", width: 160 },
    { key: "city", name: "City", width: 120 },
    { key: "items", name: "Items", width: 90 },
    { key: "total", name: "Total", width: 110 },
];

// The first 3 rows are loaded; the others never are.
const getRow = (index: number) => (index < 3 ? ORDERS[index] : undefined);

const features = [navigation()];

export default function DataGridStates() {
    const loading = useId();
    const empty = useId();
    const groups = useId();
    return (
        <div className="flex w-[48rem] max-w-full flex-col gap-6">
            <section className="flex flex-col gap-2">
                <span id={loading} className="text-sm text-palette-accent/85">
                    Loading rows
                </span>
                <DataGrid.Template.Simple
                    features={features}
                    columns={flat}
                    rowCount={ORDERS.length}
                    getRow={getRow}
                    aria-labelledby={loading}
                    className="h-64"
                />
            </section>
            <section className="flex flex-col gap-2">
                <span id={empty} className="text-sm text-palette-accent/85">
                    Empty
                </span>
                <DataGrid.Template.Simple
                    features={features}
                    columns={flat}
                    rows={[]}
                    empty="No orders yet."
                    aria-labelledby={empty}
                    className="h-48"
                />
            </section>
            <section className="flex flex-col gap-2">
                <span id={groups} className="text-sm text-palette-accent/85">
                    Column groups
                </span>
                <DataGrid.Template.Simple
                    features={features}
                    columns={grouped}
                    rows={ORDERS}
                    rowKey={(order) => order.id}
                    aria-labelledby={groups}
                    className="h-80"
                />
            </section>
        </div>
    );
}

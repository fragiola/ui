import type { Column } from "@fragiola/data-grid-react";
import { columnPinning } from "@fragiola/data-grid-react/column-pinning";
import { columnResize } from "@fragiola/data-grid-react/column-resize";
import { navigation } from "@fragiola/data-grid-react/navigation";
import { rowSelection } from "@fragiola/data-grid-react/row-selection";
import { sorting } from "@fragiola/data-grid-react/sorting";
import { DataGrid } from "#/components/ui/data-grid";

// The same grid under each condition, beside the default: a palette class
// on the root (it re-tints the frame, the header, the rows, the active
// ring and the check boxes), each density (the rows' height follows the
// spacing scale through the engine: 28.8 / 36 / 43.2px), right-to-left
// (the first column on the right, the pinned check box column at the
// right edge, the resizers on each cell's left edge, the pinned edge's
// shadow mirrored), and the other design axes on a frame. Scroll sideways
// to see the pinned edges' shadow; sort, select or resize in any of them.

const frames: {
    label: string;
    className?: string;
    attrs?: Record<string, string>;
}[] = [
    { label: "default" },
    { label: "palette-surface-blue", className: "palette-surface-blue" },
    { label: "palette-surface-rose", className: "palette-surface-rose" },
    { label: "dir=rtl", attrs: { dir: "rtl" } },
    { label: "density compact", attrs: { "data-density": "compact" } },
    { label: "density spacious", attrs: { "data-density": "spacious" } },
    { label: "radius flat", attrs: { "data-radius": "flat" } },
    { label: "radius full", attrs: { "data-radius": "full" } },
    { label: "text large", attrs: { "data-text": "large" } },
    { label: "elevation flat", attrs: { "data-elevation": "flat" } },
    { label: "elevation raised", attrs: { "data-elevation": "raised" } },
    { label: "motion none", attrs: { "data-motion": "none" } },
];

type Item = {
    id: number;
    name: string;
    kind: string;
    size: number;
    owner: string;
};

const ITEMS: Item[] = Array.from({ length: 300 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    kind: ["Report", "Sheet", "Deck"][i % 3] ?? "",
    size: (i * 53) % 900,
    owner: ["Ada", "Grace", "Alan", "Edsger"][i % 4] ?? "",
}));

const columns: Column<Item>[] = [
    {
        key: "name",
        name: "Name",
        width: 140,
        sortable: true,
        resizable: true,
        pinned: "start",
    },
    { key: "kind", name: "Kind", width: 120, sortable: true, resizable: true },
    { key: "size", name: "Size", width: 100, sortable: true, resizable: true },
    {
        key: "owner",
        name: "Owner",
        width: 140,
        sortable: true,
        resizable: true,
    },
];

const features = [
    navigation(),
    sorting(),
    columnResize(),
    columnPinning(),
    rowSelection(),
];

export default function DataGridMatrix() {
    return (
        <div className="grid w-[64rem] max-w-full grid-cols-1 gap-6 md:grid-cols-2">
            {frames.map(({ label, className, attrs }) => (
                <figure
                    key={label}
                    className="flex min-w-0 flex-col gap-1"
                    {...attrs}
                >
                    <figcaption className="text-xs text-palette-accent/85">
                        {label}
                    </figcaption>
                    <DataGrid.Template.Simple
                        features={features}
                        columns={columns}
                        rows={ITEMS}
                        rowKey={(item) => item.id}
                        rowSelection="multiple"
                        defaultSelectedRowKeys={[2, 3]}
                        defaultSortColumns={[
                            { columnKey: "name", direction: "ascending" },
                        ]}
                        aria-label={label}
                        className={`h-56 ${className ?? ""}`}
                    />
                </figure>
            ))}
        </div>
    );
}

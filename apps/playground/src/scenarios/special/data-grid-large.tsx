import type { Column } from "@fragiola/data-grid-react";
import { navigation } from "@fragiola/data-grid-react/navigation";
import { DataGrid } from "#/components/ui/data-grid";

// 10 000 rows × 30 columns, windowed on both axes, under compact, default
// and spacious density. The styled Root tells the engine the rows' height
// from the spacing scale (nine steps: 28.8 / 36 / 43.2px), so the window
// stays exact: scroll fast, drag the scrollbar to the end, or click a cell
// and hold PageDown / Ctrl+End — no gap, no overlap, no row cut in half.

type Row = { id: number } & Record<string, number>;

const COLUMNS: Column<Row>[] = [
    { key: "id", name: "#", width: 80 },
    ...Array.from({ length: 29 }, (_, i) => ({
        key: `c${i}`,
        name: `Column ${i + 1}`,
        width: 120,
        getValue: (row: Row) => (row.id * (i + 3)) % 1000,
    })),
];

const ROWS: Row[] = Array.from({ length: 10_000 }, (_, i) => ({ id: i + 1 }));

const features = [navigation()];

const densities = ["compact", "default", "spacious"] as const;

export default function DataGridLarge() {
    return (
        <div className="grid w-[64rem] max-w-full grid-cols-1 gap-4 lg:grid-cols-3">
            {densities.map((density) => (
                <figure
                    key={density}
                    className="flex min-w-0 flex-col gap-1"
                    data-density={density === "default" ? undefined : density}
                >
                    <figcaption className="text-xs text-palette-accent/85">
                        density {density}
                    </figcaption>
                    <DataGrid.Template.Simple
                        features={features}
                        columns={COLUMNS}
                        rows={ROWS}
                        rowKey={(row) => row.id}
                        aria-label={`10 000 rows, ${density}`}
                        className="h-96"
                    />
                </figure>
            ))}
        </div>
    );
}

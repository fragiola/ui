import type { Column } from "@fragiola/data-grid-react";
import { columnPinning } from "@fragiola/data-grid-react/column-pinning";
import { navigation } from "@fragiola/data-grid-react/navigation";
import { useId } from "react";
import { DataGrid } from "#/components/ui/data-grid";

// columnPinning() alone: the name pinned at the start, the score at the end,
// eight columns scrolling between them. Scroll sideways: the pinned cells
// stay, opaque from their row's fill (hover a row, or click a cell), with a
// line rule on their edge and the elevation shadow while content hides under
// it. Switch the toolbar to RTL: the sides mirror.

type Person = {
    id: number;
    name: string;
    email: string;
    team: string;
    score: number;
};

const TEAMS = ["Core", "Growth", "Design", "Data"];

const PEOPLE: Person[] = Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    name: `Person ${i + 1}`,
    email: `person${i + 1}@example.com`,
    team: TEAMS[(i * 3) % TEAMS.length] ?? "",
    score: (i * 37) % 100,
}));

const features = [navigation(), columnPinning()];

const columns: Column<Person>[] = [
    { key: "name", name: "Name", width: 160, pinned: "start" },
    ...Array.from({ length: 8 }, (_, i) => ({
        key: `col${i}`,
        name: `Column ${i + 1}`,
        width: 140,
        getValue: (person: Person) => `${person.team} ${i + 1}`,
    })),
    { key: "score", name: "Score", width: 100, pinned: "end" as const },
];

export default function DataGridPinning() {
    const label = useId();
    return (
        <div className="flex w-[44rem] max-w-full flex-col gap-2">
            <span id={label} className="text-sm text-palette-accent/85">
                Pinning
            </span>
            <DataGrid.Template.Simple
                features={features}
                rows={PEOPLE}
                columns={columns}
                rowKey={(person) => person.id}
                aria-labelledby={label}
                className="h-80"
            />
        </div>
    );
}

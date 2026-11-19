import type { Column } from "@fragiola/data-grid-react";
import { useLocalRows } from "@fragiola/data-grid-react/local";
import { navigation } from "@fragiola/data-grid-react/navigation";
import { sorting } from "@fragiola/data-grid-react/sorting";
import { useId } from "react";
import { DataGrid } from "#/components/ui/data-grid";

// sorting() alone: a click (or Enter on the active header) sorts ascending,
// then descending, then not; Ctrl or ⌘ adds a column, and each sorted column
// shows its arrow and its place in the sort. The header cell's `aria-sort`
// says the first one. The rows are sorted in memory by `useLocalRows`.

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

const features = [navigation(), sorting()];

const columns: Column<Person>[] = [
    { key: "name", name: "Name", width: 160, sortable: true },
    { key: "team", name: "Team", width: 140, sortable: true },
    { key: "score", name: "Score", width: 120, sortable: true },
    { key: "email", name: "Email (not sortable)", width: 240 },
];

export default function DataGridSorting() {
    const local = useLocalRows(PEOPLE, columns, { features });
    const label = useId();
    return (
        <div className="flex w-[44rem] max-w-full flex-col gap-2">
            <span id={label} className="text-sm text-palette-accent/85">
                Sorting
            </span>
            <DataGrid.Template.Simple
                features={features}
                {...local.props}
                columns={columns}
                rowKey={(person) => person.id}
                aria-labelledby={label}
                className="h-80"
            />
        </div>
    );
}

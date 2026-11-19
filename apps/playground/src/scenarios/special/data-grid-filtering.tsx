import type { Column } from "@fragiola/data-grid-react";
import { filtering } from "@fragiola/data-grid-react/filtering";
import { useLocalRows } from "@fragiola/data-grid-react/local";
import { navigation } from "@fragiola/data-grid-react/navigation";
import { useId } from "react";
import { DataGrid } from "#/components/ui/data-grid";

// filtering() alone: a text filter under each name (the rows whose value
// contains it), a select for the team (`meta.filterOptions`: the rows equal
// to the choice, "All" clears it), none for the score (`meta.filterable:
// false`). A click hands a filter the keys, Escape gives them back. With no
// match, the empty state shows.

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

const features = [navigation(), filtering()];

const columns: Column<Person>[] = [
    { key: "name", name: "Name", width: 160 },
    { key: "team", name: "Team", width: 160, meta: { filterOptions: TEAMS } },
    { key: "email", name: "Email", width: 240 },
    { key: "score", name: "Score", width: 100, meta: { filterable: false } },
];

export default function DataGridFiltering() {
    const local = useLocalRows(PEOPLE, columns, { features });
    const label = useId();
    return (
        <div className="flex w-[44rem] max-w-full flex-col gap-2">
            <span id={label} className="text-sm text-palette-accent/85">
                Filtering
            </span>
            <DataGrid.Template.Simple
                features={features}
                {...local.props}
                columns={columns}
                rowKey={(person) => person.id}
                empty="No person matches these filters."
                aria-labelledby={label}
                className="h-80"
            />
        </div>
    );
}

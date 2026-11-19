import type { Column } from "@fragiola/data-grid-react";
import { useLocalRows } from "@fragiola/data-grid-react/local";
import { navigation } from "@fragiola/data-grid-react/navigation";
import { pagination } from "@fragiola/data-grid-react/pagination";
import { useId } from "react";
import { DataGrid } from "#/components/ui/data-grid";

// pagination() alone: 1 000 rows paged by `useLocalRows`, 25 a page, the
// pages below the grid (the first, the last, the current one and its
// neighbours; Previous and Next disabled at the ends) and a page size to
// choose.

type Person = {
    id: number;
    name: string;
    email: string;
    team: string;
    score: number;
};

const TEAMS = ["Core", "Growth", "Design", "Data"];

const PEOPLE: Person[] = Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    name: `Person ${i + 1}`,
    email: `person${i + 1}@example.com`,
    team: TEAMS[(i * 3) % TEAMS.length] ?? "",
    score: (i * 37) % 100,
}));

const features = [navigation(), pagination()];

const columns: Column<Person>[] = [
    { key: "id", name: "#", width: 80 },
    { key: "name", name: "Name", width: 160 },
    { key: "team", name: "Team", width: 140 },
    { key: "email", name: "Email", width: 240 },
];

export default function DataGridPagination() {
    const local = useLocalRows(PEOPLE, columns, { features, pageSize: 25 });
    const label = useId();
    return (
        <div className="flex w-[44rem] max-w-full flex-col gap-2">
            <span id={label} className="text-sm text-palette-accent/85">
                Pagination
            </span>
            <DataGrid.Template.Simple
                features={features}
                {...local.props}
                columns={columns}
                rowKey={(person) => person.id}
                pageSizes={[25, 50, 100]}
                aria-labelledby={label}
                className="h-80"
            />
        </div>
    );
}

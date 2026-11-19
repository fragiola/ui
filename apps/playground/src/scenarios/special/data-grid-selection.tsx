import type { Column } from "@fragiola/data-grid-react";
import { navigation } from "@fragiola/data-grid-react/navigation";
import { rowSelection } from "@fragiola/data-grid-react/row-selection";
import { useId } from "react";
import { DataGrid } from "#/components/ui/data-grid";

// rowSelection() alone, in multiple mode: the check box column ("select all"
// is tri-state: mixed while some rows are selected), Shift+click selects
// from the last row toggled, and on the active cell Shift+Space selects its
// row, Shift+arrows extend, Ctrl or ⌘+A selects every row. Every third row
// cannot be selected (`isRowSelectable`): its box is disabled and "select
// all" leaves it out.

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

const features = [navigation(), rowSelection()];

const columns: Column<Person>[] = [
    { key: "name", name: "Name", width: 160 },
    { key: "team", name: "Team", width: 140 },
    { key: "email", name: "Email", width: 240 },
];

export default function DataGridSelection() {
    const label = useId();
    return (
        <div className="flex w-[44rem] max-w-full flex-col gap-2">
            <span id={label} className="text-sm text-palette-accent/85">
                Selection
            </span>
            <DataGrid.Template.Simple
                features={features}
                rows={PEOPLE}
                columns={columns}
                rowKey={(person) => person.id}
                rowSelection="multiple"
                isRowSelectable={(person) => person.id % 3 !== 0}
                aria-labelledby={label}
                className="h-80"
            />
        </div>
    );
}

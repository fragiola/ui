import type { Column } from "@fragiola/data-grid-react";
import { editing } from "@fragiola/data-grid-react/editing";
import { navigation } from "@fragiola/data-grid-react/navigation";
import { useId, useState } from "react";
import { DataGrid } from "#/components/ui/data-grid";

// editing() alone: Enter, F2, typing or a double click edits a name or an
// email; Enter commits and moves down, Tab across, Escape cancels, a click
// outside commits. The email column's editor refuses an address without "@":
// its field turns danger and Enter keeps the edit open. The team is not
// editable.

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

const features = [navigation(), editing()];

const columns: Column<Person>[] = [
    { key: "name", name: "Name", width: 160, editable: true },
    {
        key: "email",
        name: "Email",
        width: 260,
        editable: true,
        renderEditCell: (props) => (
            <DataGrid.CellEditor
                {...props}
                type="email"
                invalid={!String(props.value).includes("@")}
            />
        ),
    },
    { key: "team", name: "Team (read only)", width: 160 },
];

export default function DataGridEditing() {
    const [people, setPeople] = useState(PEOPLE);
    const label = useId();
    return (
        <div className="flex w-[44rem] max-w-full flex-col gap-2">
            <span id={label} className="text-sm text-palette-accent/85">
                Editing
            </span>
            <DataGrid.Template.Simple
                features={features}
                rows={people}
                columns={columns}
                rowKey={(person) => person.id}
                onCellEdit={({ row, columnKey, value }) =>
                    // a click outside commits a refused email too: not written
                    setPeople((current) =>
                        columnKey === "email" && !String(value).includes("@")
                            ? current
                            : current.map((person) =>
                                  person.id === row.id
                                      ? { ...person, [columnKey]: value }
                                      : person,
                              ),
                    )
                }
                aria-labelledby={label}
                className="h-80"
            />
        </div>
    );
}

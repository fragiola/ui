import type { Column } from "@fragiola/data-grid-react";
import { columnResize } from "@fragiola/data-grid-react/column-resize";
import { navigation } from "@fragiola/data-grid-react/navigation";
import { useId } from "react";
import { DataGrid } from "#/components/ui/data-grid";

// columnResize() alone: drag a resizer on a header cell's end edge (shown on
// the header's hover, `ring` while held or focused), double-click it to fit
// the column, or press F2 on the header cell, Tab to the resizer and use the
// arrows (Shift: 50px), Home / End, Enter to fit and Escape. The email
// column does not resize: no handle.

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

const features = [navigation(), columnResize()];

const columns: Column<Person>[] = [
    { key: "name", name: "Name", width: 160, resizable: true, minWidth: 80 },
    { key: "team", name: "Team", width: 140, resizable: true },
    { key: "score", name: "Score", width: 120, resizable: true, maxWidth: 200 },
    { key: "email", name: "Email (fixed)", width: 240 },
];

export default function DataGridResizing() {
    const label = useId();
    return (
        <div className="flex w-[44rem] max-w-full flex-col gap-2">
            <span id={label} className="text-sm text-palette-accent/85">
                Resizing
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

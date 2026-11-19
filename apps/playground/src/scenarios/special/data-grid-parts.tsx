import type { Column } from "@fragiola/data-grid-react";
import { navigation } from "@fragiola/data-grid-react/navigation";
import { useId } from "react";
import { DataGrid } from "#/components/ui/data-grid";

// The core parts by hand, with navigation() only: 10 000 rows and 12
// columns, windowed on both axes. Click a cell or Tab in, then the arrows,
// Home / End, Ctrl+Home / Ctrl+End and PageUp / PageDown: the active cell's
// inset ring follows, its row takes the half-`soft` tint, and the header
// stays on top. No sorting, resizing or pinning: their pieces are absent.

type Person = {
    id: number;
    name: string;
    email: string;
    city: string;
    team: string;
    role: string;
    score: number;
    joined: string;
};

const CITIES = ["Lisbon", "Recife", "Osaka", "Lagos", "Quito", "Oslo"];
const TEAMS = ["Core", "Growth", "Design", "Data", "Infra"];
const ROLES = ["Engineer", "Designer", "Manager", "Analyst"];

const PEOPLE: Person[] = Array.from({ length: 10_000 }, (_, i) => ({
    id: i + 1,
    name: `Person ${i + 1}`,
    email: `person${i + 1}@example.com`,
    city: CITIES[i % CITIES.length] ?? "",
    team: TEAMS[(i * 7) % TEAMS.length] ?? "",
    role: ROLES[(i * 3) % ROLES.length] ?? "",
    score: (i * 37) % 100,
    joined: `20${String(10 + (i % 15))}-0${1 + (i % 9)}-1${i % 9}`,
}));

const columns: Column<Person>[] = [
    { key: "id", name: "#", width: 72 },
    { key: "name", name: "Name", width: 160 },
    { key: "email", name: "Email", width: 240 },
    { key: "city", name: "City", width: 120 },
    { key: "team", name: "Team", width: 120 },
    { key: "role", name: "Role", width: 140 },
    { key: "score", name: "Score", width: 100 },
    { key: "joined", name: "Joined", width: 140 },
    { key: "a", name: "Notes A", width: 180, getValue: () => "—" },
    { key: "b", name: "Notes B", width: 180, getValue: () => "—" },
    { key: "c", name: "Notes C", width: 180, getValue: () => "—" },
    { key: "d", name: "Notes D", width: 180, getValue: () => "—" },
];

const features = [navigation()];

export default function DataGridParts() {
    const label = useId();
    return (
        <div className="flex w-[56rem] max-w-full flex-col gap-2">
            <span id={label} className="text-sm text-palette-accent/85">
                People (10 000 rows)
            </span>
            <DataGrid.Root
                features={features}
                columns={columns}
                rows={PEOPLE}
                rowKey={(person) => person.id}
                className="h-96"
            >
                <DataGrid.Grid aria-labelledby={label}>
                    <DataGrid.Header>
                        <DataGrid.HeaderRow>
                            <DataGrid.HeaderCells<Person>>
                                {(cell) => <DataGrid.HeaderCell cell={cell} />}
                            </DataGrid.HeaderCells>
                        </DataGrid.HeaderRow>
                    </DataGrid.Header>
                    <DataGrid.Body>
                        <DataGrid.Rows<Person>>
                            {(row) => (
                                <DataGrid.Row row={row}>
                                    <DataGrid.Cells<Person>>
                                        {(cell) => (
                                            <DataGrid.Cell cell={cell} />
                                        )}
                                    </DataGrid.Cells>
                                </DataGrid.Row>
                            )}
                        </DataGrid.Rows>
                    </DataGrid.Body>
                    <DataGrid.Empty />
                </DataGrid.Grid>
            </DataGrid.Root>
        </div>
    );
}

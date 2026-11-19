"use client";

import {
    type Column,
    type HeaderCellInfo,
    headerCellContent,
} from "@fragiola/data-grid-react";
import { columnPinning } from "@fragiola/data-grid-react/column-pinning";
import { columnResize } from "@fragiola/data-grid-react/column-resize";
import { editing } from "@fragiola/data-grid-react/editing";
import { filtering } from "@fragiola/data-grid-react/filtering";
import { useLocalRows } from "@fragiola/data-grid-react/local";
import { navigation } from "@fragiola/data-grid-react/navigation";
import { sorting } from "@fragiola/data-grid-react/sorting";
import { useId, useState } from "react";
import { Clickable } from "#/components/atoms/clickable";
import { DataGrid } from "#/components/ui/data-grid";

// A people directory composed from the parts, for what Template.Simple does
// not do: a toolbar outside the grid (a count and "Clear filters"), the
// name pinned at the start and the office at the end (scroll sideways:
// they stay, with a shadow on their edge), a filter under each name (a
// select for the enumerated columns), every column resizable (drag a
// header's edge, or F2 then Tab to it and use the arrows), and the title
// and email edited in place — Enter, F2, typing or a double click; an
// email without "@" is refused: the field turns danger and the edit stays
// open (a click outside ends it, and the app writes no such email). The
// app keeps the people and writes each edit. Copy it and change
// what your app needs.

type Person = {
    id: number;
    name: string;
    title: string;
    team: string;
    email: string;
    phone: string;
    office: string;
};

const FIRST = [
    "Ada",
    "Grace",
    "Alan",
    "Edsger",
    "Barbara",
    "Donald",
    "Frances",
    "Ken",
];
const LAST = [
    "Lovelace",
    "Hopper",
    "Turing",
    "Dijkstra",
    "Liskov",
    "Knuth",
    "Allen",
    "Thompson",
];
const TEAMS = ["Platform", "Payments", "Design", "Research"];
const OFFICES = ["Lisbon", "Recife", "Tokyo"];
const TITLES = ["Engineer", "Senior engineer", "Designer", "Manager"];

const PEOPLE: Person[] = Array.from({ length: 300 }, (_, i) => {
    const first = FIRST[i % FIRST.length] ?? "";
    const last = LAST[(i * 3) % LAST.length] ?? "";
    return {
        id: i + 1,
        name: `${first} ${last}`,
        title: TITLES[(i * 5) % TITLES.length] ?? "",
        team: TEAMS[(i * 7) % TEAMS.length] ?? "",
        email: `${first}.${last}${i + 1}@example.com`.toLowerCase(),
        phone: `+1 555 ${String(1000 + ((i * 37) % 9000)).padStart(4, "0")}`,
        office: OFFICES[i % OFFICES.length] ?? "",
    };
});

const columns: Column<Person>[] = [
    {
        key: "name",
        name: "Name",
        width: 180,
        pinned: "start",
        sortable: true,
        resizable: true,
    },
    {
        key: "title",
        name: "Title",
        width: 170,
        sortable: true,
        resizable: true,
        editable: true,
        renderEditCell: (props) => <DataGrid.CellEditor {...props} />,
    },
    {
        key: "team",
        name: "Team",
        width: 150,
        sortable: true,
        resizable: true,
        meta: { filterOptions: TEAMS },
    },
    {
        key: "email",
        name: "Email",
        width: 260,
        resizable: true,
        editable: true,
        renderEditCell: (props) => (
            <DataGrid.CellEditor
                {...props}
                type="email"
                invalid={!String(props.value).includes("@")}
            />
        ),
    },
    { key: "phone", name: "Phone", width: 150, resizable: true },
    {
        key: "office",
        name: "Office",
        width: 130,
        pinned: "end",
        sortable: true,
        resizable: true,
        meta: { filterOptions: OFFICES },
    },
];

// Made once: a grid installs its features when it mounts.
const features = [
    navigation(),
    sorting(),
    filtering(),
    editing(),
    columnResize(),
    columnPinning(),
];

// A header cell: its name and sort arrow, its filter, its resizer. Named
// by its title alone: its name would otherwise take the filter's text in.
function HeaderCell({ cell }: { cell: HeaderCellInfo<Person> }) {
    const title = useId();
    return (
        <DataGrid.HeaderCell cell={cell} aria-labelledby={title}>
            <DataGrid.HeaderLabel>
                <DataGrid.HeaderTitle id={title}>
                    {headerCellContent(cell)}
                </DataGrid.HeaderTitle>
                <DataGrid.SortIndicator cell={cell} />
            </DataGrid.HeaderLabel>
            <DataGrid.HeaderFilter cell={cell} />
            <DataGrid.ColumnResizer cell={cell} />
        </DataGrid.HeaderCell>
    );
}

export default function DataGridPeopleDirectory() {
    const [people, setPeople] = useState(PEOPLE);
    const local = useLocalRows(people, columns, { features });
    return (
        <div className="flex h-full min-h-0 w-full flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
                <p
                    className="text-sm text-palette-accent/85"
                    data-testid="count"
                >
                    {local.filteredCount} of {people.length} people
                </p>
                <Clickable.Button
                    size="sm"
                    variant="outline"
                    onClick={() => local.filter.clear()}
                >
                    Clear filters
                </Clickable.Button>
            </div>
            <DataGrid.Root
                features={features}
                {...local.props}
                columns={columns}
                rowKey={(person) => person.id}
                onCellEdit={({ row, columnKey, value }) => {
                    // the editor keeps Enter and Tab from committing a
                    // refused email; a click outside still commits, so the
                    // app checks what it writes
                    const text = String(value);
                    if (columnKey === "email" && !text.includes("@")) return;
                    setPeople((current) =>
                        current.map((person) =>
                            person.id === row.id
                                ? { ...person, [columnKey]: text }
                                : person,
                        ),
                    );
                }}
                className="min-h-0 flex-1"
            >
                <DataGrid.Grid aria-label="People">
                    <DataGrid.Header>
                        <DataGrid.HeaderRow>
                            <DataGrid.HeaderCells<Person>>
                                {(cell) => <HeaderCell cell={cell} />}
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
                    <DataGrid.Empty>
                        No one matches these filters.
                    </DataGrid.Empty>
                </DataGrid.Grid>
            </DataGrid.Root>
        </div>
    );
}

import type { Column } from "@fragiola/data-grid-react";
import { columnPinning } from "@fragiola/data-grid-react/column-pinning";
import { columnResize } from "@fragiola/data-grid-react/column-resize";
import { editing } from "@fragiola/data-grid-react/editing";
import { filtering } from "@fragiola/data-grid-react/filtering";
import { useLocalRows } from "@fragiola/data-grid-react/local";
import { navigation } from "@fragiola/data-grid-react/navigation";
import { pagination } from "@fragiola/data-grid-react/pagination";
import { rowSelection } from "@fragiola/data-grid-react/row-selection";
import { sorting } from "@fragiola/data-grid-react/sorting";
import { useId, useState } from "react";
import { DataGrid } from "#/components/ui/data-grid";

// Template.Simple with all seven common features installed: a check box
// column pinned at the start ("select all" over the page), sortable
// headers (Ctrl or ⌘+click adds a column: the priority shows), resizers,
// filters under each name (a select for the enumerated columns), the
// email edited in place (an address without "@" is refused: the field
// turns danger and Enter keeps the edit open), the status pinned at the
// end, and the pages below. The second grid is the same template with no
// feature: a plain table, none of the pieces.

type Person = {
    id: number;
    name: string;
    email: string;
    city: string;
    team: string;
    score: number;
    status: string;
};

const CITIES = ["Lisbon", "Recife", "Osaka", "Lagos", "Quito", "Oslo"];
const TEAMS = ["Core", "Growth", "Design", "Data", "Infra"];
const STATUSES = ["Active", "Away", "Invited"];

const PEOPLE: Person[] = Array.from({ length: 2_000 }, (_, i) => ({
    id: i + 1,
    name: `Person ${i + 1}`,
    email: `person${i + 1}@example.com`,
    city: CITIES[(i * 5) % CITIES.length] ?? "",
    team: TEAMS[(i * 7) % TEAMS.length] ?? "",
    score: (i * 37) % 100,
    status: STATUSES[(i * 11) % STATUSES.length] ?? "",
}));

const features = [
    navigation(),
    sorting(),
    columnResize(),
    columnPinning(),
    rowSelection(),
    filtering(),
    editing(),
    pagination(),
];

const columns: Column<Person>[] = [
    {
        key: "name",
        name: "Name",
        width: 160,
        sortable: true,
        resizable: true,
        pinned: "start",
    },
    {
        key: "email",
        name: "Email",
        width: 240,
        sortable: true,
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
    {
        key: "city",
        name: "City",
        width: 140,
        sortable: true,
        resizable: true,
        meta: { filterOptions: CITIES },
    },
    {
        key: "team",
        name: "Team",
        width: 140,
        sortable: true,
        resizable: true,
        meta: { filterOptions: TEAMS },
    },
    {
        key: "score",
        name: "Score",
        width: 100,
        sortable: true,
        resizable: true,
    },
    {
        key: "notes",
        name: "Notes",
        width: 260,
        editable: true,
        getValue: () => "",
    },
    {
        key: "status",
        name: "Status",
        width: 120,
        sortable: true,
        pinned: "end",
        meta: { filterOptions: STATUSES },
    },
];

const plain: Column<Person>[] = columns.map(({ key, name, width }) => ({
    key,
    name,
    width,
}));

export default function DataGridTemplateSimple() {
    const [people, setPeople] = useState(PEOPLE);
    const local = useLocalRows(people, columns, { features, pageSize: 50 });
    const [selected, setSelected] = useState<readonly unknown[]>([]);
    const label = useId();
    return (
        <div className="flex w-[56rem] max-w-full flex-col gap-6">
            <section className="flex flex-col gap-2">
                <span id={label} className="text-sm text-palette-accent/85">
                    People — {local.filteredCount} shown, {selected.length}{" "}
                    selected
                </span>
                <DataGrid.Template.Simple
                    features={features}
                    {...local.props}
                    columns={columns}
                    rowKey={(person) => person.id}
                    rowSelection="multiple"
                    onSelectedRowKeysChange={setSelected}
                    onCellEdit={({ row, columnKey, value }) =>
                        setPeople((current) =>
                            current.map((person) =>
                                person.id === row.id
                                    ? { ...person, [columnKey]: value }
                                    : person,
                            ),
                        )
                    }
                    pageSizes={[25, 50, 100]}
                    aria-labelledby={label}
                    className="h-96"
                />
            </section>
            <section className="flex flex-col gap-2">
                <span className="text-sm text-palette-accent/85">
                    No feature: a table
                </span>
                <DataGrid.Template.Simple
                    columns={plain}
                    rows={PEOPLE.slice(0, 50)}
                    aria-label="People, no feature"
                    className="h-64"
                />
            </section>
        </div>
    );
}

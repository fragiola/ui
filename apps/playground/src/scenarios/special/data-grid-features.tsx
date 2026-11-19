import {
    type Column,
    type HeaderCellInfo,
    headerCellContent,
    useDataGridRef,
} from "@fragiola/data-grid-react";
import { columnPinning } from "@fragiola/data-grid-react/column-pinning";
import { columnResize } from "@fragiola/data-grid-react/column-resize";
import { editing } from "@fragiola/data-grid-react/editing";
import { filtering } from "@fragiola/data-grid-react/filtering";
import { useLocalRows } from "@fragiola/data-grid-react/local";
import { navigation } from "@fragiola/data-grid-react/navigation";
import { pagination } from "@fragiola/data-grid-react/pagination";
import { rowSelection } from "@fragiola/data-grid-react/row-selection";
import { sorting } from "@fragiola/data-grid-react/sorting";
import { createContext, use, useId, useMemo, useState } from "react";
import { DataGrid } from "#/components/ui/data-grid";

// The seven feature pieces composed by hand from the parts — no template —
// right to left and at compact density: the check box column and the name
// pinned at the start (the right edge), the status at the end (the left
// edge), each resizer on its column's left edge (the end, right to left;
// the status' on its right edge, its boundary with the columns that
// scroll), the sort arrows and priorities (Ctrl or ⌘+click adds a column),
// a filter under each name, the role edited in place, and the pages below
// the frame through the Root's gridRef.

type Member = {
    id: number;
    name: string;
    role: string;
    team: string;
    status: string;
};

const TEAMS = ["Core", "Growth", "Design", "Data"];
const STATUSES = ["Active", "Away"];

const MEMBERS: Member[] = Array.from({ length: 240 }, (_, i) => ({
    id: i + 1,
    name: `Member ${i + 1}`,
    role: ["Engineer", "Designer", "Lead"][i % 3] ?? "",
    team: TEAMS[(i * 3) % TEAMS.length] ?? "",
    status: STATUSES[i % 2] ?? "",
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

// The page's keys, for "select all": the columns stay one array.
const PageKeys = createContext<readonly number[]>([]);

function SelectAll() {
    return <DataGrid.SelectAllCell rowKeys={use(PageKeys)} />;
}

const columns: Column<Member>[] = [
    {
        key: "select",
        width: 40,
        pinned: "start",
        meta: { filterable: false },
        renderHeaderCell: () => <SelectAll />,
        renderCell: ({ row, rowIndex }) => (
            <DataGrid.SelectCell
                rowIndex={rowIndex}
                aria-label={`Select ${row.name}`}
            />
        ),
    },
    {
        key: "name",
        name: "Name",
        width: 150,
        pinned: "start",
        sortable: true,
        resizable: true,
    },
    {
        key: "role",
        name: "Role",
        width: 160,
        sortable: true,
        resizable: true,
        editable: true,
        renderEditCell: (props) => (
            <DataGrid.CellEditor
                {...props}
                invalid={String(props.value).trim() === ""}
            />
        ),
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
        key: "notes",
        name: "Notes",
        width: 240,
        getValue: () => "—",
        meta: { filterable: false },
    },
    {
        key: "status",
        name: "Status",
        width: 120,
        pinned: "end",
        resizable: true,
        meta: { filterOptions: STATUSES },
    },
];

function HeaderCell({ cell }: { cell: HeaderCellInfo<Member> }) {
    return (
        <DataGrid.HeaderCell cell={cell}>
            <DataGrid.HeaderLabel>
                <DataGrid.HeaderTitle>
                    {headerCellContent(cell)}
                </DataGrid.HeaderTitle>
                <DataGrid.SortIndicator cell={cell} />
            </DataGrid.HeaderLabel>
            <DataGrid.HeaderFilter cell={cell} />
            <DataGrid.ColumnResizer cell={cell} />
        </DataGrid.HeaderCell>
    );
}

export default function DataGridFeatures() {
    const [members, setMembers] = useState(MEMBERS);
    const local = useLocalRows(members, columns, { features, pageSize: 20 });
    const gridRef = useDataGridRef<Member>();
    const label = useId();
    const pageKeys = useMemo(
        () => (local.props.rows ?? []).map((member) => member.id),
        [local.props.rows],
    );
    return (
        <div
            dir="rtl"
            data-density="compact"
            className="flex w-[44rem] max-w-full flex-col gap-2"
        >
            <span id={label} className="text-sm text-palette-accent/85">
                Members — {local.filteredCount}
            </span>
            <PageKeys value={pageKeys}>
                <DataGrid.Root
                    features={features}
                    {...local.props}
                    columns={columns}
                    rowKey={(member) => member.id}
                    rowSelection="multiple"
                    gridRef={gridRef}
                    onCellEdit={({ row, columnKey, value }) =>
                        setMembers((current) =>
                            current.map((member) =>
                                member.id === row.id
                                    ? { ...member, [columnKey]: value }
                                    : member,
                            ),
                        )
                    }
                    className="h-80"
                >
                    <DataGrid.Grid aria-labelledby={label}>
                        <DataGrid.Header>
                            <DataGrid.HeaderRow>
                                <DataGrid.HeaderCells<Member>>
                                    {(cell) => <HeaderCell cell={cell} />}
                                </DataGrid.HeaderCells>
                            </DataGrid.HeaderRow>
                        </DataGrid.Header>
                        <DataGrid.Body>
                            <DataGrid.Rows<Member>>
                                {(row) => (
                                    <DataGrid.Row row={row}>
                                        <DataGrid.Cells<Member>>
                                            {(cell) => (
                                                <DataGrid.Cell cell={cell} />
                                            )}
                                        </DataGrid.Cells>
                                    </DataGrid.Row>
                                )}
                            </DataGrid.Rows>
                        </DataGrid.Body>
                        <DataGrid.Empty>
                            No member matches these filters.
                        </DataGrid.Empty>
                    </DataGrid.Grid>
                </DataGrid.Root>
            </PageKeys>
            <DataGrid.Pagination gridRef={gridRef} />
        </div>
    );
}

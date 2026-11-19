"use client";

import {
    type Column,
    type ColumnOrGroup,
    type DataGridFeatures,
    type EditCellRenderProps,
    headerCellContent,
    type RootProps,
    type RowKey,
    type RowSelectable,
    useDataGridRef,
} from "@fragiola/data-grid-react";
import type * as React from "react";
import { createContext, use, useMemo } from "react";
import { CellEditor } from "../features/cell-editor";
import { ColumnResizer } from "../features/column-resizer";
import { HeaderFilter } from "../features/header-filter";
import { Pagination } from "../features/pagination";
import { SelectAllCell, SelectCell } from "../features/row-selection";
import { SortIndicator } from "../features/sort-indicator";
import {
    Body,
    Cell,
    Cells,
    Empty,
    Grid,
    Header,
    HeaderCell,
    HeaderCells,
    HeaderLabel,
    HeaderRow,
    HeaderRows,
    HeaderTitle,
    Root,
    Row,
    Rows,
} from "../parts";

// DataGrid.Template.Simple — a whole grid in one line, from its columns
// and rows (or rows in memory, `useLocalRows`) and the features it
// installs:
//
//   const features = [navigation(), sorting(), rowSelection(), pagination()];
//   const local = useLocalRows(people, columns, { features, pageSize: 25 });
//   <DataGrid.Template.Simple
//       features={features}
//       {...local.props}
//       columns={columns}
//       rowKey={(person) => person.id}
//       rowSelection="multiple"
//       aria-label="People"
//       className="h-96"
//   />
//
// The header (a row per level of column groups), the virtualized body and
// the empty state. The rest follows the features installed — read from the
// model by each piece (a feature not installed renders nothing), and from
// the same `features` list for the columns, which exist before the model:
//   sorting       a sort indicator in each sortable header cell
//   columnResize  a resizer on each resizable column's edge
//   rowSelection  a check box column first ("select all" over the rows
//                 given), with `rowSelection` set; pinned at the start with
//                 columnPinning
//   filtering     a filter under each column's name (a select for a column
//                 with `meta.filterOptions`; none with `meta.filterable`
//                 false)
//   editing       an editable column without `renderEditCell` gets the
//                 text editor
//   pagination    the pages below the grid (and `pageSizes` to choose from)
// Navigation and pinning need no piece: they are the package's and the
// cells'. It is assembled from the `DataGrid.*` parts and nothing else: a
// grid that outgrows it (a toolbar, a cell of its own, summary rows) copies
// this file and edits the parts. Other templates are examples to copy,
// never registry code.
//
// The template rules (the same as Input.Template.Simple):
// 1. No style of its own — no class, no tv(), nothing beyond the parts.
// 2. No appearance props — no variant, size, color, density, row height.
// 3. One className, going to the main piece (Root): its size (a grid needs
//    a height), and the palette channel.
//
// Forbidden: renderRow / cellProps / any *Props bag. Props stay flat.
//
// Ceiling of 7 props; it uses 5: aria-label, aria-labelledby, empty,
// pageSizes and className. Root's own props — features, columns, rows,
// rowKey, getRow, rowCount, the features' state (sortColumns,
// rowSelection, columnFilters, pageIndex…), their callbacks (onCellEdit…),
// gridRef… — are behaviour, forwarded via ...props, not template
// configuration. If an eighth is needed, stop and record it.
//
// Names: the grid's is the consumer's (`aria-label` or `aria-labelledby`);
// the pieces' words are their English defaults.

type SimpleProps<TRow, TFeatures extends DataGridFeatures = []> = Omit<
    RootProps<TRow, TFeatures>,
    "children" | "className"
> & {
    /** The grid's name (or `aria-labelledby`): the package sets none. */
    "aria-label"?: string | undefined;
    "aria-labelledby"?: string | undefined;
    /** What an empty grid shows: "No rows" unless given. */
    empty?: React.ReactNode;
    /** With pagination(), the page sizes to choose from. */
    pageSizes?: readonly number[] | undefined;
    className?: string | undefined;
};

// The keys "select all" covers, handed to the header's check box: the
// columns stay the same arrays while the rows change.
const SelectableKeys = createContext<readonly RowKey[]>([]);

const SELECT_COLUMN = "select";

function SelectAll() {
    return <SelectAllCell rowKeys={use(SelectableKeys)} />;
}

// The columns as given, plus what the features installed add: the check
// box column first, the text editor on an editable column without one.
function columnsFor<TRow>(
    columns: readonly ColumnOrGroup<TRow>[],
    installed: ReadonlySet<string>,
    selecting: boolean,
): readonly ColumnOrGroup<TRow>[] {
    const withEditor = (entry: ColumnOrGroup<TRow>): ColumnOrGroup<TRow> => {
        if ("children" in entry && entry.children) {
            return { ...entry, children: entry.children.map(withEditor) };
        }
        const column = entry as Column<TRow>;
        return column.editable && !column.renderEditCell
            ? {
                  ...column,
                  renderEditCell: (
                      props: EditCellRenderProps<TRow, React.ReactNode>,
                  ) => <CellEditor {...props} />,
              }
            : column;
    };
    const given = installed.has("editing") ? columns.map(withEditor) : columns;
    if (!installed.has("rowSelection") || !selecting) return given;
    const select: Column<TRow> = {
        key: SELECT_COLUMN,
        width: 44,
        pinned: installed.has("columnPinning") ? "start" : undefined,
        meta: { filterable: false },
        renderHeaderCell: () => <SelectAll />,
        renderCell: ({ rowIndex }) => <SelectCell rowIndex={rowIndex} />,
    };
    return [select, ...given];
}

function Simple<TRow, const TFeatures extends DataGridFeatures = []>({
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    empty,
    pageSizes,
    className,
    ...rootProps
}: SimpleProps<TRow, TFeatures>) {
    const { features, columns, rows, rowKey } = rootProps;
    const own = useDataGridRef<TRow>();
    const gridRef = rootProps.gridRef ?? own;
    const selection = rootProps as {
        rowSelection?: string;
        isRowSelectable?: RowSelectable<TRow>;
    };
    const installed = useMemo(
        () => new Set((features ?? []).map((feature) => feature.name)),
        [features],
    );
    const shown = useMemo(
        () =>
            columnsFor(
                columns ?? [],
                installed,
                selection.rowSelection !== undefined,
            ),
        [columns, installed, selection.rowSelection],
    );
    const selectable = useMemo(() => {
        const keep = selection.isRowSelectable;
        return (rows ?? []).flatMap((row, index) =>
            !keep || keep(row, index)
                ? [rowKey ? rowKey(row, index) : index]
                : [],
        );
    }, [rows, rowKey, selection.isRowSelectable]);
    const filtering = installed.has("filtering");
    return (
        <>
            <SelectableKeys value={selectable}>
                <Root<TRow, TFeatures>
                    {...(rootProps as RootProps<TRow, TFeatures>)}
                    columns={shown}
                    gridRef={gridRef}
                    className={className}
                >
                    <Grid
                        aria-label={ariaLabel}
                        aria-labelledby={ariaLabelledby}
                    >
                        <Header>
                            <HeaderRows<TRow>>
                                {(row) => (
                                    <HeaderRow<TRow> row={row}>
                                        <HeaderCells<TRow>>
                                            {(cell) => (
                                                <HeaderCell<TRow> cell={cell}>
                                                    <HeaderLabel>
                                                        <HeaderTitle>
                                                            {headerCellContent(
                                                                cell,
                                                            )}
                                                        </HeaderTitle>
                                                        <SortIndicator<TRow>
                                                            cell={cell}
                                                        />
                                                    </HeaderLabel>
                                                    {filtering && (
                                                        <HeaderFilter<TRow>
                                                            cell={cell}
                                                        />
                                                    )}
                                                    <ColumnResizer<TRow>
                                                        cell={cell}
                                                    />
                                                </HeaderCell>
                                            )}
                                        </HeaderCells>
                                    </HeaderRow>
                                )}
                            </HeaderRows>
                        </Header>
                        <Body>
                            <Rows<TRow>>
                                {(row) => (
                                    <Row<TRow> row={row}>
                                        <Cells<TRow>>
                                            {(cell) => (
                                                <Cell<TRow> cell={cell} />
                                            )}
                                        </Cells>
                                    </Row>
                                )}
                            </Rows>
                        </Body>
                        <Empty>{empty}</Empty>
                    </Grid>
                </Root>
            </SelectableKeys>
            {installed.has("pagination") && (
                <Pagination<TRow> gridRef={gridRef} pageSizes={pageSizes} />
            )}
        </>
    );
}

export { Simple as TemplateSimple };

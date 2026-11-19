"use client";

import { CellEditor } from "./data-grid/features/cell-editor";
import { ColumnResizer } from "./data-grid/features/column-resizer";
import { HeaderFilter } from "./data-grid/features/header-filter";
import { Pagination } from "./data-grid/features/pagination";
import { SelectAllCell, SelectCell } from "./data-grid/features/row-selection";
import { SortIndicator } from "./data-grid/features/sort-indicator";
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
} from "./data-grid/parts";
import { Template } from "./data-grid/templates";

// DataGrid — a virtualized data grid (rows and columns windowed on both
// axes, the keys and the active cell, column groups, loading rows, RTL)
// from @fragiola/data-grid-react, styled by the `sheet` family. A special
// component: a styled layer over a published package, installed with one
// command.
//
// One export, `DataGrid`: the package's parts under the same names (Root,
// Grid, Header, HeaderRows, HeaderRow, HeaderCells, HeaderCell, Body, Rows,
// Row, Cells, Cell, Empty), each wearing its `sheet` member, plus a header
// cell's Label and Title. Then a piece per common feature, each rendering
// nothing unless the grid installed its feature: SortIndicator (sorting),
// ColumnResizer (columnResize), SelectCell and SelectAllCell
// (rowSelection), HeaderFilter (filtering), CellEditor (editing) and
// Pagination (pagination); pinned columns (columnPinning) need no piece,
// their cells carry it. The model, the features and rows in memory are the
// package's:
//
//   import { useDataGrid } from "@fragiola/data-grid-react";
//   import { sorting } from "@fragiola/data-grid-react/sorting";
//   import { useLocalRows } from "@fragiola/data-grid-react/local";
//
// DataGrid.Template.Simple renders a whole grid from its columns and rows,
// with the pieces of the features installed; the parts are there for the
// grid that outgrows it.
//
// See the parts for what each one adds, and families/sheet.ts for why it
// looks the way it does.

export const DataGrid = {
    Template,
    Root,
    Grid,
    Header,
    HeaderRows,
    HeaderRow,
    HeaderCells,
    HeaderCell,
    HeaderLabel,
    HeaderTitle,
    Body,
    Rows,
    Row,
    Cells,
    Cell,
    Empty,
    SortIndicator,
    ColumnResizer,
    SelectCell,
    SelectAllCell,
    HeaderFilter,
    CellEditor,
    Pagination,
};

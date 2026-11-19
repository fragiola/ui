"use client";


// DataGrid — a virtualized data grid (rows and columns windowed on both
// axes, the keys and the active cell, column groups, loading rows, RTL)
// from @fragiola/data-grid-react, styled by the `sheet` family. A special
// component: a styled layer over a published package, installed with one
// command.
//
// One export, `DataGrid`: the package's parts under the same names (Root,
// Grid, Header, HeaderRows, HeaderRow, HeaderCells, HeaderCell, Body, Rows,
// Row, Cells, Cell, Empty), each wearing its `sheet` member, plus a header
// cell's Label and Title. The model, the features and rows in memory are
// the package's:
//
//   import { useDataGrid } from "@fragiola/data-grid-react";
//   import { sorting } from "@fragiola/data-grid-react/sorting";
//   import { useLocalRows } from "@fragiola/data-grid-react/local";
//
// See the parts for what each one adds, and families/sheet.ts for why it
// looks the way it does.

export const DataGrid = {
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
};

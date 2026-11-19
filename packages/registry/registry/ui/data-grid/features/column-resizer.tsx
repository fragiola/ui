"use client";

import { type HeaderCellInfo, useDataGrid } from "@fragiola/data-grid-react";
import { useColumnResizer } from "@fragiola/data-grid-react/column-resize";
import type * as React from "react";
import { sheet } from "#/families/sheet";
import { cn } from "#/lib/cn";
import { installed } from "./installed";

type ColumnResizerProps<TRow> = Omit<
    React.ComponentProps<"div">,
    "children" | "role"
> & {
    /** The header cell whose column (or group's columns) it resizes. */
    cell: HeaderCellInfo<TRow>;
};

// A column's resize handle (columnResize()), built with the package's
// `useColumnResizer`: a vertical `separator` on the header cell's boundary
// with the columns that scroll — its end edge, its start edge for a column
// pinned at the end (`data-edge`). A drag resizes the column; F2 (or Tab
// among the cell's controls) hands it the keys: the arrows move it 10px
// (Shift: 50), Home / End go to the limits, Enter (or a double click) fits
// the column to its content, Escape gives the keys back. Named "Resize
// <column>" unless given an `aria-label`. Nothing without columnResize()
// installed, or under a column that does not resize.
function ColumnResizer<TRow>({
    cell,
    className,
    ...props
}: ColumnResizerProps<TRow>) {
    const { model } = useDataGrid<TRow>();
    const resizer = useColumnResizer<TRow>(cell);
    if (!installed(model, "columnResize") || !resizer.state.resizable) {
        return null;
    }
    return (
        // biome-ignore lint/a11y/useAriaPropsSupportedByRole: the hook's props make it a focusable separator (the APG's splitter), which an <hr> cannot be
        <div
            data-slot="data-grid-column-resizer"
            data-edge={resizer.state.edge}
            aria-label={`Resize ${cell.column?.name ?? cell.group?.name ?? cell.key}`}
            {...props}
            {...resizer.props}
            className={cn(sheet.columnResizer(), className)}
        />
    );
}

export { ColumnResizer };

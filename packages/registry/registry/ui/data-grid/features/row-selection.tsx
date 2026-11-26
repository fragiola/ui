"use client";

import {
    type DataGridFeature,
    type RowKey,
    useDataGrid,
    useGridView,
} from "@fragiola/data-grid-react";
import {
    type RowSelectionTypes,
    useSelectAll,
} from "@fragiola/data-grid-react/row-selection";
import { MinusIcon } from "lucide-react";
import type * as React from "react";
import { iconSize } from "#/atoms/icon";
import { sheet } from "#/families/sheet";
import { cn } from "#/lib/cn";
import { Checkbox } from "#/ui/checkbox";
import { installed } from "./installed";

type BoxProps = Omit<
    React.ComponentProps<typeof Checkbox.Root>,
    "checked" | "defaultChecked" | "indeterminate" | "children"
>;

type SelectCellProps = BoxProps & {
    /** The row it selects: the `rowIndex` a column's `renderCell` gets. */
    rowIndex: number;
};

// A row's check box (rowSelection()), for a column's `renderCell`: the
// registry's Checkbox, checked while its row is selected, disabled while it
// cannot be (`isRowSelectable`). A click toggles the row; Shift+click
// selects from the last row toggled to this one. In the grid it is a
// control of its cell, no tab stop of its own: Enter reaches it and Space
// checks it; Shift+Space selects the active row anywhere. Named "Select
// row" unless given an `aria-label` (name the row: "Select Ada"). Nothing
// without rowSelection() installed.
function SelectCell({
    rowIndex,
    className,
    onCheckedChange,
    ...props
}: SelectCellProps) {
    const { model } = useDataGrid<
        unknown,
        readonly [DataGridFeature<RowSelectionTypes>]
    >();
    // the view moves with the selection: the box follows it
    useGridView();
    if (!installed(model, "rowSelection")) return null;
    return (
        <Checkbox.Root
            data-slot="data-grid-select-cell"
            aria-label="Select row"
            {...props}
            checked={model.is("row-selected", { rowIndex })}
            disabled={
                props.disabled ?? !model.is("row-selectable", { rowIndex })
            }
            onCheckedChange={(checked, details) => {
                const event = details.event;
                model.run("selected-rows.toggle", {
                    rowIndex,
                    // A base may leave the event out of a programmatic change.
                    extend:
                        event !== undefined &&
                        "shiftKey" in event &&
                        event.shiftKey === true,
                });
                onCheckedChange?.(checked, details);
            }}
            className={cn(sheet.checkbox(), className)}
        >
            <Checkbox.Indicator />
        </Checkbox.Root>
    );
}

type SelectAllCellProps = BoxProps & {
    /**
     * The rows it selects and clears: the rows shown, a page, or every
     * filtered row — leave out the rows that cannot be selected.
     */
    rowKeys: readonly RowKey[];
};

// "Select all" (rowSelection()), for a column's `renderHeaderCell`: the
// registry's Checkbox, tri-state from the package's `useSelectAll` —
// checked while every row of `rowKeys` is selected, mixed (a dash, on the
// checked box's fill) while some are. A click selects them all, or clears
// them when all are. Disabled while it would do nothing (single mode with
// nothing selected). Named "Select all rows" unless given an `aria-label`.
// Nothing without rowSelection() installed.
function SelectAllCell({
    rowKeys,
    className,
    onCheckedChange,
    ...props
}: SelectAllCellProps) {
    const { model } = useDataGrid();
    const all = useSelectAll(rowKeys);
    if (!installed(model, "rowSelection")) return null;
    const mixed = all.status === "some";
    return (
        <Checkbox.Root
            data-slot="data-grid-select-all-cell"
            aria-label="Select all rows"
            {...props}
            checked={all.status === "all"}
            indeterminate={mixed}
            disabled={props.disabled ?? !all.canToggle}
            onCheckedChange={(checked, details) => {
                all.toggle();
                onCheckedChange?.(checked, details);
            }}
            className={cn(sheet.checkbox(), className)}
        >
            {mixed ? (
                <span className={sheet.checkboxDash()}>
                    <MinusIcon className={iconSize.buttonSm} />
                </span>
            ) : (
                <Checkbox.Indicator />
            )}
        </Checkbox.Root>
    );
}

export { SelectAllCell, SelectCell };

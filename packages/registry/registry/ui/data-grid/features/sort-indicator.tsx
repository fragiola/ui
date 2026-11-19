"use client";

import {
    type HeaderCellInfo,
    useDataGrid,
    useGridView,
    useHeaderCell,
} from "@fragiola/data-grid-react";
import { sortColumnsOf } from "@fragiola/data-grid-react/sorting";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";
import type * as React from "react";
import { sheet } from "#/families/sheet";
import { cn } from "#/lib/cn";
import { installed } from "./installed";

type SortIndicatorProps<TRow> = Omit<
    React.ComponentProps<"span">,
    "children"
> & {
    /** The header cell it shows the sort of. */
    cell: HeaderCellInfo<TRow>;
};

// The sort's mark in a header cell (sorting()): an arrow up while its
// column sorts ascending, down while descending, and — while more than one
// column sorts — its place in the sort beside it. An unsorted sortable
// column shows a faint up-down mark while its header is hovered. Decorative
// (`aria-hidden`): the header cell's `aria-sort` says it. Nothing without
// sorting() installed, or on a column that does not sort. Put it in the
// header cell's Label, after its Title. The sort itself is the package's:
// a click, Enter or Space on the header cell (Ctrl or ⌘ adds a column).
function SortIndicator<TRow>({
    cell,
    className,
    ...props
}: SortIndicatorProps<TRow>) {
    const { model } = useDataGrid<TRow>();
    const { state } = useHeaderCell<TRow>(cell);
    const view = useGridView<TRow>();
    if (!installed(model, "sorting") || !state.sortable) return null;
    const multi = sortColumnsOf(view).length > 1;
    const Arrow =
        state.sortDirection === "ascending"
            ? ArrowUpIcon
            : state.sortDirection === "descending"
              ? ArrowDownIcon
              : ArrowUpDownIcon;
    return (
        <span
            data-slot="data-grid-sort-indicator"
            data-sort={state.sortDirection}
            aria-hidden="true"
            className={cn(sheet.sortIndicator(), className)}
            {...props}
        >
            <Arrow />
            {multi && state.sortPriority !== undefined && (
                <span className={sheet.sortPriority()}>
                    {state.sortPriority}
                </span>
            )}
        </span>
    );
}

export { SortIndicator };

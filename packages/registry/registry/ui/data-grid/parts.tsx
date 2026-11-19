"use client";

import {
    type BodyProps,
    type CellProps,
    type CellState,
    type DataGridFeatures,
    DataGrid as DataGridPrimitive,
    type EmptyProps,
    type GridProps,
    type GridState,
    type HeaderCellProps,
    type HeaderCellState,
    type HeaderProps,
    type HeaderRowProps,
    type HeaderRowState,
    type RootProps,
    type RootState,
    type RowProps,
    type RowState,
} from "@fragiola/data-grid-react";
import * as React from "react";
import { sheet } from "#/families/sheet";
import { cn } from "#/lib/cn";

// Data Grid's parts, styled. Virtualization, the keys, the active cell, the
// column model and every feature's behaviour come from
// @fragiola/data-grid-react; appearance comes from the `sheet` family. Each
// part wraps the primitive of the same name and only adds its member's
// classes — `render`, `ref`, handlers, the generic row type and the rest
// pass through untouched, and `className` stays a string or a function of
// the part's state. `HeaderRows`, `HeaderCells`, `Rows` and `Cells` render
// no element of their own: they are the package's, unchanged.
//
// Two pieces the package leaves to the app are parts here too: a header
// cell's Label (its name and sort indicator, on one line) and Title (the
// name, truncated). Template.Simple puts them in each header cell.
//
// The model API (useDataGrid, useDataGridRef, the features, useLocalRows,
// the hooks, the types) is not re-exported: it is imported from the
// package, the single source for it.

type ClassName<State> =
    | string
    | ((state: State) => string | undefined)
    | undefined;

// A primitive's className is a string or a function of its state: the
// member's classes go in front of either, and cn lets the consumer's win.
// Without one, the member's string as it is (a cell renders often).
function withClass<State>(
    base: string,
    className: ClassName<State>,
): string | ((state: State) => string) {
    if (typeof className === "function") {
        return (state: State) => cn(base, className(state));
    }
    return className ? cn(base, className) : base;
}

// The spacing scale in pixels, from a probe ten steps square: what the
// rows' heights are counted in. 4 (Tailwind's 0.25rem at 16px) until it is
// measured, before the first paint.
function useSpacingStep(probe: React.RefObject<HTMLElement | null>) {
    const [step, setStep] = React.useState(4);
    React.useLayoutEffect(() => {
        const element = probe.current;
        if (!element) return;
        const measure = () => {
            const size = element.getBoundingClientRect().width;
            if (size > 0) setStep(size / 10);
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        return () => observer.disconnect();
    }, [probe]);
    return step;
}

type Overflow = { start: boolean; end: boolean };

// Whether the frame hides content past its start or its end edge (scrolled
// sideways, or columns wider than it): what the pinned edges' shadow reads.
// `scrollLeft` is negative right to left; its size is what counts.
function overflowOf(element: HTMLElement): Overflow {
    const scrolled = Math.abs(element.scrollLeft);
    return {
        start: scrolled > 0.5,
        end: scrolled + element.clientWidth < element.scrollWidth - 0.5,
    };
}

function useOverflow(frame: React.RefObject<HTMLElement | null>) {
    const [overflow, setOverflow] = React.useState<Overflow>({
        start: false,
        end: false,
    });
    const update = React.useCallback(() => {
        const element = frame.current;
        if (!element) return;
        const next = overflowOf(element);
        setOverflow((current) =>
            current.start === next.start && current.end === next.end
                ? current
                : next,
        );
    }, [frame]);
    React.useLayoutEffect(() => {
        const element = frame.current;
        if (!element) return;
        update();
        // the frame's size, and the grid's (the columns' widths), change it
        const observer = new ResizeObserver(update);
        observer.observe(element);
        const grid = element.querySelector(":scope > [data-grid-part=grid]");
        if (grid) observer.observe(grid);
        return () => observer.disconnect();
    }, [frame, update]);
    return [overflow, update] as const;
}

// The grid's root: the scroll container, and the frame (`line` border,
// `rounded-lg`, the palette in scope's `base`). Give it a size (a height,
// or a flex parent): the grid inside is as large as the dataset.
//
// Density: unless given, the rows' heights are the engine's settings, from
// the spacing scale — a row nine steps (36px at the default density), a
// header row ten (40px), or seventeen with filtering() installed (a name
// above a filter). Virtualization stays exact at any density: the engine
// is told the height, never left to CSS. A function or "auto" `rowHeight`
// is the consumer's, as given.
function Root<TRow, const TFeatures extends DataGridFeatures = []>({
    className,
    rowHeight,
    headerRowHeight,
    children,
    onScroll,
    ref,
    ...props
}: RootProps<TRow, TFeatures>) {
    const probe = React.useRef<HTMLSpanElement>(null);
    const frame = React.useRef<HTMLElement | null>(null);
    const step = useSpacingStep(probe);
    const [overflow, updateOverflow] = useOverflow(frame);
    const filtering = (props.features ?? []).some(
        (feature) => feature.name === "filtering",
    );
    const setRef = React.useCallback(
        (element: HTMLElement | null) => {
            frame.current = element;
            if (typeof ref === "function") return ref(element);
            if (ref) ref.current = element;
        },
        [ref],
    );
    const rootProps = {
        ...props,
        rowHeight: rowHeight ?? step * 9,
        headerRowHeight: headerRowHeight ?? step * (filtering ? 17 : 10),
    } as RootProps<TRow, TFeatures>;
    return (
        <DataGridPrimitive.Root<TRow, TFeatures>
            data-slot="data-grid"
            data-overflow-start={overflow.start ? "" : undefined}
            data-overflow-end={overflow.end ? "" : undefined}
            {...rootProps}
            ref={setRef}
            onScroll={(event: React.UIEvent<HTMLDivElement>) => {
                updateOverflow();
                onScroll?.(event);
            }}
            className={withClass<RootState>(sheet.root(), className)}
        >
            <span aria-hidden="true" ref={probe} className={sheet.probe()} />
            {children}
        </DataGridPrimitive.Root>
    );
}

// The grid (`role="grid"` with navigation(), else `table`) and the sizer.
// Name it (`aria-label`): the package sets no names.
function Grid({ className, ...props }: GridProps) {
    return (
        <DataGridPrimitive.Grid
            data-slot="data-grid-grid"
            className={withClass<GridState>(sheet.grid(), className)}
            {...props}
        />
    );
}

// The sticky header (`rowgroup`), opaque on `soft`.
function Header({ className, ...props }: HeaderProps) {
    return (
        <DataGridPrimitive.Header
            data-slot="data-grid-header"
            className={withClass<Record<string, never>>(
                sheet.header(),
                className,
            )}
            {...props}
        />
    );
}

// The header rows, one per level of column groups: a children function, no
// element, no style.
const HeaderRows = DataGridPrimitive.HeaderRows;

// A header row (`role="row"`), with its `line` rule.
function HeaderRow<TRow = unknown>({
    className,
    ...props
}: HeaderRowProps<TRow>) {
    return (
        <DataGridPrimitive.HeaderRow<TRow>
            data-slot="data-grid-header-row"
            className={withClass<HeaderRowState>(sheet.headerRow(), className)}
            {...props}
        />
    );
}

// A header row's cells: a children function, no element, no style.
const HeaderCells = DataGridPrimitive.HeaderCells;

// A header cell (`columnheader`), a column's or a group's. Without
// children, the package's content (the column's `renderHeaderCell`, else
// its `name`); with them, only them — put `headerCellContent(cell)` (from
// the package) in a Label, beside the feature pieces.
function HeaderCell<TRow>({ className, ...props }: HeaderCellProps<TRow>) {
    return (
        <DataGridPrimitive.HeaderCell<TRow>
            data-slot="data-grid-header-cell"
            className={withClass<HeaderCellState>(
                sheet.headerCell(),
                className,
            )}
            {...props}
        />
    );
}

// A header cell's label: its title and, after it, the sort indicator.
function HeaderLabel({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="data-grid-header-label"
            className={cn(sheet.headerLabel(), className)}
            {...props}
        />
    );
}

// A header cell's name, truncated.
function HeaderTitle({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="data-grid-header-title"
            className={cn(sheet.headerTitle(), className)}
            {...props}
        />
    );
}

// The body (`rowgroup`), the layer the engine moves with the rows. No look
// of its own: the rows carry it.
function Body(props: BodyProps) {
    return <DataGridPrimitive.Body data-slot="data-grid-body" {...props} />;
}

// The rendered rows: a children function, no element, no style.
const Rows = DataGridPrimitive.Rows;

// A body row (`role="row"`): its rule, hover, active and selected fills.
function Row<TRow>({ className, ...props }: RowProps<TRow>) {
    return (
        <DataGridPrimitive.Row<TRow>
            data-slot="data-grid-row"
            className={withClass<RowState>(sheet.row(), className)}
            {...props}
        />
    );
}

// A row's cells: a children function, no element, no style.
const Cells = DataGridPrimitive.Cells;

// A body cell (`gridcell` with navigation(), else `cell`). Without
// children, the column's `renderCell` (its editor while edited), else its
// value as text.
function Cell<TRow>({ className, ...props }: CellProps<TRow>) {
    return (
        <DataGridPrimitive.Cell<TRow>
            data-slot="data-grid-cell"
            className={withClass<CellState>(sheet.cell(), className)}
            {...props}
        />
    );
}

// What the grid shows while it has no rows: "No rows" unless given
// children. Place it after the Header.
function Empty({ className, children, ...props }: EmptyProps) {
    return (
        <DataGridPrimitive.Empty
            data-slot="data-grid-empty"
            className={withClass<Record<string, never>>(
                sheet.empty(),
                className,
            )}
            {...props}
        >
            {children ?? "No rows"}
        </DataGridPrimitive.Empty>
    );
}

export {
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
};

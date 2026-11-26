"use client";

import {
    type CalendarCellState,
    Calendar as CalendarPrimitive,
} from "@fragiola/primitives-react/calendar";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type * as React from "react";
import { clickable } from "#/atoms/clickable";
import { calendar } from "#/families/calendar";
import { foundation } from "#/families/foundation";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";

// Calendar — a month grid for choosing one date (spec/calendar.md, the APG
// date grid): the arrows move by a day, Up and Down by a week, Page Up and
// Down by a month (Shift: a year), Home and End to the week's ends; RTL
// swaps Left and Right. `visibleMonths` shows months side by side.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// calendar, so this one shared file wraps Fragiola Primitives' on every
// base. `PrimitivesDirection` hands it the base's direction.
//
// The look is the `calendar` family's (families/calendar.tsx): each cell's
// state is a foundation member. `createDayCalendarParts` writes the parts
// once over an injected namespace (architecture.md §3, "share the wrapper"):
// RangeCalendar and MultipleCalendar have the same parts with their own
// Root, and `renderCalendarCell` is the month and year grids' cell too.
//
//   Root      the calendar (calendar.root)
//   Months    the visible months side by side; Month, one of them
//   Header    the heading between the page buttons
//   Heading, PrevButton, NextButton, Grid, GridHeader, HeaderCell,
//   GridBody, Row, Cell   the primitive's parts. GridHeader, GridBody, Row
//             and Grid default to the styled parts below them, so
//             `<Calendar.Grid />` is a whole month.
//   Template.Simple  the whole calendar: a header and a grid per visible
//             month, the page buttons on the outer ones.

/** The state a day, month or year cell shares (a day has `outsideMonth`). */
type CellState = Omit<CalendarCellState, "outsideMonth"> & {
    outsideMonth?: boolean;
};

/**
 * Renders a cell (`td`) with the date's box inside it: the box gets the
 * foundation's attributes from the cell's state (families/calendar.tsx), the
 * cell a range's band. The primitive's own attributes stay on the `td`.
 */
function renderCalendarCell(
    slot: string,
    props: Record<string, unknown>,
    state: CellState,
): React.ReactNode {
    const { children, ...cell } = props;
    const outside = state.outsideMonth === true;
    const end = state.rangeStart || state.rangeEnd;
    const checked = !outside && (end || (state.selected && !state.inRange));
    const inert = outside || state.disabled || state.unavailable;
    const edge =
        outside || !state.inRange || (state.rangeStart && state.rangeEnd)
            ? undefined
            : state.rangeStart
              ? "start"
              : state.rangeEnd
                ? "end"
                : "middle";
    return (
        <td {...cell}>
            {edge ? (
                <span
                    aria-hidden="true"
                    data-slot={`${slot}-band`}
                    data-edge={edge}
                    className={calendar.band()}
                />
            ) : null}
            {!outside && state.rangePreview ? (
                <span
                    aria-hidden="true"
                    data-slot={`${slot}-preview`}
                    className={calendar.preview()}
                />
            ) : null}
            <span
                data-slot={`${slot}-item`}
                data-checked={checked ? "" : undefined}
                data-active={
                    state.today && !checked && !outside ? "" : undefined
                }
                data-disabled={inert ? "" : undefined}
                data-unavailable={
                    state.unavailable && !outside ? "" : undefined
                }
                data-outside-month={outside ? "" : undefined}
                className={cn(
                    calendar.item(),
                    // the hover only where a press chooses: a chosen box keeps
                    // its `ring` under the pointer
                    inert || checked ? undefined : foundation.hover(),
                )}
            >
                {children as React.ReactNode}
            </span>
        </td>
    );
}

type Part = React.ElementType;

/** The parts every day calendar shares (Calendar, RangeCalendar, MultipleCalendar). */
type DayCalendarNamespace = {
    Heading: Part;
    PrevButton: Part;
    NextButton: Part;
    Grid: Part;
    GridHeader: Part;
    HeaderCell: Part;
    GridBody: Part;
    Row: Part;
    Cell: Part;
};

type P = typeof CalendarPrimitive;

/** The calendar's frame, shared by every calendar root (`calendar.root`). */
function calendarRootClass(className: unknown): string {
    return cn(calendar.root(), className as string);
}

function CalendarMonths({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="calendar-months"
            className={cn(calendar.months(), className)}
            {...props}
        />
    );
}

function CalendarMonth({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="calendar-month"
            className={cn(calendar.month(), className)}
            {...props}
        />
    );
}

function CalendarHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="calendar-header"
            className={cn(calendar.header(), className)}
            {...props}
        />
    );
}

/** A page button's look: a small icon button at the header's inline end. */
function pageButtonClass(side: "prev" | "next", className: unknown) {
    return cn(
        clickable({ variant: "icon", shape: "square", size: "sm" }),
        foundation.secondary(),
        foundation.disabled(),
        calendar[side](),
        className as string,
    );
}

/** The page buttons' icons: a chevron that points the reading way. */
function PageIcon({ side }: { side: "prev" | "next" }) {
    return side === "prev" ? (
        <ChevronLeftIcon aria-hidden="true" className="rtl:rotate-180" />
    ) : (
        <ChevronRightIcon aria-hidden="true" className="rtl:rotate-180" />
    );
}

/**
 * The styled parts of a day calendar over its namespace. `slot` names its
 * `data-slot`s (`calendar`, `range-calendar`, `multiple-calendar`).
 */
function createDayCalendarParts(N: DayCalendarNamespace, slot: string) {
    const Primitive = N as unknown as Omit<P, "Root">;

    function Heading({
        className,
        ...props
    }: PrimitivesProps<P["Heading"], "h2">) {
        return (
            <Primitive.Heading
                data-slot={`${slot}-heading`}
                className={cn(calendar.heading(), className as string)}
                {...props}
            />
        );
    }

    function PrevButton({
        className,
        children,
        ...props
    }: PrimitivesProps<P["PrevButton"], "button">) {
        return (
            <Primitive.PrevButton
                data-slot={`${slot}-prev-button`}
                aria-label="Previous month"
                className={pageButtonClass("prev", className)}
                {...props}
            >
                {children ?? <PageIcon side="prev" />}
            </Primitive.PrevButton>
        );
    }

    function NextButton({
        className,
        children,
        ...props
    }: PrimitivesProps<P["NextButton"], "button">) {
        return (
            <Primitive.NextButton
                data-slot={`${slot}-next-button`}
                aria-label="Next month"
                className={pageButtonClass("next", className)}
                {...props}
            >
                {children ?? <PageIcon side="next" />}
            </Primitive.NextButton>
        );
    }

    function HeaderCell({
        className,
        ...props
    }: PrimitivesProps<P["HeaderCell"], "th">) {
        return (
            <Primitive.HeaderCell
                data-slot={`${slot}-header-cell`}
                className={cn(calendar.headerCell(), className as string)}
                {...props}
            />
        );
    }

    function GridHeader({
        children,
        ...props
    }: PrimitivesProps<P["GridHeader"], "thead">) {
        return (
            <Primitive.GridHeader data-slot={`${slot}-grid-header`} {...props}>
                {children ??
                    ((weekday: { index: number }) => (
                        <HeaderCell
                            key={weekday.index}
                            weekday={weekday as never}
                        />
                    ))}
            </Primitive.GridHeader>
        );
    }

    function Cell({
        className,
        ...props
    }: Omit<PrimitivesProps<P["Cell"], "td">, "render">) {
        return (
            <Primitive.Cell
                data-slot={`${slot}-cell`}
                className={cn(calendar.cell(), className as string)}
                render={(
                    cellProps: Record<string, unknown>,
                    state: CellState,
                ) => renderCalendarCell(slot, cellProps, state)}
                {...props}
            />
        );
    }

    function Row({ children, ...props }: PrimitivesProps<P["Row"], "tr">) {
        return (
            <Primitive.Row data-slot={`${slot}-row`} {...props}>
                {children ??
                    ((date: { year: number; month: number; day: number }) => (
                        <Cell
                            key={`${date.year}-${date.month}-${date.day}`}
                            date={date}
                        />
                    ))}
            </Primitive.Row>
        );
    }

    function GridBody({
        children,
        ...props
    }: PrimitivesProps<P["GridBody"], "tbody">) {
        return (
            <Primitive.GridBody data-slot={`${slot}-grid-body`} {...props}>
                {children ??
                    ((week: { year: number; month: number; day: number }[]) => {
                        const first = week[0];
                        return (
                            <Row
                                key={`${first?.year}-${first?.month}-${first?.day}`}
                                week={week as never}
                            />
                        );
                    })}
            </Primitive.GridBody>
        );
    }

    function Grid({
        className,
        children,
        ...props
    }: PrimitivesProps<P["Grid"], "table">) {
        return (
            <Primitive.Grid
                data-slot={`${slot}-grid`}
                className={cn(calendar.grid(), className as string)}
                {...props}
            >
                {children ?? (
                    <>
                        <GridHeader />
                        <GridBody />
                    </>
                )}
            </Primitive.Grid>
        );
    }

    /** Every visible month: a header and a grid each, the page buttons on the outer ones. */
    function Pages({ count = 1 }: { count?: number }) {
        return (
            <CalendarMonths>
                {Array.from({ length: Math.max(1, count) }, (_, offset) => (
                    <CalendarMonth
                        // biome-ignore lint/suspicious/noArrayIndexKey: a month's offset is its identity
                        key={offset}
                    >
                        <CalendarHeader>
                            {offset === 0 ? <PrevButton /> : null}
                            <Heading offset={offset} />
                            {offset === count - 1 ? <NextButton /> : null}
                        </CalendarHeader>
                        <Grid offset={offset} />
                    </CalendarMonth>
                ))}
            </CalendarMonths>
        );
    }

    return {
        Months: CalendarMonths,
        Month: CalendarMonth,
        Header: CalendarHeader,
        Heading,
        PrevButton,
        NextButton,
        Grid,
        GridHeader,
        HeaderCell,
        GridBody,
        Row,
        Cell,
        Pages,
    };
}

const parts = createDayCalendarParts(CalendarPrimitive, "calendar");

function CalendarRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <CalendarPrimitive.Root
                data-slot="calendar"
                className={calendarRootClass(className)}
                {...props}
            />
        </PrimitivesDirection>
    );
}

/** The whole calendar from its Root's props: every visible month. */
function CalendarTemplateSimple({
    children,
    visibleMonths,
    ...props
}: React.ComponentProps<typeof CalendarRoot>) {
    return (
        <CalendarRoot visibleMonths={visibleMonths} {...props}>
            <parts.Pages count={visibleMonths} />
            {children}
        </CalendarRoot>
    );
}

const { Pages: _pages, ...dayParts } = parts;

export const Calendar = {
    Root: CalendarRoot,
    ...dayParts,
    Template: { Simple: CalendarTemplateSimple },
};

// What the other calendars build on (range-calendar, multiple-calendar,
// month-calendar and the pickers), in one export.
export const calendarParts = {
    create: createDayCalendarParts,
    renderCell: renderCalendarCell,
    rootClass: calendarRootClass,
    pageButtonClass,
    PageIcon,
    Months: CalendarMonths,
    Month: CalendarMonth,
    Header: CalendarHeader,
};

export type { DayCalendarNamespace };

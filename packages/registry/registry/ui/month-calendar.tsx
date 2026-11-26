"use client";

import { MonthCalendar as MonthCalendarPrimitive } from "@fragiola/primitives-react/month-calendar";
import type * as React from "react";
import { calendar } from "#/families/calendar";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";
import { calendarParts } from "#/ui/calendar";

// MonthCalendar — one month in a page of the 12 months of a year
// (spec/month-calendar.md, the APG grid): the arrows move by a month, Up and
// Down by a row (`columns`, 3 by default), Page Up and Down by a year.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// calendar, so this one shared file wraps Fragiola Primitives' on every
// base. `createMonthCalendarParts` writes the parts once over an injected
// namespace: YearCalendar, MonthRangeCalendar and YearRangeCalendar have the
// same parts with their own Root (and labels).
//
// A cell is the Calendar's (`calendarParts.renderCell`): the same box, the
// same states and the same range band, in a wider `monthCell`. A page has
// no outside cells.

type Part = React.ElementType;

/** The parts every month and year calendar shares. */
type MonthCalendarNamespace = {
    Heading: Part;
    PrevButton: Part;
    NextButton: Part;
    Grid: Part;
    GridBody: Part;
    Row: Part;
    Cell: Part;
};

type P = typeof MonthCalendarPrimitive;

type Item = { year: number; month?: number };

const key = (item: Item) => `${item.year}-${item.month ?? 0}`;

/**
 * The styled parts of a month or year calendar over its namespace. `slot`
 * names its `data-slot`s; `page` names what a page button moves ("year",
 * "years").
 */
function createMonthCalendarParts(
    N: MonthCalendarNamespace,
    slot: string,
    page: { prev: string; next: string },
) {
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
                aria-label={page.prev}
                className={calendarParts.pageButtonClass("prev", className)}
                {...props}
            >
                {children ?? <calendarParts.PageIcon side="prev" />}
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
                aria-label={page.next}
                className={calendarParts.pageButtonClass("next", className)}
                {...props}
            >
                {children ?? <calendarParts.PageIcon side="next" />}
            </Primitive.NextButton>
        );
    }

    function Cell({
        className,
        ...props
    }: Omit<PrimitivesProps<P["Cell"], "td">, "render">) {
        return (
            <Primitive.Cell
                data-slot={`${slot}-cell`}
                className={cn(calendar.monthCell(), className as string)}
                render={(
                    cellProps: Record<string, unknown>,
                    state: Parameters<typeof calendarParts.renderCell>[2],
                ) => calendarParts.renderCell(slot, cellProps, state)}
                {...props}
            />
        );
    }

    function Row({ children, ...props }: PrimitivesProps<P["Row"], "tr">) {
        return (
            <Primitive.Row data-slot={`${slot}-row`} {...props}>
                {children ??
                    ((item: Item) => (
                        <Cell key={key(item)} value={item as never} />
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
                    ((row: Item[]) => (
                        <Row
                            key={row[0] ? key(row[0]) : "row"}
                            row={row as never}
                        />
                    ))}
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
                {children ?? <GridBody />}
            </Primitive.Grid>
        );
    }

    /** The page: its header and its grid. */
    function Page() {
        return (
            <calendarParts.Month>
                <calendarParts.Header>
                    <PrevButton />
                    <Heading />
                    <NextButton />
                </calendarParts.Header>
                <Grid />
            </calendarParts.Month>
        );
    }

    return {
        Header: calendarParts.Header,
        Heading,
        PrevButton,
        NextButton,
        Grid,
        GridBody,
        Row,
        Cell,
        Page,
    };
}

const parts = createMonthCalendarParts(
    MonthCalendarPrimitive,
    "month-calendar",
    {
        prev: "Previous year",
        next: "Next year",
    },
);

function MonthCalendarRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <MonthCalendarPrimitive.Root
                data-slot="month-calendar"
                className={calendarParts.rootClass(className)}
                {...props}
            />
        </PrimitivesDirection>
    );
}

/** The whole month calendar from its Root's props: the year's page. */
function MonthCalendarTemplateSimple({
    children,
    ...props
}: React.ComponentProps<typeof MonthCalendarRoot>) {
    return (
        <MonthCalendarRoot {...props}>
            <parts.Page />
            {children}
        </MonthCalendarRoot>
    );
}

const { Page: _page, ...monthParts } = parts;

export const MonthCalendar = {
    Root: MonthCalendarRoot,
    ...monthParts,
    Template: { Simple: MonthCalendarTemplateSimple },
};

// What the year and range calendars build on, in one export.
export const monthCalendarParts = { create: createMonthCalendarParts };

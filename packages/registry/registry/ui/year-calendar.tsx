"use client";

import { YearCalendar as YearCalendarPrimitive } from "@fragiola/primitives-react/year-calendar";
import type * as React from "react";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";
import { calendarParts } from "#/ui/calendar";
import { monthCalendarParts } from "#/ui/month-calendar";

// YearCalendar — one year in a page of 12 (spec/month-calendar.md): a page
// starts at a multiple of 12, so paging never shifts the rows; the arrows
// move by a year, Up and Down by a row, Page Up and Down by a page.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// calendar, so this one shared file wraps Fragiola Primitives' on every
// base. Its parts are the MonthCalendar's (`monthCalendarParts.create`),
// named `year-calendar-*`; only the Root is its own.

type P = typeof YearCalendarPrimitive;

const parts = monthCalendarParts.create(
    YearCalendarPrimitive,
    "year-calendar",
    {
        prev: "Previous years",
        next: "Next years",
    },
);

function YearCalendarRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <YearCalendarPrimitive.Root
                data-slot="year-calendar"
                className={calendarParts.rootClass(className)}
                {...props}
            />
        </PrimitivesDirection>
    );
}

/** The whole year calendar from its Root's props: its page. */
function YearCalendarTemplateSimple({
    children,
    ...props
}: React.ComponentProps<typeof YearCalendarRoot>) {
    return (
        <YearCalendarRoot {...props}>
            <parts.Page />
            {children}
        </YearCalendarRoot>
    );
}

const { Page: _page, ...ownParts } = parts;

export const YearCalendar = {
    Root: YearCalendarRoot,
    ...ownParts,
    Template: { Simple: YearCalendarTemplateSimple },
};

"use client";

import { YearRangeCalendar as YearRangeCalendarPrimitive } from "@fragiola/primitives-react/year-range-calendar";
import type * as React from "react";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";
import { calendarParts } from "#/ui/calendar";
import { monthCalendarParts } from "#/ui/month-calendar";

// YearRangeCalendar — a range of years (spec/month-calendar.md): the first
// choice starts it, the second ends it; the years between preview it. The
// ends are `checked`, the years between the Calendar's band.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// calendar, so this one shared file wraps Fragiola Primitives' on every
// base. Its parts are the MonthCalendar's (`monthCalendarParts.create`),
// named `year-range-calendar-*`; only the Root is its own.

type P = typeof YearRangeCalendarPrimitive;

const parts = monthCalendarParts.create(
    YearRangeCalendarPrimitive,
    "year-range-calendar",
    {
        prev: "Previous years",
        next: "Next years",
    },
);

function YearRangeCalendarRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <YearRangeCalendarPrimitive.Root
                data-slot="year-range-calendar"
                className={calendarParts.rootClass(className)}
                {...props}
            />
        </PrimitivesDirection>
    );
}

/** The whole year range calendar from its Root's props: its page. */
function YearRangeCalendarTemplateSimple({
    children,
    ...props
}: React.ComponentProps<typeof YearRangeCalendarRoot>) {
    return (
        <YearRangeCalendarRoot {...props}>
            <parts.Page />
            {children}
        </YearRangeCalendarRoot>
    );
}

const { Page: _page, ...ownParts } = parts;

export const YearRangeCalendar = {
    Root: YearRangeCalendarRoot,
    ...ownParts,
    Template: { Simple: YearRangeCalendarTemplateSimple },
};

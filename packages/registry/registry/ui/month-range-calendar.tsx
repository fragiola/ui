"use client";

import { MonthRangeCalendar as MonthRangeCalendarPrimitive } from "@fragiola/primitives-react/month-range-calendar";
import type * as React from "react";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";
import { calendarParts } from "#/ui/calendar";
import { monthCalendarParts } from "#/ui/month-calendar";

// MonthRangeCalendar — a range of months (spec/month-calendar.md): the first
// choice starts it, the second ends it; the months between preview it. The
// ends are `checked`, the months between the Calendar's band.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// calendar, so this one shared file wraps Fragiola Primitives' on every
// base. Its parts are the MonthCalendar's (`monthCalendarParts.create`),
// named `month-range-calendar-*`; only the Root is its own.

type P = typeof MonthRangeCalendarPrimitive;

const parts = monthCalendarParts.create(
    MonthRangeCalendarPrimitive,
    "month-range-calendar",
    {
        prev: "Previous year",
        next: "Next year",
    },
);

function MonthRangeCalendarRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <MonthRangeCalendarPrimitive.Root
                data-slot="month-range-calendar"
                className={calendarParts.rootClass(className)}
                {...props}
            />
        </PrimitivesDirection>
    );
}

/** The whole month range calendar from its Root's props: its page. */
function MonthRangeCalendarTemplateSimple({
    children,
    ...props
}: React.ComponentProps<typeof MonthRangeCalendarRoot>) {
    return (
        <MonthRangeCalendarRoot {...props}>
            <parts.Page />
            {children}
        </MonthRangeCalendarRoot>
    );
}

const { Page: _page, ...ownParts } = parts;

export const MonthRangeCalendar = {
    Root: MonthRangeCalendarRoot,
    ...ownParts,
    Template: { Simple: MonthRangeCalendarTemplateSimple },
};

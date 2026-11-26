"use client";

import { RangeCalendar as RangeCalendarPrimitive } from "@fragiola/primitives-react/range-calendar";
import type * as React from "react";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";
import { calendarParts } from "#/ui/calendar";

// RangeCalendar — a range of dates (spec/calendar.md): the first choice
// starts it, the second ends it (swapped when it comes first), and the dates
// between preview the range under the pointer or the focus. Escape cancels a
// started range before an enclosing layer closes.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// calendar, so this one shared file wraps Fragiola Primitives' on every
// base. Its parts are the Calendar's (`calendarParts.create`), named
// `range-calendar-*`; only the Root is its own.
//
// The range is the `calendar` family's: the start and the end are `checked`
// (the `ring` box), the dates between are one `soft` band joined to them,
// rounded at a week's ends, logical in RTL; a range being chosen is the
// half-`soft` preview.

type P = typeof RangeCalendarPrimitive;

const parts = calendarParts.create(RangeCalendarPrimitive, "range-calendar");

function RangeCalendarRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <RangeCalendarPrimitive.Root
                data-slot="range-calendar"
                className={calendarParts.rootClass(className)}
                {...props}
            />
        </PrimitivesDirection>
    );
}

/** The whole range calendar from its Root's props: every visible month. */
function RangeCalendarTemplateSimple({
    children,
    visibleMonths,
    ...props
}: React.ComponentProps<typeof RangeCalendarRoot>) {
    return (
        <RangeCalendarRoot visibleMonths={visibleMonths} {...props}>
            <parts.Pages count={visibleMonths} />
            {children}
        </RangeCalendarRoot>
    );
}

const { Pages: _pages, ...rangeParts } = parts;

export const RangeCalendar = {
    Root: RangeCalendarRoot,
    ...rangeParts,
    Template: { Simple: RangeCalendarTemplateSimple },
};

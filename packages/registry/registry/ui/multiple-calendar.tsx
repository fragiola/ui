"use client";

import { MultipleCalendar as MultipleCalendarPrimitive } from "@fragiola/primitives-react/multiple-calendar";
import type * as React from "react";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";
import { calendarParts } from "#/ui/calendar";

// MultipleCalendar — several dates (spec/calendar.md, "Multiple dates"): a
// press, Enter or Space toggles a date; `maxSelected` caps how many; `name`
// submits one hidden input per date. Every other key is the Calendar's.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// calendar, so this one shared file wraps Fragiola Primitives' on every
// base. Its parts are the Calendar's (`calendarParts.create`), named
// `multiple-calendar-*`; only the Root is its own. Each chosen date is
// `checked` (the `ring` box), on its own: two chosen neighbours are two
// boxes, not a range.

type P = typeof MultipleCalendarPrimitive;

const parts = calendarParts.create(
    MultipleCalendarPrimitive,
    "multiple-calendar",
);

function MultipleCalendarRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <MultipleCalendarPrimitive.Root
                data-slot="multiple-calendar"
                className={calendarParts.rootClass(className)}
                {...props}
            />
        </PrimitivesDirection>
    );
}

/** The whole multiple-date calendar from its Root's props: every visible month. */
function MultipleCalendarTemplateSimple({
    children,
    visibleMonths,
    ...props
}: React.ComponentProps<typeof MultipleCalendarRoot>) {
    return (
        <MultipleCalendarRoot visibleMonths={visibleMonths} {...props}>
            <parts.Pages count={visibleMonths} />
            {children}
        </MultipleCalendarRoot>
    );
}

const { Pages: _pages, ...multipleParts } = parts;

export const MultipleCalendar = {
    Root: MultipleCalendarRoot,
    ...multipleParts,
    Template: { Simple: MultipleCalendarTemplateSimple },
};

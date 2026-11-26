"use client";

import { CalendarPreset as CalendarPresetPrimitive } from "@fragiola/primitives-react/calendar-preset";
import type * as React from "react";
import { calendar } from "#/families/calendar";
import { cn } from "#/lib/cn";
import type { PrimitivesProps } from "#/lib/primitives-backed";

// CalendarPreset — a button that sets a calendar's value to a known date or
// range: "Today", "Last 7 days" (spec/calendar.md, "Presets"). It goes
// anywhere inside a Calendar or RangeCalendar Root, inline or in a picker's
// popup, where a press is a choice (the popup closes). Its `value` is a
// date, a range, or a function of today returning one.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// calendar, so this one shared file wraps Fragiola Primitives' on every
// base.
//
//   List  a column of presets beside the calendar (`calendar.presets`)
//   Item  one preset (`calendar.preset`): a ghost row whose value is the
//         calendar's is `selected` (the primitive's `data-selected`)

function CalendarPresetList({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="calendar-preset-list"
            className={cn(calendar.presets(), className)}
            {...props}
        />
    );
}

function CalendarPresetItem({
    className,
    ...props
}: PrimitivesProps<typeof CalendarPresetPrimitive, "button">) {
    return (
        <CalendarPresetPrimitive
            data-slot="calendar-preset"
            className={cn(calendar.preset(), className as string)}
            {...props}
        />
    );
}

export const CalendarPreset = {
    List: CalendarPresetList,
    Item: CalendarPresetItem,
};

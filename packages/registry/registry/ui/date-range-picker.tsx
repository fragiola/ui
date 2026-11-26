"use client";

import { DateRangePicker as DateRangePickerPrimitive } from "@fragiola/primitives-react/date-range-picker";
import type * as React from "react";
import { PrimitivesDirection } from "#/lib/primitives-backed";
import { pickerParts } from "#/ui/date-picker";

// DateRangePicker — a trigger and a popup holding a range calendar
// (spec/calendar.md): a RangeCalendar in the popup without a value of its
// own binds to the picker; the second choice sets the range, closes the
// popup and returns the focus to the trigger. `name` submits the ISO 8601
// interval (`start/end`). Presets in the popup are choices too.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// date range picker, so this one shared file wraps Fragiola Primitives' on every base.
// Its Trigger and Content are the DatePicker's (`pickerParts.create`), named
// `date-range-picker-*`; only the Root is its own.

type P = typeof DateRangePickerPrimitive;

const parts = pickerParts.create(DateRangePickerPrimitive, "date-range-picker");

function DateRangePickerRoot(props: React.ComponentProps<P["Root"]>) {
    return (
        <PrimitivesDirection>
            <DateRangePickerPrimitive.Root {...props} />
        </PrimitivesDirection>
    );
}

export const DateRangePicker = {
    Root: DateRangePickerRoot,
    Trigger: parts.Trigger,
    Content: parts.Content,
};

"use client";

import { YearRangePicker as YearRangePickerPrimitive } from "@fragiola/primitives-react/year-range-picker";
import type * as React from "react";
import { PrimitivesDirection } from "#/lib/primitives-backed";
import { pickerParts } from "#/ui/date-picker";

// YearRangePicker — a trigger and a popup holding a year range calendar
// (spec/month-calendar.md): a YearRangeCalendar in the popup binds to the
// picker. `name` submits the interval (`2020/2024`).
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// year range picker, so this one shared file wraps Fragiola Primitives' on every base.
// Its Trigger and Content are the DatePicker's (`pickerParts.create`), named
// `year-range-picker-*`; only the Root is its own.

type P = typeof YearRangePickerPrimitive;

const parts = pickerParts.create(YearRangePickerPrimitive, "year-range-picker");

function YearRangePickerRoot(props: React.ComponentProps<P["Root"]>) {
    return (
        <PrimitivesDirection>
            <YearRangePickerPrimitive.Root {...props} />
        </PrimitivesDirection>
    );
}

export const YearRangePicker = {
    Root: YearRangePickerRoot,
    Trigger: parts.Trigger,
    Content: parts.Content,
};

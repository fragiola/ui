"use client";

import { MonthRangePicker as MonthRangePickerPrimitive } from "@fragiola/primitives-react/month-range-picker";
import type * as React from "react";
import { PrimitivesDirection } from "#/lib/primitives-backed";
import { pickerParts } from "#/ui/date-picker";

// MonthRangePicker — a trigger and a popup holding a month range calendar
// (spec/month-calendar.md): a MonthRangeCalendar in the popup binds to the
// picker. `name` submits the interval (`2026-03/2026-06`).
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// month range picker, so this one shared file wraps Fragiola Primitives' on every base.
// Its Trigger and Content are the DatePicker's (`pickerParts.create`), named
// `month-range-picker-*`; only the Root is its own.

type P = typeof MonthRangePickerPrimitive;

const parts = pickerParts.create(
    MonthRangePickerPrimitive,
    "month-range-picker",
);

function MonthRangePickerRoot(props: React.ComponentProps<P["Root"]>) {
    return (
        <PrimitivesDirection>
            <MonthRangePickerPrimitive.Root {...props} />
        </PrimitivesDirection>
    );
}

export const MonthRangePicker = {
    Root: MonthRangePickerRoot,
    Trigger: parts.Trigger,
    Content: parts.Content,
};

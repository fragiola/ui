"use client";

import { MonthPicker as MonthPickerPrimitive } from "@fragiola/primitives-react/month-picker";
import type * as React from "react";
import { PrimitivesDirection } from "#/lib/primitives-backed";
import { pickerParts } from "#/ui/date-picker";

// MonthPicker — a trigger and a popup holding a month calendar
// (spec/month-calendar.md): a MonthCalendar in the popup without a value of
// its own binds to the picker. `name` submits the month (`2026-11`).
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// month picker, so this one shared file wraps Fragiola Primitives' on every base.
// Its Trigger and Content are the DatePicker's (`pickerParts.create`), named
// `month-picker-*`; only the Root is its own.

type P = typeof MonthPickerPrimitive;

const parts = pickerParts.create(MonthPickerPrimitive, "month-picker");

function MonthPickerRoot(props: React.ComponentProps<P["Root"]>) {
    return (
        <PrimitivesDirection>
            <MonthPickerPrimitive.Root {...props} />
        </PrimitivesDirection>
    );
}

export const MonthPicker = {
    Root: MonthPickerRoot,
    Trigger: parts.Trigger,
    Content: parts.Content,
};

"use client";

import { YearPicker as YearPickerPrimitive } from "@fragiola/primitives-react/year-picker";
import type * as React from "react";
import { PrimitivesDirection } from "#/lib/primitives-backed";
import { pickerParts } from "#/ui/date-picker";

// YearPicker — a trigger and a popup holding a year calendar
// (spec/month-calendar.md): a YearCalendar in the popup binds to the
// picker. `name` submits the year (`2026`).
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// year picker, so this one shared file wraps Fragiola Primitives' on every base.
// Its Trigger and Content are the DatePicker's (`pickerParts.create`), named
// `year-picker-*`; only the Root is its own.

type P = typeof YearPickerPrimitive;

const parts = pickerParts.create(YearPickerPrimitive, "year-picker");

function YearPickerRoot(props: React.ComponentProps<P["Root"]>) {
    return (
        <PrimitivesDirection>
            <YearPickerPrimitive.Root {...props} />
        </PrimitivesDirection>
    );
}

export const YearPicker = {
    Root: YearPickerRoot,
    Trigger: parts.Trigger,
    Content: parts.Content,
};

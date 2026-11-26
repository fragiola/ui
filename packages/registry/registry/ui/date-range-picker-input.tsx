"use client";

import {
    DateRangePickerInput as DateRangePickerInputPrimitive,
    DateRangePicker as DateRangePickerPrimitive,
} from "@fragiola/primitives-react/date-range-picker-input";
import { CalendarIcon } from "lucide-react";
import type * as React from "react";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";
import { segmentParts } from "#/ui/date-field";
import { pickerParts } from "#/ui/date-picker";
import { typedPickerParts } from "#/ui/date-picker-input";
import { rangeFieldParts } from "#/ui/date-range-field";

// DateRangePickerInput — a date range picker typed into two ends' segments
// (spec/calendar.md, "Typed input"): each end is a Segments group
// (`range="start"` / `"end"`, each named by the consumer), one sequence
// across both, as the DateRangeField's; the trigger opens a bound
// RangeCalendar, whose choice fills both ends.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no date
// range picker, so this one shared file wraps Fragiola Primitives' on every
// base. Its parts are the DatePickerInput's and the DateRangeField's
// Separator; it goes in a `Field.Row`.

type P = typeof DateRangePickerInputPrimitive;
type D = typeof DateRangePickerPrimitive;

const segments = segmentParts.create(
    {
        Input: DateRangePickerInputPrimitive.Segments,
        Segment: DateRangePickerInputPrimitive.Segment,
    },
    "date-range-picker-input",
    "segments",
);

const parts = pickerParts.create(
    DateRangePickerPrimitive,
    "date-range-picker-input",
);

function DateRangePickerInputRoot(props: React.ComponentProps<P["Root"]>) {
    return (
        <PrimitivesDirection>
            <DateRangePickerInputPrimitive.Root {...props} />
        </PrimitivesDirection>
    );
}

function DateRangePickerInputTrigger({
    className,
    children,
    ...props
}: PrimitivesProps<D["Trigger"], "button">) {
    return (
        <DateRangePickerPrimitive.Trigger
            data-slot="date-range-picker-input-trigger"
            aria-label="Choose dates"
            className={typedPickerParts.inputTriggerClass(className)}
            {...props}
        >
            {children ?? <CalendarIcon aria-hidden="true" />}
        </DateRangePickerPrimitive.Trigger>
    );
}

function DateRangePickerInputContent({
    align = "end",
    ...props
}: React.ComponentProps<typeof parts.Content>) {
    return <parts.Content align={align} {...props} />;
}

export const DateRangePickerInput = {
    Root: DateRangePickerInputRoot,
    // one end: its Segments take `range` ("start" or "end")
    Segments: segments.Input as (
        props: PrimitivesProps<P["Segments"], "div">,
    ) => React.ReactNode,
    Segment: segments.Segment,
    Separator: rangeFieldParts.Separator,
    Trigger: DateRangePickerInputTrigger,
    Content: DateRangePickerInputContent,
};

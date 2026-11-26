"use client";

import {
    DatePickerInput as DatePickerInputPrimitive,
    DatePicker as DatePickerPrimitive,
} from "@fragiola/primitives-react/date-picker-input";
import { CalendarIcon } from "lucide-react";
import type * as React from "react";
import { clickable } from "#/atoms/clickable";
import { foundation } from "#/families/foundation";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";
import { segmentParts } from "#/ui/date-field";
import { pickerParts } from "#/ui/date-picker";

// DatePickerInput — a date picker typed into segments (spec/calendar.md,
// "Typed input"): the reader types the date into a DateField's segments, or
// opens the calendar with the trigger. Typing sets the value once the entry
// is complete and valid (else the value is `null` and the segments show
// `data-invalid`); the calendar fills the segments. One value, one form
// input, as the DatePicker's.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no date
// picker, so this one shared file wraps Fragiola Primitives' on every base.
//
// The control is only its middle (rule 3): it goes in a `Field.Row`.
//   Root      the picker's and the segments' state, no element
//   Segments  the typed date, DateField's Input (`field.segments`)
//   Segment   DateField's Segment
//   Trigger   a small ghost icon button pushed to the row's inline end, opening
//             the popup; named "Choose date" unless given a name
//   Content   the DatePicker's popup, aligned to the trigger's end

type P = typeof DatePickerInputPrimitive;
type D = typeof DatePickerPrimitive;

const segments = segmentParts.create(
    {
        Input: DatePickerInputPrimitive.Segments,
        Segment: DatePickerInputPrimitive.Segment,
    },
    "date-picker-input",
    "segments",
);

const parts = pickerParts.create(DatePickerPrimitive, "date-picker-input");

/** The typed pickers' trigger: an icon button inside the row. */
function inputTriggerClass(className: unknown): string {
    return cn(
        clickable({ variant: "ghost", shape: "square", size: "sm" }),
        foundation.secondary(),
        "ms-auto me-0.5 shrink-0 self-center",
        className as string,
    );
}

function DatePickerInputRoot(props: React.ComponentProps<P["Root"]>) {
    return (
        <PrimitivesDirection>
            <DatePickerInputPrimitive.Root {...props} />
        </PrimitivesDirection>
    );
}

function DatePickerInputTrigger({
    className,
    children,
    ...props
}: PrimitivesProps<D["Trigger"], "button">) {
    return (
        <DatePickerPrimitive.Trigger
            data-slot="date-picker-input-trigger"
            aria-label="Choose date"
            className={inputTriggerClass(className)}
            {...props}
        >
            {children ?? <CalendarIcon aria-hidden="true" />}
        </DatePickerPrimitive.Trigger>
    );
}

function DatePickerInputContent({
    align = "end",
    ...props
}: React.ComponentProps<typeof parts.Content>) {
    return <parts.Content align={align} {...props} />;
}

export const DatePickerInput = {
    Root: DatePickerInputRoot,
    Segments: segments.Input,
    Segment: segments.Segment,
    Trigger: DatePickerInputTrigger,
    Content: DatePickerInputContent,
};

// The typed range picker's trigger, in one export.
export const typedPickerParts = { inputTriggerClass };

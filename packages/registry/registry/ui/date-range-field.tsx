"use client";

import { DateRangeField as DateRangeFieldPrimitive } from "@fragiola/primitives-react/date-range-field";
import type * as React from "react";
import { field } from "#/families/field";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";
import { segmentParts } from "#/ui/date-field";

// DateRangeField — a start and an end date typed in segments
// (spec/date-range-field.md): the two ends are one sequence (a completed
// start goes on into the end), each end an Input named by the consumer
// (`aria-label="Start date"`). An end before the start, out of range or
// unavailable makes the range invalid: every segment carries `data-invalid`
// and turns `palette-danger` by inheritance.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no date
// range field, so this one shared file wraps Fragiola Primitives' on every
// base. Its Input and Segment are DateField's (`segmentParts.create`); it
// goes in a `Field.Row`, which draws one box around both ends.
//   Root       the control's area, `field.body`
//   Input      one end (`range="start"` or `"end"`), `field.segments`
//   Separator  the dash between the ends, `field.separator`, hidden from
//              assistive technology (each Input carries its own name)

type P = typeof DateRangeFieldPrimitive;

const parts = segmentParts.create(DateRangeFieldPrimitive, "date-range-field");

function DateRangeFieldRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <DateRangeFieldPrimitive.Root
                data-slot="date-range-field"
                className={segmentParts.rootClass(className)}
                {...props}
            />
        </PrimitivesDirection>
    );
}

function RangeSeparator({
    className,
    children,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            aria-hidden="true"
            data-slot="date-range-field-separator"
            className={cn(field.separator(), className)}
            {...props}
        >
            {children ?? "–"}
        </span>
    );
}

export const DateRangeField = {
    Root: DateRangeFieldRoot,
    // one end: its Input takes `range` ("start" or "end")
    Input: parts.Input as (
        props: PrimitivesProps<P["Input"], "div">,
    ) => React.ReactNode,
    Segment: parts.Segment,
    Separator: RangeSeparator,
};

// The dash between a range's ends, for TimeRangeField and the typed range
// picker.
export const rangeFieldParts = { Separator: RangeSeparator };

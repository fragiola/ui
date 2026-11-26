"use client";

import { TimeRangeField as TimeRangeFieldPrimitive } from "@fragiola/primitives-react/time-range-field";
import type * as React from "react";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";
import { segmentParts } from "#/ui/date-field";
import { rangeFieldParts } from "#/ui/date-range-field";

// TimeRangeField — a start and an end time typed in segments
// (spec/date-range-field.md): the DateRangeField's sequence over two
// `PlainTime`s; an end before the start makes the range invalid
// (`palette-danger` by inheritance).
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no time
// range field, so this one shared file wraps Fragiola Primitives' on every
// base. Its parts are DateRangeField's, named `time-range-field-*`; it goes
// in a `Field.Row`.

type P = typeof TimeRangeFieldPrimitive;

const parts = segmentParts.create(TimeRangeFieldPrimitive, "time-range-field");

function TimeRangeFieldRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <TimeRangeFieldPrimitive.Root
                data-slot="time-range-field"
                className={segmentParts.rootClass(className)}
                {...props}
            />
        </PrimitivesDirection>
    );
}

export const TimeRangeField = {
    Root: TimeRangeFieldRoot,
    // one end: its Input takes `range` ("start" or "end")
    Input: parts.Input as (
        props: PrimitivesProps<P["Input"], "div">,
    ) => React.ReactNode,
    Segment: parts.Segment,
    Separator: rangeFieldParts.Separator,
};

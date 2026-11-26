"use client";

import { TimeField as TimeFieldPrimitive } from "@fragiola/primitives-react/time-field";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";
import { segmentParts } from "#/ui/date-field";

// TimeField — a time typed in segments (spec/date-field.md): hours, minutes
// (`granularity="second"` adds seconds) and, on a 12-hour clock, the day
// period, typed and stepped as DateField's. Its value is a `PlainTime`.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no time
// field, so this one shared file wraps Fragiola Primitives' on every base.
// Its Input and Segment are DateField's (`segmentParts.create`), named
// `time-field-*`; it goes in a `Field.Row`, which draws the box.

type P = typeof TimeFieldPrimitive;

const parts = segmentParts.create(TimeFieldPrimitive, "time-field");

function TimeFieldRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <TimeFieldPrimitive.Root
                data-slot="time-field"
                className={segmentParts.rootClass(className)}
                {...props}
            />
        </PrimitivesDirection>
    );
}

export const TimeField = {
    Root: TimeFieldRoot,
    Input: parts.Input,
    Segment: parts.Segment,
};

"use client";

import { DateField as DateFieldPrimitive } from "@fragiola/primitives-react/date-field";
import type * as React from "react";
import { field } from "#/families/field";
import { foundation } from "#/families/foundation";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";

// DateField — a date typed in segments (spec/date-field.md): each segment is
// a spinbutton the digits fill (focus moves on when no further digit fits),
// the arrows step, Backspace erases, Left and Right move between segments.
// `granularity` adds the time's segments; `min`, `max` and
// `isDateUnavailable` make a value invalid; `name` submits it (ISO 8601).
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no date
// field, so this one shared file wraps Fragiola Primitives' on every base.
//
// The control is only its middle (rule 3): it goes in a `Field.Row`, which
// draws the box, the height and the focus ring.
//   Root     the control's area, `field.body`; renders the hidden input
//   Input    the segments' group, `field.segments`: the control's marker,
//            type and padding, laid out inline (the locale's order in RTL)
//   Segment  one segment, `field.segment`: the focused one `highlighted`, a
//            placeholder and a literal secondary text
// An invalid value (out of range, unavailable) carries `data-invalid`, so
// the segments turn `palette-danger` by inheritance.
//
// `segmentParts.create` writes Input and Segment once over an injected
// namespace: TimeField, DateRangeField, TimeRangeField and the typed pickers
// use the same parts.

type Part = React.ElementType;

type P = typeof DateFieldPrimitive;

type Segment = { index: number; type: string; placeholder: boolean };

/** The styled Input and Segment over a namespace's parts. */
function createSegmentParts(
    N: { Input: Part; Segment: Part },
    slot: string,
    input = "input",
) {
    const Primitive = N as unknown as Pick<P, "Input" | "Segment">;

    function SegmentPart({
        className,
        segment,
        ...props
    }: PrimitivesProps<P["Segment"], "span">) {
        const own = segment as unknown as Segment;
        return (
            <Primitive.Segment
                data-slot={`${slot}-segment`}
                segment={segment}
                className={cn(
                    field.segment(),
                    own.placeholder || own.type === "literal"
                        ? foundation.secondary()
                        : undefined,
                    className as string,
                )}
                {...props}
            />
        );
    }

    function Input({
        className,
        children,
        ...props
    }: PrimitivesProps<P["Input"], "div">) {
        return (
            <Primitive.Input
                data-slot={`${slot}-${input}`}
                className={cn(field.segments(), className as string)}
                {...props}
            >
                {children ??
                    ((segment: Segment) => (
                        <SegmentPart
                            key={segment.index}
                            segment={segment as never}
                        />
                    ))}
            </Primitive.Input>
        );
    }

    return { Input, Segment: SegmentPart };
}

/** A field's Root: the control's area inside the row. */
function rootClass(className: unknown): string {
    return cn(field.body(), "items-center", className as string);
}

const parts = createSegmentParts(DateFieldPrimitive, "date-field");

function DateFieldRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <DateFieldPrimitive.Root
                data-slot="date-field"
                className={rootClass(className)}
                {...props}
            />
        </PrimitivesDirection>
    );
}

export const DateField = {
    Root: DateFieldRoot,
    Input: parts.Input,
    Segment: parts.Segment,
};

// What the time and range fields and the typed pickers build on.
export const segmentParts = { create: createSegmentParts, rootClass };

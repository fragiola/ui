"use client";

import { NumberField as NumberFieldPrimitive } from "@fragiola/primitives-react/number-field";
import { ChevronsLeftRightIcon, MinusIcon, PlusIcon } from "lucide-react";
import { field } from "#/families/field";
import { foundation } from "#/families/foundation";
import type { PrimitiveProps } from "#/lib/base";
import { cn } from "#/lib/cn";

// NumberField — a number typed, stepped or scrubbed. Fragiola Primitives'
// NumberField provides the behaviour: the arrows (Shift for the large step,
// Alt for the small one), Page Up and Down, Home and End to the bounds, the
// Increment and Decrement buttons (held to repeat), the wheel with
// `allowWheelScrub`, the ScrubArea's drag, and the value formatted for the
// locale (`format`).
//
// The control is only its middle (rule 3), and the box is the field's:
//   Group      the box, `field.row` (the stroke, the radius, the ring).
//   Input      the bare control, `field.control`, inside a `Field.Body`
//              like any input; its numbers are tabular.
//   Decrement  a field addon (`field.addon`) on the inline start, and
//   Increment  one on the inline end: the `soft` adornment, a button. Their
//              side is `data-side` (`side`), like `Field.Addon`'s.
//   ScrubArea  a label-sized area that changes the value while dragged
//              sideways (`cursor-ew-resize`), with its ScrubAreaCursor.
// The steppers are named "Decrease" and "Increase" unless an `aria-label`
// is given.

type Side = "inline-start" | "inline-end";

function NumberFieldRoot({
    className,
    ...props
}: PrimitiveProps<typeof NumberFieldPrimitive.Root, "div">) {
    return (
        <NumberFieldPrimitive.Root
            data-slot="number-field"
            className={cn("flex w-full flex-col gap-2", className as string)}
            {...props}
        />
    );
}

function NumberFieldGroup({
    className,
    ...props
}: PrimitiveProps<typeof NumberFieldPrimitive.Group, "div">) {
    return (
        <NumberFieldPrimitive.Group
            data-slot="number-field-group"
            className={cn(field.row(), "flex-nowrap", className as string)}
            {...props}
        />
    );
}

function NumberFieldInput({
    className,
    ...props
}: PrimitiveProps<typeof NumberFieldPrimitive.Input, "input">) {
    return (
        <NumberFieldPrimitive.Input
            data-slot="number-field-input"
            className={cn(field.control(), "tabular-nums", className as string)}
            {...props}
        />
    );
}

const stepper = [
    field.addon(),
    foundation.focusInset(),
    foundation.disabled(),
    "cursor-pointer px-2.5 text-palette-accent transition-colors duration-150 hover:text-palette-contrast",
];

function NumberFieldDecrement({
    className,
    side = "inline-start",
    children,
    ...props
}: PrimitiveProps<typeof NumberFieldPrimitive.Decrement, "button"> & {
    side?: Side;
}) {
    return (
        <NumberFieldPrimitive.Decrement
            data-slot="number-field-decrement"
            data-side={side}
            aria-label="Decrease"
            className={cn(stepper, className as string)}
            {...props}
        >
            {children ?? <MinusIcon />}
        </NumberFieldPrimitive.Decrement>
    );
}

function NumberFieldIncrement({
    className,
    side = "inline-end",
    children,
    ...props
}: PrimitiveProps<typeof NumberFieldPrimitive.Increment, "button"> & {
    side?: Side;
}) {
    return (
        <NumberFieldPrimitive.Increment
            data-slot="number-field-increment"
            data-side={side}
            aria-label="Increase"
            className={cn(stepper, className as string)}
            {...props}
        >
            {children ?? <PlusIcon />}
        </NumberFieldPrimitive.Increment>
    );
}

function NumberFieldScrubArea({
    className,
    ...props
}: PrimitiveProps<typeof NumberFieldPrimitive.ScrubArea, "span">) {
    return (
        <NumberFieldPrimitive.ScrubArea
            data-slot="number-field-scrub-area"
            className={cn(
                "inline-flex w-fit cursor-ew-resize items-center gap-1 select-none",
                className as string,
            )}
            {...props}
        />
    );
}

function NumberFieldScrubAreaCursor({
    className,
    children,
    ...props
}: PrimitiveProps<typeof NumberFieldPrimitive.ScrubAreaCursor, "span">) {
    return (
        <NumberFieldPrimitive.ScrubAreaCursor
            data-slot="number-field-scrub-area-cursor"
            className={cn(
                "text-palette-contrast drop-shadow-sm [&_svg:not([class*='size-'])]:size-icon",
                className as string,
            )}
            {...props}
        >
            {children ?? <ChevronsLeftRightIcon />}
        </NumberFieldPrimitive.ScrubAreaCursor>
    );
}

export const NumberField = {
    Root: NumberFieldRoot,
    Group: NumberFieldGroup,
    Input: NumberFieldInput,
    Decrement: NumberFieldDecrement,
    Increment: NumberFieldIncrement,
    ScrubArea: NumberFieldScrubArea,
    ScrubAreaCursor: NumberFieldScrubAreaCursor,
};

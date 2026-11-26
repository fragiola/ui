"use client";

import { OTPField as OTPFieldPrimitive } from "@fragiola/primitives-react/otp-field";
import { Separator as SeparatorPrimitive } from "@fragiola/primitives-react/separator";
import { field } from "#/families/field";
import type { PrimitiveProps } from "#/lib/base";
import { cn } from "#/lib/cn";

// OTPField — a one-time code, one character per slot. Fragiola Primitives'
// OTPField provides the behaviour: a typed character moves the focus to the
// next slot, Backspace back, the arrows between slots (swapped in RTL), and
// a pasted code fills every slot from the first; `validationType` (digits by
// default) refuses other characters, and `onValueComplete` fires when the
// code is whole.
//
// Each slot is a control box: the field's box (`field.row`: the stroke, the
// field's radius, the ring when the slot is focused) around one centred
// character, `h-control` square. It composes the box and adds no style of
// its own, as a checkbox's mark composes it. Name every slot by its position
// ("Digit 2 of 6").
//
// Separator: Fragiola Primitives' OTPField has none (its spec leaves Base
// UI's out and names its Separator instead), so the part is that Separator,
// vertical: a short `line` dash between two groups of slots.

function OTPFieldRoot({
    className,
    ...props
}: PrimitiveProps<typeof OTPFieldPrimitive.Root, "div">) {
    return (
        <OTPFieldPrimitive.Root
            data-slot="otp-field"
            className={cn(
                "flex w-fit items-center gap-2 has-disabled:opacity-50",
                className as string,
            )}
            {...props}
        />
    );
}

function OTPFieldInput({
    className,
    ...props
}: PrimitiveProps<typeof OTPFieldPrimitive.Input, "input">) {
    return (
        <OTPFieldPrimitive.Input
            data-slot="otp-field-input"
            className={cn(
                field.row(),
                "field-control h-control w-9 shrink-0 px-0 text-center text-base tabular-nums caret-palette-ring outline-none disabled:cursor-not-allowed",
                className as string,
            )}
            {...props}
        />
    );
}

function OTPFieldSeparator({
    className,
    ...props
}: PrimitiveProps<typeof SeparatorPrimitive, "div">) {
    return (
        <SeparatorPrimitive
            data-slot="otp-field-separator"
            orientation="vertical"
            className={cn(
                "h-0.5 w-2.5 shrink-0 rounded-full bg-palette-line",
                className as string,
            )}
            {...props}
        />
    );
}

export const OTPField = {
    Root: OTPFieldRoot,
    Input: OTPFieldInput,
    Separator: OTPFieldSeparator,
};

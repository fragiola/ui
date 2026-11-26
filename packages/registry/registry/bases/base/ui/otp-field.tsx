"use client";

import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field";
import type * as React from "react";
import { field } from "#/families/field";
import { cn } from "#/lib/cn";

// OTPField — a one-time code, one character per slot. Base UI's OTPField
// provides the behaviour: a typed character moves the focus to the next
// slot, Backspace back, the arrows between slots (swapped in RTL), and a
// pasted code fills every slot from the first; `validationType` (digits by
// default) refuses other characters, and `onValueComplete` fires when the
// code is whole.
//
// Each slot is a control box: the field's box (`field.row`: the stroke, the
// field's radius, the ring when the slot is focused) around one centred
// character, `h-control` square. It composes the box and adds no style of
// its own, as a checkbox's mark composes it. Name every slot by its position
// ("Digit 2 of 6").
//
// Separator: Base UI's OTPField.Separator, a short `line` dash between two
// groups of slots.

function OTPFieldRoot({
    className,
    ...props
}: React.ComponentProps<typeof OTPFieldPrimitive.Root>) {
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
}: React.ComponentProps<typeof OTPFieldPrimitive.Input>) {
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
}: React.ComponentProps<typeof OTPFieldPrimitive.Separator>) {
    return (
        <OTPFieldPrimitive.Separator
            data-slot="otp-field-separator"
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

"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import type * as React from "react";
import { choice } from "#/families/choice";
import { cn } from "#/lib/cn";

// Radio — a checkable circle. Uses the choice family's root (the circle)
// and indicator (the dot). Base UI's Radio provides the behaviour.
//
// The choice family root has rounded-sm; radio overrides to rounded-full.
// The indicator is a filled circle (size-2) instead of a check icon.
//
// RadioGroup is the root directly (not a namespace) — it renders a <div>
// and provides shared state to the radio buttons inside.

function RadioGroup({
    className,
    ...props
}: React.ComponentProps<typeof RadioGroupPrimitive>) {
    return (
        <RadioGroupPrimitive
            data-slot="radio-group"
            className={cn("flex flex-col gap-2", className as string)}
            {...props}
        />
    );
}

function RadioRoot({
    className,
    ...props
}: React.ComponentProps<typeof RadioPrimitive.Root>) {
    return (
        <RadioPrimitive.Root
            data-slot="radio"
            className={cn(
                "field-control size-4 shrink-0 rounded-full border",
                "border-palette-line bg-palette-soft",
                "data-checked:bg-palette-ring",
                "field-focus:outline-solid field-focus:outline-1 field-focus:outline-offset-1 field-focus:outline-palette-ring",
                "data-disabled:opacity-50 data-disabled:cursor-not-allowed",
                "transition-colors",
                className as string,
            )}
            {...props}
        />
    );
}

function RadioIndicator({
    className,
    ...props
}: React.ComponentProps<typeof RadioPrimitive.Indicator>) {
    return (
        <RadioPrimitive.Indicator
            data-slot="radio-indicator"
            className={cn(
                "grid place-content-center w-full h-full",
                className as string,
            )}
            {...props}
        >
            <span className="size-2 rounded-full bg-palette-base" />
        </RadioPrimitive.Indicator>
    );
}

export { RadioGroup };

export const Radio = {
    Root: RadioRoot,
    Indicator: RadioIndicator,
};

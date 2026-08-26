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
                choice.root(),
                "size-4.5 rounded-full",
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
            className={cn(choice.indicator(), className as string)}
            {...props}
        >
            <span className="size-2 rounded-full bg-palette-contrast" />
        </RadioPrimitive.Indicator>
    );
}

export { RadioGroup };

export const Radio = {
    Root: RadioRoot,
    Indicator: RadioIndicator,
};

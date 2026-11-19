"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import type * as React from "react";
import { choice } from "#/families/choice";
import { cn } from "#/lib/cn";

// Radio — a checkable circle. Uses the choice family's `mark` (the circle)
// and `indicator` (the dot). Base UI's Radio provides the behaviour.
//
// The mark is the checkbox's box; the radio adds `rounded-full`, an intrinsic
// circle. The indicator is a dot in the mark's text colour (`base` on the
// `ring` fill) instead of a check icon.
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
            className={cn(choice.mark(), "rounded-full", className as string)}
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
            className={cn(choice.indicator(), "size-full", className as string)}
            {...props}
        >
            <span className="size-1.5 rounded-full bg-current" />
        </RadioPrimitive.Indicator>
    );
}

export { RadioGroup };

export const Radio = {
    Root: RadioRoot,
    Indicator: RadioIndicator,
};

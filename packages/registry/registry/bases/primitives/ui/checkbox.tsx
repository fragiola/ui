"use client";

import { Checkbox as CheckboxPrimitive } from "@fragiola/primitives-react/checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";
import { choice } from "#/families/choice";
import type { PrimitiveProps } from "#/lib/base";
import { cn } from "#/lib/cn";

// Checkbox — a checkable box. Uses the choice family's `mark` (the box) and
// `indicator` (the check icon). Fragiola Primitives' Checkbox provides the behaviour
// (checked/unchecked/indeterminate states, keyboard, aria).
//
// The mark is size-4 with `rounded-sm`; the check is `size-icon-xs` with a
// heavier stroke, so it reads at that size.
//
// No size variant, no tone prop — palette handles tone via className.

function CheckboxRoot({
    className,
    ...props
}: PrimitiveProps<typeof CheckboxPrimitive.Root, "div">) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(choice.mark(), className as string)}
            {...props}
        />
    );
}

function CheckboxIndicator({
    className,
    ...props
}: PrimitiveProps<typeof CheckboxPrimitive.Indicator, "div">) {
    return (
        <CheckboxPrimitive.Indicator
            data-slot="checkbox-indicator"
            className={cn(choice.indicator(), className as string)}
            {...props}
        >
            <CheckIcon
                className="size-icon-xs in-data-indeterminate:hidden"
                strokeWidth={3}
            />
            <MinusIcon
                className="hidden size-icon-xs in-data-indeterminate:block"
                strokeWidth={3}
            />
        </CheckboxPrimitive.Indicator>
    );
}

export const Checkbox = {
    Root: CheckboxRoot,
    Indicator: CheckboxIndicator,
};

"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon } from "lucide-react";
import type * as React from "react";
import { choice } from "#/families/choice";
import { cn } from "#/lib/cn";

// Checkbox — a checkable box. Uses the choice family's root (the box) and
// indicator (the check icon). Base UI's Checkbox provides the behaviour
// (checked/unchecked/indeterminate states, keyboard, aria).
//
// The choice family root has size-4.5 (18px) and rounded-sm. The indicator
// is a CheckIcon at size-3.5 (inherited from the family's svg rule).
//
// No size variant, no tone prop — palette handles tone via className.

function CheckboxRoot({
    className,
    ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(choice.root(), "size-4.5", className as string)}
            {...props}
        />
    );
}

function CheckboxIndicator({
    className,
    ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Indicator>) {
    return (
        <CheckboxPrimitive.Indicator
            data-slot="checkbox-indicator"
            className={cn(choice.indicator(), className as string)}
            {...props}
        >
            <CheckIcon className="size-3.5" />
        </CheckboxPrimitive.Indicator>
    );
}

export const Checkbox = {
    Root: CheckboxRoot,
    Indicator: CheckboxIndicator,
};

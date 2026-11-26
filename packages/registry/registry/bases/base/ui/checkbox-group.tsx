"use client";

import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import type * as React from "react";
import { cn } from "#/lib/cn";

// CheckboxGroup — Checkboxes sharing one value: the list of the checked
// ones' `value`s. Base UI's CheckboxGroup provides the behaviour.
// With `allValues`, a `<Checkbox.Root parent />` checks or clears them all
// and shows the mixed mark (`data-indeterminate`, the choice family's dash)
// while only some are checked.
//
// The group draws nothing: its checkboxes are `Checkbox` in
// `Field.ChoiceRoot`s, a column apart like RadioGroup's. The root is the
// root directly (not a namespace), like RadioGroup.

function CheckboxGroup({
    className,
    ...props
}: React.ComponentProps<typeof CheckboxGroupPrimitive>) {
    return (
        <CheckboxGroupPrimitive
            data-slot="checkbox-group"
            className={cn("flex flex-col gap-2", className as string)}
            {...props}
        />
    );
}

export { CheckboxGroup };

"use client";

import { CheckboxGroup as CheckboxGroupPrimitive } from "@fragiola/primitives-react/checkbox-group";
import type { PrimitiveProps } from "#/lib/base";
import { cn } from "#/lib/cn";

// CheckboxGroup — Checkboxes sharing one value: the list of the checked
// ones' `value`s. Fragiola Primitives' CheckboxGroup provides the behaviour.
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
}: PrimitiveProps<typeof CheckboxGroupPrimitive, "div">) {
    return (
        <CheckboxGroupPrimitive
            data-slot="checkbox-group"
            className={cn("flex flex-col gap-2", className as string)}
            {...props}
        />
    );
}

export { CheckboxGroup };

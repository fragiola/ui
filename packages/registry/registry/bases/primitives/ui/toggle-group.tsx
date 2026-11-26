"use client";

import { ToggleGroup as ToggleGroupPrimitive } from "@fragiola/primitives-react/toggle-group";
import type { PrimitiveProps } from "#/lib/base";
import { cn } from "#/lib/cn";

// ToggleGroup — a set of Toggles sharing one value: one pressed at most, or
// several with `multiple`. Fragiola Primitives' ToggleGroup provides the
// behaviour: one tab stop and the arrows between the toggles (roving focus,
// RTL swapping Left and Right), `orientation` and `loopFocus`.
//
// The group draws nothing: its toggles are `Toggle`, each with its own
// Clickable surface and the `current` mark when pressed, a gap apart. A
// button group whose buttons share one border is another component (it has
// no behaviour of its own). The root is the root directly (not a namespace),
// like RadioGroup.

function ToggleGroup({
    className,
    ...props
}: PrimitiveProps<typeof ToggleGroupPrimitive, "div">) {
    return (
        <ToggleGroupPrimitive
            data-slot="toggle-group"
            className={cn(
                "inline-flex w-fit items-center gap-1 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
                className as string,
            )}
            {...props}
        />
    );
}

export { ToggleGroup };

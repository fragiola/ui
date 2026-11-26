"use client";

import { Switch as SwitchPrimitive } from "@fragiola/primitives-react/switch";
import { choice } from "#/families/choice";
import type { PrimitiveProps } from "#/lib/base";
import { cn } from "#/lib/cn";

// Switch — a toggle. The choice family's `track` (the body: `rail` when off,
// `ring` when on — the same two colours as a slider) and `thumb` (the knob).
// Fragiola Primitives' Switch provides the behaviour. The thumb follows the track's
// shape (`rounded-pill`), so at `data-radius="flat"` a square track slides a
// square thumb.

function SwitchRoot({
    className,
    ...props
}: PrimitiveProps<typeof SwitchPrimitive.Root, "div">) {
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            className={cn(choice.track(), className as string)}
            {...props}
        />
    );
}

function SwitchThumb({
    className,
    ...props
}: PrimitiveProps<typeof SwitchPrimitive.Thumb, "div">) {
    return (
        <SwitchPrimitive.Thumb
            data-slot="switch-thumb"
            className={cn(choice.thumb(), className as string)}
            {...props}
        />
    );
}

export const Switch = {
    Root: SwitchRoot,
    Thumb: SwitchThumb,
};

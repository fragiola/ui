"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import type * as React from "react";
import { choice } from "#/families/choice";
import { cn } from "#/lib/cn";

// Switch — a toggle. Uses the choice family's root (the track) and control
// (the thumb). Base UI's Switch provides the behaviour.
//
// The choice family root has size-4.5 and rounded-sm; switch overrides to
// w-9 h-5 rounded-full. The thumb is a circle that slides when checked.
// data-checked fills the track with palette-base.

function SwitchRoot({
    className,
    ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            className={cn(
                choice.root(),
                "w-9 h-5 rounded-full",
                "data-checked:bg-palette-base",
                className as string,
            )}
            {...props}
        />
    );
}

function SwitchThumb({
    className,
    ...props
}: React.ComponentProps<typeof SwitchPrimitive.Thumb>) {
    return (
        <SwitchPrimitive.Thumb
            data-slot="switch-thumb"
            className={cn(
                choice.control(),
                "size-4 rounded-full bg-palette-soft shadow-sm",
                "data-checked:translate-x-4 rtl:data-checked:-translate-x-4",
                "transition-transform",
                className as string,
            )}
            {...props}
        />
    );
}

export const Switch = {
    Root: SwitchRoot,
    Thumb: SwitchThumb,
};

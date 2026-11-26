"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";
import { clickable } from "#/atoms/clickable";
import { foundation } from "#/families/foundation";
import { cn } from "#/lib/cn";

// Toggle — a two-state button (the APG's toggle button: `aria-pressed`).
// Base UI's Toggle provides the behaviour; inside a ToggleGroup it
// joins the group's value.
//
// It is a Clickable (`clickable`, the button surface: height, radius, focus,
// the soft hover) whose pressed state is the foundation's `current` — `soft`,
// `contrast` text, `font-medium` — the same mark as the current tab or page:
// the `current` variant reads `aria-pressed="true"` (global.css). Not the
// `checked` fill: a pressed toggle is where you are in a set of tools, not a
// value being on.
//
// A toggle disabled by its group carries only `data-disabled`, so the
// foundation's `disabled` dims it as Clickable's `disabled` does.
//
// Clickable's axes minus `solid` (a solid button has no "off" look to
// return to): `ghost` (default, a toolbar's), `outline` and `icon`, `size`
// and `shape`. None is colour; colour is the palette class.

type ToggleVariants = Omit<VariantProps<typeof clickable>, "variant"> & {
    variant?: "ghost" | "outline" | "icon";
};

function Toggle({
    className,
    variant = "ghost",
    size,
    shape,
    disabled,
    ...props
}: React.ComponentProps<typeof TogglePrimitive> & ToggleVariants) {
    return (
        <TogglePrimitive
            data-slot="toggle"
            className={cn(
                clickable({
                    variant,
                    size,
                    shape,
                    disabled: disabled || undefined,
                }),
                foundation.current(),
                foundation.disabled(),
                className as string,
            )}
            disabled={disabled}
            {...props}
        />
    );
}

export { Toggle };

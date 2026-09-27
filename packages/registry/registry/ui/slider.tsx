"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import type * as React from "react";
import { Text } from "#/atoms/text";
import { field } from "#/families/field";
import { track } from "#/families/track";
import { cn } from "#/lib/cn";

// Slider — a field control. This is the thesis test of the control/body rule
// (architecture.md §3): a control that is NOT a text input underneath. The
// slider carries no border, no background box, no height, no focus ring on a
// box, no invalid state and no theme of its own. All of that arrives from
// `field.row` when it is composed inside `Field`, exactly as it does for
// `input`, `textarea`, `numeric` and `select`.
//
// The interactive element (Control) carries the `field-control` marker class,
// which is what the `field-focus` custom variant in global.css matches. Without
// it, the row's outline will not fire on focus — and it will fail silently.
//
// The thumb's own focus ring uses `palette-ring`. The fill grows from the
// inline start and inverts under RTL — the primitive sets `inset-inline-start`
// inline (a logical property), which is what makes that automatic. Vertical
// orientation is behaviour from the primitive (`data-orientation=vertical`),
// not a style variant.
//
// `track` is the family shared with `progress` (rail + fill). Installing
// `slider` after `progress` writes exactly one file — `slider.tsx` itself.

function SliderRoot<Value extends number | readonly number[]>({
    ...props
}: SliderPrimitive.Root.Props<Value>) {
    return <SliderPrimitive.Root data-slot="slider" {...props} />;
}

function SliderLabel({
    className,
    ...props
}: React.ComponentProps<typeof SliderPrimitive.Label>) {
    return (
        <SliderPrimitive.Label
            data-slot="slider-label"
            render={<Text.Label />}
            className={cn(field.label(), className as string)}
            {...props}
        />
    );
}

function SliderValue({
    className,
    ...props
}: React.ComponentProps<typeof SliderPrimitive.Value>) {
    return (
        <SliderPrimitive.Value
            data-slot="slider-value"
            className={cn(
                "text-sm text-palette-accent/85",
                className as string,
            )}
            {...props}
        />
    );
}

function SliderControl({
    className,
    ...props
}: React.ComponentProps<typeof SliderPrimitive.Control>) {
    // `field-control` is the marker the `field-focus` variant matches — the
    // row's outline fires when this is focused. `touch-none` disables the
    // browser's touch scrolling so a drag does not pan the page. The cross-axis
    // padding gives the thumb room; the inline axis is governed by the rail.
    // No border, no background, no height of its own — the row owns the box.
    return (
        <SliderPrimitive.Control
            data-slot="slider-control"
            className={cn(
                "field-control relative flex w-full touch-none items-center py-2.5 outline-none",
                "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-fit data-[orientation=vertical]:flex-col data-[orientation=vertical]:px-2.5 data-[orientation=vertical]:py-2.5",
                className as string,
            )}
            {...props}
        />
    );
}

function SliderTrack({
    className,
    ...props
}: React.ComponentProps<typeof SliderPrimitive.Track>) {
    return (
        <SliderPrimitive.Track
            data-slot="slider-track"
            className={cn(track.rail(), className as string)}
            {...props}
        />
    );
}

function SliderIndicator({
    className,
    ...props
}: React.ComponentProps<typeof SliderPrimitive.Indicator>) {
    return (
        <SliderPrimitive.Indicator
            data-slot="slider-indicator"
            className={cn(track.fill(), className as string)}
            {...props}
        />
    );
}

function SliderThumb({
    className,
    ...props
}: React.ComponentProps<typeof SliderPrimitive.Thumb>) {
    // The thumb is the only piece that draws its own focus ring — `palette-ring`
    // via `:focus-visible` on the nested input. `size-4` + `rounded-full` is the
    // shape; `bg-palette-base` is the palette's colour (the same role the fill
    // uses, so the thumb reads as the tip of the fill). `shadow-sm` lifts it off
    // the rail. The primitive positions the thumb absolutely and sets the
    // translate inline, so no positioning class is needed here.
    return (
        <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            className={cn(
                "absolute block size-4 rounded-full bg-palette-base shadow-sm",
                "outline-none has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-palette-ring",
                "data-[dragging]:scale-110",
                "data-[orientation=vertical]:size-4",
                className as string,
            )}
            {...props}
        />
    );
}

export const Slider = {
    Root: SliderRoot,
    Label: SliderLabel,
    Value: SliderValue,
    Control: SliderControl,
    Track: SliderTrack,
    Indicator: SliderIndicator,
    Thumb: SliderThumb,
};

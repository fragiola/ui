"use client";

import { Meter as MeterPrimitive } from "@base-ui/react/meter";
import type * as React from "react";
import { field } from "#/families/field";
import { track } from "#/families/track";
import { cn } from "#/lib/cn";

// Meter — a value within a known range: a quota, a storage, a score
// (`meter`, not a task's progress, which is Progress). Base UI's
// Meter provides the behaviour: the `meter` role with its value, bounds and
// text (`aria-valuetext`, formatted for the locale with `format`).
//
// The same `track` family as Progress and Slider: `track.rail` for the rail
// (`line`), `track.fill` for the indicator (`ring`, the colour of every
// "on" mark). The primitive sizes the fill from the inline start with
// logical properties, so it inverts under RTL. The label is a field label;
// the value is secondary text. Tone is a palette class, never a prop.

function MeterRoot({
    className,
    ...props
}: React.ComponentProps<typeof MeterPrimitive.Root>) {
    return (
        <MeterPrimitive.Root
            data-slot="meter"
            className={cn(
                "flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2",
                className as string,
            )}
            {...props}
        />
    );
}

function MeterLabel({
    className,
    ...props
}: React.ComponentProps<typeof MeterPrimitive.Label>) {
    return (
        <MeterPrimitive.Label
            data-slot="meter-label"
            className={cn(field.label(), "text-sm", className as string)}
            {...props}
        />
    );
}

function MeterValue({
    className,
    ...props
}: React.ComponentProps<typeof MeterPrimitive.Value>) {
    return (
        <MeterPrimitive.Value
            data-slot="meter-value"
            className={cn(
                "text-sm tabular-nums text-palette-accent/85",
                className as string,
            )}
            {...props}
        />
    );
}

function MeterTrack({
    className,
    ...props
}: React.ComponentProps<typeof MeterPrimitive.Track>) {
    return (
        <MeterPrimitive.Track
            data-slot="meter-track"
            className={cn(
                track.rail(),
                "basis-full overflow-hidden",
                className as string,
            )}
            {...props}
        />
    );
}

function MeterIndicator({
    className,
    ...props
}: React.ComponentProps<typeof MeterPrimitive.Indicator>) {
    return (
        <MeterPrimitive.Indicator
            data-slot="meter-indicator"
            className={cn(
                track.fill(),
                "inset-y-0 transition-[width] duration-150",
                className as string,
            )}
            {...props}
        />
    );
}

export const Meter = {
    Root: MeterRoot,
    Label: MeterLabel,
    Value: MeterValue,
    Track: MeterTrack,
    Indicator: MeterIndicator,
};

"use client";

import { ColorSlider as ColorSliderPrimitive } from "@fragiola/primitives-react/color-slider";
import type * as React from "react";
import { Text } from "#/atoms/text";
import { color } from "#/families/color";
import { field } from "#/families/field";
import { foundation } from "#/families/foundation";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";

// ColorSlider — one channel of a colour (hue, alpha, a red or a lightness)
// on a track drawn in that channel's gradient (spec/color-slider.md): the
// thumb is an APG slider over the channel's range, a press on the track
// moves it there and drags it, RTL runs it from the right. Inside a
// ColorPicker, a slider without a value of its own binds to the picker's
// colour.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI's Slider
// edits a number, not a colour's channel, and Base UI has no colour slider,
// so this one shared file wraps Fragiola Primitives' on every base.
//
// The look is the `color` family's:
//   Root    the group: the label and the value on one line, the track
//           under them (a column when vertical)
//   Label   the field's label type; it names the group and the thumb
//   Output  the channel's text (`120°`, `50%`), secondary
//   Track   the primitive's gradient (the colour being picked, never a
//           palette role), over the checkerboard for the alpha channel
//   Thumb   the knob with the colour inside, `focus` (it is the slider)
//   Template.Simple  the label, the value, the track and the thumb.

type P = typeof ColorSliderPrimitive;

function ColorSliderRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <ColorSliderPrimitive.Root
                data-slot="color-slider"
                className={cn(color.slider(), className as string)}
                {...props}
            />
        </PrimitivesDirection>
    );
}

function ColorSliderLabel({
    className,
    ...props
}: PrimitivesProps<P["Label"], "div">) {
    return (
        <ColorSliderPrimitive.Label
            data-slot="color-slider-label"
            render={<Text.Label />}
            className={cn(field.label(), className as string)}
            {...props}
        />
    );
}

function ColorSliderOutput({
    className,
    ...props
}: PrimitivesProps<P["Output"], "output">) {
    return (
        <ColorSliderPrimitive.Output
            data-slot="color-slider-output"
            className={cn(
                foundation.secondary(),
                "justify-self-end text-sm tabular-nums",
                className as string,
            )}
            {...props}
        />
    );
}

function ColorSliderTrack({
    className,
    ...props
}: PrimitivesProps<P["Track"], "div">) {
    return (
        <ColorSliderPrimitive.Track
            data-slot="color-slider-track"
            className={cn(color.sliderTrack(), className as string)}
            {...props}
        />
    );
}

function ColorSliderThumb({
    className,
    ...props
}: PrimitivesProps<P["Thumb"], "div">) {
    return (
        <ColorSliderPrimitive.Thumb
            data-slot="color-slider-thumb"
            className={cn(color.sliderThumb(), className as string)}
            {...props}
        />
    );
}

type Channel = React.ComponentProps<P["Root"]>["channel"];

/** A channel's name, for the template's label (English, as its copy). */
const CHANNEL_NAMES: Record<Channel, string> = {
    red: "Red",
    green: "Green",
    blue: "Blue",
    hue: "Hue",
    saturation: "Saturation",
    lightness: "Lightness",
    brightness: "Brightness",
    alpha: "Alpha",
};

/**
 * The common slider: its label (`label`, default the channel's name), the
 * channel's value, the track and the thumb. Every Root prop is forwarded;
 * `className` goes to the root.
 */
function ColorSliderTemplateSimple({
    label,
    ...props
}: PrimitivesProps<P["Root"], "div"> & { label?: string }) {
    return (
        <ColorSliderRoot {...props}>
            <ColorSliderLabel>
                {label ?? CHANNEL_NAMES[props.channel]}
            </ColorSliderLabel>
            <ColorSliderOutput />
            <ColorSliderTrack>
                <ColorSliderThumb />
            </ColorSliderTrack>
        </ColorSliderRoot>
    );
}

export const ColorSlider = {
    Root: ColorSliderRoot,
    Label: ColorSliderLabel,
    Output: ColorSliderOutput,
    Track: ColorSliderTrack,
    Thumb: ColorSliderThumb,
    Template: { Simple: ColorSliderTemplateSimple },
};

"use client";

import { ColorArea as ColorAreaPrimitive } from "@fragiola/primitives-react/color-area";
import type * as React from "react";
import { color } from "#/families/color";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";

// ColorArea — two channels of a colour at once (saturation and brightness by
// default) on a 2D area (spec/color-area.md): two APG sliders, one hidden
// range input per axis inside the thumb. A press moves the thumb there and
// drags it; the arrows move both axes from either input, the focus following
// the axis a key moved; RTL runs x from the right. Inside a ColorPicker, an
// area without a value of its own binds to the picker's colour.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no colour
// area, so this one shared file wraps Fragiola Primitives' on every base.
//
// The look is the `color` family's:
//   Root   the area: the primitive's background layers (the colour being
//          picked, never a palette role) with the edge's hairline; name it
//          (`aria-label`, the area is a `group`)
//   Thumb  the knob with the colour inside, `focusNested` (the focus is an
//          Input inside it)
//   Input  one per axis (`axis="x"`, `axis="y"`), visually hidden by the
//          primitive; name each one (`aria-label="Saturation"`)
//   Template.Simple  the area, its thumb and both inputs, named after the
//          channels.

type P = typeof ColorAreaPrimitive;

function ColorAreaRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <ColorAreaPrimitive.Root
                data-slot="color-area"
                className={cn(color.area(), className as string)}
                {...props}
            />
        </PrimitivesDirection>
    );
}

function ColorAreaThumb({
    className,
    ...props
}: PrimitivesProps<P["Thumb"], "div">) {
    return (
        <ColorAreaPrimitive.Thumb
            data-slot="color-area-thumb"
            className={cn(color.areaThumb(), className as string)}
            {...props}
        />
    );
}

function ColorAreaInput(props: PrimitivesProps<P["Input"], "input">) {
    return <ColorAreaPrimitive.Input data-slot="color-area-input" {...props} />;
}

type Channel = NonNullable<React.ComponentProps<P["Root"]>["xChannel"]>;

/** A channel's name, for the inputs of the template (English, as its copy). */
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
 * The common area: saturation across, brightness up (the hsb square under a
 * hue slider), its thumb and both inputs named after their channels. Every
 * Root prop is forwarded; `className` goes to the area. Name it
 * (`aria-label`, default "Color").
 */
function ColorAreaTemplateSimple({
    xChannel = "saturation",
    yChannel = "brightness",
    "aria-label": ariaLabel = "Color",
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <ColorAreaRoot
            xChannel={xChannel}
            yChannel={yChannel}
            aria-label={ariaLabel}
            {...props}
        >
            <ColorAreaThumb>
                <ColorAreaInput axis="x" aria-label={CHANNEL_NAMES[xChannel]} />
                <ColorAreaInput axis="y" aria-label={CHANNEL_NAMES[yChannel]} />
            </ColorAreaThumb>
        </ColorAreaRoot>
    );
}

export const ColorArea = {
    Root: ColorAreaRoot,
    Thumb: ColorAreaThumb,
    Input: ColorAreaInput,
    Template: { Simple: ColorAreaTemplateSimple },
};

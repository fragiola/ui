"use client";

import { ColorWheel as ColorWheelPrimitive } from "@fragiola/primitives-react/color-wheel";
import { color } from "#/families/color";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";

// ColorWheel — a colour's hue on a ring (spec/color-wheel.md): the thumb is
// an APG slider over 0–360°, a press on the ring moves it there and drags it,
// the arrows step it (wrapping). `outerRadius` and `innerRadius` (px) size
// the ring; the primitive sizes the box from them. Inside a ColorPicker, a
// wheel without a value of its own binds to the picker's colour.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no colour
// wheel, so this one shared file wraps Fragiola Primitives' on every base.
//
// The look is the `color` family's:
//   Root   the box (`wheel`), its size the primitive's
//   Track  the ring: the primitive's conic gradient of every hue, masked
//          inside the inner radius (physical: a wheel has no direction)
//   Thumb  the knob with the colour inside, `focus` (it is the slider);
//          name it (`aria-label="Hue"`)
//   Template.Simple  the ring and its thumb.

type P = typeof ColorWheelPrimitive;

function ColorWheelRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <ColorWheelPrimitive.Root
                data-slot="color-wheel"
                className={cn(color.wheel(), className as string)}
                {...props}
            />
        </PrimitivesDirection>
    );
}

function ColorWheelTrack({
    className,
    ...props
}: PrimitivesProps<P["Track"], "div">) {
    return (
        <ColorWheelPrimitive.Track
            data-slot="color-wheel-track"
            className={cn(color.wheelTrack(), className as string)}
            {...props}
        />
    );
}

function ColorWheelThumb({
    className,
    ...props
}: PrimitivesProps<P["Thumb"], "div">) {
    return (
        <ColorWheelPrimitive.Thumb
            data-slot="color-wheel-thumb"
            className={cn(color.wheelThumb(), className as string)}
            {...props}
        />
    );
}

/**
 * The common wheel: the ring and its thumb. The thumb takes the name
 * (`aria-label`, default "Hue", or `aria-labelledby`); every other Root prop
 * is forwarded, and `className` goes to the box.
 */
function ColorWheelTemplateSimple({
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <ColorWheelRoot {...props}>
            <ColorWheelTrack />
            <ColorWheelThumb
                aria-label={
                    ariaLabelledby === undefined
                        ? (ariaLabel ?? "Hue")
                        : ariaLabel
                }
                aria-labelledby={ariaLabelledby}
            />
        </ColorWheelRoot>
    );
}

export const ColorWheel = {
    Root: ColorWheelRoot,
    Track: ColorWheelTrack,
    Thumb: ColorWheelThumb,
    Template: { Simple: ColorWheelTemplateSimple },
};

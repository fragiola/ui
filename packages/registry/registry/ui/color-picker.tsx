"use client";

import { ColorPicker as ColorPickerPrimitive } from "@fragiola/primitives-react/color-picker";
import { PipetteIcon } from "lucide-react";
import type * as React from "react";
import { clickable } from "#/atoms/clickable";
import { field } from "#/families/field";
import { foundation } from "#/families/foundation";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";
import { ColorArea } from "#/ui/color-area";
import { ColorField } from "#/ui/color-field";
import { ColorSlider } from "#/ui/color-slider";
import { ColorSwatch } from "#/ui/color-swatch";
import { ColorSwatchPicker } from "#/ui/color-swatch-picker";
import { Field } from "#/ui/field";

// ColorPicker — one colour edited by several controls at once
// (spec/color-picker.md): a Root that holds the colour and shares it with
// the Color Area, Wheel, Slider, Field, Swatch and Swatch Picker placed
// inside it. A control with neither `value` nor `defaultValue` binds to the
// picker: it shows the picker's colour and every change it makes sets it, so
// the parts stay in sync by pointer and keyboard. `format` (hex, rgb, hsl,
// hsb) is the picker's state for the channel fields you show; `name`
// submits the colour as hex.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no colour
// picker, so this one shared file wraps Fragiola Primitives' on every base.
//
// It adds no family: the controls inside are the `color` family's.
//   Root                the picker's group, a column of its controls
//   FormatSelect        a native select of the format, its options yours:
//                       a control box (`field.row` with the `field-control`
//                       marker, the one select that is its own box)
//   EyeDropperTrigger   an outline square Clickable with a pipette; it
//                       renders only where the browser has the EyeDropper
//                       API (Chromium); name it
//   Template.Simple     the common picker: an area, a hue and an alpha
//                       slider, a swatch and a hex field, and `swatches`.

type P = typeof ColorPickerPrimitive;

function ColorPickerRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <ColorPickerPrimitive.Root
                data-slot="color-picker"
                className={cn(
                    "flex w-full flex-col gap-3",
                    className as string,
                )}
                {...props}
            />
        </PrimitivesDirection>
    );
}

function ColorPickerFormatSelect({
    className,
    ...props
}: PrimitivesProps<P["FormatSelect"], "select">) {
    return (
        <ColorPickerPrimitive.FormatSelect
            data-slot="color-picker-format-select"
            className={cn(
                field.row(),
                foundation.disabled(),
                "field-control min-h-control w-auto shrink-0 cursor-pointer px-2",
                className as string,
            )}
            {...props}
        />
    );
}

function ColorPickerEyeDropperTrigger({
    className,
    children,
    ...props
}: PrimitivesProps<P["EyeDropperTrigger"], "button">) {
    return (
        <ColorPickerPrimitive.EyeDropperTrigger
            data-slot="color-picker-eye-dropper-trigger"
            className={cn(
                clickable({ variant: "outline", shape: "square" }),
                foundation.disabled(),
                "shrink-0",
                className as string,
            )}
            {...props}
        >
            {children ?? <PipetteIcon />}
        </ColorPickerPrimitive.EyeDropperTrigger>
    );
}

type Swatches = React.ComponentProps<
    typeof ColorSwatchPicker.Template.Simple
>["colors"];

/**
 * The common picker's controls, bound to the picker around them: the area
 * (saturation and brightness), a hue and an alpha slider, the colour's
 * swatch beside its hex field, and the swatches when there are any. The
 * popover's template shows the same controls in its popup.
 */
function ColorPickerControls({ swatches }: { swatches?: Swatches }) {
    return (
        <>
            <ColorArea.Template.Simple />
            <ColorSlider.Root channel="hue" colorSpace="hsb">
                <ColorSlider.Track>
                    <ColorSlider.Thumb aria-label="Hue" />
                </ColorSlider.Track>
            </ColorSlider.Root>
            <ColorSlider.Root channel="alpha">
                <ColorSlider.Track>
                    <ColorSlider.Thumb aria-label="Alpha" />
                </ColorSlider.Track>
            </ColorSlider.Root>
            {/* dimmed with a disabled picker: the swatch and the row have
                no disabled state of their own */}
            <div className="flex items-center gap-2 in-data-disabled:opacity-50">
                <ColorSwatch className="size-9" />
                <Field.Row>
                    <ColorField.Root>
                        <ColorField.Input aria-label="Hex color" />
                    </ColorField.Root>
                </Field.Row>
            </div>
            {swatches && swatches.length > 0 ? (
                <ColorSwatchPicker.Template.Simple
                    aria-label="Swatches"
                    colors={swatches}
                />
            ) : null}
        </>
    );
}

/**
 * The common picker: an area, a hue and an alpha slider, the colour's
 * swatch and hex field, and an option per colour of `swatches`. Every Root
 * prop is forwarded; `className` goes to the root.
 */
function ColorPickerTemplateSimple({
    swatches,
    ...props
}: PrimitivesProps<P["Root"], "div"> & { swatches?: Swatches }) {
    return (
        <ColorPickerRoot {...props}>
            <ColorPickerControls swatches={swatches} />
        </ColorPickerRoot>
    );
}

export const ColorPicker = {
    Root: ColorPickerRoot,
    FormatSelect: ColorPickerFormatSelect,
    EyeDropperTrigger: ColorPickerEyeDropperTrigger,
    Template: { Simple: ColorPickerTemplateSimple },
};

// What the popover's template builds on.
export const colorPickerParts = { Controls: ColorPickerControls };

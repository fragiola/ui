"use client";

import { ColorPickerPopover as ColorPickerPopoverPrimitive } from "@fragiola/primitives-react/color-picker-popover";
import type * as React from "react";
import { clickable } from "#/atoms/clickable";
import { foundation } from "#/families/foundation";
import { popup } from "#/families/popup";
import { POSITIONER_DEFAULTS } from "#/lib/base";
import { cn } from "#/lib/cn";
import type { PrimitivesProps } from "#/lib/primitives-backed";
import { ColorPicker, colorPickerParts } from "#/ui/color-picker";
import { ColorSwatch } from "#/ui/color-swatch";

// ColorPickerPopover — a ColorPicker's controls in a popup opened from a
// swatch (spec/color-picker.md, the opt-in popover): the Trigger shows the
// picker's colour and toggles a non-modal dialog below it; on open the focus
// moves to the popup's first control, Escape closes it and returns the focus
// to the trigger, as an outside press does unless it focused something; Tab
// out of it closes it. It lives
// inside a ColorPicker.Root, whose colour the controls in the popup bind to;
// the Root's hidden input stays in the page while the popup is closed.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no colour
// picker, so this one shared file wraps Fragiola Primitives' on every base.
//
// It adds no family:
//   Root      the popup's open state, no element (inside ColorPicker.Root)
//   Trigger   an outline square Clickable (the control box, `h-control`)
//             holding a ColorSwatch of the picker's colour; name it
//             (`aria-label="Brand color"`)
//   Content   Portal, Positioner and Popup in one: the `popup.content`
//             overlay, a column of the controls, below the trigger at its
//             start; name it (`aria-label="Choose color"`)
//   Template.Simple  the swatch trigger and the common picker's controls
//             in the popup.

type P = typeof ColorPickerPopoverPrimitive;

type PositionerProps = Pick<
    PrimitivesProps<P["Positioner"], "div">,
    | "side"
    | "align"
    | "sideOffset"
    | "alignOffset"
    | "collisionPadding"
    | "anchor"
>;

function ColorPickerPopoverTrigger({
    className,
    children,
    ...props
}: PrimitivesProps<P["Trigger"], "button">) {
    return (
        <ColorPickerPopoverPrimitive.Trigger
            data-slot="color-picker-popover-trigger"
            className={cn(
                clickable({ variant: "outline", shape: "square" }),
                foundation.disabled(),
                "shrink-0 self-start p-1.5",
                className as string,
            )}
            {...props}
        >
            {children ?? <ColorSwatch className="size-full rounded-sm" />}
        </ColorPickerPopoverPrimitive.Trigger>
    );
}

function ColorPickerPopoverContent({
    className,
    side,
    align = "start",
    sideOffset = 4,
    alignOffset,
    collisionPadding,
    anchor,
    ...props
}: PrimitivesProps<P["Popup"], "div"> & PositionerProps) {
    return (
        <ColorPickerPopoverPrimitive.Portal>
            <ColorPickerPopoverPrimitive.Positioner
                {...POSITIONER_DEFAULTS}
                className="z-50 outline-none"
                side={side}
                align={align}
                sideOffset={sideOffset}
                alignOffset={alignOffset}
                {...(collisionPadding === undefined
                    ? {}
                    : { collisionPadding })}
                anchor={anchor}
            >
                <ColorPickerPopoverPrimitive.Popup
                    data-slot="color-picker-popover-content"
                    className={cn(
                        popup.content(),
                        "flex w-64 flex-col gap-3 p-3",
                        className as string,
                    )}
                    {...props}
                />
            </ColorPickerPopoverPrimitive.Positioner>
        </ColorPickerPopoverPrimitive.Portal>
    );
}

type Swatches = React.ComponentProps<
    typeof ColorPicker.Template.Simple
>["swatches"];

/**
 * The common popover picker: a swatch trigger and, in the popup, the area, a
 * hue and an alpha slider, the swatch and hex field and `swatches`. Every
 * ColorPicker.Root prop is forwarded; `className`, `id` and the trigger's
 * name (`aria-label`, default "Color"; `aria-labelledby`) go to the trigger.
 */
function ColorPickerPopoverTemplateSimple({
    swatches,
    className,
    id,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    ...props
}: Omit<React.ComponentProps<typeof ColorPicker.Root>, "className"> & {
    className?: string;
    swatches?: Swatches;
}) {
    return (
        <ColorPicker.Root {...props}>
            <ColorPickerPopoverPrimitive.Root>
                <ColorPickerPopoverTrigger
                    id={id}
                    className={className}
                    aria-label={
                        ariaLabelledby === undefined
                            ? (ariaLabel ?? "Color")
                            : ariaLabel
                    }
                    aria-labelledby={ariaLabelledby}
                />
                <ColorPickerPopoverContent aria-label="Choose color">
                    <colorPickerParts.Controls swatches={swatches} />
                </ColorPickerPopoverContent>
            </ColorPickerPopoverPrimitive.Root>
        </ColorPicker.Root>
    );
}

export const ColorPickerPopover = {
    Root: ColorPickerPopoverPrimitive.Root,
    Trigger: ColorPickerPopoverTrigger,
    Content: ColorPickerPopoverContent,
    Template: { Simple: ColorPickerPopoverTemplateSimple },
};

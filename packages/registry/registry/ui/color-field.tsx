"use client";

import { ColorField as ColorFieldPrimitive } from "@fragiola/primitives-react/color-field";
import { field } from "#/families/field";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";

// ColorField — a colour typed as text (spec/color-field.md): a hex value
// (`#336699`; `rgb()` and `hsl()` are read too), committed on Enter or blur;
// ArrowUp and ArrowDown step it as a 24-bit number. With `channel` it edits
// one channel as a spinbutton (`120°`, `50%`) with the channel's steps. A
// text that is no colour goes back to the value. Inside a ColorPicker, a
// field without a value of its own binds to the picker's colour.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no colour
// field, so this one shared file wraps Fragiola Primitives' on every base.
//
// The control is only its middle (rule 3): it goes in a `Field.Row`, which
// draws the box, the height and the focus ring. It adds no family.
//   Root   the control's area, `field.body`; renders the hidden input
//   Input  the bare control, `field.control` (the marker, the type, the
//          padding)

type P = typeof ColorFieldPrimitive;

function ColorFieldRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <ColorFieldPrimitive.Root
                data-slot="color-field"
                className={cn(
                    field.body(),
                    "items-center",
                    className as string,
                )}
                {...props}
            />
        </PrimitivesDirection>
    );
}

function ColorFieldInput({
    className,
    ...props
}: PrimitivesProps<P["Input"], "input">) {
    return (
        <ColorFieldPrimitive.Input
            data-slot="color-field-input"
            className={cn(
                field.control(),
                "self-stretch tabular-nums",
                className as string,
            )}
            {...props}
        />
    );
}

export const ColorField = {
    Root: ColorFieldRoot,
    Input: ColorFieldInput,
};

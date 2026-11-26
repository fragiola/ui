"use client";

import { ColorSwatch as ColorSwatchPrimitive } from "@fragiola/primitives-react/color-swatch";
import { color } from "#/families/color";
import { cn } from "#/lib/cn";
import type { PrimitivesProps } from "#/lib/primitives-backed";

// ColorSwatch — a colour shown as a tile (spec/color-swatch.md), its
// transparency over a checkerboard. An image to assistive technologies
// (`role="img"`): name it (`aria-label="Ocean"`), else its name is the
// colour's CSS text. Inside a ColorPicker, a swatch without a `color` shows
// the picker's colour; inside a ColorSwatchPicker item it is the option.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no colour
// swatch, so this one shared file wraps Fragiola Primitives' on every base.
// It has no direction to follow, so it needs no `PrimitivesDirection`.
//
// The look is the `color` family's `swatch`: the primitive's
// `--color-swatch-color` (the colour, never a palette role) over the
// checkerboard, with the edge's hairline. One part, no namespace parts:
// resize it with a class (`size-6`, `size-full`).

function ColorSwatch({
    className,
    ...props
}: PrimitivesProps<typeof ColorSwatchPrimitive, "div">) {
    return (
        <ColorSwatchPrimitive
            data-slot="color-swatch"
            className={cn(color.swatch(), className as string)}
            {...props}
        />
    );
}

export { ColorSwatch };

"use client";

import { AspectRatio as AspectRatioPrimitive } from "@fragiola/primitives-react/aspect-ratio";
import { cn } from "#/lib/cn";
import type { PrimitivesProps } from "#/lib/primitives-backed";

// Aspect Ratio — keeps its content at a width-to-height ratio: an image, a
// video embed, a map (spec/aspect-ratio.md). `ratio` is the width over the
// height (`16 / 9`; `1` by default). The primitive sets `aspect-ratio` and
// `min-height: 0` as its structural style, so its width is the layout's and
// its height follows; a taller child overflows, so fit it with
// `object-cover` (an image) or `size-full`.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// aspect ratio, so this one shared file wraps Fragiola Primitives' on every
// base. It has no direction, no state and no behaviour, so it needs no
// PrimitivesDirection.
//
// No family: it draws nothing, and clips its content (`overflow-hidden`),
// so a `rounded-*` on it rounds the image inside.

function AspectRatio({
    className,
    ...props
}: PrimitivesProps<typeof AspectRatioPrimitive, "div">) {
    return (
        <AspectRatioPrimitive
            data-slot="aspect-ratio"
            className={cn("relative overflow-hidden", className as string)}
            {...props}
        />
    );
}

export { AspectRatio };

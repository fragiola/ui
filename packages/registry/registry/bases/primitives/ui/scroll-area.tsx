"use client";

import { ScrollArea as ScrollAreaPrimitive } from "@fragiola/primitives-react/scroll-area";
import type * as React from "react";
import { foundation } from "#/families/foundation";
import type { PrimitiveProps } from "#/lib/base";
import { cn } from "#/lib/cn";

// Scroll Area — a box that scrolls natively (keyboard, wheel, touch, find in
// page) with thin scrollbars of its own in place of the browser's.
//
// The look composes the foundation (docs/visual-language.md):
//   Viewport   the element that scrolls; when it is a tab stop (its content
//              overflows and holds nothing focusable) its ring is drawn
//              inside (`focusInset`), as the box clips it.
//   Scrollbar  a thin track, transparent, shown while the pointer is over
//              the area or it scrolls (`data-hovering`, `data-scrolling`).
//   Thumb      a pill in `line` (`rail`, the track ground of every control),
//              which stands out on any floor; `knob`'s `base` fill would
//              vanish on it.
// `ScrollArea.Template.Simple` is the common box: the viewport, its content
// and both scrollbars.

function ScrollAreaRoot({
    className,
    ...props
}: PrimitiveProps<typeof ScrollAreaPrimitive.Root, "div">) {
    return (
        <ScrollAreaPrimitive.Root
            data-slot="scroll-area"
            className={cn(
                "relative min-h-0 overflow-hidden",
                className as string,
            )}
            {...props}
        />
    );
}

function ScrollAreaViewport({
    className,
    ...props
}: PrimitiveProps<typeof ScrollAreaPrimitive.Viewport, "div">) {
    return (
        <ScrollAreaPrimitive.Viewport
            data-slot="scroll-area-viewport"
            className={cn(
                foundation.focusInset(),
                "size-full max-h-[inherit] rounded-[inherit]",
                className as string,
            )}
            {...props}
        />
    );
}

function ScrollAreaContent({
    ...props
}: PrimitiveProps<typeof ScrollAreaPrimitive.Content, "div">) {
    return (
        <ScrollAreaPrimitive.Content
            data-slot="scroll-area-content"
            {...props}
        />
    );
}

function ScrollAreaScrollbar({
    className,
    orientation = "vertical",
    ...props
}: PrimitiveProps<typeof ScrollAreaPrimitive.Scrollbar, "div">) {
    return (
        <ScrollAreaPrimitive.Scrollbar
            data-slot="scroll-area-scrollbar"
            orientation={orientation}
            className={cn(
                `
                flex touch-none p-0.5 select-none
                opacity-0 transition-opacity duration-150
                data-hovering:opacity-100 data-scrolling:opacity-100
                motion-reduce:transition-none
                data-[orientation=vertical]:w-2.5
                data-[orientation=horizontal]:h-2.5
                data-[orientation=horizontal]:flex-col
                `,
                className as string,
            )}
            {...props}
        >
            <ScrollAreaPrimitive.Thumb
                data-slot="scroll-area-thumb"
                className={cn(
                    foundation.rail(),
                    `
                    rounded-full
                    data-[orientation=vertical]:w-full
                    data-[orientation=horizontal]:h-full
                    `,
                )}
            />
        </ScrollAreaPrimitive.Scrollbar>
    );
}

function ScrollAreaCorner({
    ...props
}: PrimitiveProps<typeof ScrollAreaPrimitive.Corner, "div">) {
    return (
        <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" {...props} />
    );
}

/** The common box: a viewport, its content and both scrollbars. */
function ScrollAreaTemplateSimple({
    className,
    children,
    "aria-label": label,
}: {
    className?: string;
    children?: React.ReactNode;
    /** Names the viewport as a region, when the content needs a name. */
    "aria-label"?: string;
}) {
    return (
        <ScrollAreaRoot className={className}>
            <ScrollAreaViewport
                {...(label ? { role: "region", "aria-label": label } : {})}
            >
                <ScrollAreaContent>{children}</ScrollAreaContent>
            </ScrollAreaViewport>
            <ScrollAreaScrollbar orientation="vertical" />
            <ScrollAreaScrollbar orientation="horizontal" />
            <ScrollAreaCorner />
        </ScrollAreaRoot>
    );
}

export const ScrollArea = {
    Root: ScrollAreaRoot,
    Viewport: ScrollAreaViewport,
    Content: ScrollAreaContent,
    Scrollbar: ScrollAreaScrollbar,
    Corner: ScrollAreaCorner,
    Template: { Simple: ScrollAreaTemplateSimple },
};

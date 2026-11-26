"use client";

import { HoverCard as HoverCardPrimitive } from "@fragiola/primitives-react/hover-card";
import { popup } from "#/families/popup";
import { POSITIONER_DEFAULTS, type PrimitiveProps } from "#/lib/base";
import { cn } from "#/lib/cn";

// Hover Card — a preview of what is behind a link, shown while the link is
// hovered or keyboard-focused (Base UI's Preview Card). It is not modal and
// never takes the focus; it stays open while the pointer is over it.
//
// It composes `popup.content`, the floating box every popup shares, with a
// card's padding and width. The trigger is the link itself (an `<a>`): wear
// `Text.Link` through `render`, or any element.
//
// `delay` and `closeDelay` are the Root's (Fragiola Primitives' API); the
// Base UI file takes them on the Root too and hands them to its Trigger.

function HoverCardRoot({
    ...props
}: PrimitiveProps<typeof HoverCardPrimitive.Root, "div">) {
    return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

function HoverCardTrigger({
    ...props
}: PrimitiveProps<typeof HoverCardPrimitive.Trigger, "a">) {
    return (
        <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
    );
}

function HoverCardContent({
    className,
    align,
    alignOffset,
    side,
    sideOffset = 4,
    ...props
}: PrimitiveProps<typeof HoverCardPrimitive.Popup, "div"> &
    Pick<
        PrimitiveProps<typeof HoverCardPrimitive.Positioner, "div">,
        "align" | "alignOffset" | "side" | "sideOffset"
    >) {
    return (
        <HoverCardPrimitive.Portal>
            <HoverCardPrimitive.Positioner
                {...POSITIONER_DEFAULTS}
                className="isolate z-50 outline-none"
                align={align}
                alignOffset={alignOffset}
                side={side}
                sideOffset={sideOffset}
            >
                <HoverCardPrimitive.Popup
                    data-slot="hover-card-content"
                    className={cn(
                        popup.content(),
                        "w-64 p-4",
                        className as string,
                    )}
                    {...props}
                />
            </HoverCardPrimitive.Positioner>
        </HoverCardPrimitive.Portal>
    );
}

export const HoverCard = {
    Root: HoverCardRoot,
    Trigger: HoverCardTrigger,
    Content: HoverCardContent,
};

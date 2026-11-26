"use client";

import { PreviewCard as HoverCardPrimitive } from "@base-ui/react/preview-card";
import * as React from "react";
import { popup } from "#/families/popup";
import { cn } from "#/lib/cn";

// Hover Card — a preview of what is behind a link, shown while the link is
// hovered or keyboard-focused (Base UI's Preview Card). It is not modal and
// never takes the focus; it stays open while the pointer is over it.
//
// It composes `popup.content`, the floating box every popup shares, with a
// card's padding and width. The trigger is the link itself (an `<a>`): wear
// `Text.Link` through `render`, or any element.
//
// `delay` and `closeDelay` are the Root's on every base (Fragiola
// Primitives' API). Base UI takes them on its Trigger, so the Root hands
// them down through a context; a Trigger's own value still wins.

type Delays = { delay?: number; closeDelay?: number };

const DelaysContext = React.createContext<Delays>({});

function HoverCardRoot({
    delay,
    closeDelay,
    ...props
}: HoverCardPrimitive.Root.Props & Delays) {
    const delays = React.useMemo(
        () => ({ delay, closeDelay }),
        [delay, closeDelay],
    );
    return (
        <DelaysContext.Provider value={delays}>
            <HoverCardPrimitive.Root data-slot="hover-card" {...props} />
        </DelaysContext.Provider>
    );
}

function HoverCardTrigger({
    delay,
    closeDelay,
    ...props
}: HoverCardPrimitive.Trigger.Props) {
    const delays = React.useContext(DelaysContext);
    return (
        <HoverCardPrimitive.Trigger
            data-slot="hover-card-trigger"
            delay={delay ?? delays.delay}
            closeDelay={closeDelay ?? delays.closeDelay}
            {...props}
        />
    );
}

function HoverCardContent({
    className,
    align,
    alignOffset,
    side,
    sideOffset = 4,
    ...props
}: HoverCardPrimitive.Popup.Props &
    Pick<
        HoverCardPrimitive.Positioner.Props,
        "align" | "alignOffset" | "side" | "sideOffset"
    >) {
    return (
        <HoverCardPrimitive.Portal>
            <HoverCardPrimitive.Positioner
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

"use client";

import { Carousel as CarouselPrimitive } from "@fragiola/primitives-react/carousel";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    PauseIcon,
    PlayIcon,
} from "lucide-react";
import * as React from "react";
import { Clickable } from "#/atoms/clickable";
import { foundation } from "#/families/foundation";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";

// Carousel — slides shown a page at a time, with Previous and Next, the
// slide picker's dots and an optional rotation the user can stop (the APG
// carousel). The slides scroll natively with CSS snapping: a swipe, a
// trackpad or a mouse drag scrolls them, and a page change scrolls to its
// first slide. In RTL the first slide is on the right and Next goes left.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// carousel, so this one shared file wraps Fragiola Primitives' on every
// base. `PrimitivesDirection` hands it the base's direction.
//
// The look composes what exists:
//   Viewport            the frame the slides scroll in and the arrows sit on.
//   ItemGroup           the scroller, `rounded-lg`; its own ring
//                       (`focusInset`) when it is the tab stop.
//   Prev/NextTrigger    a small outline icon button on the raised surface,
//                       over the slides' inline ends, dimmed (`disabled`) at
//                       an end; the chevrons mirror in RTL.
//   Indicator           a dot: the `rail` at rest, `checked` (the `ring`)
//                       on the current page — "on" is ring everywhere.
//   AutoplayTrigger     a ghost icon button, Pause or Play.

function CarouselRoot({
    className,
    ...props
}: PrimitivesProps<typeof CarouselPrimitive.Root, "div">) {
    return (
        <PrimitivesDirection>
            <CarouselPrimitive.Root
                data-slot="carousel"
                className={cn("flex flex-col gap-3", className as string)}
                {...props}
            />
        </PrimitivesDirection>
    );
}

function CarouselViewport({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="carousel-viewport"
            className={cn("relative", className)}
            {...props}
        />
    );
}

function CarouselItemGroup({
    className,
    ...props
}: PrimitivesProps<typeof CarouselPrimitive.ItemGroup, "div">) {
    return (
        <CarouselPrimitive.ItemGroup
            data-slot="carousel-item-group"
            className={cn(
                foundation.focusInset(),
                "rounded-lg data-dragging:cursor-grabbing",
                className as string,
            )}
            {...props}
        />
    );
}

function CarouselItem({
    className,
    ...props
}: PrimitivesProps<typeof CarouselPrimitive.Item, "div">) {
    return (
        <CarouselPrimitive.Item
            data-slot="carousel-item"
            className={cn("min-w-0", className as string)}
            {...props}
        />
    );
}

const ARROW =
    "absolute top-1/2 z-10 -translate-y-1/2 palette-raised bg-palette-base shadow-sm";

function CarouselPrevTrigger({
    className,
    children,
    ...props
}: PrimitivesProps<typeof CarouselPrimitive.PrevTrigger, "button">) {
    return (
        <CarouselPrimitive.PrevTrigger
            data-slot="carousel-prev-trigger"
            aria-label="Previous slide"
            render={
                <Clickable.Button variant="outline" shape="square" size="sm" />
            }
            className={cn(ARROW, "start-3", className as string)}
            {...props}
        >
            {children ?? <ChevronLeftIcon className="rtl:rotate-180" />}
        </CarouselPrimitive.PrevTrigger>
    );
}

function CarouselNextTrigger({
    className,
    children,
    ...props
}: PrimitivesProps<typeof CarouselPrimitive.NextTrigger, "button">) {
    return (
        <CarouselPrimitive.NextTrigger
            data-slot="carousel-next-trigger"
            aria-label="Next slide"
            render={
                <Clickable.Button variant="outline" shape="square" size="sm" />
            }
            className={cn(ARROW, "end-3", className as string)}
            {...props}
        >
            {children ?? <ChevronRightIcon className="rtl:rotate-180" />}
        </CarouselPrimitive.NextTrigger>
    );
}

function CarouselIndicatorGroup({
    className,
    ...props
}: PrimitivesProps<typeof CarouselPrimitive.IndicatorGroup, "div">) {
    return (
        <CarouselPrimitive.IndicatorGroup
            data-slot="carousel-indicator-group"
            className={cn(
                "flex items-center justify-center gap-1 data-[orientation=vertical]:flex-col",
                className as string,
            )}
            {...props}
        />
    );
}

function CarouselIndicator({
    className,
    render,
    ...props
}: PrimitivesProps<typeof CarouselPrimitive.Indicator, "button">) {
    // A dot in a 24px target: the button carries the focus ring, the dot
    // inside it the `rail` or, on the current page, `checked`.
    return (
        <CarouselPrimitive.Indicator
            data-slot="carousel-indicator"
            className={cn(
                foundation.focus(),
                "flex size-6 cursor-pointer items-center justify-center rounded-full",
                className as string,
            )}
            render={(
                itemProps: Record<string, unknown>,
                state: { current: boolean },
            ) => {
                const own = { ...itemProps };
                const children = (
                    <span
                        aria-hidden="true"
                        data-checked={state.current ? "" : undefined}
                        className={cn(
                            foundation.rail(),
                            foundation.checked(),
                            "size-2 rounded-full transition-colors duration-150",
                        )}
                    />
                );
                if (typeof render === "function") {
                    return (
                        render as (p: unknown, s: unknown) => React.ReactNode
                    )({ ...own, children }, state);
                }
                if (React.isValidElement(render)) {
                    return React.cloneElement(
                        render as React.ReactElement<Record<string, unknown>>,
                        { ...own, children },
                    );
                }
                return (
                    <button type="button" {...own}>
                        {children}
                    </button>
                );
            }}
            {...props}
        />
    );
}

function CarouselAutoplayTrigger({
    className,
    children,
    ...props
}: PrimitivesProps<typeof CarouselPrimitive.AutoplayTrigger, "button">) {
    return (
        <CarouselPrimitive.AutoplayTrigger
            data-slot="carousel-autoplay-trigger"
            render={
                <Clickable.Button variant="ghost" shape="square" size="sm" />
            }
            className={className as string}
            {...props}
        >
            {children ??
                ((state: { playing: boolean }) =>
                    state.playing ? (
                        <>
                            <PauseIcon />
                            <span className="sr-only">Stop slide rotation</span>
                        </>
                    ) : (
                        <>
                            <PlayIcon />
                            <span className="sr-only">
                                Start slide rotation
                            </span>
                        </>
                    ))}
        </CarouselPrimitive.AutoplayTrigger>
    );
}

export const Carousel = {
    Root: CarouselRoot,
    Viewport: CarouselViewport,
    ItemGroup: CarouselItemGroup,
    Item: CarouselItem,
    PrevTrigger: CarouselPrevTrigger,
    NextTrigger: CarouselNextTrigger,
    IndicatorGroup: CarouselIndicatorGroup,
    Indicator: CarouselIndicator,
    AutoplayTrigger: CarouselAutoplayTrigger,
};

"use client";

import { mergeProps } from "@fragiola/primitives-react/render";
import { SegmentedControl as SegmentedControlPrimitive } from "@fragiola/primitives-react/segmented-control";
import * as React from "react";
import { foundation } from "#/families/foundation";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";

// Segmented Control — one value of a few, shown side by side: a view switcher
// (List, Grid, Board), a unit or a density. A radio group with a mark that
// slides to the checked segment (spec/segmented-control.md, the APG radio
// group): arrows move the focus and check, RTL swaps Left and Right.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// segmented control, so this one shared file wraps Fragiola Primitives' on
// every base, and its item depends on `@fragiola/primitives-react` on both.
// `PrimitivesDirection` hands it the base's direction.
//
// The look composes the foundation (docs/visual-language.md):
//   Root       a control box (`box`): the `line` stroke, transparent, the
//              control height and radius, with a 2px inner gap.
//   Item       a segment; the checked one is `current` (`soft`, `contrast`,
//              `font-medium`), the others secondary text with the `hover`
//              fill. Focus is `focusInset`: the box packs the segments.
//   Indicator  the `current` fill itself, rendered by the Root after the
//              Items (the primitive measures the checked one) and sliding to
//              it. It carries the fill so it can move; the checked Item keeps
//              `current`'s text and weight over it.
// No variant, no size: colour is the palette in scope.

type AnyRef = React.Ref<unknown> | undefined;

function mergeRefs(...refs: unknown[]): React.RefCallback<unknown> {
    return (node) => {
        for (const ref of refs as AnyRef[]) {
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.RefObject<unknown>).current = node;
        }
    };
}

const INNER_RADIUS = "rounded-[max(0px,calc(var(--radius-control)-2px))]";

function SegmentedControlRoot({
    className,
    children,
    ...props
}: PrimitivesProps<typeof SegmentedControlPrimitive.Root, "div">) {
    return (
        <PrimitivesDirection>
            <SegmentedControlPrimitive.Root
                data-slot="segmented-control"
                className={cn(
                    foundation.box(),
                    foundation.disabled(),
                    `
                    relative isolate inline-flex min-h-control w-fit
                    items-stretch gap-0.5 rounded-control p-0.5
                    data-[orientation=vertical]:flex-col
                    `,
                    className as string,
                )}
                {...props}
            >
                {children}
                <SegmentedControlPrimitive.Indicator
                    data-slot="segmented-control-indicator"
                    data-active=""
                    className={cn(
                        foundation.current(),
                        INNER_RADIUS,
                        `
                        absolute -z-10
                        inset-s-(--segment-indicator-inset-inline-start)
                        top-(--segment-indicator-inset-block-start)
                        w-(--segment-indicator-inline-size)
                        h-(--segment-indicator-block-size)
                        transition-[inset-inline-start,top,width,height]
                        duration-200 ease-out motion-reduce:transition-none
                        `,
                    )}
                />
            </SegmentedControlPrimitive.Root>
        </PrimitivesDirection>
    );
}

function SegmentedControlItem({
    className,
    render,
    ...props
}: PrimitivesProps<typeof SegmentedControlPrimitive.Item, "button">) {
    // The primitive marks the checked segment `data-checked` (a radio);
    // `foundation.current()` keys on `data-active`, the "where you are"
    // attribute, so the render function adds it (as Tabs does), then
    // renders the consumer's `render` or the default button.
    return (
        <SegmentedControlPrimitive.Item
            data-slot="segmented-control-item"
            className={cn(
                foundation.hover(),
                foundation.current(),
                foundation.focusInset(),
                foundation.disabled(),
                INNER_RADIUS,
                `
                current:bg-transparent
                inline-flex flex-1 cursor-pointer items-center justify-center
                gap-2 whitespace-nowrap px-3 text-sm text-palette-accent/85
                select-none transition-colors duration-150
                [&_svg:not([class*='size-'])]:size-icon
                `,
                className as string,
            )}
            render={(
                itemProps: Record<string, unknown>,
                state: { checked: boolean },
            ) => {
                const active: Record<string, unknown> = {
                    ...itemProps,
                    "data-active": state.checked ? "" : undefined,
                };
                if (typeof render === "function") {
                    return (
                        render as (p: unknown, s: unknown) => React.ReactNode
                    )(active, state);
                }
                if (React.isValidElement(render)) {
                    const own = render.props as Record<string, unknown>;
                    // Both refs: the primitive's registers the segment (the
                    // roving focus, the indicator), the consumer's is theirs.
                    return React.cloneElement(
                        render as React.ReactElement<Record<string, unknown>>,
                        {
                            ...mergeProps(active, own),
                            ref: mergeRefs(active.ref, own.ref),
                        },
                    );
                }
                return <button type="button" {...active} />;
            }}
            {...props}
        />
    );
}

function SegmentedControlItemText({
    className,
    ...props
}: PrimitivesProps<typeof SegmentedControlPrimitive.ItemText, "span">) {
    return (
        <SegmentedControlPrimitive.ItemText
            data-slot="segmented-control-item-text"
            className={cn("truncate", className as string)}
            {...props}
        />
    );
}

export const SegmentedControl = {
    Root: SegmentedControlRoot,
    Item: SegmentedControlItem,
    ItemText: SegmentedControlItemText,
};

"use client";

import {
    type SelectItemData,
    Select as SelectPrimitive,
    type SelectVirtualListProps,
    SelectVirtual as SelectVirtualPrimitive,
} from "@fragiola/primitives-react/select-virtual";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import type * as React from "react";
import { field } from "#/families/field";
import { menu } from "#/families/menu";
import { popup } from "#/families/popup";
import { POSITIONER_DEFAULTS } from "#/lib/base";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";

// Select Virtual — a Select of thousands of items that renders only the
// options in view (spec/virtual-lists.md): the keys and the typeahead reach
// every item (End highlights the last of 10,000), the highlighted option
// stays rendered and scrolls into view, and each option carries its place
// in the set.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI's Select
// has no virtual list, so this one shared file is Fragiola Primitives'
// Select on every base — beside the base's own Select, which stays as it
// is. It is that Select's twin: the same family members in the same places
// (the trigger `field.row`, the popup `popup.content`, an option
// `menu.selectableItem` with `menu.itemIndicator`), so the two look the
// same. The Root takes `items` (`{ value, label, disabled? }`: every item,
// the labels known while closed); `SelectVirtual.List` calls its function
// for each item in view, returning a `SelectVirtual.Item`. A virtual list is
// flat (no groups). On Base UI, name the trigger with `aria-labelledby`:
// Base UI's Field does not reach it.

function SelectVirtualRoot(
    props: React.ComponentProps<typeof SelectPrimitive.Root>,
) {
    return (
        <PrimitivesDirection>
            <SelectPrimitive.Root data-slot="select" {...props} />
        </PrimitivesDirection>
    );
}

function SelectVirtualValue({
    className,
    ...props
}: PrimitivesProps<typeof SelectPrimitive.Value, "div">) {
    return (
        <SelectPrimitive.Value
            data-slot="select-value"
            className={cn(
                "text-sm text-palette-accent/85",
                className as string,
            )}
            {...props}
        />
    );
}

function SelectVirtualTrigger({
    className,
    children,
    ...props
}: PrimitivesProps<typeof SelectPrimitive.Trigger, "button">) {
    return (
        <SelectPrimitive.Trigger
            data-slot="select-trigger"
            className={cn(
                field.row(),
                "flex-row items-center justify-between px-3 py-2",
                className as string,
            )}
            {...props}
        >
            {children}
            <ChevronDownIcon className="size-icon text-palette-accent/85" />
        </SelectPrimitive.Trigger>
    );
}

function SelectVirtualContent({
    className,
    align = "start",
    alignOffset = 0,
    side = "bottom",
    sideOffset = 4,
    ...props
}: PrimitivesProps<typeof SelectPrimitive.Popup, "div"> &
    Pick<
        PrimitivesProps<typeof SelectPrimitive.Positioner, "div">,
        "align" | "alignOffset" | "side" | "sideOffset"
    >) {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Positioner
                {...POSITIONER_DEFAULTS}
                className="isolate z-50 outline-none"
                align={align}
                alignOffset={alignOffset}
                side={side}
                sideOffset={sideOffset}
            >
                <SelectPrimitive.Popup
                    data-slot="select-content"
                    className={cn(popup.content(), className as string)}
                    {...props}
                />
            </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
    );
}

// The virtual list: the scroll container is the popup (`popup.content`
// scrolls up to the room the page leaves), as the twin's.
function SelectVirtualList({ className, ...props }: SelectVirtualListProps) {
    return (
        <SelectVirtualPrimitive.List
            data-slot="select-list"
            className={cn("flex flex-col", className as string)}
            {...props}
        />
    );
}

function SelectVirtualItem({
    className,
    children,
    ...props
}: PrimitivesProps<typeof SelectPrimitive.Item, "div">) {
    return (
        <SelectPrimitive.Item
            data-slot="select-item"
            className={cn(menu.selectableItem(), className as string)}
            {...props}
        >
            <SelectPrimitive.ItemIndicator
                className={menu.itemIndicator()}
                data-slot="select-item-indicator"
            >
                <CheckIcon />
            </SelectPrimitive.ItemIndicator>
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    );
}

export type { SelectItemData };

export const SelectVirtual = {
    Root: SelectVirtualRoot,
    Trigger: SelectVirtualTrigger,
    Value: SelectVirtualValue,
    Content: SelectVirtualContent,
    List: SelectVirtualList,
    Item: SelectVirtualItem,
};

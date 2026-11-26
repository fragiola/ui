"use client";

import {
    Autocomplete as AutocompletePrimitive,
    type AutocompleteVirtualListProps,
    AutocompleteVirtual as AutocompleteVirtualPrimitive,
} from "@fragiola/primitives-react/autocomplete-virtual";
import { ChevronDownIcon, XIcon } from "lucide-react";
import type * as React from "react";
import { Clickable } from "#/atoms/clickable";
import { field } from "#/families/field";
import { menu } from "#/families/menu";
import { popup } from "#/families/popup";
import { POSITIONER_DEFAULTS } from "#/lib/base";
import { cn } from "#/lib/cn";
import {
    type PrimitivesProps as PrimitiveProps,
    PrimitivesDirection,
} from "#/lib/primitives-backed";

// Autocomplete Virtual — a Autocomplete over thousands of items that renders only the
// matching options in view (spec/virtual-lists.md): the first and last
// matches, the highlighted option with its neighbours
// stay rendered, so the arrows, the wrap through the input and opening on
// an end behave as with every option rendered; each option carries its
// place in the set, and `onLoadMore` asks for the next page.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI's Autocomplete
// virtualizes only through an external virtualizer (`virtualized`), so this
// one shared file is Fragiola Primitives'
// Autocomplete on every base — beside the base's own Autocomplete, which
// stays as it is. It is that Autocomplete's twin, part for part, with the same
// family members in the same places (field + popup + menu), so the two look
// the same. The Root takes flat `items` (a virtual list has no groups);
// `AutocompleteVirtual.List` calls its function for each match in view, returning
// a `AutocompleteVirtual.Item`. On Base UI, name the input with `aria-labelledby`
// or `id` + `htmlFor`: Base UI's Field does not reach it.

// Items and the render functions of List are typed as loosely as on Base
// UI, where an item is `any`: the same code compiles on every base.
// biome-ignore lint/suspicious/noExplicitAny: Base UI's item type
type AnyItem = any;

function AutocompleteVirtualRoot({
    ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Root<AnyItem>>) {
    return (
        <PrimitivesDirection>
            <AutocompletePrimitive.Root<AnyItem>
                data-slot="autocomplete"
                {...props}
            />
        </PrimitivesDirection>
    );
}

function AutocompleteInputGroup({
    className,
    ...props
}: PrimitiveProps<typeof AutocompletePrimitive.InputGroup, "div">) {
    return (
        <AutocompletePrimitive.InputGroup
            data-slot="autocomplete-input-group"
            className={cn(
                field.row(),
                "flex-row items-center gap-1.5 px-3 py-2",
                className as string,
            )}
            {...props}
        />
    );
}

function AutocompleteInput({
    className,
    ...props
}: PrimitiveProps<typeof AutocompletePrimitive.Input, "input">) {
    return (
        <AutocompletePrimitive.Input
            data-slot="autocomplete-input"
            className={cn(
                "field-control min-w-0 flex-1 bg-transparent text-sm text-palette-accent outline-none placeholder:text-palette-accent/85",
                className as string,
            )}
            {...props}
        />
    );
}

function AutocompleteTrigger({
    className,
    "aria-label": ariaLabel = "Show suggestions",
    ...props
}: PrimitiveProps<typeof AutocompletePrimitive.Trigger, "button">) {
    return (
        <AutocompletePrimitive.Trigger
            data-slot="autocomplete-trigger"
            render={
                <Clickable.Button
                    variant="ghost"
                    shape="square"
                    size="xs"
                    aria-label={ariaLabel}
                />
            }
            className={cn(className as string)}
            {...props}
        >
            <ChevronDownIcon className="size-icon text-palette-accent/85" />
        </AutocompletePrimitive.Trigger>
    );
}

function AutocompleteClear({
    className,
    "aria-label": ariaLabel = "Clear",
    ...props
}: PrimitiveProps<typeof AutocompletePrimitive.Clear, "button">) {
    return (
        <AutocompletePrimitive.Clear
            data-slot="autocomplete-clear"
            render={
                <Clickable.Button
                    variant="ghost"
                    shape="square"
                    size="xs"
                    aria-label={ariaLabel}
                />
            }
            className={cn(className as string)}
            {...props}
        >
            <XIcon className="size-icon" />
        </AutocompletePrimitive.Clear>
    );
}

function AutocompleteContent({
    className,
    align = "start",
    alignOffset = 0,
    side = "bottom",
    sideOffset = 4,
    ...props
}: PrimitiveProps<typeof AutocompletePrimitive.Popup, "div"> &
    Pick<
        PrimitiveProps<typeof AutocompletePrimitive.Positioner, "div">,
        "align" | "alignOffset" | "side" | "sideOffset"
    >) {
    return (
        <AutocompletePrimitive.Portal>
            <AutocompletePrimitive.Positioner
                {...POSITIONER_DEFAULTS}
                className="isolate z-50 outline-none"
                align={align}
                alignOffset={alignOffset}
                side={side}
                sideOffset={sideOffset}
            >
                <AutocompletePrimitive.Popup
                    data-slot="autocomplete-content"
                    className={cn(popup.content(), className as string)}
                    {...props}
                />
            </AutocompletePrimitive.Positioner>
        </AutocompletePrimitive.Portal>
    );
}

// The virtual list, with the twin's List classes: a column (the rows'
// room is their margin, the gap is read), the popup its scroll container.
function AutocompleteVirtualList({
    className,
    ...props
}: AutocompleteVirtualListProps<AnyItem>) {
    return (
        <AutocompleteVirtualPrimitive.List<AnyItem>
            data-slot="autocomplete-list"
            className={cn("flex flex-col gap-1", className as string)}
            {...props}
        />
    );
}

function AutocompleteItem({
    className,
    ...props
}: PrimitiveProps<typeof AutocompletePrimitive.Item, "div">) {
    return (
        <AutocompletePrimitive.Item
            data-slot="autocomplete-item"
            className={cn(menu.item(), className as string)}
            {...props}
        />
    );
}

function AutocompleteEmpty({
    className,
    ...props
}: PrimitiveProps<typeof AutocompletePrimitive.Empty, "div">) {
    return (
        <AutocompletePrimitive.Empty
            data-slot="autocomplete-empty"
            className={cn(
                "p-2 text-sm text-palette-accent/85 empty:hidden",
                className as string,
            )}
            {...props}
        />
    );
}

function AutocompleteStatus({
    className,
    ...props
}: PrimitiveProps<typeof AutocompletePrimitive.Status, "div">) {
    return (
        <AutocompletePrimitive.Status
            data-slot="autocomplete-status"
            className={cn("sr-only", className as string)}
            {...props}
        />
    );
}

export const AutocompleteVirtual = {
    Root: AutocompleteVirtualRoot,
    InputGroup: AutocompleteInputGroup,
    Input: AutocompleteInput,
    Trigger: AutocompleteTrigger,
    Clear: AutocompleteClear,
    Content: AutocompleteContent,
    List: AutocompleteVirtualList,
    Item: AutocompleteItem,
    Empty: AutocompleteEmpty,
    Status: AutocompleteStatus,
};

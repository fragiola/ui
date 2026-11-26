"use client";

import {
    Autocomplete as AutocompletePrimitive,
    type AutocompleteRootProps,
} from "@fragiola/primitives-react/autocomplete";
import { ChevronDownIcon, XIcon } from "lucide-react";
import type * as React from "react";
import { Clickable } from "#/atoms/clickable";
import { field } from "#/families/field";
import { menu } from "#/families/menu";
import { popup } from "#/families/popup";
import { POSITIONER_DEFAULTS, type PrimitiveProps } from "#/lib/base";
import { cn } from "#/lib/cn";

// Autocomplete — a text input that suggests: the value is the text typed,
// and the list offers completions to pick (a search box, a tag, a city).
// Unlike a Combobox, it selects nothing: picking an item fills the input.
// Fragiola Primitives' Autocomplete provides the behaviour: filtering
// (`filter`, `limit`), `mode` (list, inline completion or both), the
// highlighted item under the arrows, Enter to pick, Escape to close.
//
// It is Combobox's recombination, field + popup + menu, and declares no
// style of its own:
//   InputGroup  the box, `field.row`; Input the bare control in it
//   Trigger     a ghost Clickable with the chevron; Clear one with an ×
//   Content     the floating box, `popup.content`
//   Item        a menu item, `menu.item` (no check: nothing is selected)
//   GroupLabel  `menu.label`; Separator `menu.separator`
//   Empty       secondary text; Status the live region, visually hidden

// Items and the render functions of List are typed as loosely as on Base
// UI, where an item is `any`: the same code compiles on every base.
// biome-ignore lint/suspicious/noExplicitAny: Base UI's item type
type AnyItem = any;

function AutocompleteRoot({ ...props }: AutocompleteRootProps<AnyItem>) {
    return (
        <AutocompletePrimitive.Root<AnyItem>
            data-slot="autocomplete"
            {...props}
        />
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
                    aria-label="Show suggestions"
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
                    aria-label="Clear"
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
                    className={cn(
                        popup.content("z-50 outline-none"),
                        className as string,
                    )}
                    {...props}
                />
            </AutocompletePrimitive.Positioner>
        </AutocompletePrimitive.Portal>
    );
}

function AutocompleteList({
    className,
    ...props
}: Omit<
    PrimitiveProps<typeof AutocompletePrimitive.List, "div">,
    "children"
> & {
    children?:
        | React.ReactNode
        | ((item: AnyItem, index: number) => React.ReactNode);
}) {
    return (
        <AutocompletePrimitive.List
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

function AutocompleteGroup({
    className,
    ...props
}: PrimitiveProps<typeof AutocompletePrimitive.Group, "div">) {
    return (
        <AutocompletePrimitive.Group
            data-slot="autocomplete-group"
            className={cn("flex flex-col gap-1", className as string)}
            {...props}
        />
    );
}

function AutocompleteGroupLabel({
    className,
    ...props
}: PrimitiveProps<typeof AutocompletePrimitive.GroupLabel, "div">) {
    return (
        <AutocompletePrimitive.GroupLabel
            data-slot="autocomplete-group-label"
            className={cn(menu.label(), className as string)}
            {...props}
        />
    );
}

function AutocompleteSeparator({
    className,
    ...props
}: PrimitiveProps<typeof AutocompletePrimitive.Separator, "div">) {
    return (
        <AutocompletePrimitive.Separator
            data-slot="autocomplete-separator"
            className={cn(menu.separator(), className as string)}
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

export const Autocomplete = {
    Root: AutocompleteRoot,
    InputGroup: AutocompleteInputGroup,
    Input: AutocompleteInput,
    Trigger: AutocompleteTrigger,
    Clear: AutocompleteClear,
    Content: AutocompleteContent,
    List: AutocompleteList,
    Item: AutocompleteItem,
    Group: AutocompleteGroup,
    GroupLabel: AutocompleteGroupLabel,
    Separator: AutocompleteSeparator,
    Empty: AutocompleteEmpty,
    Status: AutocompleteStatus,
};

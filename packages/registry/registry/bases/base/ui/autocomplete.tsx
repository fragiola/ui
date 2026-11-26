"use client";

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { ChevronDownIcon, XIcon } from "lucide-react";
import type * as React from "react";
import { Clickable } from "#/atoms/clickable";
import { field } from "#/families/field";
import { menu } from "#/families/menu";
import { popup } from "#/families/popup";
import { cn } from "#/lib/cn";

// Autocomplete — a text input that suggests: the value is the text typed,
// and the list offers completions to pick (a search box, a tag, a city).
// Unlike a Combobox, it selects nothing: picking an item fills the input.
// Base UI's Autocomplete provides the behaviour: filtering
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

// An item is `any`, as Base UI types it: the same code compiles on every
// base.
// biome-ignore lint/suspicious/noExplicitAny: Base UI's item type
type AnyItem = any;

function AutocompleteRoot({
    ...props
}: Omit<AutocompletePrimitive.Root.Props<AnyItem>, "items"> & {
    items?: readonly AnyItem[];
}) {
    return <AutocompletePrimitive.Root data-slot="autocomplete" {...props} />;
}

function AutocompleteInputGroup({
    className,
    ...props
}: React.ComponentProps<typeof AutocompletePrimitive.InputGroup>) {
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
}: React.ComponentProps<typeof AutocompletePrimitive.Input>) {
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
}: React.ComponentProps<typeof AutocompletePrimitive.Trigger>) {
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
}: React.ComponentProps<typeof AutocompletePrimitive.Clear>) {
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
}: React.ComponentProps<typeof AutocompletePrimitive.Popup> &
    Pick<
        React.ComponentProps<typeof AutocompletePrimitive.Positioner>,
        "align" | "alignOffset" | "side" | "sideOffset"
    >) {
    return (
        <AutocompletePrimitive.Portal>
            <AutocompletePrimitive.Positioner
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
}: Omit<React.ComponentProps<typeof AutocompletePrimitive.List>, "children"> & {
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
}: React.ComponentProps<typeof AutocompletePrimitive.Item>) {
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
}: React.ComponentProps<typeof AutocompletePrimitive.Group>) {
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
}: React.ComponentProps<typeof AutocompletePrimitive.GroupLabel>) {
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
}: React.ComponentProps<typeof AutocompletePrimitive.Separator>) {
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
}: React.ComponentProps<typeof AutocompletePrimitive.Empty>) {
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
}: React.ComponentProps<typeof AutocompletePrimitive.Status>) {
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

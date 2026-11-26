"use client";

import {
    Combobox as ComboboxPrimitive,
    type ComboboxVirtualListProps,
    ComboboxVirtual as ComboboxVirtualPrimitive,
} from "@fragiola/primitives-react/combobox-virtual";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import type * as React from "react";
import { Clickable } from "#/atoms/clickable";
import { Text } from "#/atoms/text";
import { field } from "#/families/field";
import { menu } from "#/families/menu";
import { popup } from "#/families/popup";
import { POSITIONER_DEFAULTS } from "#/lib/base";
import { cn } from "#/lib/cn";
import {
    type PrimitivesProps as PrimitiveProps,
    PrimitivesDirection,
} from "#/lib/primitives-backed";

// Combobox Virtual — a Combobox over thousands of items that renders only the
// matching options in view (spec/virtual-lists.md): the first and last
// matches, the highlighted option with its neighbours and the selected one
// stay rendered, so the arrows, the wrap through the input and opening on
// an end behave as with every option rendered; each option carries its
// place in the set, and `onLoadMore` asks for the next page.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI's Combobox
// virtualizes only through an external virtualizer (`virtualized`), so this
// one shared file is Fragiola Primitives'
// Combobox on every base — beside the base's own Combobox, which
// stays as it is. It is that Combobox's twin, part for part, with the same
// family members in the same places (field + popup + menu), so the two look
// the same. The Root takes flat `items` (a virtual list has no groups);
// `ComboboxVirtual.List` calls its function for each match in view, returning
// a `ComboboxVirtual.Item`. On Base UI, name the input with `aria-labelledby`
// or `id` + `htmlFor`: Base UI's Field does not reach it.

// Items, values and the render functions of List and Value are typed as
// loosely as on Base UI, where an item is `any`: the same code compiles on
// every base (Fragiola Primitives types them from `items`).
// biome-ignore lint/suspicious/noExplicitAny: Base UI's item type
type AnyItem = any;

function ComboboxVirtualRoot({
    ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Root<AnyItem>>) {
    return (
        <PrimitivesDirection>
            <ComboboxPrimitive.Root<AnyItem> data-slot="combobox" {...props} />
        </PrimitivesDirection>
    );
}

// Fragiola Primitives has no Combobox.Label (its spec leaves Base UI's
// out): the label is Text.Label with the field's label style, associated
// by the consumer (`htmlFor`). Inside a Field, Field.Label names the input,
// as the example does on every base.
function ComboboxLabel({
    className,
    ...props
}: React.ComponentProps<typeof Text.Label>) {
    return (
        <Text.Label
            data-slot="combobox-label"
            className={cn(field.label(), className as string)}
            {...props}
        />
    );
}

function ComboboxInputGroup({
    className,
    ...props
}: PrimitiveProps<typeof ComboboxPrimitive.InputGroup, "div">) {
    // The input group IS a field row. The box (border, background, focus
    // ring) comes from field.row; the layout (flex-row, items-center) is
    // the group's own. No new style classes.
    return (
        <ComboboxPrimitive.InputGroup
            data-slot="combobox-input-group"
            className={cn(
                field.row(),
                "flex-row items-center gap-1.5 px-3 py-2",
                className as string,
            )}
            {...props}
        />
    );
}

function ComboboxInput({
    className,
    ...props
}: PrimitiveProps<typeof ComboboxPrimitive.Input, "input">) {
    // The input is a field control — no border, no background, no height, no
    // focus ring of its own. The field-control marker makes the row's
    // outline fire on focus. `min-w-0` allows the input to shrink inside the
    // flex row.
    return (
        <ComboboxPrimitive.Input
            data-slot="combobox-input"
            className={cn(
                "field-control min-w-0 flex-1 bg-transparent text-sm text-palette-accent outline-none placeholder:text-palette-accent/85",
                className as string,
            )}
            {...props}
        />
    );
}

function ComboboxTrigger({
    className,
    ...props
}: PrimitiveProps<typeof ComboboxPrimitive.Trigger, "button">) {
    // The trigger is Clickable.Button — no button style in this file. It
    // sits on the inline end of the input group. variant="ghost" +
    // shape="square" + size="sm" gives the chevron a tap target without a
    // visible button.
    return (
        <ComboboxPrimitive.Trigger
            data-slot="combobox-trigger"
            render={
                <Clickable.Button
                    variant="ghost"
                    shape="square"
                    size="xs"
                    aria-label="Show options"
                />
            }
            className={cn(className as string)}
            {...props}
        >
            <ChevronDownIcon className="size-icon text-palette-accent/85" />
        </ComboboxPrimitive.Trigger>
    );
}

function ComboboxClear({
    className,
    ...props
}: PrimitiveProps<typeof ComboboxPrimitive.Clear, "button">) {
    // The clear button is Clickable.Button — no button style in this file.
    return (
        <ComboboxPrimitive.Clear
            data-slot="combobox-clear"
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
        </ComboboxPrimitive.Clear>
    );
}

function ComboboxContent({
    className,
    align = "start",
    alignOffset = 0,
    side = "bottom",
    sideOffset = 4,
    ...props
}: PrimitiveProps<typeof ComboboxPrimitive.Popup, "div"> &
    Pick<
        PrimitiveProps<typeof ComboboxPrimitive.Positioner, "div">,
        "align" | "alignOffset" | "side" | "sideOffset"
    >) {
    return (
        <ComboboxPrimitive.Portal>
            <ComboboxPrimitive.Positioner
                {...POSITIONER_DEFAULTS}
                className="isolate z-50 outline-none"
                align={align}
                alignOffset={alignOffset}
                side={side}
                sideOffset={sideOffset}
            >
                <ComboboxPrimitive.Popup
                    data-slot="combobox-content"
                    className={cn(popup.content(), className as string)}
                    {...props}
                />
            </ComboboxPrimitive.Positioner>
        </ComboboxPrimitive.Portal>
    );
}

// The virtual list, with the twin's List classes: a column (the rows'
// room is their margin, the gap is read), the popup its scroll container.
function ComboboxVirtualList({
    className,
    ...props
}: ComboboxVirtualListProps<AnyItem>) {
    return (
        <ComboboxVirtualPrimitive.List<AnyItem>
            data-slot="combobox-list"
            className={cn("flex flex-col gap-1", className as string)}
            {...props}
        />
    );
}

function ComboboxItem({
    className,
    children,
    ...props
}: PrimitiveProps<typeof ComboboxPrimitive.Item, "div">) {
    return (
        <ComboboxPrimitive.Item
            data-slot="combobox-item"
            className={cn(menu.selectableItem(), className as string)}
            {...props}
        >
            <ComboboxPrimitive.ItemIndicator
                className={menu.itemIndicator()}
                data-slot="combobox-item-indicator"
            >
                <CheckIcon />
            </ComboboxPrimitive.ItemIndicator>
            {children}
        </ComboboxPrimitive.Item>
    );
}

function ComboboxEmpty({
    className,
    ...props
}: PrimitiveProps<typeof ComboboxPrimitive.Empty, "div">) {
    return (
        <ComboboxPrimitive.Empty
            data-slot="combobox-empty"
            className={cn(
                "p-2 text-sm text-palette-accent/85",
                className as string,
            )}
            {...props}
        />
    );
}

function ComboboxStatus({
    className,
    ...props
}: PrimitiveProps<typeof ComboboxPrimitive.Status, "div">) {
    return (
        <ComboboxPrimitive.Status
            data-slot="combobox-status"
            className={cn("sr-only", className as string)}
            {...props}
        />
    );
}

function ComboboxValue({
    ...props
}: Omit<PrimitiveProps<typeof ComboboxPrimitive.Value, "div">, "children"> & {
    children?: React.ReactNode | ((value: AnyItem) => React.ReactNode);
}) {
    // ComboboxValue doesn't render its own HTML element (it's a text
    // replacement), so it doesn't accept className. The consumer wraps it
    // in a Text component or applies classes to the parent.
    return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

function ComboboxChips({
    className,
    ...props
}: PrimitiveProps<typeof ComboboxPrimitive.Chips, "div">) {
    return (
        <ComboboxPrimitive.Chips
            data-slot="combobox-chips"
            className={cn("flex flex-wrap gap-1", className as string)}
            {...props}
        />
    );
}

function ComboboxChip({
    className,
    ...props
}: PrimitiveProps<typeof ComboboxPrimitive.Chip, "div">) {
    // A chip is a small badge-like element. It uses the same visual language
    // as a soft badge: bg-palette-soft + text-palette-contrast + rounded-md.
    // This is the one place where a class is not from a family — but it is
    // a role combination (soft + contrast), not a new style. The chip is
    // too specific to multiselect to justify a family member.
    return (
        <ComboboxPrimitive.Chip
            data-slot="combobox-chip"
            className={cn(
                "inline-flex items-center gap-1 rounded-md bg-palette-soft px-2 py-0.5 text-xs text-palette-contrast",
                className as string,
            )}
            {...props}
        />
    );
}

function ComboboxChipRemove({
    className,
    ...props
}: PrimitiveProps<typeof ComboboxPrimitive.ChipRemove, "div">) {
    return (
        <ComboboxPrimitive.ChipRemove
            data-slot="combobox-chip-remove"
            render={
                <Clickable.Button
                    variant="ghost"
                    shape="square"
                    size="xs"
                    aria-label="Remove"
                />
            }
            className={cn(className as string)}
            {...props}
        >
            <XIcon className="size-icon-xs" />
        </ComboboxPrimitive.ChipRemove>
    );
}

export const ComboboxVirtual = {
    Root: ComboboxVirtualRoot,
    Label: ComboboxLabel,
    InputGroup: ComboboxInputGroup,
    Input: ComboboxInput,
    Trigger: ComboboxTrigger,
    Clear: ComboboxClear,
    Content: ComboboxContent,
    List: ComboboxVirtualList,
    Item: ComboboxItem,
    Empty: ComboboxEmpty,
    Status: ComboboxStatus,
    Value: ComboboxValue,
    Chips: ComboboxChips,
    Chip: ComboboxChip,
    ChipRemove: ComboboxChipRemove,
};

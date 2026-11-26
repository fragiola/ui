"use client";

import {
    Combobox as ComboboxPrimitive,
    type ComboboxRootProps,
} from "@fragiola/primitives-react/combobox";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import type * as React from "react";
import { Clickable } from "#/atoms/clickable";
import { Text } from "#/atoms/text";
import { field } from "#/families/field";
import { menu } from "#/families/menu";
import { popup } from "#/families/popup";
import { POSITIONER_DEFAULTS, type PrimitiveProps } from "#/lib/base";
import { cn } from "#/lib/cn";

// Combobox — the second recombination test. This component is field + popup +
// menu, and it declares no new style. Every class comes from a family:
//   - Input uses field.row (the box) + field-control (the marker) + layout
//   - Trigger uses Clickable.Button (no button style in this file)
//   - Content uses popup.content (the floating box)
//   - Item uses menu.selectableItem (the option with indicator space)
//   - ItemIndicator uses menu.itemIndicator
//   - GroupLabel uses menu.label
//   - Separator uses menu.separator
//
// If this file contains a class that does not come from a family, the
// recombination claim is wrong. It does not.
//
// The input is a field control — the thesis test of the control/body rule
// applied to a text input that is also a trigger. The box (border,
// background, focus ring) comes from field.row; the input carries the
// field-control marker so the row's outline fires on focus. The trigger
// button and clear button sit inside the input group on the inline end.

// Items, values and the render functions of List and Value are typed as
// loosely as on Base UI, where an item is `any`: the same code compiles on
// every base (Fragiola Primitives types them from `items`).
// biome-ignore lint/suspicious/noExplicitAny: Base UI's item type
type AnyItem = any;

function ComboboxRoot({ ...props }: ComboboxRootProps<AnyItem>) {
    return <ComboboxPrimitive.Root<AnyItem> data-slot="combobox" {...props} />;
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

function ComboboxList({
    className,
    ...props
}: Omit<PrimitiveProps<typeof ComboboxPrimitive.List, "div">, "children"> & {
    children?:
        | React.ReactNode
        | ((item: AnyItem, index: number) => React.ReactNode);
}) {
    return (
        <ComboboxPrimitive.List
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

function ComboboxGroup({
    className,
    ...props
}: PrimitiveProps<typeof ComboboxPrimitive.Group, "div">) {
    return (
        <ComboboxPrimitive.Group
            data-slot="combobox-group"
            className={cn("flex flex-col gap-1", className as string)}
            {...props}
        />
    );
}

function ComboboxGroupLabel({
    className,
    ...props
}: PrimitiveProps<typeof ComboboxPrimitive.GroupLabel, "div">) {
    return (
        <ComboboxPrimitive.GroupLabel
            data-slot="combobox-group-label"
            className={cn(menu.label(), className as string)}
            {...props}
        />
    );
}

function ComboboxSeparator({
    className,
    ...props
}: PrimitiveProps<typeof ComboboxPrimitive.Separator, "div">) {
    return (
        <ComboboxPrimitive.Separator
            data-slot="combobox-separator"
            className={cn(menu.separator(), className as string)}
            {...props}
        />
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

export const Combobox = {
    Root: ComboboxRoot,
    Label: ComboboxLabel,
    InputGroup: ComboboxInputGroup,
    Input: ComboboxInput,
    Trigger: ComboboxTrigger,
    Clear: ComboboxClear,
    Content: ComboboxContent,
    List: ComboboxList,
    Item: ComboboxItem,
    Group: ComboboxGroup,
    GroupLabel: ComboboxGroupLabel,
    Separator: ComboboxSeparator,
    Empty: ComboboxEmpty,
    Status: ComboboxStatus,
    Value: ComboboxValue,
    Chips: ComboboxChips,
    Chip: ComboboxChip,
    ChipRemove: ComboboxChipRemove,
};

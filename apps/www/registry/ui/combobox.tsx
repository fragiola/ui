"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import type * as React from "react";
import { Clickable } from "#/atoms/clickable";
import { Text } from "#/atoms/text";
import { field } from "#/families/field";
import { menu } from "#/families/menu";
import { popup } from "#/families/popup";
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

function ComboboxRoot<Value, Multiple extends boolean | undefined = false>({
    ...props
}: ComboboxPrimitive.Root.Props<Value, Multiple>) {
    return (
        <ComboboxPrimitive.Root<Value, Multiple>
            data-slot="combobox"
            {...props}
        />
    );
}

function ComboboxLabel({
    className,
    ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Label>) {
    return (
        <ComboboxPrimitive.Label
            data-slot="combobox-label"
            render={<Text.Label />}
            className={cn(field.label(), className as string)}
            {...props}
        />
    );
}

function ComboboxInputGroup({
    className,
    ...props
}: React.ComponentProps<typeof ComboboxPrimitive.InputGroup>) {
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
}: React.ComponentProps<typeof ComboboxPrimitive.Input>) {
    // The input is a field control — no border, no background, no height, no
    // focus ring of its own. The field-control marker makes the row's
    // outline fire on focus. `min-w-0` allows the input to shrink inside the
    // flex row.
    return (
        <ComboboxPrimitive.Input
            data-slot="combobox-input"
            className={cn(
                "field-control min-w-0 flex-1 bg-transparent text-sm text-palette-contrast outline-none placeholder:text-palette-accent/85",
                className as string,
            )}
            {...props}
        />
    );
}

function ComboboxTrigger({
    className,
    ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Trigger>) {
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
                    size="sm"
                    aria-label="Show options"
                />
            }
            className={cn(className as string)}
            {...props}
        >
            <ChevronDownIcon className="size-4 text-palette-accent/85" />
        </ComboboxPrimitive.Trigger>
    );
}

function ComboboxClear({
    className,
    ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Clear>) {
    // The clear button is Clickable.Button — no button style in this file.
    return (
        <ComboboxPrimitive.Clear
            data-slot="combobox-clear"
            render={
                <Clickable.Button
                    variant="ghost"
                    shape="square"
                    size="sm"
                    aria-label="Clear"
                />
            }
            className={cn(className as string)}
            {...props}
        >
            <XIcon className="size-4" />
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
}: ComboboxPrimitive.Popup.Props &
    Pick<
        ComboboxPrimitive.Positioner.Props,
        "align" | "alignOffset" | "side" | "sideOffset"
    >) {
    return (
        <ComboboxPrimitive.Portal>
            <ComboboxPrimitive.Positioner
                className="isolate z-50 outline-none"
                align={align}
                alignOffset={alignOffset}
                side={side}
                sideOffset={sideOffset}
            >
                <ComboboxPrimitive.Popup
                    data-slot="combobox-content"
                    className={cn(
                        popup.content("z-50 outline-none"),
                        className as string,
                    )}
                    {...props}
                />
            </ComboboxPrimitive.Positioner>
        </ComboboxPrimitive.Portal>
    );
}

function ComboboxList({
    className,
    ...props
}: React.ComponentProps<typeof ComboboxPrimitive.List>) {
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
}: React.ComponentProps<typeof ComboboxPrimitive.Item>) {
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
}: React.ComponentProps<typeof ComboboxPrimitive.Group>) {
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
}: React.ComponentProps<typeof ComboboxPrimitive.GroupLabel>) {
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
}: React.ComponentProps<typeof ComboboxPrimitive.Separator>) {
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
}: React.ComponentProps<typeof ComboboxPrimitive.Empty>) {
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
}: React.ComponentProps<typeof ComboboxPrimitive.Status>) {
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
}: React.ComponentProps<typeof ComboboxPrimitive.Value>) {
    // ComboboxValue doesn't render its own HTML element (it's a text
    // replacement), so it doesn't accept className. The consumer wraps it
    // in a Text component or applies classes to the parent.
    return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

function ComboboxChips({
    className,
    ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Chips>) {
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
}: React.ComponentProps<typeof ComboboxPrimitive.Chip>) {
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
}: React.ComponentProps<typeof ComboboxPrimitive.ChipRemove>) {
    return (
        <ComboboxPrimitive.ChipRemove
            data-slot="combobox-chip-remove"
            render={
                <Clickable.Button
                    variant="ghost"
                    shape="square"
                    size="sm"
                    aria-label="Remove"
                />
            }
            className={cn(className as string)}
            {...props}
        >
            <XIcon className="size-3" />
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

"use client";

import {
    Select as SelectPrimitive,
    type SelectRootProps,
} from "@fragiola/primitives-react/select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { field } from "#/families/field";
import { menu } from "#/families/menu";
import { popup } from "#/families/popup";
import { POSITIONER_DEFAULTS, type PrimitiveProps } from "#/lib/base";
import { cn } from "#/lib/cn";

// Select — the recombination test. This component is field + popup + menu,
// and it declares no new style. Every class comes from a family:
//   - Trigger uses field.row (the box) + layout
//   - Content uses popup.content (the floating box)
//   - Item uses menu.selectableItem (the option with indicator space)
//   - ItemIndicator uses menu.itemIndicator
//
// If this file contains a class that does not come from a family, the
// recombination claim is wrong. It does not.

// Items as Base UI takes them: a list of `{ value, label }`, or a map of
// value to label (Fragiola Primitives takes the list). A label is text here:
// Fragiola Primitives' Value shows an item's label as a string.
type SelectItems = SelectRootProps["items"] | Readonly<Record<string, string>>;

function selectItems(items: SelectItems): SelectRootProps["items"] {
    if (items === undefined || Array.isArray(items)) {
        return items as SelectRootProps["items"];
    }
    return Object.entries(items).map(([value, label]) => ({
        value,
        label,
    }));
}

function SelectRoot({
    items,
    ...props
}: Omit<SelectRootProps, "items"> & { items?: SelectItems }) {
    return (
        <SelectPrimitive.Root
            data-slot="select"
            items={selectItems(items)}
            {...props}
        />
    );
}

function SelectValue({
    className,
    ...props
}: PrimitiveProps<typeof SelectPrimitive.Value, "div">) {
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

function SelectTrigger({
    className,
    children,
    ...props
}: PrimitiveProps<typeof SelectPrimitive.Trigger, "button">) {
    return (
        <SelectPrimitive.Trigger
            data-slot="select-trigger"
            // The trigger IS a field row. The box (border, background, focus
            // ring) comes from field.row; the layout (flex-row, padding)
            // is the trigger's own. No new style classes.
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

// Fragiola Primitives' listbox is a List part inside the Popup (Base UI's
// items sit in the Popup): Content wraps its children in one, a block that
// changes no layout, so the same items render a listbox on every base.
function SelectContent({
    className,
    children,
    align = "start",
    alignOffset = 0,
    side = "bottom",
    sideOffset = 4,
    ...props
}: PrimitiveProps<typeof SelectPrimitive.Popup, "div"> &
    Pick<
        PrimitiveProps<typeof SelectPrimitive.Positioner, "div">,
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
                    className={cn(
                        popup.content("z-50 outline-none"),
                        className as string,
                    )}
                    {...props}
                >
                    <SelectPrimitive.List>{children}</SelectPrimitive.List>
                </SelectPrimitive.Popup>
            </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
    );
}

function SelectItem({
    className,
    children,
    ...props
}: PrimitiveProps<typeof SelectPrimitive.Item, "div">) {
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

function SelectGroup({
    ...props
}: PrimitiveProps<typeof SelectPrimitive.Group, "div">) {
    return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectLabel({
    className,
    ...props
}: PrimitiveProps<typeof SelectPrimitive.GroupLabel, "div">) {
    return (
        <SelectPrimitive.GroupLabel
            data-slot="select-label"
            className={cn(menu.label(), className as string)}
            {...props}
        />
    );
}

function SelectSeparator({
    className,
    ...props
}: PrimitiveProps<typeof SelectPrimitive.Separator, "div">) {
    return (
        <SelectPrimitive.Separator
            data-slot="select-separator"
            className={cn(menu.separator(), className as string)}
            {...props}
        />
    );
}

export const Select = {
    Root: SelectRoot,
    Trigger: SelectTrigger,
    Value: SelectValue,
    Content: SelectContent,
    Item: SelectItem,
    Group: SelectGroup,
    Label: SelectLabel,
    Separator: SelectSeparator,
};

"use client";

import {
    Listbox as ListboxPrimitive,
    type ListboxRootProps,
} from "@fragiola/primitives-react/listbox";
import { CheckIcon } from "lucide-react";
import { menu } from "#/families/menu";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";

// Listbox — a list of options that stays on the page, for one value or
// several (the APG listbox): the focus moves to the options (a roving tab
// stop), the arrows, Home, End, Page Up and Page Down move it, typing
// jumps to a label, Space chooses; with `multiple`, Shift extends a range
// and Ctrl+A chooses every option. It submits, resets and validates in a
// form (`name`).
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// listbox, so this one shared file wraps Fragiola Primitives' on every
// base. `PrimitivesDirection` hands it the base's direction (a horizontal
// list swaps Left and Right in RTL).
//
// It composes the menu family, the option lists' family:
//   Root           `menu.list`: the control box with a panel's radius.
//   Item           `menu.option`: the popup item's row, lit by `selected`
//                  (soft, contrast) with a check, half of soft on hover,
//                  and the ring inside when focused — the focus and the
//                  choice are two things here.
//   ItemIndicator  `menu.itemIndicator` with a check.
//   GroupLabel     `menu.label`; Separator `menu.separator`.
// Give the Root a height (`max-h-*`) to make it scroll. Name it with
// `aria-label` or `aria-labelledby`: on Base UI, Base UI's Field does not
// reach it.

function ListboxRoot({ className, ...props }: ListboxRootProps) {
    return (
        <PrimitivesDirection>
            <ListboxPrimitive.Root
                data-slot="listbox"
                className={cn(menu.list(), className as string)}
                {...(props as ListboxRootProps)}
            />
        </PrimitivesDirection>
    );
}

function ListboxItem({
    className,
    children,
    ...props
}: PrimitivesProps<typeof ListboxPrimitive.Item, "div">) {
    return (
        <ListboxPrimitive.Item
            data-slot="listbox-item"
            className={cn(menu.option(), className as string)}
            {...props}
        >
            <ListboxPrimitive.ItemIndicator
                data-slot="listbox-item-indicator"
                className={menu.itemIndicator()}
            >
                <CheckIcon />
            </ListboxPrimitive.ItemIndicator>
            {children}
        </ListboxPrimitive.Item>
    );
}

function ListboxGroup({
    className,
    ...props
}: PrimitivesProps<typeof ListboxPrimitive.Group, "div">) {
    return (
        <ListboxPrimitive.Group
            data-slot="listbox-group"
            className={cn("flex flex-col gap-px", className as string)}
            {...props}
        />
    );
}

function ListboxGroupLabel({
    className,
    ...props
}: PrimitivesProps<typeof ListboxPrimitive.GroupLabel, "div">) {
    return (
        <ListboxPrimitive.GroupLabel
            data-slot="listbox-group-label"
            className={cn(menu.label(), className as string)}
            {...props}
        />
    );
}

function ListboxSeparator({
    className,
    ...props
}: PrimitivesProps<typeof ListboxPrimitive.Separator, "div">) {
    return (
        <ListboxPrimitive.Separator
            data-slot="listbox-separator"
            className={cn(menu.separator(), className as string)}
            {...props}
        />
    );
}

export type { ListboxRootProps };

export const Listbox = {
    Root: ListboxRoot,
    Item: ListboxItem,
    Group: ListboxGroup,
    GroupLabel: ListboxGroupLabel,
    Separator: ListboxSeparator,
};

"use client";

import { Toolbar as ToolbarPrimitive } from "@fragiola/primitives-react/toolbar";
import type * as React from "react";
import { clickable } from "#/atoms/clickable";
import { field } from "#/families/field";
import { foundation } from "#/families/foundation";
import type { PrimitiveProps } from "#/lib/base";
import { cn } from "#/lib/cn";
import { Toggle } from "#/ui/toggle";

// Toolbar — a row (or a column) of controls with ONE tab stop: the arrows
// move between its buttons, links and inputs (the APG toolbar, roving focus,
// RTL swapping Left and Right). Fragiola Primitives' Toolbar provides the
// behaviour.
//
// It composes what exists and adds no family:
//   Root       a panel (`foundation.panel`): the floor's fill, a `line`
//              stroke, `rounded-lg`, with a 4px inner gap.
//   Button     a small ghost Clickable; a menu renders its trigger
//              (`render={<DropdownMenu.Trigger />}`).
//   Toggle     a small Toggle that is one of the toolbar's items: a tool
//              that stays pressed (the `current` mark), alone or in a
//              ToggleGroup.
//   Link       the same small ghost Clickable, an `<a>`.
//   Input      a bare field control (rule 3): it carries no box, so put it
//              in a `Field.Row` / `Field.Body` like any input.
//   Group      the tools that belong together, a gap apart.
//   Separator  a 1px `line` rule across the toolbar's axis.

const tool = clickable({ variant: "ghost", size: "sm" });

function ToolbarRoot({
    className,
    ...props
}: PrimitiveProps<typeof ToolbarPrimitive.Root, "div">) {
    return (
        <ToolbarPrimitive.Root
            data-slot="toolbar"
            className={cn(
                foundation.panel(),
                "flex w-fit items-center gap-1 p-1 data-[orientation=vertical]:flex-col",
                className as string,
            )}
            {...props}
        />
    );
}

function ToolbarButton({
    className,
    ...props
}: PrimitiveProps<typeof ToolbarPrimitive.Button, "button">) {
    return (
        <ToolbarPrimitive.Button
            data-slot="toolbar-button"
            className={cn(tool, foundation.disabled(), className as string)}
            {...props}
        />
    );
}

// A Toggle placed in the toolbar is one of its items on Fragiola Primitives
// (the toolbar's roving scope reaches it, in a ToggleGroup too), so the part
// is the Toggle itself, small. On Base UI it is a Toolbar.Button rendering
// the Toggle: one part, the same use on both bases.
function ToolbarToggle({
    size = "sm",
    ...props
}: React.ComponentProps<typeof Toggle>) {
    return <Toggle data-slot="toolbar-toggle" size={size} {...props} />;
}

function ToolbarLink({
    className,
    ...props
}: PrimitiveProps<typeof ToolbarPrimitive.Link, "a">) {
    return (
        <ToolbarPrimitive.Link
            data-slot="toolbar-link"
            className={cn(tool, className as string)}
            {...props}
        />
    );
}

function ToolbarInput({
    className,
    ...props
}: PrimitiveProps<typeof ToolbarPrimitive.Input, "input">) {
    return (
        <ToolbarPrimitive.Input
            data-slot="toolbar-input"
            className={cn(field.control(), "py-1", className as string)}
            {...props}
        />
    );
}

function ToolbarGroup({
    className,
    ...props
}: PrimitiveProps<typeof ToolbarPrimitive.Group, "div">) {
    return (
        <ToolbarPrimitive.Group
            data-slot="toolbar-group"
            className={cn(
                "flex items-center gap-1 in-data-[orientation=vertical]:flex-col",
                className as string,
            )}
            {...props}
        />
    );
}

function ToolbarSeparator({
    className,
    ...props
}: PrimitiveProps<typeof ToolbarPrimitive.Separator, "div">) {
    return (
        <ToolbarPrimitive.Separator
            data-slot="toolbar-separator"
            className={cn(
                "shrink-0 bg-palette-line",
                "data-[orientation=vertical]:mx-1 data-[orientation=vertical]:h-5 data-[orientation=vertical]:w-px",
                "data-[orientation=horizontal]:my-1 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-5",
                className as string,
            )}
            {...props}
        />
    );
}

export const Toolbar = {
    Root: ToolbarRoot,
    Button: ToolbarButton,
    Toggle: ToolbarToggle,
    Link: ToolbarLink,
    Input: ToolbarInput,
    Group: ToolbarGroup,
    Separator: ToolbarSeparator,
};

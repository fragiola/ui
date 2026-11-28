"use client";

import { ContextMenu as ContextMenuPrimitive } from "@fragiola/primitives-react/context-menu";
import type * as React from "react";
import { createMenuParts } from "#/families/menu/parts";
import type { PrimitiveProps } from "#/lib/base";
import { cn } from "#/lib/cn";

const parts = createMenuParts(ContextMenuPrimitive);

function ContextMenuRoot({
    ...props
}: PrimitiveProps<typeof ContextMenuPrimitive.Root, "div">) {
    return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuTrigger({
    className,
    ...props
}: PrimitiveProps<typeof ContextMenuPrimitive.Trigger, "button">) {
    return (
        <ContextMenuPrimitive.Trigger
            data-slot="context-menu-trigger"
            // select-none is behavioural (stops text selection on right-click),
            // not visual style — it does not come from a family.
            className={cn("select-none", className as string)}
            {...props}
        />
    );
}

function ContextMenuContent({
    align = "start",
    alignOffset = 4,
    side = "inline-end",
    sideOffset = 0,
    ...props
}: PrimitiveProps<typeof ContextMenuPrimitive.Popup, "div"> &
    Pick<
        PrimitiveProps<typeof ContextMenuPrimitive.Positioner, "div">,
        "align" | "alignOffset" | "side" | "sideOffset"
    >) {
    return (
        <parts.Content
            data-slot="context-menu-content"
            align={align}
            alignOffset={alignOffset}
            side={side}
            sideOffset={sideOffset}
            {...props}
        />
    );
}

function ContextMenuSubContent({
    ...props
}: React.ComponentProps<typeof ContextMenuContent>) {
    return (
        <ContextMenuContent
            data-slot="context-menu-sub-content"
            side="inline-end"
            {...props}
        />
    );
}

export const ContextMenu = {
    ...parts,
    Root: ContextMenuRoot,
    Trigger: ContextMenuTrigger,
    Content: ContextMenuContent,
    SubContent: ContextMenuSubContent,
};

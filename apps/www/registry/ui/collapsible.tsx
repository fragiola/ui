"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import type * as React from "react";
import { disclosure } from "#/families/disclosure";
import { cn } from "#/lib/cn";

// Collapsible — a single expand/collapse section. Composes the `disclosure`
// family (trigger, panel, content). The only things this component declares
// for itself are Root — the coordination point for a single section.
//
// An accordion is a group of collapsibles with coordination; a collapsible
// is one section on its own. Both share the same trigger, panel and content
// from the `disclosure` family — the zero-variant rule is preserved because
// the only difference is coordination (behaviour, not style).
//
// The trigger is a `group` — put a chevron inside with
// `transition-transform group-data-[panel-open]:rotate-180` and it rotates
// when the panel opens. See the demo.

function CollapsibleRoot({
    className,
    ...props
}: CollapsiblePrimitive.Root.Props) {
    return (
        <CollapsiblePrimitive.Root
            data-slot="collapsible"
            className={cn(
                "border border-palette-line rounded-md",
                className as string,
            )}
            {...props}
        />
    );
}

function CollapsibleTrigger({
    className,
    ...props
}: CollapsiblePrimitive.Trigger.Props) {
    return (
        <CollapsiblePrimitive.Trigger
            data-slot="collapsible-trigger"
            className={cn(disclosure.trigger(), className as string)}
            {...props}
        />
    );
}

function CollapsiblePanel({
    className,
    ...props
}: CollapsiblePrimitive.Panel.Props) {
    return (
        <CollapsiblePrimitive.Panel
            data-slot="collapsible-panel"
            className={cn(disclosure.panel(), className as string)}
            {...props}
        />
    );
}

function CollapsibleContent({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="collapsible-content"
            className={cn(disclosure.content(), className as string)}
            {...props}
        />
    );
}

export const Collapsible = {
    Root: CollapsibleRoot,
    Trigger: CollapsibleTrigger,
    Panel: CollapsiblePanel,
    Content: CollapsibleContent,
};

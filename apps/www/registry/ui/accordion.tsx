"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import type * as React from "react";
import { disclosure } from "#/families/disclosure";
import { cn } from "#/lib/cn";

// Accordion — a group of expand/collapse items with coordination. Composes
// the `disclosure` family (trigger, panel, content). The only things this
// component declares for itself are Root, Item and Header — the coordination
// points.
//
// `openMultiple` (behaviour, not style) controls whether one or many items
// can be open at a time. The default is true (multiple open); set it to
// false for a single-open accordion.
//
// The trigger is a `group` — put a chevron inside with
// `transition-transform group-data-[panel-open]:rotate-180` and it rotates
// when the panel opens. See the demo.

function AccordionRoot({ className, ...props }: AccordionPrimitive.Root.Props) {
    return (
        <AccordionPrimitive.Root
            data-slot="accordion"
            className={cn("flex flex-col gap-1", className as string)}
            {...props}
        />
    );
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
    return (
        <AccordionPrimitive.Item
            data-slot="accordion-item"
            className={cn(
                "border border-palette-line rounded-md",
                className as string,
            )}
            {...props}
        />
    );
}

function AccordionHeader({
    className,
    ...props
}: AccordionPrimitive.Header.Props) {
    return (
        <AccordionPrimitive.Header
            data-slot="accordion-header"
            className={cn("flex", className as string)}
            {...props}
        />
    );
}

function AccordionTrigger({
    className,
    ...props
}: AccordionPrimitive.Trigger.Props) {
    return (
        <AccordionPrimitive.Trigger
            data-slot="accordion-trigger"
            className={cn(disclosure.trigger(), className as string)}
            {...props}
        />
    );
}

function AccordionPanel({
    className,
    ...props
}: AccordionPrimitive.Panel.Props) {
    return (
        <AccordionPrimitive.Panel
            data-slot="accordion-panel"
            className={cn(disclosure.panel(), className as string)}
            {...props}
        />
    );
}

function AccordionContent({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="accordion-content"
            className={cn(disclosure.content(), className as string)}
            {...props}
        />
    );
}

export const Accordion = {
    Root: AccordionRoot,
    Item: AccordionItem,
    Header: AccordionHeader,
    Trigger: AccordionTrigger,
    Panel: AccordionPanel,
    Content: AccordionContent,
};

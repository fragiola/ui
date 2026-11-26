"use client";

import { Accordion as AccordionPrimitive } from "@fragiola/primitives-react/accordion";
import * as React from "react";
import { disclosure } from "#/families/disclosure";
import { foundation } from "#/families/foundation";
import type { PrimitiveProps } from "#/lib/base";
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

function AccordionRoot({
    className,
    ...props
}: PrimitiveProps<typeof AccordionPrimitive.Root, "div">) {
    return (
        <AccordionPrimitive.Root
            data-slot="accordion"
            className={cn(
                foundation.panel(),
                "flex flex-col divide-y divide-palette-line overflow-hidden",
                className as string,
            )}
            {...props}
        />
    );
}

// An item's value is optional, as on Base UI: without one the item gets an
// id of its own (Fragiola Primitives requires it).
function AccordionItem({
    className,
    value,
    ...props
}: Omit<PrimitiveProps<typeof AccordionPrimitive.Item, "div">, "value"> & {
    value?: PrimitiveProps<typeof AccordionPrimitive.Item, "div">["value"];
}) {
    const id = React.useId();
    return (
        <AccordionPrimitive.Item
            data-slot="accordion-item"
            value={value ?? id}
            className={cn(className as string)}
            {...props}
        />
    );
}

function AccordionHeader({
    className,
    ...props
}: PrimitiveProps<typeof AccordionPrimitive.Header, "div">) {
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
}: PrimitiveProps<typeof AccordionPrimitive.Trigger, "button">) {
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
}: PrimitiveProps<typeof AccordionPrimitive.Panel, "div">) {
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

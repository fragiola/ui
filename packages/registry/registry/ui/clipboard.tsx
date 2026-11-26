"use client";

import { Clipboard as ClipboardPrimitive } from "@fragiola/primitives-react/clipboard";
import { CheckIcon, CopyIcon } from "lucide-react";
import type * as React from "react";
import { clickable } from "#/atoms/clickable";
import { field } from "#/families/field";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";

// Clipboard — a button that copies a text and shows, for a while
// (`timeout`), that it did (spec/clipboard.md): the Trigger copies the
// Root's `value` with the browser's Clipboard API, every part carries
// `data-copied` (or `data-failed`), the Indicator turns its icon into a
// check, and the Root writes the app's `announcement` ("Copied") into a
// polite live region, so a screen reader hears it without the focus moving.
// A failed copy focuses the Input with its text selected, to copy by hand.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// clipboard, so this one shared file wraps Fragiola Primitives' on every
// base.
//
// No family of its own: it composes the field and the Clickable.
//   Root       a row
//   Control    the field's box (`field.row`) around the Input and the
//              Trigger, for a value shown beside its copy button
//   Input      the read-only value, the bare control (`field.control`); name
//              it (`aria-label`, or a label's `htmlFor`)
//   Trigger    a ghost square Clickable (for one with text, pass
//              `className="aspect-auto px-3"`); while copied it is `ring`, the "on" colour;
//              name it (`aria-label="Copy install command"`)
//   Indicator  the icon that follows the status: a copy icon, a check while
//              copied (or your children, a function of the state)
//   Template.Simple  the value in a Control with an icon Trigger, announcing
//              "Copied to clipboard" (`announcement`).

type P = typeof ClipboardPrimitive;

function ClipboardRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <ClipboardPrimitive.Root
                data-slot="clipboard"
                className={cn(
                    "flex min-w-0 items-center gap-2",
                    className as string,
                )}
                {...props}
            />
        </PrimitivesDirection>
    );
}

function ClipboardControl({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="clipboard-control"
            className={cn(
                field.row(),
                "min-h-control items-center pe-0.5",
                className as string,
            )}
            {...props}
        />
    );
}

function ClipboardInput({
    className,
    ...props
}: PrimitivesProps<P["Input"], "input">) {
    return (
        <ClipboardPrimitive.Input
            data-slot="clipboard-input"
            className={cn(
                field.control(),
                "flex-1 truncate font-mono text-xs",
                className as string,
            )}
            {...props}
        />
    );
}

function ClipboardTrigger({
    className,
    children,
    ...props
}: PrimitivesProps<P["Trigger"], "button">) {
    return (
        <ClipboardPrimitive.Trigger
            data-slot="clipboard-trigger"
            className={cn(
                clickable({ variant: "ghost", shape: "square", size: "sm" }),
                "shrink-0 data-copied:text-palette-ring",
                className as string,
            )}
            {...props}
        >
            {children ?? <ClipboardIndicator />}
        </ClipboardPrimitive.Trigger>
    );
}

type IndicatorState = { copied: boolean };

function ClipboardIndicator({
    className,
    children,
    ...props
}: PrimitivesProps<P["Indicator"], "span">) {
    return (
        <ClipboardPrimitive.Indicator
            data-slot="clipboard-indicator"
            className={cn(
                "inline-flex items-center gap-2",
                className as string,
            )}
            {...props}
        >
            {children ??
                ((state: IndicatorState) =>
                    state.copied ? <CheckIcon /> : <CopyIcon />)}
        </ClipboardPrimitive.Indicator>
    );
}

/**
 * The common clipboard: the read-only value in the field's box with an icon
 * Trigger at its inline end ("Copy", a check while copied), announcing
 * "Copied to clipboard". Every Root prop is forwarded; `className` goes to
 * the row. `id` and `aria-label` go to the value's input, so a label's
 * `htmlFor` or the `aria-label` names it (the Trigger is "Copy").
 */
function ClipboardTemplateSimple({
    id,
    "aria-label": ariaLabel,
    announcement = "Copied to clipboard",
    ...props
}: Omit<PrimitivesProps<P["Root"], "div">, "children">) {
    return (
        <ClipboardRoot announcement={announcement} {...props}>
            <ClipboardControl>
                <ClipboardInput id={id} aria-label={ariaLabel} />
                <ClipboardTrigger aria-label="Copy" />
            </ClipboardControl>
        </ClipboardRoot>
    );
}

export const Clipboard = {
    Root: ClipboardRoot,
    Control: ClipboardControl,
    Input: ClipboardInput,
    Trigger: ClipboardTrigger,
    Indicator: ClipboardIndicator,
    Template: { Simple: ClipboardTemplateSimple },
};

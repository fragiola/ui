"use client";

import { AlertDialog as AlertDialogPrimitive } from "@fragiola/primitives-react/alert-dialog";
import type { DialogTriggerProps } from "@fragiola/primitives-react/dialog";
import type * as React from "react";
import { createLayerParts } from "#/families/layer/parts";
import type { PrimitiveProps } from "#/lib/base";
import { cn } from "#/lib/cn";

// AlertDialog — the proof that `layer` is a family. This file declares ONLY
// what genuinely differs from dialog:
//   - the primitive namespace (AlertDialog, not Dialog)
//   - the absence of a close button (showClose={false}) — an alert dialog is
//     dismissed only by an explicit action, not by a corner X
//   - the action/cancel pair (which is just Clickable.Button composed in the
//     footer, not a new part)
//
// Everything else comes from `layer` through createLayerParts. AlertDialog
// reuses Dialog's Backdrop, Popup, Title, Description, Close and Portal at
// runtime (7/9 parts identical); the factory injects the namespace so each
// component inherits its own divergence if the library ever splits them.
//
// A destructive confirmation is `className="palette-danger"` on the action
// button — no `variant="destructive"`, no `tone` prop.
//
// Installing alert-dialog after dialog writes EXACTLY ONE FILE: this one.
// The `layer` family and the parts factory are already on disk.

const parts = createLayerParts(AlertDialogPrimitive);

function AlertDialogRoot({
    ...props
}: PrimitiveProps<typeof AlertDialogPrimitive.Root, "div">) {
    return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

// The Trigger's own props type is an `Omit` of Dialog's over a type that
// forwards any prop, which leaves only the forwarding: the props are
// Dialog.Trigger's (the same part, with a AlertDialog handle).
type TriggerProps = Omit<
    PrimitiveProps<React.ComponentType<DialogTriggerProps>, "button">,
    "handle"
> &
    Pick<React.ComponentProps<typeof AlertDialogPrimitive.Trigger>, "handle">;

function AlertDialogTrigger({ ...props }: TriggerProps) {
    return (
        <AlertDialogPrimitive.Trigger
            data-slot="alert-dialog-trigger"
            {...props}
        />
    );
}

// Fragiola Primitives' Portal renders no element of its own (Base UI's is a
// div): the div here carries the portal's slot and its props, so
// everything keyed on `alert-dialog-portal` (the embeds' overlay promotion, readers'
// selectors) finds it on every base.
function AlertDialogPortal({
    children,
    container,
    keepMounted,
    ...props
}: PrimitiveProps<typeof AlertDialogPrimitive.Portal, "div">) {
    return (
        <AlertDialogPrimitive.Portal
            container={container}
            keepMounted={keepMounted}
        >
            <div data-slot="alert-dialog-portal" {...props}>
                {children}
            </div>
        </AlertDialogPrimitive.Portal>
    );
}

function AlertDialogBackdrop({
    className,
    ...props
}: React.ComponentProps<typeof parts.Backdrop>) {
    return <parts.Backdrop className={className} {...props} />;
}

function AlertDialogContent({
    className,
    ...props
}: React.ComponentProps<typeof parts.Content>) {
    return (
        // `z-50` lifts the wrapper above the backdrop's z-40: `position: fixed`
        // establishes a stacking context, so without this the panel's own z-50
        // is confined inside the wrapper and the backdrop paints over it.
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4">
            <parts.Content
                data-slot="alert-dialog-content"
                // No close button — an alert dialog is dismissed by an
                // explicit action, not a corner X. A boolean that toggles a
                // part is not a style variant.
                showClose={false}
                className={cn("w-full max-w-lg", className as string)}
                {...props}
            />
        </div>
    );
}

export const AlertDialog = {
    Root: AlertDialogRoot,
    Trigger: AlertDialogTrigger,
    Portal: AlertDialogPortal,
    Backdrop: AlertDialogBackdrop,
    Content: AlertDialogContent,
    Header: parts.Header,
    Body: parts.Body,
    Footer: parts.Footer,
    Title: parts.Title,
    Description: parts.Description,
    Close: parts.Close,
};

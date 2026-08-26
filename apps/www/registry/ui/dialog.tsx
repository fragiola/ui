"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { createLayerParts } from "#/families/layer/parts";
import { cn } from "#/lib/cn";

// Dialog — a modal layer. Consumes the `layer` family (backdrop + panel +
// header + body + footer + title + description) through createLayerParts.
// The only things this component declares for itself are Root, Trigger,
// Portal, and the centring transform on Content.
//
// Centring uses transforms on the panel, not flexbox on the backdrop — the
// backdrop must stay a pure scrim so a nested overlay does not inherit a
// layout. The panel is fixed, inset-0, grid place-items-center, and the
// panel itself carries the surface; the grid wrapper is a positioning
// concern, not a style variant.
//
// Title renders Text.Heading as="h2" through render; Description renders
// Text.Paragraph. Both keep the primitive's a11y wiring (aria-labelledby /
// aria-describedby). The close affordance is Clickable.Button variant="icon"
// shape="square" size="sm", positioned with logical properties (top-4 end-4),
// carrying an sr-only label.

const parts = createLayerParts(DialogPrimitive);

function DialogRoot({ ...props }: DialogPrimitive.Root.Props) {
    return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ children, ...props }: DialogPrimitive.Portal.Props) {
    return (
        <DialogPrimitive.Portal data-slot="dialog-portal" {...props}>
            {children}
        </DialogPrimitive.Portal>
    );
}

function DialogBackdrop({
    className,
    ...props
}: React.ComponentProps<typeof parts.Backdrop>) {
    return <parts.Backdrop className={className} {...props} />;
}

function DialogContent({
    className,
    ...props
}: React.ComponentProps<typeof parts.Content>) {
    return (
        // The grid wrapper is the centring concern: fixed, inset-0, grid
        // place-items-center. It is NOT a style variant of the panel — it is
        // positioning that lives in the component. The panel (layer.panel)
        // is the surface.
        <div className="fixed inset-0 grid place-items-center overflow-y-auto p-4">
            <parts.Content
                data-slot="dialog-content"
                className={cn("w-full max-w-lg", className as string)}
                {...props}
            />
        </div>
    );
}

export const Dialog = {
    Root: DialogRoot,
    Trigger: DialogTrigger,
    Portal: DialogPortal,
    Backdrop: DialogBackdrop,
    Content: DialogContent,
    Header: parts.Header,
    Body: parts.Body,
    Footer: parts.Footer,
    Title: parts.Title,
    Description: parts.Description,
    Close: parts.Close,
};

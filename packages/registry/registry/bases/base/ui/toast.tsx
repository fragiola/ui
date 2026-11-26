"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { XIcon } from "lucide-react";
import type * as React from "react";
import { Clickable } from "#/atoms/clickable";
import { toast as family } from "#/families/toast";
import { cn } from "#/lib/cn";

// Toast — brief notifications in a stack at the page's corner: announced to
// assistive technology, closed by their timer, a swipe, Escape or Close, and
// reached with F6. The queue lives outside React (`Toast.createToastManager`,
// or the Provider's own, `Toast.useToastManager`); the Viewport renders one
// Root per toast.
//
// The look is the `toast` family: a neutral overlay card whose status is the
// palette class on its Icon (`palette-green`, `palette-danger`, …), a title
// in the label type and a description in secondary text, its actions under
// them and a Close in the corner. `Toast.Template.Simple` is the whole
// stack: it renders every toast of the Provider's queue, with the icon, the
// palette and one action taken from the toast's `data` (`ToastData`).
//
// Not promoted over fragiola.com's page: a toast is no modal layer (the page
// stays usable under it), so in an example it shows in the frame's corner,
// like the other non-modal popups (AGENTS.md, "A modal example covers the
// site's page").

/** What `Toast.Template.Simple` reads from a toast's `data`. */
export type ToastData = {
    /** The status mark, an icon. */
    icon?: React.ReactNode;
    /** The icon's palette class (`palette-green`, `palette-danger`, …). */
    palette?: string;
    /** One action under the text; pressing it also closes the toast. */
    action?: { label: string; onClick?: () => void };
};

// Base UI's Content marks a toast behind the frontmost one (`data-behind`)
// itself; the Fragiola Primitives file computes it from the toast's index.

type ToastObject<Data extends object> = ToastPrimitive.Root.ToastObject<Data>;

function ToastProvider(
    props: React.ComponentProps<typeof ToastPrimitive.Provider>,
) {
    return <ToastPrimitive.Provider {...props} />;
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
    return (
        <ToastPrimitive.Portal>
            <ToastPrimitive.Viewport
                data-slot="toast-viewport"
                className={cn(family.viewport(), className as string)}
                {...props}
            />
        </ToastPrimitive.Portal>
    );
}

function ToastRoot({ className, ...props }: ToastPrimitive.Root.Props) {
    return (
        <ToastPrimitive.Root
            data-slot="toast"
            className={cn(family.root(), className as string)}
            {...props}
        />
    );
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
    return (
        <ToastPrimitive.Content
            data-slot="toast-content"
            className={cn(family.content(), className as string)}
            {...props}
        />
    );
}

function ToastIcon({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="toast-icon"
            aria-hidden="true"
            className={cn(family.icon(), className)}
            {...props}
        />
    );
}

function ToastBody({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="toast-body"
            className={cn(family.body(), className)}
            {...props}
        />
    );
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
    return (
        <ToastPrimitive.Title
            data-slot="toast-title"
            className={cn(family.title(), className as string)}
            {...props}
        />
    );
}

function ToastDescription({
    className,
    ...props
}: ToastPrimitive.Description.Props) {
    return (
        <ToastPrimitive.Description
            data-slot="toast-description"
            className={cn(family.description(), className as string)}
            {...props}
        />
    );
}

function ToastActions({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="toast-actions"
            className={cn(family.actions(), className)}
            {...props}
        />
    );
}

function ToastAction({ className, ...props }: ToastPrimitive.Action.Props) {
    return (
        <ToastPrimitive.Action
            data-slot="toast-action"
            render={<Clickable.Button variant="outline" size="sm" />}
            className={className as string}
            {...props}
        />
    );
}

function ToastClose({
    className,
    children,
    ...props
}: ToastPrimitive.Close.Props) {
    return (
        <ToastPrimitive.Close
            data-slot="toast-close"
            aria-label="Close"
            render={
                <Clickable.Button variant="icon" shape="square" size="sm" />
            }
            className={cn(family.close(), className as string)}
            {...props}
        >
            {children ?? <XIcon />}
        </ToastPrimitive.Close>
    );
}

function SimpleToast({ toast }: { toast: ToastObject<ToastData> }) {
    const { close } = ToastPrimitive.useToastManager<ToastData>();
    const { icon, palette, action } = toast.data ?? {};
    return (
        <ToastRoot toast={toast}>
            <ToastContent>
                {icon ? (
                    <ToastIcon className={palette}>{icon}</ToastIcon>
                ) : null}
                <ToastBody>
                    {toast.title ? <ToastTitle /> : null}
                    {toast.description ? <ToastDescription /> : null}
                    {action ? (
                        <ToastActions>
                            <ToastAction
                                onClick={() => {
                                    action.onClick?.();
                                    close(toast.id);
                                }}
                            >
                                {action.label}
                            </ToastAction>
                        </ToastActions>
                    ) : null}
                </ToastBody>
                <ToastClose />
            </ToastContent>
        </ToastRoot>
    );
}

/** The whole stack: every toast of the Provider's queue, in the Viewport. */
function ToastTemplateSimple({
    className,
    "aria-label": label = "Notifications",
}: {
    className?: string;
    "aria-label"?: string;
}) {
    const { toasts } = ToastPrimitive.useToastManager<ToastData>();
    return (
        <ToastViewport aria-label={label} className={className}>
            {toasts.map((toast) => (
                <SimpleToast key={toast.id} toast={toast} />
            ))}
        </ToastViewport>
    );
}

export const Toast = {
    Provider: ToastProvider,
    Viewport: ToastViewport,
    Root: ToastRoot,
    Content: ToastContent,
    Icon: ToastIcon,
    Body: ToastBody,
    Title: ToastTitle,
    Description: ToastDescription,
    Actions: ToastActions,
    Action: ToastAction,
    Close: ToastClose,
    useToastManager: ToastPrimitive.useToastManager,
    createToastManager: ToastPrimitive.createToastManager,
    Template: { Simple: ToastTemplateSimple },
};

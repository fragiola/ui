"use client";

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { XIcon } from "lucide-react";
import { Clickable } from "#/atoms/clickable";
import { Text } from "#/atoms/text";
import { layer } from "#/families/layer";
import { cn } from "#/lib/cn";

// Drawer — an edge-anchored layer with real swipe and snap-point support.
// Built on Base UI's Drawer primitive, which is why this component exists and
// why `sheet` does not: an edge-anchored dialog and a drawer are the same
// component, and the behaviour library ships a real Drawer with swipe, snap
// points and a viewport. Two items would be exactly the duplication this
// project removes.
//
// The drawer consumes the `layer` family directly (panel, header, body,
// footer, title, description) but is NOT built from createLayerParts: it has
// its own Viewport, Handle and a transform-based positioning model that the
// dialog does not share. A factory would be padding for one component.
//
// ─── ANCHORING AND RTL ──────────────────────────────────────────────────────
// `swipeDirection` (up/down/left/right — physical) determines the anchored
// edge. The inline edges (left/right) MUST invert under RTL: a drawer that
// opens from the wrong side in Arabic is the classic silent failure. The
// Viewport's justify direction and the Popup's transform both follow
// `data-swipe-direction`, with `rtl:` counterparts for left/right.
//
// ─── THE SWIPE HANDLE ───────────────────────────────────────────────────────
// A small palette-line bar. It is drawer-specific and stays in the component,
// not in `layer`.
//
// ─── SNAP POINTS AND MODALITY ───────────────────────────────────────────────
// Behaviour, exposed as props by the primitive, not as style variants.
//
// ─── RADIUS ─────────────────────────────────────────────────────────────────
// The panel takes its radius on the edges AWAY from the anchored side only.

type Side = "up" | "down" | "left" | "right";

function DrawerRoot({ ...props }: DrawerPrimitive.Root.Props) {
    return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
    return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({ children, ...props }: DrawerPrimitive.Portal.Props) {
    return (
        <DrawerPrimitive.Portal data-slot="drawer-portal" {...props}>
            {children}
        </DrawerPrimitive.Portal>
    );
}

function DrawerBackdrop({
    className,
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Backdrop>) {
    return (
        <DrawerPrimitive.Backdrop
            data-slot="drawer-backdrop"
            className={cn(layer.backdrop(), className as string)}
            {...props}
        />
    );
}

// Viewport — the positioning container. The popup is anchored to an edge via
// flex justify; the inline edges invert under RTL. pointer-events-none on the
// viewport, pointer-events-auto on the popup.
function DrawerViewport({
    className,
    side = "right",
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Viewport> & {
    side?: Side;
}) {
    return (
        <DrawerPrimitive.Viewport
            data-slot="drawer-viewport"
            data-side={side}
            className={cn(
                "fixed inset-0 z-50 flex pointer-events-none",
                // block axis anchoring
                side === "up" && "flex-col justify-start",
                side === "down" && "flex-col justify-end",
                // inline axis anchoring — physical left/right, invert under RTL
                side === "left" &&
                    "flex-row justify-start rtl:flex-row-reverse",
                side === "right" && "flex-row justify-end rtl:flex-row-reverse",
                className as string,
            )}
            {...props}
        />
    );
}

// Popup — the surface. layer.panel brings the raised surface, border, radius,
// shadow. The drawer adds: width/height for the anchored edge, the transform
// against the primitive's swipe-movement CSS variables, and the open/close
// transform on the anchored edge. Radius is on the edges AWAY from the
// anchored side.
function DrawerPopup({
    className,
    side = "right",
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Popup> & {
    side?: Side;
}) {
    return (
        <DrawerPrimitive.Popup
            data-slot="drawer-popup"
            data-side={side}
            className={cn(
                layer.panel(),
                "pointer-events-auto outline-none",
                // The popup's own open/close: layer.panel already fades; the
                // drawer adds a slide on the anchored edge via the primitive's
                // transition markers.
                "data-starting-style:animate-in data-ending-style:animate-out",
                // sizing + radius per anchored edge
                side === "right" &&
                    "h-full w-80 rounded-s-none data-starting-style:slide-in-from-right data-ending-style:slide-out-to-right",
                side === "left" &&
                    "h-full w-80 rounded-e-none data-starting-style:slide-in-from-left data-ending-style:slide-out-to-left",
                side === "up" &&
                    "w-full max-h-[85vh] rounded-b-none data-starting-style:slide-in-from-top data-ending-style:slide-out-to-top",
                side === "down" &&
                    "w-full max-h-[85vh] rounded-t-none data-starting-style:slide-in-from-bottom data-ending-style:slide-out-to-bottom",
                className as string,
            )}
            {...props}
        />
    );
}

// Handle — the swipe affordance. A small palette-line bar, drawer-specific.
function DrawerHandle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="drawer-handle"
            aria-hidden
            className={cn(
                "mx-auto mt-3 mb-2 h-1.5 w-10 shrink-0 rounded-full bg-palette-line",
                className as string,
            )}
            {...props}
        />
    );
}

function DrawerContent({
    className,
    showClose = true,
    children,
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content> & {
    showClose?: boolean;
}) {
    return (
        <DrawerPrimitive.Content
            data-slot="drawer-content"
            className={cn("flex flex-col", className as string)}
            {...props}
        >
            {showClose ? (
                <DrawerPrimitive.Close
                    render={
                        <Clickable.Button
                            variant="icon"
                            shape="square"
                            size="sm"
                            aria-label="Close"
                            className="absolute top-4 end-4"
                        />
                    }
                >
                    <XIcon />
                </DrawerPrimitive.Close>
            ) : null}
            {children}
        </DrawerPrimitive.Content>
    );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="drawer-header"
            className={cn(layer.header(), className as string)}
            {...props}
        />
    );
}

function DrawerBody({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="drawer-body"
            className={cn(layer.body(), className as string)}
            {...props}
        />
    );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="drawer-footer"
            className={cn(layer.footer(), className as string)}
            {...props}
        />
    );
}

function DrawerTitle({
    className,
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
    return (
        <DrawerPrimitive.Title
            data-slot="drawer-title"
            render={<Text.Heading as="h2" />}
            className={cn(layer.title(), className as string)}
            {...props}
        />
    );
}

function DrawerDescription({
    className,
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
    return (
        <DrawerPrimitive.Description
            data-slot="drawer-description"
            render={<Text.Paragraph />}
            className={cn(layer.description(), className as string)}
            {...props}
        />
    );
}

function DrawerClose({
    className,
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
    return (
        <DrawerPrimitive.Close
            data-slot="drawer-close"
            render={<Clickable.Button variant="ghost" size="sm" />}
            className={className as string}
            {...props}
        />
    );
}

export const Drawer = {
    Root: DrawerRoot,
    Trigger: DrawerTrigger,
    Portal: DrawerPortal,
    Backdrop: DrawerBackdrop,
    Viewport: DrawerViewport,
    Popup: DrawerPopup,
    Handle: DrawerHandle,
    Content: DrawerContent,
    Header: DrawerHeader,
    Body: DrawerBody,
    Footer: DrawerFooter,
    Title: DrawerTitle,
    Description: DrawerDescription,
    Close: DrawerClose,
};

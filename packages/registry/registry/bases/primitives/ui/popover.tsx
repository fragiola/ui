"use client";

import { Popover as PopoverPrimitive } from "@fragiola/primitives-react/popover";
import { XIcon } from "lucide-react";
import { Clickable } from "#/atoms/clickable";
import { Text } from "#/atoms/text";
import { popup } from "#/families/popup";
import { POSITIONER_DEFAULTS, type PrimitiveProps } from "#/lib/base";
import { cn } from "#/lib/cn";

// Popover — a floating surface positioned against a trigger. Composes
// `popup.content` (the same floating box dropdown-menu uses) and adds Title,
// Description and Close through `render` — the same composition pattern as
// Dialog, but pointing at `popup.content` instead of `layer.panel`.
//
// Why `popup.content` and not `layer.panel`: a popover is positioned by a
// floating-ui positioner and sized by --available-height; a dialog panel is
// not. The overlap (raised surface, border, radius, shadow) is checked, not
// assumed — and it is small enough that unifying them would couple a
// positioned surface to a centring transform it does not use. They stay
// separate (layer.panel for modal surfaces, popup.content for positioned
// surfaces).
//
// Title renders Text.Heading as="h2" through render; Description renders
// Text.Paragraph. Both keep the primitive's a11y wiring. The close
// affordance is Clickable.Button variant="icon" shape="square" size="sm",
// positioned with logical properties (top-4 end-4).

function PopoverRoot({
    ...props
}: PrimitiveProps<typeof PopoverPrimitive.Root, "div">) {
    return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({
    ...props
}: PrimitiveProps<typeof PopoverPrimitive.Trigger, "button">) {
    return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
    className,
    showClose = true,
    children,
    ...props
}: PrimitiveProps<typeof PopoverPrimitive.Popup, "div"> &
    Pick<
        PrimitiveProps<typeof PopoverPrimitive.Positioner, "div">,
        "align" | "alignOffset" | "side" | "sideOffset"
    > & {
        /** Whether to render the close affordance. */
        showClose?: boolean;
    }) {
    const { align, alignOffset, side, sideOffset, ...popupProps } = props;
    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Positioner
                {...POSITIONER_DEFAULTS}
                className="z-50 outline-none"
                align={align}
                alignOffset={alignOffset}
                side={side}
                sideOffset={sideOffset}
            >
                <PopoverPrimitive.Popup
                    data-slot="popover-content"
                    className={cn(
                        popup.content("z-50 outline-none"),
                        className as string,
                    )}
                    {...popupProps}
                >
                    {showClose ? (
                        <PopoverPrimitive.Close
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
                        </PopoverPrimitive.Close>
                    ) : null}
                    {children}
                </PopoverPrimitive.Popup>
            </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
    );
}

function PopoverTitle({
    className,
    ...props
}: PrimitiveProps<typeof PopoverPrimitive.Title, "h2">) {
    return (
        <PopoverPrimitive.Title
            data-slot="popover-title"
            render={<Text.Heading as="h2" />}
            className={cn("text-palette-contrast", className as string)}
            {...props}
        />
    );
}

function PopoverDescription({
    className,
    ...props
}: PrimitiveProps<typeof PopoverPrimitive.Description, "p">) {
    return (
        <PopoverPrimitive.Description
            data-slot="popover-description"
            render={<Text.Paragraph />}
            className={cn("text-palette-accent/85", className as string)}
            {...props}
        />
    );
}

function PopoverClose({
    className,
    ...props
}: PrimitiveProps<typeof PopoverPrimitive.Close, "button">) {
    return (
        <PopoverPrimitive.Close
            data-slot="popover-close"
            render={<Clickable.Button variant="ghost" size="sm" />}
            className={className as string}
            {...props}
        />
    );
}

export const Popover = {
    Root: PopoverRoot,
    Trigger: PopoverTrigger,
    Content: PopoverContent,
    Title: PopoverTitle,
    Description: PopoverDescription,
    Close: PopoverClose,
};

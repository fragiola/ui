import type * as React from "react";
import { Text } from "#/atoms/text";
import { foundation } from "#/families/foundation";
import { cn } from "#/lib/cn";

// Card — a group of content that stands on the floor: a plan, a setting, a
// summary. No primitive, no family of its own: the box is the visual
// language's raised tier (`foundation.raised`: `palette-raised`, a `line`
// stroke, `rounded-lg`, `shadow-sm`), the tier a tile and the inset sidebar
// stand on. A surface-tier palette class on the Root (`palette-surface-*`)
// replaces `raised` (cn knows the palette group); a chromatic one would put
// the secondary text on a coloured ground, below AA. A colour is a palette,
// never a variant.
//
// The anatomy is Untitled UI's modal and card header (title, supporting
// text, an action at the inline end), in Fragiola's type:
//   Root         the raised box, a column
//   Header       the title and description, with the Action beside them
//   Title        `Text.Heading` (h3: `text-lg`, `font-semibold`, `contrast`)
//   Description  secondary text (`foundation.secondary`)
//   Action       at the header's inline end, over both rows (a button, a menu)
//   Content      the body
//   Footer       a row of actions
//
// Every part pads its own inline sides, so a full-bleed child (an image, a
// table) goes in the Root between them. Spacing comes from the spacing
// scale, so the density axis reaches it.

function CardRoot({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card"
            className={cn(
                foundation.raised(),
                "flex flex-col gap-6 py-6 text-sm",
                className as string,
            )}
            {...props}
        />
    );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-header"
            className={cn(
                "grid auto-rows-min items-start gap-1.5 px-6",
                "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
                className as string,
            )}
            {...props}
        />
    );
}

function CardTitle({
    className,
    as = "h3",
    ...props
}: Omit<React.ComponentProps<typeof Text.Heading>, "hierarchy">) {
    return (
        <Text.Heading
            data-slot="card-title"
            as={as}
            className={cn("leading-snug", className as string)}
            {...props}
        />
    );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
    return (
        <p
            data-slot="card-description"
            className={cn(
                foundation.secondary(),
                "text-sm",
                className as string,
            )}
            {...props}
        />
    );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-action"
            className={cn(
                "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
                className as string,
            )}
            {...props}
        />
    );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-content"
            className={cn("px-6", className as string)}
            {...props}
        />
    );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-footer"
            className={cn("flex items-center gap-2 px-6", className as string)}
            {...props}
        />
    );
}

export const Card = {
    Root: CardRoot,
    Header: CardHeader,
    Title: CardTitle,
    Description: CardDescription,
    Action: CardAction,
    Content: CardContent,
    Footer: CardFooter,
};

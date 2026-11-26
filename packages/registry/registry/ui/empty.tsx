import type * as React from "react";
import { Text } from "#/atoms/text";
import { foundation } from "#/families/foundation";
import { cn } from "#/lib/cn";
import { FeaturedIcon } from "#/ui/featured-icon";

// Empty — what a list, a table or a search shows when it has nothing to show
// yet: an icon, a title, a line that says why and what to do, and actions
// (Untitled UI's empty state, without its background patterns and
// illustrations). No primitive, no family of its own: the Icon is the
// Featured Icon at `size-12`, the Title the heading type, the Description
// secondary text, the Actions a row of Clickables you pass.
//
//   Root         a centred column; it draws no box, so it sits in a Card, a
//                panel or straight on the floor (add `border border-dashed
//                border-palette-line rounded-lg` for an outlined drop area)
//   Header       the icon, the title and the description
//   Icon         a Featured Icon (its colour is the palette class it carries)
//   Title        `Text.Heading` (h3: `text-lg`, `font-semibold`, `contrast`)
//   Description  secondary text, its width kept readable
//   Actions      the buttons under the header
//
// Spacing comes from the spacing scale, so the density axis reaches it.

function EmptyRoot({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="empty"
            className={cn(
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-6",
                "p-6 text-center text-sm text-balance text-palette-contrast",
                className as string,
            )}
            {...props}
        />
    );
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="empty-header"
            className={cn(
                "flex max-w-sm flex-col items-center gap-2",
                className as string,
            )}
            {...props}
        />
    );
}

function EmptyIcon({
    className,
    ...props
}: React.ComponentProps<typeof FeaturedIcon>) {
    return (
        <FeaturedIcon
            data-slot="empty-icon"
            className={cn("mb-2 size-12", className as string)}
            {...props}
        />
    );
}

function EmptyTitle({
    className,
    as = "h3",
    ...props
}: React.ComponentProps<typeof Text.Heading>) {
    return (
        <Text.Heading
            data-slot="empty-title"
            as={as}
            className={cn("leading-snug", className as string)}
            {...props}
        />
    );
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
    return (
        <p
            data-slot="empty-description"
            className={cn(
                foundation.secondary(),
                "text-sm leading-relaxed",
                className as string,
            )}
            {...props}
        />
    );
}

function EmptyActions({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="empty-actions"
            className={cn(
                "flex flex-wrap items-center justify-center gap-2",
                className as string,
            )}
            {...props}
        />
    );
}

export const Empty = {
    Root: EmptyRoot,
    Header: EmptyHeader,
    Icon: EmptyIcon,
    Title: EmptyTitle,
    Description: EmptyDescription,
    Actions: EmptyActions,
};

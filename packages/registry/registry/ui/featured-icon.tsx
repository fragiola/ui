import type * as React from "react";
import { cn } from "#/lib/cn";

// Featured Icon — an icon in a tinted shape, the mark that leads an empty
// state, a confirmation or a feature row (Untitled UI's featured icon, its
// "light" theme). No primitive, no family: a circle filled with the palette's
// `soft` tint and the icon in its `accent`, the soft badge's pair of roles.
// So the colour is only the palette class it carries or inherits
// (`className="palette-danger"`): on the floor it is a neutral grey, under a
// chromatic palette that palette's tint. There is no colour variant and no
// size variant: the size is a class (`size-12`), and the icon is the
// standalone illustration size (`size-icon-lg`) unless it sets its own.
//
// It is decorative by default (`aria-hidden`): the text beside it says what
// it means. Give it an `aria-label` when it stands alone: it is then an
// image (`role="img"`), no longer hidden.

function FeaturedIcon({
    className,
    "aria-hidden": ariaHidden,
    ...props
}: React.ComponentProps<"span">) {
    const labelled =
        props["aria-label"] !== undefined ||
        props["aria-labelledby"] !== undefined;
    return (
        <span
            data-slot="featured-icon"
            role={labelled ? "img" : undefined}
            aria-hidden={ariaHidden ?? (labelled ? undefined : true)}
            className={cn(
                "inline-flex size-10 shrink-0 items-center justify-center rounded-full",
                "bg-palette-soft text-palette-accent",
                "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-icon-lg",
                className as string,
            )}
            {...props}
        />
    );
}

export { FeaturedIcon };

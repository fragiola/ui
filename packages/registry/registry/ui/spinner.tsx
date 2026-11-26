import { LoaderCircleIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "#/lib/cn";

// Spinner — something is loading and its length is unknown: a button that
// is saving, a list that is fetching (Untitled UI's loading indicator, its
// line spinner). No primitive, no family: a circle with a gap that turns.
//
// It follows the motion axis: `animate-spin` turns once per second times
// `--motion-scale` (styles/global.css), so it is slower when expressive,
// faster when fast, and still at `none`, where the open circle alone says
// "loading". `prefers-reduced-motion` forces `--motion-scale: 0`, so a
// reader who asked for less motion sees it still too.
//
// It takes the text colour it sits in (`currentColor`), so in a Clickable it
// is the button's colour, at the icon size beside `text-sm` (`size-icon`, the
// typography axis); a denser context passes its size (`size-icon-xs` in a
// badge). It is `role="status"` named "Loading"; pass another
// `aria-label`, or `aria-hidden` when the text beside it already says so.

function Spinner({
    className,
    "aria-hidden": ariaHidden,
    ...props
}: React.ComponentProps<"svg">) {
    return (
        <LoaderCircleIcon
            data-slot="spinner"
            role={ariaHidden ? undefined : "status"}
            aria-label={ariaHidden ? undefined : "Loading"}
            aria-hidden={ariaHidden}
            className={cn(
                "size-icon shrink-0 animate-spin",
                className as string,
            )}
            {...props}
        />
    );
}

export { Spinner };

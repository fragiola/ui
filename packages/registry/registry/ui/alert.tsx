import type * as React from "react";
import { foundation } from "#/families/foundation";
import { cn } from "#/lib/cn";

// Alert — a message that stays in the page: a warning above a form, a
// notice at the top of a settings panel (Untitled UI's alert: an icon, a
// title, supporting text, actions). No primitive, no family of its own.
//
// Its box is the control box (`foundation.box`): a `line` stroke on a
// transparent ground with its text in `accent`. So the colour is only the
// palette class it carries, as an invalid field's: `palette-danger` on the
// Root makes it a red stroke with red text, never a red block, and the
// description (secondary, `accent/85`) follows. A palette class on the Icon
// alone colours only the mark, the toast's look (families/toast.tsx). There
// is no colour variant: a new colour is a new palette.
//
//   Root         the box, with no live role: a message rendered with the
//                page is read with it. Pass `role="alert"` for one inserted
//                in response to an action (a form that failed to save), so
//                it is announced at once, or `role="status"` for a polite one
//   Icon         the mark at the inline start, sized like the toast's
//   Title        the label type (`font-medium`)
//   Description  secondary text
//   Actions      a row of buttons under the text
//
// The text sits in the column after the Icon whenever there is one; without
// an Icon it starts at the Root's padding.

function AlertRoot({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert"
            className={cn(
                foundation.box(),
                "group/alert grid w-full grid-cols-1 items-start gap-x-3 gap-y-1",
                "rounded-lg px-4 py-3 text-sm",
                "has-data-[slot=alert-icon]:grid-cols-[auto_1fr]",
                className as string,
            )}
            {...props}
        />
    );
}

function AlertIcon({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="alert-icon"
            aria-hidden
            className={cn(
                "flex h-5 shrink-0 items-center text-palette-accent",
                "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-icon",
                className as string,
            )}
            {...props}
        />
    );
}

// The text column: after the Icon when there is one.
const COLUMN = "group-has-data-[slot=alert-icon]/alert:col-start-2";

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-title"
            className={cn(
                COLUMN,
                "min-h-5 font-medium leading-5",
                className as string,
            )}
            {...props}
        />
    );
}

function AlertDescription({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-description"
            className={cn(
                COLUMN,
                foundation.secondary(),
                "text-sm [&_p]:leading-relaxed",
                className as string,
            )}
            {...props}
        />
    );
}

function AlertActions({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-actions"
            className={cn(
                COLUMN,
                "mt-2 flex flex-wrap items-center gap-2",
                className as string,
            )}
            {...props}
        />
    );
}

export const Alert = {
    Root: AlertRoot,
    Icon: AlertIcon,
    Title: AlertTitle,
    Description: AlertDescription,
    Actions: AlertActions,
};

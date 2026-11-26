import type * as React from "react";
import { cn } from "#/lib/cn";

// Button Group — Clickables joined into one row: "Previous / Next", a
// split button, "Day / Week / Month" links (Untitled UI's button group). No
// primitive, no family: it only joins the Clickables you put in it, which
// keep their own look, focus ring and palette.
//
// The join is logical, so it is right in RTL: every child but the first
// loses its start radius and its start border (an outline button's stroke
// is shared with its neighbour's), every child but the last its end radius.
// `rounded-s-*`, `rounded-e-*` and `border-s-*` map to the inline start and
// end, so under `dir="rtl"` the row and its rounded ends mirror. Vertical,
// the block axis stays physical (top and bottom). A focused child rises
// above its neighbours, so its ring is never covered.
//
// Solid buttons have no stroke to share: put a Separator between them.
//
// It is a `role="group"` (name it with `aria-label`). Each button stays its
// own tab stop: a Button Group has no keyboard behaviour. A row of tools
// that is one tab stop with arrow-key navigation is a Toolbar.
//
//   Root       the row (`orientation`: horizontal, or vertical)
//   Separator  a `line` rule between two solid buttons

function ButtonGroupRoot({
    className,
    orientation = "horizontal",
    ...props
}: React.ComponentProps<"div"> & {
    orientation?: "horizontal" | "vertical";
}) {
    return (
        // biome-ignore lint/a11y/useSemanticElements: a fieldset is a form group with a legend; a row of buttons is an ARIA group
        <div
            data-slot="button-group"
            role="group"
            data-orientation={orientation}
            className={cn(
                "group/button-group flex w-fit items-stretch",
                "*:focus-visible:relative *:focus-visible:z-10",
                "data-[orientation=horizontal]:[&>*:not(:first-child)]:rounded-s-none",
                "data-[orientation=horizontal]:[&>*:not(:first-child)]:border-s-0",
                "data-[orientation=horizontal]:[&>*:not(:last-child)]:rounded-e-none",
                "data-[orientation=vertical]:flex-col",
                "data-[orientation=vertical]:[&>*:not(:first-child)]:rounded-t-none",
                "data-[orientation=vertical]:[&>*:not(:first-child)]:border-t-0",
                "data-[orientation=vertical]:[&>*:not(:last-child)]:rounded-b-none",
                className as string,
            )}
            {...props}
        />
    );
}

function ButtonGroupSeparator({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="button-group-separator"
            aria-hidden
            className={cn(
                "shrink-0 self-stretch bg-palette-line",
                "group-data-[orientation=horizontal]/button-group:w-px",
                "group-data-[orientation=vertical]/button-group:h-px",
                className as string,
            )}
            {...props}
        />
    );
}

export const ButtonGroup = {
    Root: ButtonGroupRoot,
    Separator: ButtonGroupSeparator,
};

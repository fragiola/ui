import type * as React from "react";
import { cn } from "#/lib/cn";

// Kbd — a key, or a combination of keys, to press: "⌘ K" beside a search
// box, "Esc" in a hint. No primitive, no family: the visual language's
// keyboard-hint type (`text-xs font-medium`, the badge's), on a key cap
// drawn with roles: a `line` stroke around a `soft` adornment (a recessed
// adornment, as a field's addon or inline code), its text in `accent`. Its
// height is the badge's line, so it sits in a line of text or a field's
// inset without moving it. A field's addon and inset round a Kbd that is
// their direct child to the field's radius.
//
// A menu's or a Command's shortcut is not a Kbd: it is the menu family's
// `shortcut`, secondary text at the row's inline end, because a cap in every
// row would be noise. A Kbd is the standalone hint.
//
//   Kbd       one key (`<kbd>`)
//   KbdGroup  the keys of a combination, side by side (a `<kbd>` holding
//             `<kbd>`s, as HTML nests them)

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
    return (
        <kbd
            data-slot="kbd"
            className={cn(
                "inline-flex h-5 min-w-5 shrink-0 items-center justify-center gap-1",
                "rounded-sm border border-palette-line bg-palette-soft px-1",
                "font-sans text-xs font-medium text-palette-accent select-none",
                "[&_svg:not([class*='size-'])]:size-icon-xs",
                className as string,
            )}
            {...props}
        />
    );
}

function KbdGroup({ className, ...props }: React.ComponentProps<"kbd">) {
    return (
        <kbd
            data-slot="kbd-group"
            className={cn(
                "inline-flex items-center gap-1 font-sans",
                className as string,
            )}
            {...props}
        />
    );
}

export { Kbd, KbdGroup };

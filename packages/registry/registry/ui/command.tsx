"use client";

import { Command as CommandPrimitive } from "@fragiola/primitives-react/command";
import { SearchIcon } from "lucide-react";
import * as React from "react";
import { foundation } from "#/families/foundation";
import { menu } from "#/families/menu";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";

// Command — a command palette: a text field that filters a list of actions,
// always shown, and runs the highlighted one with Enter or a press (the APG
// combobox with its list always displayed). The focus stays in the Input;
// the arrows, Home and End move the highlight; typing highlights the best
// match; Backspace on an empty Input goes back a page (`pages`).
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// command palette, so this one shared file wraps Fragiola Primitives' on
// every base.
//
// It composes what exists:
//   Root        a panel (`foundation.panel`), a column that clips.
//   Input       the search row: a glass, then the input with no body of its
//               own (rule 3), over a `line` rule. The palette's focus is the
//               highlighted item, so the input draws no ring.
//   List        the option list, scrolling under the input.
//   Item        `menu.item` (the popup item: `highlighted` is the
//               primitive's `data-highlighted`); Shortcut `menu.shortcut`,
//               the keyboard hint at the inline end.
//   GroupLabel  `menu.label`; Separator `menu.separator`.
//   Empty, Loading  secondary text, centred: the live regions.
//
// The palette in a dialog is a composition, not a part: a `Dialog.Content`
// holding a `Command.Root` (the Input is the dialog's first tabbable, so it
// takes the focus), opened by the app's own shortcut (Cmd/Ctrl+K). See the
// example.

function CommandRoot({
    className,
    ...props
}: PrimitivesProps<typeof CommandPrimitive.Root, "div">) {
    return (
        <PrimitivesDirection>
            <CommandPrimitive.Root
                data-slot="command"
                className={cn(
                    foundation.panel(),
                    "flex size-full flex-col overflow-hidden",
                    className as string,
                )}
                {...props}
            />
        </PrimitivesDirection>
    );
}

function CommandInput({
    className,
    ...props
}: PrimitivesProps<typeof CommandPrimitive.Input, "input">) {
    return (
        <div
            data-slot="command-input-row"
            className="flex shrink-0 items-center gap-2 border-b border-palette-line px-3"
        >
            <SearchIcon
                aria-hidden="true"
                className={cn(foundation.secondary(), "size-icon shrink-0")}
            />
            <CommandPrimitive.Input
                data-slot="command-input"
                className={cn(
                    "h-11 w-full min-w-0 bg-transparent text-sm text-palette-accent outline-none placeholder:text-palette-accent/85",
                    className as string,
                )}
                {...props}
            />
        </div>
    );
}

function CommandList({
    className,
    ...props
}: PrimitivesProps<typeof CommandPrimitive.List, "div">) {
    return (
        <CommandPrimitive.List
            data-slot="command-list"
            className={cn(
                "flex max-h-80 scroll-py-2 flex-col overflow-x-hidden overflow-y-auto p-2 outline-none",
                className as string,
            )}
            {...props}
        />
    );
}

function CommandGroup({
    className,
    ...props
}: PrimitivesProps<typeof CommandPrimitive.Group, "div">) {
    return (
        <CommandPrimitive.Group
            data-slot="command-group"
            className={cn("flex flex-col", className as string)}
            {...props}
        />
    );
}

function CommandGroupLabel({
    className,
    ...props
}: PrimitivesProps<typeof CommandPrimitive.GroupLabel, "div">) {
    return (
        <CommandPrimitive.GroupLabel
            data-slot="command-group-label"
            className={cn(menu.label(), className as string)}
            {...props}
        />
    );
}

function CommandSeparator({
    className,
    ...props
}: PrimitivesProps<typeof CommandPrimitive.Separator, "div">) {
    return (
        <CommandPrimitive.Separator
            data-slot="command-separator"
            className={cn(menu.separator(), "shrink-0", className as string)}
            {...props}
        />
    );
}

function CommandItem({
    className,
    ...props
}: PrimitivesProps<typeof CommandPrimitive.Item, "div">) {
    return (
        <CommandPrimitive.Item
            data-slot="command-item"
            className={cn(menu.item(), "shrink-0", className as string)}
            {...props}
        />
    );
}

function CommandShortcut({ className, ...props }: React.ComponentProps<"kbd">) {
    return (
        <kbd
            data-slot="command-shortcut"
            className={cn(menu.shortcut(), "font-sans", className)}
            {...props}
        />
    );
}

const STATUS = "py-6 text-center text-sm";

function CommandEmpty({
    className,
    ...props
}: PrimitivesProps<typeof CommandPrimitive.Empty, "div">) {
    return (
        <CommandPrimitive.Empty
            data-slot="command-empty"
            className={cn(foundation.secondary(), STATUS, className as string)}
            {...props}
        />
    );
}

function CommandLoading({
    className,
    ...props
}: PrimitivesProps<typeof CommandPrimitive.Loading, "div">) {
    return (
        <CommandPrimitive.Loading
            data-slot="command-loading"
            className={cn(foundation.secondary(), STATUS, className as string)}
            {...props}
        />
    );
}

/** An action of `Command.Template.Simple`. */
export type CommandAction = {
    /** What the filter scores, and the action's identity. */
    value: string;
    /** What the row shows (default: the value). */
    label?: React.ReactNode;
    icon?: React.ReactNode;
    /** The keyboard hint at the row's end (`⌘K`). */
    shortcut?: string;
    keywords?: readonly string[];
    disabled?: boolean;
    onSelect?: (value: string) => void;
};

/** A group of `Command.Template.Simple`. */
export type CommandActionGroup = {
    label: string;
    actions: readonly CommandAction[];
};

/** The common palette: the input, the groups of actions, the empty state. */
function CommandTemplateSimple({
    groups,
    placeholder = "Type a command or search…",
    empty = "No results found.",
    "aria-label": label = "Command",
    className,
}: {
    groups: readonly CommandActionGroup[];
    placeholder?: string;
    empty?: React.ReactNode;
    /** Names the input (default "Command"). */
    "aria-label"?: string;
    className?: string;
}) {
    return (
        <CommandRoot className={className}>
            <CommandInput placeholder={placeholder} aria-label={label} />
            <CommandList>
                {groups.map((group, i) => (
                    <React.Fragment key={group.label}>
                        {i > 0 ? <CommandSeparator /> : null}
                        <CommandGroup>
                            <CommandGroupLabel>{group.label}</CommandGroupLabel>
                            {group.actions.map((action) => (
                                <CommandItem
                                    key={action.value}
                                    value={action.value}
                                    keywords={action.keywords}
                                    disabled={action.disabled}
                                    onSelect={(value: string) =>
                                        action.onSelect?.(value)
                                    }
                                >
                                    {action.icon}
                                    <span>{action.label ?? action.value}</span>
                                    {action.shortcut ? (
                                        <CommandShortcut>
                                            {action.shortcut}
                                        </CommandShortcut>
                                    ) : null}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </React.Fragment>
                ))}
            </CommandList>
            <CommandEmpty>{empty}</CommandEmpty>
        </CommandRoot>
    );
}

export const Command = {
    Root: CommandRoot,
    Input: CommandInput,
    List: CommandList,
    Group: CommandGroup,
    GroupLabel: CommandGroupLabel,
    Separator: CommandSeparator,
    Item: CommandItem,
    Shortcut: CommandShortcut,
    Empty: CommandEmpty,
    Loading: CommandLoading,
    Template: { Simple: CommandTemplateSimple },
};

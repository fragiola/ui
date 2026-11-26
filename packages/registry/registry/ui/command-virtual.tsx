"use client";

import {
    type CommandEntry,
    type CommandVirtualListProps,
    CommandVirtual as CommandVirtualPrimitive,
} from "@fragiola/primitives-react/command-virtual";
import { cn } from "#/lib/cn";
import { Command } from "#/ui/command";

// Command Virtual — a Command palette over thousands of actions that renders
// only the matching ones in view: the List filters `items` (`{ value,
// keywords?, disabled? }` and anything of the app's) with the Root's text,
// and calls its function for each match in view, which returns a
// `Command.Item`. The highlighted action, its neighbours, the best match and
// the ends stay rendered, so the keys behave as with every action rendered.
//
// Primitives-backed, like Command, and its twin: every part but the List is
// Command's, and the List has Command.List's classes (a virtual list is
// flat: no groups). It scrolls itself (`max-h-80`).

const LIST =
    "flex max-h-80 scroll-py-2 flex-col overflow-x-hidden overflow-y-auto p-2 outline-none";

function CommandVirtualList<Entry extends CommandEntry = CommandEntry>({
    className,
    ...props
}: CommandVirtualListProps<Entry>) {
    return (
        <CommandVirtualPrimitive.List<Entry>
            data-slot="command-list"
            className={cn(LIST, className as string)}
            {...props}
        />
    );
}

export type { CommandEntry };

// Command's parts but its template, which renders the plain List.
const { Template: _template, ...parts } = Command;

export const CommandVirtual = {
    ...parts,
    List: CommandVirtualList,
};

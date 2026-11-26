"use client";

import {
    CalendarIcon,
    FileTextIcon,
    PlusIcon,
    SearchIcon,
    SettingsIcon,
    UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Clickable } from "#/components/atoms/clickable";
import { Command, type CommandActionGroup } from "#/components/ui/command";
import { Dialog } from "#/components/ui/dialog";

// A project tool's command palette, twice: on the page, and in a dialog
// opened by its button or by Cmd/Ctrl+K (the app's own shortcut). Typing
// filters the actions and highlights the best match, the arrows move the
// highlight, Enter runs it. The focus stays in the input. The page's
// palette is the template; the dialog's is written from its parts.
export default function CommandDemo() {
    const [ran, setRan] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setOpen((value) => !value);
            }
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, []);

    const groups: CommandActionGroup[] = [
        {
            label: "Suggestions",
            actions: [
                {
                    value: "New issue",
                    icon: <PlusIcon />,
                    shortcut: "C",
                    onSelect: setRan,
                },
                {
                    value: "Open calendar",
                    icon: <CalendarIcon />,
                    keywords: ["schedule", "events"],
                    onSelect: setRan,
                },
                {
                    value: "Search documents",
                    icon: <FileTextIcon />,
                    shortcut: "/",
                    onSelect: setRan,
                },
            ],
        },
        {
            label: "Settings",
            actions: [
                {
                    value: "Profile",
                    icon: <UserIcon />,
                    shortcut: "⌘P",
                    onSelect: setRan,
                },
                {
                    value: "Preferences",
                    icon: <SettingsIcon />,
                    shortcut: "⌘,",
                    onSelect: setRan,
                },
                { value: "Billing", disabled: true },
            ],
        },
    ];

    return (
        <div className="palette-surface flex w-full flex-col items-start gap-4 bg-palette-base text-palette-contrast">
            <Command.Template.Simple
                groups={groups}
                aria-label="Command"
                className="h-auto max-w-sm"
            />
            <div className="flex items-center gap-3">
                <Dialog.Root open={open} onOpenChange={setOpen}>
                    <Dialog.Trigger
                        render={<Clickable.Button variant="outline" />}
                    >
                        <SearchIcon />
                        Search…
                        <kbd className="font-sans text-xs text-palette-accent/85">
                            ⌘K
                        </kbd>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <Dialog.Backdrop />
                        <Dialog.Content
                            showClose={false}
                            className="overflow-hidden"
                        >
                            <Dialog.Title className="sr-only">
                                Command palette
                            </Dialog.Title>
                            <Command.Root className="border-0">
                                <Command.Input
                                    aria-label="Command"
                                    placeholder="Type a command or search…"
                                />
                                <Command.List>
                                    <Command.Group>
                                        <Command.GroupLabel>
                                            Navigation
                                        </Command.GroupLabel>
                                        {[
                                            "Inbox",
                                            "My issues",
                                            "Projects",
                                            "Roadmap",
                                        ].map((page) => (
                                            <Command.Item
                                                key={page}
                                                value={`Go to ${page}`}
                                                onSelect={(value: string) => {
                                                    setRan(value);
                                                    setOpen(false);
                                                }}
                                            >
                                                <FileTextIcon />
                                                <span>Go to {page}</span>
                                            </Command.Item>
                                        ))}
                                    </Command.Group>
                                </Command.List>
                                <Command.Empty>No results found.</Command.Empty>
                            </Command.Root>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
                <span className="text-sm text-palette-accent/85">
                    {ran ? `Ran “${ran}”.` : "Nothing run yet."}
                </span>
            </div>
        </div>
    );
}

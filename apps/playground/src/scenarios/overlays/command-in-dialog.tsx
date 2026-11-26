import { useState } from "react";
import { Clickable } from "#/components/atoms/clickable";
import { Command } from "#/components/ui/command";
import { Dialog } from "#/components/ui/dialog";

// The Epic #166 probe, after primitives-in-dialog and date-picker-in-dialog:
// a Command (Fragiola Primitives) inside the base's Dialog. On opening, the
// palette's input must take the focus inside the dialog's trap; typing
// filters, the arrows move the highlight and Enter runs the action while the
// focus stays in the input; Escape closes the dialog and the focus returns
// to the trigger. On the Fragiola Primitives base both are one library: the
// reference.
export default function CommandInDialog() {
    const [ran, setRan] = useState("none");
    const [open, setOpen] = useState(false);
    return (
        <div className="palette-surface flex flex-col gap-3 rounded-lg border border-palette-line bg-palette-base p-6">
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger render={<Clickable.Button variant="outline" />}>
                    Open the palette
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Backdrop />
                    <Dialog.Content
                        showClose={false}
                        className="overflow-hidden"
                    >
                        <Dialog.Title className="sr-only">Palette</Dialog.Title>
                        <Command.Root className="border-0">
                            <Command.Input aria-label="Command" />
                            <Command.List>
                                {["Alpha", "Beta", "Gamma", "Delta"].map(
                                    (name) => (
                                        <Command.Item
                                            key={name}
                                            value={name}
                                            onSelect={(value: string) => {
                                                setRan(value);
                                                setOpen(false);
                                            }}
                                        >
                                            {name}
                                        </Command.Item>
                                    ),
                                )}
                            </Command.List>
                            <Command.Empty>No results.</Command.Empty>
                        </Command.Root>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
            <p className="text-sm">ran: {ran}</p>
        </div>
    );
}

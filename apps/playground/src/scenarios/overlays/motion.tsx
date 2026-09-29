import { Clickable } from "#/components/atoms/clickable";
import { AlertDialog } from "#/components/ui/alert-dialog";
import { Dialog } from "#/components/ui/dialog";
import { Drawer } from "#/components/ui/drawer";
import { Popover } from "#/components/ui/popover";
import { Tooltip } from "#/components/ui/tooltip";

// Every overlay's trigger side by side, to compare how each one opens and
// closes under the same theme, direction and density — the animations the
// docs examples show one page apart.

export default function OverlayMotion() {
    return (
        <div className="palette-surface flex flex-wrap items-center gap-3 rounded-lg border border-palette-line bg-palette-base p-6">
            <Dialog.Root>
                <Dialog.Trigger render={<Clickable.Button variant="outline" />}>
                    Dialog
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Backdrop />
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Dialog</Dialog.Title>
                            <Dialog.Description>
                                Backdrop and panel, from the layer family.
                            </Dialog.Description>
                        </Dialog.Header>
                        <Dialog.Footer>
                            <Dialog.Close
                                render={<Clickable.Button variant="outline" />}
                            >
                                Close
                            </Dialog.Close>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <AlertDialog.Root>
                <AlertDialog.Trigger
                    render={<Clickable.Button variant="outline" />}
                >
                    Alert dialog
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                    <AlertDialog.Backdrop />
                    <AlertDialog.Content>
                        <AlertDialog.Header>
                            <AlertDialog.Title>Alert dialog</AlertDialog.Title>
                            <AlertDialog.Description>
                                The same layer, with no dismissal on the
                                backdrop.
                            </AlertDialog.Description>
                        </AlertDialog.Header>
                        <AlertDialog.Footer>
                            <AlertDialog.Close
                                render={<Clickable.Button variant="outline" />}
                            >
                                Close
                            </AlertDialog.Close>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>

            {(["right", "left"] as const).map((side) => (
                <Drawer.Root key={side} swipeDirection={side}>
                    <Drawer.Trigger
                        render={<Clickable.Button variant="outline" />}
                    >
                        Drawer ({side})
                    </Drawer.Trigger>
                    <Drawer.Portal>
                        <Drawer.Backdrop />
                        <Drawer.Viewport side={side}>
                            <Drawer.Popup side={side}>
                                <Drawer.Handle />
                                <Drawer.Content>
                                    <Drawer.Header>
                                        <Drawer.Title>Drawer</Drawer.Title>
                                        <Drawer.Description>
                                            Slides in from the {side} edge.
                                        </Drawer.Description>
                                    </Drawer.Header>
                                    <Drawer.Footer>
                                        <Drawer.Close
                                            render={
                                                <Clickable.Button variant="outline" />
                                            }
                                        >
                                            Close
                                        </Drawer.Close>
                                    </Drawer.Footer>
                                </Drawer.Content>
                            </Drawer.Popup>
                        </Drawer.Viewport>
                    </Drawer.Portal>
                </Drawer.Root>
            ))}

            <Popover.Root>
                <Popover.Trigger
                    render={<Clickable.Button variant="outline" />}
                >
                    Popover
                </Popover.Trigger>
                <Popover.Content align="start" sideOffset={4}>
                    <div className="flex flex-col gap-1 p-4">
                        <Popover.Title>Popover</Popover.Title>
                        <Popover.Description>
                            A popup anchored to its trigger.
                        </Popover.Description>
                    </div>
                </Popover.Content>
            </Popover.Root>

            <Tooltip.Provider>
                <Tooltip.Root>
                    <Tooltip.Trigger
                        render={<Clickable.Button variant="outline" />}
                    >
                        Tooltip
                    </Tooltip.Trigger>
                    <Tooltip.Content>A transient text label.</Tooltip.Content>
                </Tooltip.Root>
            </Tooltip.Provider>
        </div>
    );
}

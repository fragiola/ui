import { Popover as PrimitivesPopover } from "@fragiola/primitives-react/popover";
import { Clickable } from "#/components/atoms/clickable";
import { Dialog } from "#/components/ui/dialog";
import { SegmentedControl } from "#/components/ui/segmented-control";
import { popup } from "#/families/popup";

// The Epic #158 probe: a Fragiola Primitives popup inside the base's Dialog.
// On the Base UI base the two libraries share one page, so this checks that
// they do not fight over focus, outside press or scroll lock: the popover
// opens over the dialog and takes the focus, Escape and an outside press
// close the popover first and leave the dialog open, the dialog's focus trap
// lets the focus reach the popover, and the page stays locked until the
// dialog closes. A primitives-backed component (Segmented Control) sits in
// the same dialog, its arrows working while the dialog traps the focus.
// On the Fragiola Primitives base both are one library: the reference.
export default function PrimitivesInDialog() {
    return (
        <div className="palette-surface flex flex-col gap-3 rounded-lg border border-palette-line bg-palette-base p-6">
            <Dialog.Root>
                <Dialog.Trigger render={<Clickable.Button variant="outline" />}>
                    Open the dialog
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Backdrop />
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Share the board</Dialog.Title>
                            <Dialog.Description>
                                A Fragiola Primitives popover and a
                                primitives-backed control inside the base's
                                dialog.
                            </Dialog.Description>
                        </Dialog.Header>
                        <SegmentedControl.Root
                            aria-label="Access"
                            defaultValue="view"
                        >
                            <SegmentedControl.Item value="view">
                                Can view
                            </SegmentedControl.Item>
                            <SegmentedControl.Item value="edit">
                                Can edit
                            </SegmentedControl.Item>
                        </SegmentedControl.Root>
                        <PrimitivesPopover.Root>
                            <PrimitivesPopover.Trigger
                                render={<Clickable.Button variant="outline" />}
                            >
                                Link settings
                            </PrimitivesPopover.Trigger>
                            <PrimitivesPopover.Portal>
                                <PrimitivesPopover.Positioner
                                    sideOffset={4}
                                    className="z-50"
                                >
                                    <PrimitivesPopover.Popup
                                        className={popup.content(
                                            "z-50 flex flex-col gap-2 p-4 outline-none",
                                        )}
                                    >
                                        <PrimitivesPopover.Title className="text-sm font-medium">
                                            Link settings
                                        </PrimitivesPopover.Title>
                                        <Clickable.Button variant="outline">
                                            Copy link
                                        </Clickable.Button>
                                        <PrimitivesPopover.Close
                                            render={
                                                <Clickable.Button variant="ghost" />
                                            }
                                        >
                                            Done
                                        </PrimitivesPopover.Close>
                                    </PrimitivesPopover.Popup>
                                </PrimitivesPopover.Positioner>
                            </PrimitivesPopover.Portal>
                        </PrimitivesPopover.Root>
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
        </div>
    );
}

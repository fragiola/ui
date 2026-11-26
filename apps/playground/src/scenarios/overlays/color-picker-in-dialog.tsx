import { Clickable } from "#/components/atoms/clickable";
import { ColorPickerPopover } from "#/components/ui/color-picker-popover";
import { Dialog } from "#/components/ui/dialog";
import { Field } from "#/components/ui/field";

// The Epic #169 probe, after the date picker's: a color picker popover (a
// Fragiola Primitives popup) inside the base's Dialog. On the Base UI base
// its popup must take the focus inside Base UI's focus trap (on the area's
// first slider), the arrows must move the thumb, Escape and an outside press
// must close the popup only and return the focus to the trigger, and the
// next Escape must close the dialog. On the Fragiola Primitives base both
// are one library: the date picker needed its focus moved a frame after
// mounting there; this checks whether the popover does.
export default function ColorPickerInDialog() {
    return (
        <div className="palette-surface flex flex-col gap-3 rounded-lg border border-palette-line bg-palette-base p-6">
            <Dialog.Root>
                <Dialog.Trigger render={<Clickable.Button variant="outline" />}>
                    Edit the label
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Backdrop />
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Edit the label</Dialog.Title>
                            <Dialog.Description>
                                A Fragiola Primitives color picker popover
                                inside the base's dialog.
                            </Dialog.Description>
                        </Dialog.Header>
                        <Field.Root>
                            <Field.Label id="label-color">Color</Field.Label>
                            <ColorPickerPopover.Template.Simple
                                id="label-color-trigger"
                                aria-labelledby="label-color label-color-trigger"
                                defaultValue="#e11d48"
                                swatches={["#2563eb", "#16a34a", "#e11d48"]}
                            />
                        </Field.Root>
                        <Dialog.Footer>
                            <Dialog.Close
                                render={<Clickable.Button variant="outline" />}
                            >
                                Cancel
                            </Dialog.Close>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}

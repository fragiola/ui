import { Clickable } from "#/components/atoms/clickable";
import { DatePicker } from "#/components/ui/date-picker";
import { Dialog } from "#/components/ui/dialog";
import { Field } from "#/components/ui/field";

// The Epic #162 probe, after Epic #158's primitives-in-dialog: a date
// picker (a Fragiola Primitives popup) inside the base's Dialog. On the
// Base UI base the picker's popup must take the focus inside Base UI's focus
// trap (on the calendar's focused date), the arrows must move in the grid,
// a choice must close the popup and return the focus to the trigger, and
// Escape must close the popup first, then the dialog. On the Fragiola
// Primitives base both are one library: the reference.
export default function DatePickerInDialog() {
    return (
        <div className="palette-surface flex flex-col gap-3 rounded-lg border border-palette-line bg-palette-base p-6">
            <Dialog.Root>
                <Dialog.Trigger render={<Clickable.Button variant="outline" />}>
                    Schedule the release
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Backdrop />
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Schedule the release</Dialog.Title>
                            <Dialog.Description>
                                A Fragiola Primitives date picker inside the
                                base's dialog.
                            </Dialog.Description>
                        </Dialog.Header>
                        <Field.Root>
                            <Field.Label id="release-label">
                                Release date
                            </Field.Label>
                            <DatePicker.Template.Simple
                                id="release-trigger"
                                aria-labelledby="release-label release-trigger"
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

"use client";

import { Clickable } from "#/components/atoms/clickable";
import { Input } from "#/components/atoms/fields";
import { Dialog } from "#/components/ui/dialog";
import { Field } from "#/components/ui/field";

const TERMS_SECTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Two dialogs an app would have, in the default look: a form that edits a
// profile, and terms whose body scrolls while the header and footer stay.
// The content travels through a portal and inherits the floor's palette
// from the owning subtree; the fields carry no palette class and the
// primary action carries palette-neutral.

export default function DialogDemo() {
    return (
        <div className="palette-surface flex flex-wrap items-center gap-4 bg-palette-base text-palette-contrast">
            <Dialog.Root>
                <Dialog.Trigger render={<Clickable.Button variant="outline" />}>
                    Edit profile
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Backdrop />
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Edit profile</Dialog.Title>
                            <Dialog.Description>
                                Make changes to your profile here. Click save
                                when you are done.
                            </Dialog.Description>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Field.Root>
                                <Field.Label>Name</Field.Label>
                                <Field.Row>
                                    <Field.Body>
                                        <Input defaultValue="Ada Lovelace" />
                                    </Field.Body>
                                </Field.Row>
                            </Field.Root>
                            <Field.Root>
                                <Field.Label>Username</Field.Label>
                                <Field.Row>
                                    <Field.Body>
                                        <Input defaultValue="@ada" />
                                    </Field.Body>
                                </Field.Row>
                            </Field.Root>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.Close
                                render={<Clickable.Button variant="outline" />}
                            >
                                Cancel
                            </Dialog.Close>
                            <Clickable.Button className="palette-neutral">
                                Save
                            </Clickable.Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <Dialog.Root>
                <Dialog.Trigger render={<Clickable.Button variant="outline" />}>
                    Terms
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Backdrop />
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Terms of service</Dialog.Title>
                            <Dialog.Description>
                                Please read the full terms before continuing.
                            </Dialog.Description>
                        </Dialog.Header>
                        <Dialog.Body className="max-h-60">
                            {TERMS_SECTIONS.map((n) => (
                                <p
                                    key={n}
                                    className="text-sm text-palette-accent/85"
                                >
                                    Section {n}: Fragiola is a copy-paste
                                    component library built on Base UI
                                    primitives and Tailwind v4. The palette
                                    contract is six roles; the number of
                                    palettes is free.
                                </p>
                            ))}
                        </Dialog.Body>
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

"use client";

import { Clickable } from "#/components/atoms/clickable";
import { Input } from "#/components/atoms/fields";
import { Field } from "#/components/ui/field";
import { Popover } from "#/components/ui/popover";

// Two popovers an app would have, in the default look: a small form that
// edits a value in place, and a note with no close button (it closes on an
// outside click or Escape). The content travels through a portal and
// inherits the floor's palette from the owning subtree; the fields carry no
// palette class and the primary action carries palette-neutral.
export default function PopoverDemo() {
    return (
        <div className="palette-surface flex flex-wrap items-start gap-4 bg-palette-base text-palette-contrast">
            <Popover.Root>
                <Popover.Trigger
                    render={<Clickable.Button variant="outline" />}
                >
                    Set dimensions
                </Popover.Trigger>
                <Popover.Content align="start" sideOffset={4}>
                    <div className="flex flex-col gap-3 p-4">
                        <div className="flex flex-col gap-1">
                            <Popover.Title>Dimensions</Popover.Title>
                            <Popover.Description>
                                Set the size of the canvas.
                            </Popover.Description>
                        </div>
                        <Field.Root>
                            <Field.Label>Width</Field.Label>
                            <Field.Row>
                                <Field.Body>
                                    <Input defaultValue="1280" />
                                </Field.Body>
                                <Field.Addon side="inline-end">px</Field.Addon>
                            </Field.Row>
                        </Field.Root>
                        <Field.Root>
                            <Field.Label>Height</Field.Label>
                            <Field.Row>
                                <Field.Body>
                                    <Input defaultValue="720" />
                                </Field.Body>
                                <Field.Addon side="inline-end">px</Field.Addon>
                            </Field.Row>
                        </Field.Root>
                        <div className="flex justify-end gap-2">
                            <Popover.Close
                                render={
                                    <Clickable.Button
                                        variant="outline"
                                        size="sm"
                                    />
                                }
                            >
                                Cancel
                            </Popover.Close>
                            <Clickable.Button
                                className="palette-neutral"
                                size="sm"
                            >
                                Apply
                            </Clickable.Button>
                        </div>
                    </div>
                </Popover.Content>
            </Popover.Root>

            <Popover.Root>
                <Popover.Trigger render={<Clickable.Button variant="ghost" />}>
                    What is a seat?
                </Popover.Trigger>
                <Popover.Content showClose={false} align="start">
                    <div className="flex max-w-64 flex-col gap-2 p-4">
                        <Popover.Title>Seats</Popover.Title>
                        <Popover.Description>
                            One seat per member who can sign in. Guests and
                            viewers are free.
                        </Popover.Description>
                    </div>
                </Popover.Content>
            </Popover.Root>
        </div>
    );
}

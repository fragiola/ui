"use client";

import { Clickable } from "#/atoms/clickable";
import { Input } from "#/atoms/fields";
import { Field } from "#/ui/field";
import { Popover } from "#/ui/popover";

export default function PopoverDemo() {
    return (
        <div className="flex flex-wrap gap-4">
            {/* A popover with a form — title, description, body, close */}
            <Popover.Root>
                <Popover.Trigger
                    render={<Clickable.Button variant="outline" />}
                >
                    Open popover
                </Popover.Trigger>
                <Popover.Content align="start" sideOffset={4}>
                    <div className="flex flex-col gap-3 p-4">
                        <div className="flex flex-col gap-1">
                            <Popover.Title>Dimensions</Popover.Title>
                            <Popover.Description>
                                Set the dimensions for the canvas.
                            </Popover.Description>
                        </div>
                        <Field.Root>
                            <Field.Label>Width</Field.Label>
                            <Field.Row>
                                <Field.Body>
                                    <Input defaultValue="100%" />
                                </Field.Body>
                            </Field.Row>
                        </Field.Root>
                        <Field.Root>
                            <Field.Label>Height</Field.Label>
                            <Field.Row>
                                <Field.Body>
                                    <Input defaultValue="auto" />
                                </Field.Body>
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
                            <Clickable.Button variant="solid" size="sm">
                                Apply
                            </Clickable.Button>
                        </div>
                    </div>
                </Popover.Content>
            </Popover.Root>

            {/* A popover without the close button */}
            <Popover.Root>
                <Popover.Trigger
                    render={<Clickable.Button variant="outline" />}
                >
                    No close
                </Popover.Trigger>
                <Popover.Content showClose={false} align="start">
                    <div className="flex flex-col gap-2 p-4">
                        <Popover.Title>Quick info</Popover.Title>
                        <Popover.Description>
                            A popover without a close button — dismissed by
                            clicking outside or pressing Escape.
                        </Popover.Description>
                    </div>
                </Popover.Content>
            </Popover.Root>
        </div>
    );
}

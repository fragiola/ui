"use client";

import type { ReactNode } from "react";
import { Clickable } from "#/atoms/clickable";
import { Input } from "#/atoms/fields";
import { Field } from "#/ui/field";
import { Popover } from "#/ui/popover";

// The floor is palette-surface. The popover content travels through a portal
// but inherits the palette from the owning subtree — the title, description,
// fields and buttons all read roles from the floor. Shows: a popover with a
// form, and one without a close button.
export default function PopoverDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            <Row label="with form">
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
            </Row>

            <Row label="no close button">
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
            </Row>
        </div>
    );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-palette-accent/85">
                {label}
            </span>
            <div className="flex flex-wrap items-center gap-4">{children}</div>
        </div>
    );
}

"use client";

import type { ReactNode } from "react";
import { Clickable } from "#/components/atoms/clickable";
import { Input } from "#/components/atoms/fields";
import { Field } from "#/components/ui/field";

// The surface-tier palettes: each is the neutral surface with one chromatic
// ring, so a field wearing one reads neutral and shows its colour only on
// focus. Literal here because examples are published source (the code panel
// shows this file verbatim, with a copy button).
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

// A profile form in the default look: the fields carry no palette class and
// take the floor's; the box (stroke, height, focus ring) lives on Field.Row,
// never on the input. Then the states a form needs, invalid and disabled,
// and last the same field in each surface-ring palette (focus one to see
// its ring).
export default function FieldDemo() {
    return (
        <div className="not-prose palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <form
                className="flex max-w-sm flex-col gap-4"
                onSubmit={(event) => event.preventDefault()}
            >
                <Field.Root>
                    <Field.Label>Name</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input defaultValue="Ada Lovelace" />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>

                <Field.Root>
                    <Field.Label>Email</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input type="email" placeholder="ada@example.com" />
                        </Field.Body>
                    </Field.Row>
                    <Field.Description>
                        We send receipts to this address.
                    </Field.Description>
                </Field.Root>

                <Clickable.Button
                    type="submit"
                    className="palette-neutral self-start"
                >
                    Save profile
                </Clickable.Button>
            </form>

            {/* Invalid arrives by palette inheritance: Base UI emits
                data-invalid on Field.Root, and danger.css registers
                [data-invalid] as a palette-danger applier, so the whole
                field turns danger with no extra class. */}
            <Row label="states">
                <Field.Root invalid className="w-56">
                    <Field.Label>Username</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input defaultValue="admin" />
                        </Field.Body>
                    </Field.Row>
                    <Field.Error match>This username is taken.</Field.Error>
                </Field.Root>

                <Field.Root disabled className="w-56">
                    <Field.Label>Workspace ID</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input defaultValue="ws_8f2k41" />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>
            </Row>

            {/* the same field, only its palette-* class changed */}
            <Row label="palettes">
                {SURFACE_RING.map((palette) => (
                    <Field.Root
                        key={palette}
                        className={`palette-${palette} w-40`}
                    >
                        <Field.Row>
                            <Field.Body>
                                <Input
                                    aria-label={palette}
                                    placeholder={palette}
                                />
                            </Field.Body>
                        </Field.Row>
                    </Field.Root>
                ))}
            </Row>
        </div>
    );
}

// Row — a captioned row. The caption is a <span>, not a heading.
function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-palette-accent/85">
                {label}
            </span>
            <div className="flex flex-wrap items-start gap-4">{children}</div>
        </div>
    );
}

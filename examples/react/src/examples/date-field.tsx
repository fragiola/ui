"use client";

import { type ReactNode, useState } from "react";
import { DateField } from "#/components/ui/date-field";
import { Field } from "#/components/ui/field";

// The surface-tier palettes: the neutral surface with one chromatic ring, so
// only the focus ring takes colour. Literal here because examples are
// published source (the code panel shows this file verbatim, with a copy
// button).
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

type PlainDate = { year: number; month: number; day: number };

const LONG = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

// A birth date in the default look: the field's row is the box, the segments
// are only its middle. Type the digits (focus moves on when no further digit
// fits), or step a segment with the arrows; the focused segment is
// `highlighted` and the empty ones are secondary text. Each field is named
// by its label's id (on Base UI, the registry's Field does not reach a
// Fragiola Primitives control). Then the states a reader needs (a value
// outside `min`/`max`, invalid by inheritance; a date and time; disabled),
// and last the same field in each surface-ring palette.
export default function DateFieldDemo() {
    const [date, setDate] = useState<PlainDate | null>(null);
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Field.Root className="max-w-xs">
                <Field.Label id="birth-date-label">Birth date</Field.Label>
                <Field.Row>
                    <DateField.Root
                        value={date}
                        onValueChange={setDate}
                        name="birth-date"
                    >
                        <DateField.Input aria-labelledby="birth-date-label" />
                    </DateField.Root>
                </Field.Row>
                <Field.Description>
                    {date
                        ? LONG.format(
                              new Date(date.year, date.month - 1, date.day),
                          )
                        : "Month, day and year."}
                </Field.Description>
            </Field.Root>

            <Row label="states">
                <Field.Root className="w-56">
                    <Field.Label id="renewal-label">Renewal</Field.Label>
                    <Field.Row>
                        <DateField.Root
                            defaultValue={{ year: 2019, month: 3, day: 14 }}
                            min={{ year: 2025, month: 1, day: 1 }}
                        >
                            <DateField.Input aria-labelledby="renewal-label" />
                        </DateField.Root>
                    </Field.Row>
                </Field.Root>
                <Field.Root className="w-64">
                    <Field.Label id="meeting-label">Meeting</Field.Label>
                    <Field.Row>
                        <DateField.Root
                            granularity="minute"
                            defaultValue={{
                                year: 2026,
                                month: 12,
                                day: 3,
                                hour: 14,
                                minute: 30,
                                second: 0,
                            }}
                        >
                            <DateField.Input aria-labelledby="meeting-label" />
                        </DateField.Root>
                    </Field.Row>
                </Field.Root>
                <Field.Root className="w-56" disabled>
                    <Field.Label id="signed-label">Signed</Field.Label>
                    <Field.Row>
                        <DateField.Root
                            defaultValue={{ year: 2026, month: 1, day: 9 }}
                            disabled
                        >
                            <DateField.Input aria-labelledby="signed-label" />
                        </DateField.Root>
                    </Field.Row>
                </Field.Root>
            </Row>

            {/* the same field, only its palette-* class changed */}
            <Row label="palettes">
                {SURFACE_RING.map((palette) => (
                    <Field.Row
                        key={palette}
                        className={`w-40 palette-${palette}`}
                    >
                        <DateField.Root>
                            <DateField.Input aria-label={`Date, ${palette}`} />
                        </DateField.Root>
                    </Field.Row>
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
            <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
                {children}
            </div>
        </div>
    );
}

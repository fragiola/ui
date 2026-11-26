"use client";

import { type ReactNode, useState } from "react";
import { DateRangeField } from "#/components/ui/date-range-field";
import { Field } from "#/components/ui/field";

type PlainDate = { year: number; month: number; day: number };
type DateRange = { start: PlainDate; end: PlainDate };

const SHORT = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

function format(date: PlainDate): string {
    return SHORT.format(new Date(date.year, date.month - 1, date.day));
}

// A trip in the default look: one row holds both ends, each end named by its
// own Input (`aria-label`), the dash between them hidden from assistive
// technology. A completed start goes on into the end. Then the state a
// reader needs: an end before the start makes the range invalid, every
// segment `palette-danger` by inheritance.
export default function DateRangeFieldDemo() {
    const [range, setRange] = useState<DateRange | null>({
        start: { year: 2027, month: 3, day: 8 },
        end: { year: 2027, month: 3, day: 15 },
    });
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Field.Root className="max-w-sm">
                <Field.Label id="trip-label">Trip</Field.Label>
                <Field.Row>
                    <DateRangeField.Root
                        value={range}
                        onValueChange={setRange}
                        startName="from"
                        endName="to"
                    >
                        <DateRangeField.Input
                            range="start"
                            aria-label="Departure"
                            aria-labelledby="trip-label"
                        />
                        <DateRangeField.Separator />
                        <DateRangeField.Input
                            range="end"
                            aria-label="Return"
                            aria-labelledby="trip-label"
                        />
                    </DateRangeField.Root>
                </Field.Row>
                <Field.Description>
                    {range
                        ? `${format(range.start)} to ${format(range.end)}`
                        : "Type the departure, then the return."}
                </Field.Description>
            </Field.Root>

            <Row label="invalid: the end before the start">
                <Field.Row className="max-w-sm">
                    <DateRangeField.Root
                        defaultValue={{
                            start: { year: 2027, month: 5, day: 20 },
                            end: { year: 2027, month: 5, day: 12 },
                        }}
                    >
                        <DateRangeField.Input
                            range="start"
                            aria-label="Start date"
                        />
                        <DateRangeField.Separator />
                        <DateRangeField.Input
                            range="end"
                            aria-label="End date"
                        />
                    </DateRangeField.Root>
                </Field.Row>
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
            {children}
        </div>
    );
}

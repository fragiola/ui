"use client";

import { type ReactNode, useState } from "react";
import { Field } from "#/components/ui/field";
import { TimeField } from "#/components/ui/time-field";

type PlainTime = {
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
};

// A reminder's time in the default look: hours, minutes and, on the
// locale's 12-hour clock, the day period (type `a` or `p`). Then the clocks
// a reader needs: 24 hours with seconds, and a range of opening hours
// (`min`/`max`) that a later time leaves invalid.
export default function TimeFieldDemo() {
    const [time, setTime] = useState<PlainTime | null>({
        hour: 9,
        minute: 30,
        second: 0,
        millisecond: 0,
    });
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Field.Root className="max-w-xs">
                <Field.Label id="reminder-label">Reminder</Field.Label>
                <Field.Row>
                    <TimeField.Root value={time} onValueChange={setTime}>
                        <TimeField.Input aria-labelledby="reminder-label" />
                    </TimeField.Root>
                </Field.Row>
                <Field.Description>
                    {time
                        ? `Every day at ${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}.`
                        : "Choose a time."}
                </Field.Description>
            </Field.Root>

            <Row label="states">
                <Field.Root className="w-48">
                    <Field.Label id="lap-label">Lap time</Field.Label>
                    <Field.Row>
                        <TimeField.Root
                            hourCycle={24}
                            granularity="second"
                            defaultValue={{
                                hour: 0,
                                minute: 4,
                                second: 12,
                                millisecond: 0,
                            }}
                        >
                            <TimeField.Input aria-labelledby="lap-label" />
                        </TimeField.Root>
                    </Field.Row>
                </Field.Root>
                <Field.Root className="w-48">
                    <Field.Label id="pickup-label">Pickup (9–17)</Field.Label>
                    <Field.Row>
                        <TimeField.Root
                            min={{
                                hour: 9,
                                minute: 0,
                                second: 0,
                                millisecond: 0,
                            }}
                            max={{
                                hour: 17,
                                minute: 0,
                                second: 0,
                                millisecond: 0,
                            }}
                            defaultValue={{
                                hour: 19,
                                minute: 15,
                                second: 0,
                                millisecond: 0,
                            }}
                        >
                            <TimeField.Input aria-labelledby="pickup-label" />
                        </TimeField.Root>
                    </Field.Row>
                </Field.Root>
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

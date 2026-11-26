"use client";

import { useState } from "react";
import { Field } from "#/components/ui/field";
import { TimeRangeField } from "#/components/ui/time-range-field";

type PlainTime = {
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
};
type TimeRange = { start: PlainTime; end: PlainTime };

function minutes(range: TimeRange): number {
    return (
        range.end.hour * 60 +
        range.end.minute -
        (range.start.hour * 60 + range.start.minute)
    );
}

// Opening hours in the default look: one row, two ends, each named by its own
// Input; an end before the start makes the range invalid (`palette-danger`
// by inheritance).
export default function TimeRangeFieldDemo() {
    const [range, setRange] = useState<TimeRange | null>({
        start: { hour: 9, minute: 0, second: 0, millisecond: 0 },
        end: { hour: 17, minute: 30, second: 0, millisecond: 0 },
    });
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Field.Root className="max-w-sm">
                <Field.Label id="hours-label">Opening hours</Field.Label>
                <Field.Row>
                    <TimeRangeField.Root value={range} onValueChange={setRange}>
                        <TimeRangeField.Input
                            range="start"
                            id="hours-start"
                            aria-label="Opens"
                            aria-labelledby="hours-label hours-start"
                        />
                        <TimeRangeField.Separator />
                        <TimeRangeField.Input
                            range="end"
                            id="hours-end"
                            aria-label="Closes"
                            aria-labelledby="hours-label hours-end"
                        />
                    </TimeRangeField.Root>
                </Field.Row>
                <Field.Description>
                    {range
                        ? `Open ${Math.floor(minutes(range) / 60)} h ${minutes(range) % 60} min a day.`
                        : "Type the opening and the closing time."}
                </Field.Description>
            </Field.Root>
        </div>
    );
}

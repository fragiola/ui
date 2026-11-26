"use client";

import { useState } from "react";
import { DateRangePickerInput } from "#/components/ui/date-range-picker-input";
import { Field } from "#/components/ui/field";
import { RangeCalendar } from "#/components/ui/range-calendar";

type PlainDate = { year: number; month: number; day: number };
type DateRange = { start: PlainDate; end: PlainDate };

// A stay typed or picked: check-in and check-out are two ends' segments in
// one field row (each named by its own Segments), one sequence across both;
// the trigger opens a two-month range calendar whose choice fills both ends.
export default function DateRangePickerInputDemo() {
    const [stay, setStay] = useState<DateRange | null>({
        start: { year: 2027, month: 7, day: 3 },
        end: { year: 2027, month: 7, day: 10 },
    });
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Field.Root className="max-w-sm">
                <Field.Label id="stay-label">Stay</Field.Label>
                <DateRangePickerInput.Root
                    value={stay}
                    onValueChange={setStay}
                    name="stay"
                >
                    <Field.Row>
                        <DateRangePickerInput.Segments
                            range="start"
                            aria-label="Check-in"
                            aria-labelledby="stay-label"
                        />
                        <DateRangePickerInput.Separator />
                        <DateRangePickerInput.Segments
                            range="end"
                            aria-label="Check-out"
                            aria-labelledby="stay-label"
                        />
                        <DateRangePickerInput.Trigger className="ms-auto" />
                    </Field.Row>
                    <DateRangePickerInput.Content aria-label="Choose stay">
                        <RangeCalendar.Template.Simple visibleMonths={2} />
                    </DateRangePickerInput.Content>
                </DateRangePickerInput.Root>
                <Field.Description>
                    {stay
                        ? "Check-in from 3 pm, check-out by 11 am."
                        : "Type both dates, or pick them."}
                </Field.Description>
            </Field.Root>
        </div>
    );
}

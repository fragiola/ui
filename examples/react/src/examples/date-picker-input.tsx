"use client";

import { useState } from "react";
import { Calendar } from "#/components/ui/calendar";
import { DatePickerInput } from "#/components/ui/date-picker-input";
import { Field } from "#/components/ui/field";

type PlainDate = { year: number; month: number; day: number };

const LONG = new Intl.DateTimeFormat("en-US", { dateStyle: "full" });

// An arrival date typed or picked: the segments are the Date Field's, the
// trigger an icon button inside the same field row. Typing a complete,
// valid date sets the value (and the calendar opens on it); choosing a day
// in the calendar fills the segments. Both are one value and one form input.
export default function DatePickerInputDemo() {
    const [arrival, setArrival] = useState<PlainDate | null>({
        year: 2027,
        month: 4,
        day: 18,
    });
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Field.Root className="max-w-xs">
                <Field.Label id="arrival-label">Arrival</Field.Label>
                <DatePickerInput.Root
                    value={arrival}
                    onValueChange={setArrival}
                    name="arrival"
                >
                    <Field.Row>
                        <DatePickerInput.Segments aria-labelledby="arrival-label" />
                        <DatePickerInput.Trigger />
                    </Field.Row>
                    <DatePickerInput.Content aria-label="Choose arrival date">
                        <Calendar.Template.Simple />
                    </DatePickerInput.Content>
                </DatePickerInput.Root>
                <Field.Description>
                    {arrival
                        ? LONG.format(
                              new Date(
                                  arrival.year,
                                  arrival.month - 1,
                                  arrival.day,
                              ),
                          )
                        : "Type a complete date, or pick one."}
                </Field.Description>
            </Field.Root>
        </div>
    );
}

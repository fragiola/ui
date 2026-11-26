"use client";

import { useState } from "react";
import { Field } from "#/components/ui/field";
import { MonthRangeCalendar } from "#/components/ui/month-range-calendar";
import { MonthRangePicker } from "#/components/ui/month-range-picker";

type Month = { year: number; month: number };
type Value = { start: Month; end: Month };

const MONTH = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
});

function format(month: Month): string {
    return MONTH.format(new Date(month.year, month.month - 1));
}

// A season of months: two choices in the popup make the range, the months
// between the Calendar's band; the form submits the interval
// (`2027-04/2027-09`).
export default function MonthRangePickerDemo() {
    const [value, setValue] = useState<Value | null>({
        start: { year: 2027, month: 4 },
        end: { year: 2027, month: 9 },
    });
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Field.Root className="max-w-xs">
                <Field.Label id="month-range-picker-label">Season</Field.Label>
                <MonthRangePicker.Root
                    value={value}
                    onValueChange={setValue}
                    name="month-range-picker"
                >
                    <MonthRangePicker.Trigger
                        id="month-range-picker-trigger"
                        aria-labelledby="month-range-picker-label month-range-picker-trigger"
                    >
                        {value ? (
                            `${format(value.start)} – ${format(value.end)}`
                        ) : (
                            <span className="text-palette-accent/85">Pick</span>
                        )}
                    </MonthRangePicker.Trigger>
                    <MonthRangePicker.Content aria-label="Choose season">
                        <MonthRangeCalendar.Template.Simple />
                    </MonthRangePicker.Content>
                </MonthRangePicker.Root>
            </Field.Root>
        </div>
    );
}

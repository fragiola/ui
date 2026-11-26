"use client";

import { useState } from "react";
import { Field } from "#/components/ui/field";
import { MonthCalendar } from "#/components/ui/month-calendar";
import { MonthPicker } from "#/components/ui/month-picker";

type Value = { year: number; month: number };

const MONTH = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
});

// A billing month: the trigger opens a page of months, a choice sets the
// month, closes the popup and returns the focus to the trigger. The form
// submits `2026-10`.
export default function MonthPickerDemo() {
    const [value, setValue] = useState<Value | null>({ year: 2026, month: 10 });
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Field.Root className="max-w-xs">
                <Field.Label id="month-picker-label">Billing month</Field.Label>
                <MonthPicker.Root
                    value={value}
                    onValueChange={setValue}
                    name="month-picker"
                >
                    <MonthPicker.Trigger
                        id="month-picker-trigger"
                        aria-labelledby="month-picker-label month-picker-trigger"
                    >
                        {value ? (
                            MONTH.format(new Date(value.year, value.month - 1))
                        ) : (
                            <span className="text-palette-accent/85">Pick</span>
                        )}
                    </MonthPicker.Trigger>
                    <MonthPicker.Content aria-label="Choose billing month">
                        <MonthCalendar.Template.Simple />
                    </MonthPicker.Content>
                </MonthPicker.Root>
            </Field.Root>
        </div>
    );
}

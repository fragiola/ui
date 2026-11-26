"use client";

import { useState } from "react";
import { Field } from "#/components/ui/field";
import { YearCalendar } from "#/components/ui/year-calendar";
import { YearPicker } from "#/components/ui/year-picker";

type Value = { year: number };

// A car's model year: the trigger opens a page of 12 years, a choice sets
// the year and closes the popup. The form submits `2024`.
export default function YearPickerDemo() {
    const [value, setValue] = useState<Value | null>({ year: 2024 });
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Field.Root className="max-w-xs">
                <Field.Label id="year-picker-label">Model year</Field.Label>
                <YearPicker.Root
                    value={value}
                    onValueChange={setValue}
                    name="year-picker"
                >
                    <YearPicker.Trigger
                        id="year-picker-trigger"
                        aria-labelledby="year-picker-label year-picker-trigger"
                    >
                        {value ? (
                            String(value.year)
                        ) : (
                            <span className="text-palette-accent/85">Pick</span>
                        )}
                    </YearPicker.Trigger>
                    <YearPicker.Content aria-label="Choose model year">
                        <YearCalendar.Template.Simple />
                    </YearPicker.Content>
                </YearPicker.Root>
            </Field.Root>
        </div>
    );
}

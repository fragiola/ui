"use client";

import { useState } from "react";
import { Field } from "#/components/ui/field";
import { YearRangeCalendar } from "#/components/ui/year-range-calendar";
import { YearRangePicker } from "#/components/ui/year-range-picker";

type Value = { start: { year: number }; end: { year: number } };

// A span of seasons: two choices in the popup make the range of years; the
// form submits the interval (`2019/2023`).
export default function YearRangePickerDemo() {
    const [value, setValue] = useState<Value | null>({
        start: { year: 2019 },
        end: { year: 2023 },
    });
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Field.Root className="max-w-xs">
                <Field.Label id="year-range-picker-label">Seasons</Field.Label>
                <YearRangePicker.Root
                    value={value}
                    onValueChange={setValue}
                    name="year-range-picker"
                >
                    <YearRangePicker.Trigger
                        id="year-range-picker-trigger"
                        aria-labelledby="year-range-picker-label year-range-picker-trigger"
                    >
                        {value ? (
                            `${value.start.year} – ${value.end.year}`
                        ) : (
                            <span className="text-palette-accent/85">Pick</span>
                        )}
                    </YearRangePicker.Trigger>
                    <YearRangePicker.Content aria-label="Choose seasons">
                        <YearRangeCalendar.Template.Simple />
                    </YearRangePicker.Content>
                </YearRangePicker.Root>
            </Field.Root>
        </div>
    );
}

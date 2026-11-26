"use client";

import { useState } from "react";
import { CalendarPreset } from "#/components/ui/calendar-preset";
import { DateRangePicker } from "#/components/ui/date-range-picker";
import { Field } from "#/components/ui/field";
import { RangeCalendar } from "#/components/ui/range-calendar";

type PlainDate = { year: number; month: number; day: number };
type DateRange = { start: PlainDate; end: PlainDate };

function fromDate(date: Date): PlainDate {
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
    };
}

function addDays(date: PlainDate, days: number): PlainDate {
    return fromDate(new Date(date.year, date.month - 1, date.day + days));
}

const SHORT = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
});

function format(date: PlainDate): string {
    return SHORT.format(new Date(date.year, date.month - 1, date.day));
}

const PRESETS: { label: string; value: (today: PlainDate) => DateRange }[] = [
    { label: "Last 7 days", value: (t) => ({ start: addDays(t, -6), end: t }) },
    {
        label: "Last 30 days",
        value: (t) => ({ start: addDays(t, -29), end: t }),
    },
    {
        label: "Last 90 days",
        value: (t) => ({ start: addDays(t, -89), end: t }),
    },
];

// A report's range, Untitled UI's layout: the presets beside a two-month
// range calendar in the popup. The second date (or a preset) sets the range,
// closes the popup and returns the focus to the trigger, which shows the
// range.
export default function DateRangePickerDemo() {
    const [range, setRange] = useState<DateRange | null>(() => {
        const today = fromDate(new Date());
        return { start: addDays(today, -6), end: today };
    });
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Field.Root className="max-w-xs">
                <Field.Label id="period-label">Period</Field.Label>
                <DateRangePicker.Root
                    value={range}
                    onValueChange={setRange}
                    name="period"
                >
                    <DateRangePicker.Trigger
                        id="period-trigger"
                        aria-labelledby="period-label period-trigger"
                    >
                        {range ? (
                            `${format(range.start)} – ${format(range.end)}`
                        ) : (
                            <span className="text-palette-accent/85">
                                Pick a period
                            </span>
                        )}
                    </DateRangePicker.Trigger>
                    <DateRangePicker.Content aria-label="Choose period">
                        <RangeCalendar.Root
                            visibleMonths={2}
                            className="flex-row items-start gap-6"
                        >
                            <CalendarPreset.List aria-label="Presets">
                                {PRESETS.map((preset) => (
                                    <CalendarPreset.Item
                                        key={preset.label}
                                        value={preset.value}
                                    >
                                        {preset.label}
                                    </CalendarPreset.Item>
                                ))}
                            </CalendarPreset.List>
                            <RangeCalendar.Months>
                                {[0, 1].map((offset) => (
                                    <RangeCalendar.Month key={offset}>
                                        <RangeCalendar.Header>
                                            {offset === 0 ? (
                                                <RangeCalendar.PrevButton />
                                            ) : null}
                                            <RangeCalendar.Heading
                                                offset={offset}
                                            />
                                            {offset === 1 ? (
                                                <RangeCalendar.NextButton />
                                            ) : null}
                                        </RangeCalendar.Header>
                                        <RangeCalendar.Grid offset={offset} />
                                    </RangeCalendar.Month>
                                ))}
                            </RangeCalendar.Months>
                        </RangeCalendar.Root>
                    </DateRangePicker.Content>
                </DateRangePicker.Root>
            </Field.Root>
        </div>
    );
}

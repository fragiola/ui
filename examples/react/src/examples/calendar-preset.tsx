"use client";

import { useState } from "react";
import { CalendarPreset } from "#/components/ui/calendar-preset";
import { RangeCalendar } from "#/components/ui/range-calendar";

type PlainDate = { year: number; month: number; day: number };
type DateRange = { start: PlainDate; end: PlainDate };

// Dates are plain `{ year, month, day }` values, with no time zone.
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

// A preset's value is a date, a range, or a function of today returning one
// (read when it renders and when it is pressed).
const PRESETS: { label: string; value: (today: PlainDate) => DateRange }[] = [
    { label: "Today", value: (today) => ({ start: today, end: today }) },
    {
        label: "Yesterday",
        value: (today) => ({
            start: addDays(today, -1),
            end: addDays(today, -1),
        }),
    },
    {
        label: "Last 7 days",
        value: (today) => ({ start: addDays(today, -6), end: today }),
    },
    {
        label: "Last 30 days",
        value: (today) => ({ start: addDays(today, -29), end: today }),
    },
    {
        label: "This month",
        value: (today) => ({ start: { ...today, day: 1 }, end: today }),
    },
];

// An analytics range in Untitled UI's layout: the presets in a column beside
// the calendar. A press sets the range and shows it; the preset whose range
// is the calendar's is `selected` (`soft`, `contrast` text).
export default function CalendarPresetDemo() {
    const [range, setRange] = useState<DateRange | null>(() => {
        const today = fromDate(new Date());
        return { start: addDays(today, -6), end: today };
    });
    return (
        <div className="palette-surface flex w-full flex-col gap-4 bg-palette-base text-palette-contrast">
            <RangeCalendar.Root
                value={range}
                onValueChange={setRange}
                className="flex-row flex-wrap items-start gap-6"
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
                <RangeCalendar.Month>
                    <RangeCalendar.Header>
                        <RangeCalendar.PrevButton />
                        <RangeCalendar.Heading />
                        <RangeCalendar.NextButton />
                    </RangeCalendar.Header>
                    <RangeCalendar.Grid />
                </RangeCalendar.Month>
            </RangeCalendar.Root>
            <p className="text-sm text-palette-accent/85">
                {range
                    ? `${format(range.start)} – ${format(range.end)}`
                    : "Choose a range or a preset."}
            </p>
        </div>
    );
}

"use client";

import { type ReactNode, useState } from "react";
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

function nights(range: DateRange): number {
    const start = new Date(
        range.start.year,
        range.start.month - 1,
        range.start.day,
    );
    const end = new Date(range.end.year, range.end.month - 1, range.end.day);
    return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

const TODAY = fromDate(new Date());

const SHORT = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
});

function format(date: PlainDate): string {
    return SHORT.format(new Date(date.year, date.month - 1, date.day));
}

// A stay in the default look: check-in and check-out across two months. The
// ends are `checked` (the `ring` box) and the nights between are one `soft`
// band joined to them, rounded at a week's ends; while a new range is being
// chosen, the half-`soft` preview follows the pointer. Then the same range
// right to left, where the band joins the other way.
export default function RangeCalendarDemo() {
    const [range, setRange] = useState<DateRange | null>({
        start: addDays(TODAY, 5),
        end: addDays(TODAY, 12),
    });
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex flex-col gap-3">
                <RangeCalendar.Template.Simple
                    visibleMonths={2}
                    value={range}
                    onValueChange={setRange}
                    min={TODAY}
                />
                <p className="text-sm text-palette-accent/85">
                    {range
                        ? `${format(range.start)} – ${format(range.end)}, ${nights(range)} nights`
                        : "Choose check-in, then check-out."}
                </p>
            </div>

            <Row label="rtl">
                <div dir="rtl" lang="he-IL">
                    <RangeCalendar.Template.Simple
                        locale="he-IL"
                        defaultValue={{
                            start: addDays(TODAY, 2),
                            end: addDays(TODAY, 9),
                        }}
                    />
                </div>
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
            <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
                {children}
            </div>
        </div>
    );
}

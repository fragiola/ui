"use client";

import { useState } from "react";
import { MonthRangeCalendar } from "#/components/ui/month-range-calendar";

type PlainYearMonth = { year: number; month: number };
type MonthRange = { start: PlainYearMonth; end: PlainYearMonth };

const YEAR = new Date().getFullYear();

const SHORT = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
});

function format(month: PlainYearMonth): string {
    return SHORT.format(new Date(month.year, month.month - 1));
}

// A report's period in the default look: the first choice starts the range,
// the second ends it. The ends are `checked` and the months between are the
// Calendar's `soft` band, joined to them and rounded at a row's ends.
export default function MonthRangeCalendarDemo() {
    const [range, setRange] = useState<MonthRange | null>({
        start: { year: YEAR, month: 2 },
        end: { year: YEAR, month: 7 },
    });
    return (
        <div className="palette-surface flex w-full flex-wrap items-start gap-8 bg-palette-base text-palette-contrast">
            <MonthRangeCalendar.Template.Simple
                value={range}
                onValueChange={setRange}
            />
            <div className="flex max-w-56 flex-col gap-1 pt-1">
                <span className="text-sm font-medium">Report period</span>
                <p className="text-sm text-palette-accent/85">
                    {range
                        ? `${format(range.start)} – ${format(range.end)}`
                        : "Choose the first month, then the last."}
                </p>
            </div>
        </div>
    );
}

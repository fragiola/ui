"use client";

import { useState } from "react";
import { YearRangeCalendar } from "#/components/ui/year-range-calendar";

type PlainYear = { year: number };
type YearRange = { start: PlainYear; end: PlainYear };

const THIS_YEAR = new Date().getFullYear();

// A chart's span in the default look: two choices make the range, the ends
// `checked`, the years between the Calendar's `soft` band; the years after
// this one are disabled (`max`).
export default function YearRangeCalendarDemo() {
    const [range, setRange] = useState<YearRange | null>({
        start: { year: THIS_YEAR - 6 },
        end: { year: THIS_YEAR - 1 },
    });
    return (
        <div className="palette-surface flex w-full flex-wrap items-start gap-8 bg-palette-base text-palette-contrast">
            <YearRangeCalendar.Template.Simple
                value={range}
                onValueChange={setRange}
                max={{ year: THIS_YEAR }}
            />
            <div className="flex max-w-56 flex-col gap-1 pt-1">
                <span className="text-sm font-medium">Revenue chart</span>
                <p className="text-sm text-palette-accent/85">
                    {range
                        ? `From ${range.start.year} to ${range.end.year}.`
                        : "Choose the first year, then the last."}
                </p>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { YearCalendar } from "#/components/ui/year-calendar";

type PlainYear = { year: number };

const THIS_YEAR = new Date().getFullYear();

// A graduation year in the default look: a page of 12 years (starting at a
// multiple of 12, so paging never shifts the rows), the chosen one
// `checked`, this year `current`, the years after it disabled (`max`).
export default function YearCalendarDemo() {
    const [year, setYear] = useState<PlainYear | null>({
        year: THIS_YEAR - 4,
    });
    return (
        <div className="palette-surface flex w-full flex-wrap items-start gap-8 bg-palette-base text-palette-contrast">
            <YearCalendar.Template.Simple
                value={year}
                onValueChange={setYear}
                max={{ year: THIS_YEAR }}
            />
            <div className="flex max-w-56 flex-col gap-1 pt-1">
                <span className="text-sm font-medium">Graduation</span>
                <p className="text-sm text-palette-accent/85">
                    {year ? `Class of ${year.year}.` : "Choose a year."}
                </p>
            </div>
        </div>
    );
}

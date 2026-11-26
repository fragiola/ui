"use client";

import { type ReactNode, useState } from "react";
import { Calendar } from "#/components/ui/calendar";
import { CalendarView } from "#/components/ui/calendar-view";

type PlainDate = { year: number; month: number; day: number };

const LONG = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

function format(date: PlainDate): string {
    return LONG.format(new Date(date.year, date.month - 1, date.day));
}

// A birth date, decades away from today: the heading is a button that goes
// up to the months, then to the years; a year goes back down to its months,
// a month to its days, and the date is chosen in the day grid. Then the year
// view on its own, where a page of years starts.
export default function CalendarViewDemo() {
    const [date, setDate] = useState<PlainDate | null>(null);
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex flex-wrap items-start gap-8">
                <Calendar.Root
                    value={date}
                    onValueChange={setDate}
                    max={{ year: 2010, month: 12, day: 31 }}
                >
                    <CalendarView.Template.Simple />
                </Calendar.Root>
                <div className="flex max-w-56 flex-col gap-1 pt-1">
                    <span className="text-sm font-medium">Birth date</span>
                    <p className="text-sm text-palette-accent/85">
                        {date
                            ? format(date)
                            : "Press the heading to choose a year first."}
                    </p>
                </div>
            </div>

            <Row label='defaultView="year"'>
                <Calendar.Root>
                    <CalendarView.Template.Simple defaultView="year" />
                </Calendar.Root>
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

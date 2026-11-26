"use client";

import { type ReactNode, useState } from "react";
import { Calendar } from "#/components/ui/calendar";

// The surface-tier palettes: the neutral surface with one chromatic ring, so
// only the chosen date and the focus ring take colour. Literal here because
// examples are published source (the code panel shows this file verbatim,
// with a copy button).
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

type PlainDate = { year: number; month: number; day: number };

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

function isWeekend(date: PlainDate): boolean {
    const day = new Date(date.year, date.month - 1, date.day).getDay();
    return day === 0 || day === 6;
}

const TODAY = fromDate(new Date());

// The first weekday at least `days` after today.
function weekdayAfter(days: number): PlainDate {
    let date = addDays(TODAY, days);
    while (isWeekend(date)) date = addDays(date, 1);
    return date;
}

const LONG = new Intl.DateTimeFormat("en-US", { dateStyle: "full" });

function format(date: PlainDate): string {
    return LONG.format(new Date(date.year, date.month - 1, date.day));
}

// A delivery date in the default look: the next 60 days, weekends
// unavailable (struck through, focusable, never chosen). The chosen date is
// `checked` (the `ring` box), today is `current`. Then the states a reader
// needs (two months side by side, a disabled calendar), and last the same
// calendar in each surface-ring palette: only the chosen date and the ring
// change.
export default function CalendarDemo() {
    const [date, setDate] = useState<PlainDate | null>(weekdayAfter(3));
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex flex-wrap items-start gap-8">
                <Calendar.Template.Simple
                    value={date}
                    onValueChange={setDate}
                    min={TODAY}
                    max={addDays(TODAY, 60)}
                    isDateUnavailable={isWeekend}
                />
                <div className="flex max-w-56 flex-col gap-1 pt-1">
                    <span className="text-sm font-medium">Delivery</span>
                    <p className="text-sm text-palette-accent/85">
                        {date
                            ? format(date)
                            : "Choose a weekday in the next 60 days."}
                    </p>
                </div>
            </div>

            <Row label="two months">
                <Calendar.Template.Simple
                    visibleMonths={2}
                    defaultValue={addDays(TODAY, 10)}
                />
            </Row>

            <Row label="disabled">
                <Calendar.Template.Simple defaultValue={TODAY} disabled />
            </Row>

            {/* the same calendar, only its palette-* class changed */}
            <Row label="palettes">
                {SURFACE_RING.map((palette) => (
                    <Calendar.Template.Simple
                        key={palette}
                        defaultValue={addDays(TODAY, 1)}
                        className={`palette-${palette}`}
                    />
                ))}
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

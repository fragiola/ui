"use client";

import { type ReactNode, useState } from "react";
import { MultipleCalendar } from "#/components/ui/multiple-calendar";

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

const TODAY = fromDate(new Date());

const SHORT = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
});

function format(date: PlainDate): string {
    return SHORT.format(new Date(date.year, date.month - 1, date.day));
}

// Days off in the default look: a press, Enter or Space toggles a date, and
// each chosen date is `checked` (the `ring` box) on its own — two chosen
// neighbours are two boxes, never a range. Then the cap a reader needs:
// `maxSelected` refuses a fourth date until one is removed.
export default function MultipleCalendarDemo() {
    const [days, setDays] = useState<PlainDate[]>([
        addDays(TODAY, 2),
        addDays(TODAY, 3),
        addDays(TODAY, 9),
    ]);
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex flex-wrap items-start gap-8">
                <MultipleCalendar.Template.Simple
                    value={days}
                    onValueChange={setDays}
                    min={TODAY}
                    name="days-off"
                />
                <div className="flex max-w-56 flex-col gap-1 pt-1">
                    <span className="text-sm font-medium">
                        Days off ({days.length})
                    </span>
                    <p className="text-sm text-palette-accent/85">
                        {days.length
                            ? days.map(format).join(", ")
                            : "Choose the days you will be away."}
                    </p>
                </div>
            </div>

            <Row label="maxSelected={3}">
                <MultipleCalendar.Template.Simple
                    maxSelected={3}
                    defaultValue={[
                        addDays(TODAY, 1),
                        addDays(TODAY, 4),
                        addDays(TODAY, 6),
                    ]}
                />
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

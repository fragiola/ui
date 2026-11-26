"use client";

import { type ReactNode, useState } from "react";
import { MonthCalendar } from "#/components/ui/month-calendar";

type PlainYearMonth = { year: number; month: number };

const NOW = new Date();
const THIS_MONTH: PlainYearMonth = {
    year: NOW.getFullYear(),
    month: NOW.getMonth() + 1,
};

const LONG = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
});

// A billing month in the default look: the months of a year in three
// columns, the chosen one `checked`, this month `current`, the months after
// it disabled (`max`). Then the cells a reader needs: four columns, and a
// month that cannot be chosen (`isUnavailable`, struck through).
export default function MonthCalendarDemo() {
    const [month, setMonth] = useState<PlainYearMonth | null>({
        ...THIS_MONTH,
        month: THIS_MONTH.month === 1 ? 1 : THIS_MONTH.month - 1,
    });
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex flex-wrap items-start gap-8">
                <MonthCalendar.Template.Simple
                    value={month}
                    onValueChange={setMonth}
                    max={THIS_MONTH}
                />
                <div className="flex max-w-56 flex-col gap-1 pt-1">
                    <span className="text-sm font-medium">Invoice</span>
                    <p className="text-sm text-palette-accent/85">
                        {month
                            ? `Billed for ${LONG.format(new Date(month.year, month.month - 1))}.`
                            : "Choose a month."}
                    </p>
                </div>
            </div>

            <Row label="columns={4}, isUnavailable">
                <MonthCalendar.Template.Simple
                    columns={4}
                    isUnavailable={(item: PlainYearMonth) => item.month === 8}
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

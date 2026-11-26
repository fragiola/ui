"use client";

import { type ReactNode, useState } from "react";
import { Calendar } from "#/components/ui/calendar";
import { CalendarView } from "#/components/ui/calendar-view";
import { DatePicker } from "#/components/ui/date-picker";
import { Field } from "#/components/ui/field";

// The surface-tier palettes: the neutral surface with one chromatic ring, so
// only the trigger's focus ring and the chosen date take colour. Literal here
// because examples are published source (the code panel shows this file
// verbatim, with a copy button).
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

type PlainDate = { year: number; month: number; day: number };

function fromDate(date: Date): PlainDate {
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
    };
}

const TODAY = fromDate(new Date());

const LONG = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

// A due date in the default look: `DatePicker.Template.Simple`, a field row
// that opens a calendar in the `popup.content` overlay. The calendar takes
// the focus on the value; a choice closes the popup and returns the focus to
// the trigger. The trigger is named by its label and its own value
// (`aria-labelledby`). Then the picker composed from its parts, with a
// CalendarView in the popup for a date far away, a disabled picker, and the
// same picker in each surface-ring palette.
export default function DatePickerDemo() {
    const [due, setDue] = useState<PlainDate | null>(null);
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Field.Root className="max-w-xs">
                <Field.Label id="due-label">Due date</Field.Label>
                <DatePicker.Template.Simple
                    id="due-trigger"
                    aria-labelledby="due-label due-trigger"
                    value={due}
                    onValueChange={setDue}
                    min={TODAY}
                    name="due"
                />
                <Field.Description>
                    {due
                        ? `Due ${LONG.format(new Date(due.year, due.month - 1, due.day))}.`
                        : "The task has no due date yet."}
                </Field.Description>
            </Field.Root>

            <Row label="parts, with views">
                <DatePicker.Root
                    defaultValue={{ year: 1990, month: 6, day: 14 }}
                >
                    <DatePicker.Trigger
                        aria-label="Birth date"
                        className="w-56"
                    >
                        June 14, 1990
                    </DatePicker.Trigger>
                    <DatePicker.Content aria-label="Choose birth date">
                        <Calendar.Root>
                            <CalendarView.Template.Simple />
                        </Calendar.Root>
                    </DatePicker.Content>
                </DatePicker.Root>
                <DatePicker.Template.Simple
                    aria-label="Start date, disabled"
                    className="w-56"
                    defaultValue={TODAY}
                    disabled
                />
            </Row>

            {/* the same picker, only its palette-* class changed */}
            <Row label="palettes">
                {SURFACE_RING.map((palette) => (
                    <div key={palette} className={`palette-${palette}`}>
                        <DatePicker.Template.Simple
                            aria-label={`Date, ${palette}`}
                            className="w-44"
                            defaultValue={TODAY}
                        />
                    </div>
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
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {children}
            </div>
        </div>
    );
}

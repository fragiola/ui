"use client";

import { CalendarView as CalendarViewPrimitive } from "@fragiola/primitives-react/calendar-view";
import { ChevronDownIcon } from "lucide-react";
import type * as React from "react";
import { calendar } from "#/families/calendar";
import { cn } from "#/lib/cn";
import type { PrimitivesProps } from "#/lib/primitives-backed";
import { Calendar, calendarParts } from "#/ui/calendar";
import { MonthCalendar } from "#/ui/month-calendar";
import { YearCalendar } from "#/ui/year-calendar";

// CalendarView — a day calendar's grid switched between days, months and
// years (spec/month-calendar.md, "Views"): the Trigger goes one view up, a
// choice in a view goes back down to it (navigation only: the value is
// chosen in the day grid), and the new view's focused cell takes the focus.
// It goes inside a Calendar, RangeCalendar or MultipleCalendar Root, inline
// or in a picker's popup.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// calendar, so this one shared file wraps Fragiola Primitives' on every
// base.
//
//   Root      the view state, no element; its children see the view
//   Trigger   the heading as a button (`calendar.viewTrigger`), with a
//             chevron; put the view's Heading in it, rendered as a span
//   Template.Simple  the three views: the day grid with the page buttons,
//             the month calendar, the year calendar, each headed by the
//             Trigger. Behaviour props (`view`, `defaultView`,
//             `onViewChange`) are forwarded.

function CalendarViewTrigger({
    className,
    children,
    ...props
}: PrimitivesProps<typeof CalendarViewPrimitive.Trigger, "button">) {
    return (
        <CalendarViewPrimitive.Trigger
            data-slot="calendar-view-trigger"
            className={cn(calendar.viewTrigger(), className as string)}
            {...props}
        >
            {children}
            <ChevronDownIcon
                aria-hidden="true"
                className="in-data-[view=year]:hidden"
            />
        </CalendarViewPrimitive.Trigger>
    );
}

type RootProps = React.ComponentProps<typeof CalendarViewPrimitive.Root>;

/** The three views, each headed by the Trigger holding its heading. */
function CalendarViewTemplateSimple({ children, ...props }: RootProps) {
    return (
        <CalendarViewPrimitive.Root {...props}>
            {(state: { view: "day" | "month" | "year" }) => (
                <>
                    {state.view === "day" ? (
                        <calendarParts.Month>
                            <calendarParts.Header>
                                <Calendar.PrevButton />
                                <CalendarViewTrigger>
                                    <Calendar.Heading render={<span />} />
                                </CalendarViewTrigger>
                                <Calendar.NextButton />
                            </calendarParts.Header>
                            <Calendar.Grid />
                        </calendarParts.Month>
                    ) : state.view === "month" ? (
                        <MonthCalendar.Root>
                            <calendarParts.Month>
                                <calendarParts.Header>
                                    <MonthCalendar.PrevButton />
                                    <CalendarViewTrigger>
                                        <MonthCalendar.Heading
                                            render={<span />}
                                        />
                                    </CalendarViewTrigger>
                                    <MonthCalendar.NextButton />
                                </calendarParts.Header>
                                <MonthCalendar.Grid />
                            </calendarParts.Month>
                        </MonthCalendar.Root>
                    ) : (
                        <YearCalendar.Root>
                            <calendarParts.Month>
                                <calendarParts.Header>
                                    <YearCalendar.PrevButton />
                                    <CalendarViewTrigger>
                                        <YearCalendar.Heading
                                            render={<span />}
                                        />
                                    </CalendarViewTrigger>
                                    <YearCalendar.NextButton />
                                </calendarParts.Header>
                                <YearCalendar.Grid />
                            </calendarParts.Month>
                        </YearCalendar.Root>
                    )}
                    {typeof children === "function"
                        ? children(state)
                        : children}
                </>
            )}
        </CalendarViewPrimitive.Root>
    );
}

export const CalendarView = {
    Root: CalendarViewPrimitive.Root,
    Trigger: CalendarViewTrigger,
    Template: { Simple: CalendarViewTemplateSimple },
};

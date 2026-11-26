// .tsx without JSX, on purpose: `ui/calendar.tsx` has the same basename, and
// after installing, the shadcn CLI re-resolves `@/components/families/calendar`
// by basename and prefers .tsx over .ts (families/field.tsx says why).
//
// Family `calendar` — every calendar's grid: the day grid (Calendar,
// RangeCalendar, MultipleCalendar), the month and year grids (MonthCalendar,
// YearCalendar and their ranges), the presets and the view trigger. The
// pickers put these grids in a `popup.content`; the date fields are the
// `field` family's (segments).
//
// Origin: Untitled UI's date picker (`calendar.tsx`, `cell.tsx`,
// `range-calendar.tsx`) for the anatomy and the density only. The look is
// the visual language's (docs/visual-language.md): every state of a cell is
// a foundation member, never a class of its own.
//
// ─── A CELL IS TWO ELEMENTS ─────────────────────────────────────────────────
// The primitive's cell (`td`, role="gridcell") is the focus target and the
// range's ground; inside it, the `item` is the date's box, which carries the
// states. The wrapper (ui/calendar.tsx) reads the cell's state and gives the
// item the foundation's own attributes, so the members key on what they
// always key on:
//
//   state                        item attribute     member
//   chosen (a date, a range end) data-checked       foundation.checked (ring)
//   today, not chosen            data-active        foundation.current
//   disabled, unavailable, or
//   outside the shown month      data-disabled      foundation.disabled
//   none of these                (the hover)        foundation.hover
//
// A range's middle is a `band` behind the items: one `soft` strip through
// the cells, from the start's centre to the end's, rounded at a week's ends.
// It is drawn with logical insets (`start-1/2`, `rounded-s-*`), so it joins
// the same way in RTL. While a new range is being chosen, the committed band
// hides and the `preview` band (half of `soft`) follows the pointer or the
// focus.
//
// Focus is `focusInset` on the cell: the grid packs its cells, so the ring is
// drawn inside, following the cell's control radius (a circle at
// `data-radius="full"`).
//
// Zero variants, like every family.

import { tv } from "tailwind-variants";
import { foundation } from "./foundation";

// root — the calendar: its months (or its page) and, beside them, presets.
// `group/calendar` lets a committed band hide while a preview exists.
const root = tv({
    base: "group/calendar flex w-fit flex-col gap-4 text-sm text-palette-contrast",
});

// months — the visible months side by side, wrapping on a narrow frame.
const months = tv({
    base: "flex flex-wrap items-start gap-x-8 gap-y-4",
});

// month — one month: its header above its grid.
const month = tv({
    base: "flex flex-col gap-3",
});

// header — the heading centred between the page buttons, which sit at the
// header's inline ends (`prev` and `next`).
const header = tv({
    base: "relative flex h-8 items-center justify-center px-9",
});

// heading — the month and year (or the year, or the page of years).
const heading = tv({
    base: "text-sm font-semibold text-palette-contrast",
});

// prev / next — where the page buttons sit in the header.
const prev = tv({ base: "absolute inset-y-0 start-0 my-auto" });
const next = tv({ base: "absolute inset-y-0 end-0 my-auto" });

// grid — the table. Rows are 2px apart, so two weeks of one range read as
// two strips; cells touch, so a week's band is one.
const grid = tv({
    base: "border-separate border-spacing-x-0 border-spacing-y-0.5",
});

// headerCell — a weekday's short name, secondary text.
const headerCell = tv({
    base: [
        foundation.secondary(),
        "h-8 w-9 p-0 text-center text-xs font-normal",
    ],
});

// cell — one date: the focus target and the band's ground. Square, the
// control's height (9 steps of the spacing scale) and its radius.
const cell = tv({
    base: [
        foundation.focusInset(),
        `
        group/cell relative size-9 p-0 text-center align-middle
        rounded-control
        `,
    ],
});

// monthCell — one month or year: the cell of a 3-column page, wider than a
// day, the control's height.
const monthCell = tv({
    base: [
        foundation.focusInset(),
        "group/cell relative h-control w-20 p-0 text-center align-middle rounded-control",
    ],
});

// item — the date's box inside a cell, carrying its states (above). A date
// of the 6-week grid outside its month cannot be chosen: it is `disabled`
// and takes no other state.
const item = tv({
    base: [
        foundation.checked(),
        foundation.current(),
        foundation.disabled(),
        `
        relative flex size-full cursor-pointer select-none items-center
        justify-center rounded-control tabular-nums
        transition-colors duration-150
        data-unavailable:line-through
        `,
    ],
});

// band — a range's middle: `soft` through the cell, from the start's centre
// (`data-edge="start"`) to the end's (`data-edge="end"`), rounded at a
// week's inline ends. It hides while a new range is previewed.
const band = tv({
    base: `
        pointer-events-none absolute inset-y-0 inset-x-0 bg-palette-soft
        data-[edge=start]:start-1/2 data-[edge=end]:end-1/2
        group-first/cell:rounded-s-control group-last/cell:rounded-e-control
        group-has-data-range-preview/calendar:hidden
    `,
});

// preview — the range being chosen, from its first date to the pointer or
// the focus: half of `soft`, so it never reads as the committed range.
const preview = tv({
    base: `
        pointer-events-none absolute inset-0 bg-palette-soft/50
        group-first/cell:rounded-s-control group-last/cell:rounded-e-control
    `,
});

// presets — a column of presets beside a calendar (Untitled's range picker
// layout): `presets` holds them, `preset` is one. The preset whose value is
// the calendar's is `selected` (the primitive's `data-selected`).
const presets = tv({
    base: "flex min-w-32 flex-col gap-0.5",
});

const preset = tv({
    base: [
        foundation.hover(),
        foundation.selected(),
        foundation.focus(),
        foundation.disabled(),
        `
        flex h-8 w-full cursor-pointer items-center rounded-control px-3
        text-start text-sm text-palette-accent transition-colors duration-150
        `,
    ],
});

// viewTrigger — the heading as a button that goes one view up (days →
// months → years). In the year view it is disabled and stays a heading.
const viewTrigger = tv({
    base: [
        foundation.hover(),
        foundation.focus(),
        `
        inline-flex h-8 cursor-pointer items-center gap-1 rounded-control px-2
        text-sm font-semibold text-palette-contrast transition-colors duration-150
        disabled:cursor-default disabled:bg-transparent
        [&_svg:not([class*='size-'])]:size-icon-sm [&_svg]:text-palette-accent/85
        `,
    ],
});

export const calendar = {
    root,
    months,
    month,
    header,
    heading,
    prev,
    next,
    grid,
    headerCell,
    cell,
    monthCell,
    item,
    band,
    preview,
    presets,
    preset,
    viewTrigger,
};

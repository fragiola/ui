"use client";

import { DatePicker as DatePickerPrimitive } from "@fragiola/primitives-react/date-picker";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { field } from "#/families/field";
import { foundation } from "#/families/foundation";
import { popup } from "#/families/popup";
import { POSITIONER_DEFAULTS } from "#/lib/base";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";
import { Calendar } from "#/ui/calendar";

// DatePicker — a trigger and a popup holding a calendar (spec/calendar.md):
// the trigger opens a non-modal dialog whose calendar takes the focus on the
// value (else today); a choice sets the value, closes the popup and returns
// the focus to the trigger, as Escape and Tab out do. A Calendar rendered in
// the popup without a value of its own binds to the picker. `name` submits
// the value (ISO 8601); `required`, `disabled` and `readOnly` are a form
// control's.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no date
// picker, so this one shared file wraps Fragiola Primitives' on every base.
// `pickerParts.create` writes Trigger and Content once over an injected
// namespace: DateRangePicker, the month and year pickers and the typed
// pickers use the same parts with their own Root.
//
//   Root      the picker's state, no element
//   Trigger   a field row as a button (`field.row` with the `field-control`
//             marker, as the select trigger): a calendar icon, then the
//             consumer's content (the formatted value, or a placeholder)
//   Content   the popup: Portal, Positioner and Popup in one, the
//             `popup.content` overlay (no surface of its own), below the
//             trigger at its start; name it (`aria-label="Choose date"`)
//   Template.Simple  the common date picker: the trigger showing the value
//             (or `placeholder`) and a bound Calendar in the popup.

type Part = React.ElementType;

type P = typeof DatePickerPrimitive;

type PositionerProps = Pick<
    PrimitivesProps<P["Positioner"], "div">,
    | "side"
    | "align"
    | "sideOffset"
    | "alignOffset"
    | "collisionPadding"
    | "anchor"
>;

/** A picker's trigger: a field row that opens the popup. */
function triggerClass(className: unknown): string {
    return cn(
        field.row(),
        `
        field-control min-h-control cursor-pointer flex-nowrap items-center
        gap-2 px-3 text-start
        [&_svg:not([class*='size-'])]:size-icon
        `,
        className as string,
    );
}

/**
 * The popup's focus, once it has opened. The bound calendar focuses its date
 * while it mounts, a layout effect that runs before the popup registers as
 * an overlay; inside Fragiola Primitives' own Dialog, the dialog's focus trap
 * takes that focus back (to its first tabbable) — a primitive's ordering,
 * which the UI absorbs here (Base UI's dialog keeps it). A frame later, the
 * popup is a layer of the dialog: if the focus is not in it, it goes to the
 * grid's focused cell, where the spec puts it. A hidden mark inside the
 * popup does it on mount (a ref on the Popup itself would be merged anew on
 * every render, restarting its overlay session).
 */
function FocusSettler() {
    const mark = React.useRef<HTMLSpanElement>(null);
    React.useEffect(() => {
        const popup = mark.current?.parentElement;
        const view = popup?.ownerDocument.defaultView;
        if (!popup || !view) return undefined;
        const frame = view.requestAnimationFrame(() => {
            const active = popup.ownerDocument.activeElement;
            if (popup.closest("[hidden]")) return;
            if (active && popup.contains(active)) return;
            popup
                .querySelector<HTMLElement>('[role="gridcell"][tabindex="0"]')
                ?.focus({ preventScroll: true });
        });
        return () => view.cancelAnimationFrame(frame);
    }, []);
    return <span ref={mark} hidden />;
}

/** The styled Trigger and Content over a picker namespace's parts. */
function createPickerParts(
    N: { Trigger: Part; Portal: Part; Positioner: Part; Popup: Part },
    slot: string,
) {
    const Primitive = N as unknown as Pick<
        P,
        "Trigger" | "Portal" | "Positioner" | "Popup"
    >;

    function Trigger({
        className,
        children,
        ...props
    }: PrimitivesProps<P["Trigger"], "button">) {
        return (
            <Primitive.Trigger
                data-slot={`${slot}-trigger`}
                className={triggerClass(className)}
                {...props}
            >
                <CalendarIcon
                    aria-hidden="true"
                    className={foundation.secondary()}
                />
                <span className="min-w-0 flex-1 truncate">{children}</span>
            </Primitive.Trigger>
        );
    }

    function Content({
        className,
        side,
        align = "start",
        sideOffset = 4,
        alignOffset,
        collisionPadding,
        anchor,
        children,
        ...props
    }: PrimitivesProps<P["Popup"], "div"> & PositionerProps) {
        return (
            <Primitive.Portal>
                <Primitive.Positioner
                    {...POSITIONER_DEFAULTS}
                    className="z-50 outline-none"
                    side={side}
                    align={align}
                    sideOffset={sideOffset}
                    alignOffset={alignOffset}
                    {...(collisionPadding === undefined
                        ? {}
                        : { collisionPadding })}
                    anchor={anchor}
                >
                    <Primitive.Popup
                        data-slot={`${slot}-content`}
                        className={cn(
                            popup.content(),
                            "z-50 w-auto p-3 outline-none",
                            className as string,
                        )}
                        {...props}
                    >
                        {children}
                        <FocusSettler />
                    </Primitive.Popup>
                </Primitive.Positioner>
            </Primitive.Portal>
        );
    }

    return { Trigger, Content };
}

const parts = createPickerParts(DatePickerPrimitive, "date-picker");

function DatePickerRoot(props: React.ComponentProps<P["Root"]>) {
    return (
        <PrimitivesDirection>
            <DatePickerPrimitive.Root {...props} />
        </PrimitivesDirection>
    );
}

type PlainDate = { year: number; month: number; day: number };

/**
 * A date in the calendar's locale (`Intl`, medium style): the picker's
 * `locale`, else the document's `lang` once mounted (`en-US` on a server and
 * its hydration, as the calendar). Written in UTC, so years 0–99 stay
 * themselves. With a `calendar` system, compose the trigger yourself.
 */
function formatDate(date: PlainDate, locale: string): string {
    const at = new Date(Date.UTC(2000, date.month - 1, date.day));
    at.setUTCFullYear(date.year);
    return new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeZone: "UTC",
    }).format(at);
}

/** The document's `lang`, read once mounted (none on a server). */
function useDocumentLang(): string | undefined {
    const [lang, setLang] = React.useState<string | undefined>(undefined);
    React.useEffect(() => {
        setLang(document.documentElement.lang || undefined);
    }, []);
    return lang;
}

/**
 * The common date picker: the trigger shows the value (or `placeholder`),
 * the popup a bound Calendar. Every Root prop is forwarded; `className` goes
 * to the trigger, and so do its `id` and its name (`aria-labelledby`,
 * `aria-label`).
 */
function DatePickerTemplateSimple({
    className,
    placeholder = "Pick a date",
    id,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    onValueChange,
    ...props
}: React.ComponentProps<P["Root"]> & {
    className?: string;
    placeholder?: string;
    id?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
}) {
    const [own, setOwn] = React.useState<PlainDate | null>(
        props.defaultValue ?? null,
    );
    const shown = props.value !== undefined ? props.value : own;
    const lang = useDocumentLang();
    return (
        <DatePickerRoot
            onValueChange={(value, details) => {
                setOwn(value);
                onValueChange?.(value, details);
            }}
            {...props}
        >
            <parts.Trigger
                id={id}
                className={className}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledby}
            >
                {shown ? (
                    formatDate(shown, props.locale ?? lang ?? "en-US")
                ) : (
                    <span className={foundation.secondary()}>
                        {placeholder}
                    </span>
                )}
            </parts.Trigger>
            <parts.Content aria-label="Choose date">
                <Calendar.Template.Simple visibleMonths={props.visibleMonths} />
            </parts.Content>
        </DatePickerRoot>
    );
}

export const DatePicker = {
    Root: DatePickerRoot,
    Trigger: parts.Trigger,
    Content: parts.Content,
    Template: { Simple: DatePickerTemplateSimple },
};

// What the other pickers build on, in one export.
export const pickerParts = { create: createPickerParts, triggerClass };

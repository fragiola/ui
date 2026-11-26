"use client";

import { Editable as EditablePrimitive } from "@fragiola/primitives-react/editable";
import { CheckIcon, PencilIcon, XIcon } from "lucide-react";
import { clickable } from "#/atoms/clickable";
import { field } from "#/families/field";
import { foundation } from "#/families/foundation";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";

// Editable — a text shown as plain text that turns into a field to edit it
// in place (spec/editable.md): a focus, a press or a double press on the
// Preview (`activationMode`), or the EditTrigger, starts an edit with the
// text selected; Enter, leaving it or the SubmitTrigger commits
// (`submitMode`), Escape or the CancelTrigger reverts, and the focus
// returns to the EditTrigger, else the Preview. The Input is the form
// control (`name`, `required`, a form reset).
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// editable, so this one shared file wraps Fragiola Primitives' on every base.
//
// The look is the field's. The Area is the field's box (`field.row`), with a
// transparent stroke while the Preview shows: the text sits where the
// Input's value will, so starting an edit only draws the box around it.
//   Root           a row: the Area, then the triggers; dimmed when disabled
//   Area           the box (`field.row`), stroked only while editing; rings
//                  while the Input has the focus
//   Preview        the text (`accent`, the Input's value colour), the `hover` fill and the inset
//                  ring on the box's area; the placeholder is secondary text
//   Input          the bare control (`field.control`); name it (a
//                  `Field.Label`, a `<label for>` its `id`, or `aria-label`)
//   EditTrigger    a ghost square Clickable (a pencil), hidden while editing
//   SubmitTrigger  a ghost square Clickable (a check), shown while editing
//   CancelTrigger  a ghost square Clickable (a cross), shown while editing;
//                  name each trigger (`aria-label`)
//   Template.Simple  the Area with its Preview and Input, and the three
//                  triggers ("Edit", "Save", "Cancel").

type P = typeof EditablePrimitive;

function EditableRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <EditablePrimitive.Root
                data-slot="editable"
                className={cn(
                    foundation.disabled(),
                    "flex w-full min-w-0 items-start gap-1",
                    className as string,
                )}
                {...props}
            />
        </PrimitivesDirection>
    );
}

function EditableArea({
    className,
    ...props
}: PrimitivesProps<P["Area"], "div">) {
    return (
        <EditablePrimitive.Area
            data-slot="editable-area"
            className={cn(
                field.row(),
                "min-w-0 flex-1 not-data-editing:border-transparent",
                className as string,
            )}
            {...props}
        />
    );
}

function EditablePreview({
    className,
    ...props
}: PrimitivesProps<P["Preview"], "span">) {
    return (
        <EditablePrimitive.Preview
            data-slot="editable-preview"
            className={cn(
                foundation.hover(),
                foundation.focusInset(),
                `
                block min-h-control w-full min-w-0 cursor-text truncate
                px-3 py-2 text-sm text-palette-accent
                data-placeholder:text-palette-accent/85
                data-disabled:pointer-events-none data-readonly:pointer-events-none
                `,
                className as string,
            )}
            {...props}
        />
    );
}

function EditableInput({
    className,
    ...props
}: PrimitivesProps<P["Input"], "input">) {
    return (
        <EditablePrimitive.Input
            data-slot="editable-input"
            className={cn(field.control(), className as string)}
            {...props}
        />
    );
}

const trigger = () =>
    cn(
        clickable({ variant: "ghost", shape: "square" }),
        foundation.disabled(),
        foundation.secondary(),
        "shrink-0",
    );

function EditableEditTrigger({
    className,
    children,
    ...props
}: PrimitivesProps<P["EditTrigger"], "button">) {
    return (
        <EditablePrimitive.EditTrigger
            data-slot="editable-edit-trigger"
            className={cn(trigger(), className as string)}
            {...props}
        >
            {children ?? <PencilIcon />}
        </EditablePrimitive.EditTrigger>
    );
}

function EditableSubmitTrigger({
    className,
    children,
    ...props
}: PrimitivesProps<P["SubmitTrigger"], "button">) {
    return (
        <EditablePrimitive.SubmitTrigger
            data-slot="editable-submit-trigger"
            className={cn(trigger(), className as string)}
            {...props}
        >
            {children ?? <CheckIcon />}
        </EditablePrimitive.SubmitTrigger>
    );
}

function EditableCancelTrigger({
    className,
    children,
    ...props
}: PrimitivesProps<P["CancelTrigger"], "button">) {
    return (
        <EditablePrimitive.CancelTrigger
            data-slot="editable-cancel-trigger"
            className={cn(trigger(), className as string)}
            {...props}
        >
            {children ?? <XIcon />}
        </EditablePrimitive.CancelTrigger>
    );
}

/**
 * The common editable: the Area with its Preview and Input, then an
 * EditTrigger ("Edit"), a SubmitTrigger ("Save") and a CancelTrigger
 * ("Cancel"). Every Root prop is forwarded; `className` goes to the root.
 * `aria-label` and `aria-labelledby` name the Input (a `<label for>` names
 * it through the Root's `id`).
 */
function EditableTemplateSimple({
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...props
}: Omit<PrimitivesProps<P["Root"], "div">, "children">) {
    return (
        <EditableRoot {...props}>
            <EditableArea>
                <EditablePreview />
                <EditableInput
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledBy}
                />
            </EditableArea>
            <EditableEditTrigger aria-label="Edit" />
            <EditableSubmitTrigger aria-label="Save" />
            <EditableCancelTrigger aria-label="Cancel" />
        </EditableRoot>
    );
}

export const Editable = {
    Root: EditableRoot,
    Area: EditableArea,
    Preview: EditablePreview,
    Input: EditableInput,
    EditTrigger: EditableEditTrigger,
    SubmitTrigger: EditableSubmitTrigger,
    CancelTrigger: EditableCancelTrigger,
    Template: { Simple: EditableTemplateSimple },
};

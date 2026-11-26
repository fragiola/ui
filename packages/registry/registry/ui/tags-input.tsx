"use client";

import { TagsInput as TagsInputPrimitive } from "@fragiola/primitives-react/tags-input";
import { XIcon } from "lucide-react";
import { clickable } from "#/atoms/clickable";
import { chip } from "#/families/chip";
import { field } from "#/families/field";
import { foundation } from "#/families/foundation";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";

// TagsInput — a text input that turns what is typed into tags
// (spec/tags-input.md): Enter, the delimiter (`,`) or a paste adds the text
// as tags; Backspace at the start and the arrows move the focus onto the
// tags, Backspace or Delete on a tag removes it; with `editable`, Enter or a
// double press edits a tag in place. A form control: one hidden input per
// tag under `name`, `required`, a form reset.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no tags
// input, so this one shared file wraps Fragiola Primitives' on every base.
//
// The look composes `field` and `chip`; a tag is the same chip as a
// Combobox's (families/chip.ts):
//   Root          the box itself (`field.row`): it holds the Control and the
//                 ClearTrigger, rings when the Input has the focus, and is
//                 dimmed when disabled
//   Control       the control's area (`field.body`), a wrapping row of the
//                 tags (`chip.group`) then the Input; a press focuses the
//                 Input
//   Input         the bare control (`field.control`), filling the rest of the
//                 line; name it (a `<label for>`, or `aria-labelledby`)
//   Tag           one chip (`chip.item`); it takes the focus
//   TagText       its text, truncated
//   TagRemove     a ghost square Clickable (`chip.remove`); name it
//                 (`aria-label="Remove react"`)
//   TagInput      the in-place edit (`chip.input`), shown while editing
//   ClearTrigger  a small ghost Clickable at the inline end, hidden while
//                 there is nothing to clear; name it (`aria-label`)
//   Template.Simple  every tag with its remove button (and its edit with
//                 `editable`), the Input and the ClearTrigger.

type P = typeof TagsInputPrimitive;

function TagsInputRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <TagsInputPrimitive.Root
                data-slot="tags-input"
                className={cn(
                    field.row(),
                    foundation.disabled(),
                    "items-center",
                    className as string,
                )}
                {...props}
            />
        </PrimitivesDirection>
    );
}

function TagsInputControl({
    className,
    ...props
}: PrimitivesProps<P["Control"], "div">) {
    return (
        <TagsInputPrimitive.Control
            data-slot="tags-input-control"
            className={cn(
                field.body(),
                chip.group(),
                "cursor-text px-1.5 py-1",
                className as string,
            )}
            {...props}
        />
    );
}

function TagsInputInput({
    className,
    ...props
}: PrimitivesProps<P["Input"], "input">) {
    return (
        <TagsInputPrimitive.Input
            data-slot="tags-input-input"
            className={cn(
                field.control(),
                "w-auto min-w-20 flex-1 px-1.5 py-1",
                className as string,
            )}
            {...props}
        />
    );
}

function TagsInputTag({
    className,
    ...props
}: PrimitivesProps<P["Tag"], "div">) {
    return (
        <TagsInputPrimitive.Tag
            data-slot="tags-input-tag"
            className={cn(chip.item(), className as string)}
            {...props}
        />
    );
}

function TagsInputTagText({
    className,
    ...props
}: PrimitivesProps<P["TagText"], "span">) {
    return (
        <TagsInputPrimitive.TagText
            data-slot="tags-input-tag-text"
            className={cn("truncate", className as string)}
            {...props}
        />
    );
}

function TagsInputTagRemove({
    className,
    children,
    ...props
}: PrimitivesProps<P["TagRemove"], "button">) {
    return (
        <TagsInputPrimitive.TagRemove
            data-slot="tags-input-tag-remove"
            className={cn(
                clickable({ variant: "ghost", shape: "square", size: "xs" }),
                chip.remove(),
                className as string,
            )}
            {...props}
        >
            {children ?? <XIcon />}
        </TagsInputPrimitive.TagRemove>
    );
}

function TagsInputTagInput({
    className,
    ...props
}: PrimitivesProps<P["TagInput"], "input">) {
    return (
        <TagsInputPrimitive.TagInput
            data-slot="tags-input-tag-input"
            className={cn(chip.input(), className as string)}
            {...props}
        />
    );
}

function TagsInputClearTrigger({
    className,
    children,
    ...props
}: PrimitivesProps<P["ClearTrigger"], "button">) {
    return (
        <TagsInputPrimitive.ClearTrigger
            data-slot="tags-input-clear-trigger"
            className={cn(
                clickable({ variant: "ghost", shape: "square", size: "sm" }),
                "me-0.5 shrink-0 text-palette-accent/85",
                className as string,
            )}
            {...props}
        >
            {children ?? <XIcon />}
        </TagsInputPrimitive.ClearTrigger>
    );
}

/**
 * The common tags input: every tag with its remove button ("Remove <tag>"),
 * and its in-place edit with `editable`, then the Input and a ClearTrigger
 * ("Clear tags"). Every Root prop is forwarded; `className` goes to the box.
 * `id`, `aria-label` and `aria-labelledby` name the Input, the labelled
 * control (a `<label for>` the `id`).
 */
function TagsInputTemplateSimple({
    placeholder,
    id,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...props
}: Omit<PrimitivesProps<P["Root"], "div">, "children"> & {
    placeholder?: string;
}) {
    return (
        <TagsInputRoot {...props}>
            {({ value }: { value: readonly string[] }) => (
                <>
                    <TagsInputControl>
                        {value.map((tag, index) => (
                            <TagsInputTag
                                // biome-ignore lint/suspicious/noArrayIndexKey: duplicates may be allowed; a tag's place is its identity
                                key={index}
                                index={index}
                            >
                                <TagsInputTagText>{tag}</TagsInputTagText>
                                <TagsInputTagRemove
                                    aria-label={`Remove ${tag}`}
                                />
                                {props.editable ? (
                                    <TagsInputTagInput aria-label="Edit tag" />
                                ) : null}
                            </TagsInputTag>
                        ))}
                        <TagsInputInput
                            id={id}
                            aria-label={ariaLabel}
                            aria-labelledby={ariaLabelledBy}
                            placeholder={placeholder}
                        />
                    </TagsInputControl>
                    <TagsInputClearTrigger aria-label="Clear tags" />
                </>
            )}
        </TagsInputRoot>
    );
}

export const TagsInput = {
    Root: TagsInputRoot,
    Control: TagsInputControl,
    Input: TagsInputInput,
    Tag: TagsInputTag,
    TagText: TagsInputTagText,
    TagRemove: TagsInputTagRemove,
    TagInput: TagsInputTagInput,
    ClearTrigger: TagsInputClearTrigger,
    Template: { Simple: TagsInputTemplateSimple },
};

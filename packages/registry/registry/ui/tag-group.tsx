"use client";

import { TagGroup as TagGroupPrimitive } from "@fragiola/primitives-react/tag-group";
import { XIcon } from "lucide-react";
import type * as React from "react";
import { clickable } from "#/atoms/clickable";
import { chip } from "#/families/chip";
import { field } from "#/families/field";
import { foundation } from "#/families/foundation";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
    renderMarked,
} from "#/lib/primitives-backed";

// TagGroup — a focusable group of tags that stays on the page: labels,
// categories, filters (spec/tag-group.md, React Aria's grid of tags). One
// tab stop, the arrows (swapped in RTL), Home and End move through the tags;
// with `selectionMode`, Space, Enter or a press selects (`single`) or toggles
// (`multiple`); with `onRemove`, Delete, Backspace or a tag's RemoveButton
// asks the app to remove it, and the focus moves on. It holds no form value.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no tag
// group, so this one shared file wraps Fragiola Primitives' on every base.
//
// The look is the `chip` family's: a tag is the chip a Combobox and a Tags
// Input show, and a user can select it.
//   Root          a column: the Label above the List
//   Label         names the List (`field.label`'s type)
//   List          the `grid`, a wrapping row of tags (`chip.group`); it takes
//                 the focus once the last tag is removed
//   Tag           one tag (`chip.tag`): the chosen one gets `data-checked`
//                 from its state, so the foundation's `checked` fills it
//                 with `ring`; a disabled one is dimmed
//   TagCell       the tag's one `gridcell`: its content and RemoveButton in
//                 a row
//   RemoveButton  a ghost square Clickable (`chip.remove`), in the tag's
//                 colour; name it (`aria-label="Remove Design"`)
//   Template.Simple  a Label, then a tag per entry of `tags`, each with a
//                 RemoveButton when `onRemove` is given.

type P = typeof TagGroupPrimitive;

function TagGroupRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <TagGroupPrimitive.Root
                data-slot="tag-group"
                className={cn("flex flex-col gap-2", className as string)}
                {...props}
            />
        </PrimitivesDirection>
    );
}

function TagGroupLabel({
    className,
    ...props
}: PrimitivesProps<P["Label"], "span">) {
    return (
        <TagGroupPrimitive.Label
            data-slot="tag-group-label"
            className={cn(field.label(), "text-sm", className as string)}
            {...props}
        />
    );
}

function TagGroupList({
    className,
    ...props
}: PrimitivesProps<P["List"], "div">) {
    return (
        <TagGroupPrimitive.List
            data-slot="tag-group-list"
            className={cn(
                chip.group(),
                foundation.focus(),
                "gap-1.5 rounded-md",
                className as string,
            )}
            {...props}
        />
    );
}

function TagGroupTag({
    className,
    render,
    ...props
}: PrimitivesProps<P["Tag"], "div">) {
    // The primitive marks the chosen tag `data-selected`; the foundation's
    // `checked` reads `data-checked`, so the tag adds it from its state (as
    // the swatch picker's options do).
    return (
        <TagGroupPrimitive.Tag
            data-slot="tag-group-tag"
            className={cn(chip.tag(), className as string)}
            render={renderMarked(
                render,
                (state: { selected: boolean }) => ({
                    "data-checked": state.selected ? "" : undefined,
                }),
                (marked) => <div {...marked} />,
            )}
            {...props}
        />
    );
}

function TagGroupTagCell({
    className,
    ...props
}: PrimitivesProps<P["TagCell"], "div">) {
    return (
        <TagGroupPrimitive.TagCell
            data-slot="tag-group-tag-cell"
            className={cn(
                "inline-flex min-w-0 items-center gap-1",
                className as string,
            )}
            {...props}
        />
    );
}

function TagGroupRemoveButton({
    className,
    children,
    ...props
}: PrimitivesProps<P["RemoveButton"], "button">) {
    return (
        <TagGroupPrimitive.RemoveButton
            data-slot="tag-group-remove-button"
            className={cn(
                clickable({ variant: "ghost", shape: "square", size: "xs" }),
                chip.remove(),
                className as string,
            )}
            {...props}
        >
            {children ?? <XIcon />}
        </TagGroupPrimitive.RemoveButton>
    );
}

type TagEntry = string | { value: string; label: React.ReactNode };

/**
 * The common tag group: a Label (when `label` is given), then a tag per
 * entry of `tags` (a string, or `{ value, label }`), each with a
 * RemoveButton ("Remove <label>") when `onRemove` is given. Every Root prop
 * is forwarded; `className` goes to the root. Without a `label`,
 * `aria-label` or `aria-labelledby` names the List.
 */
function TagGroupTemplateSimple({
    tags,
    label,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...props
}: Omit<PrimitivesProps<P["Root"], "div">, "children"> & {
    tags: readonly TagEntry[];
    label?: React.ReactNode;
}) {
    return (
        <TagGroupRoot {...props}>
            {label ? <TagGroupLabel>{label}</TagGroupLabel> : null}
            <TagGroupList
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
            >
                {tags.map((entry) => {
                    const value =
                        typeof entry === "string" ? entry : entry.value;
                    const text =
                        typeof entry === "string" ? entry : entry.label;
                    return (
                        <TagGroupTag key={value} value={value}>
                            <TagGroupTagCell>
                                {text}
                                {props.onRemove ? (
                                    <TagGroupRemoveButton
                                        aria-label={`Remove ${typeof text === "string" ? text : value}`}
                                    />
                                ) : null}
                            </TagGroupTagCell>
                        </TagGroupTag>
                    );
                })}
            </TagGroupList>
        </TagGroupRoot>
    );
}

export const TagGroup = {
    Root: TagGroupRoot,
    Label: TagGroupLabel,
    List: TagGroupList,
    Tag: TagGroupTag,
    TagCell: TagGroupTagCell,
    RemoveButton: TagGroupRemoveButton,
    Template: { Simple: TagGroupTemplateSimple },
};

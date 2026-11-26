"use client";

import { SearchField as SearchFieldPrimitive } from "@fragiola/primitives-react/search-field";
import { SearchIcon, XIcon } from "lucide-react";
import type * as React from "react";
import { clickable } from "#/atoms/clickable";
import { field } from "#/families/field";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";

// SearchField — a search box: Escape clears it (a second Escape leaves it to
// the page), Enter submits (`onSubmit` with the query), and the clear
// button empties it and returns the focus. It is no listbox: suggestions are
// an Autocomplete.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// search field, so this one shared file wraps Fragiola Primitives' on every
// base.
//
// The control is only its middle (rule 3): it goes in a `Field.Row`, which
// draws the box.
//   Root         the control's area, `field.body`
//   Icon         the search glass, a `field.inset` at the inline start
//                (secondary, as every secondary icon)
//   Input        the bare control, `field.control`, without the browser's
//                own clear button
//   ClearButton  a small ghost Clickable at the inline end, hidden while
//                the field is empty; name it (`aria-label="Clear search"`)

function SearchFieldRoot({
    className,
    ...props
}: PrimitivesProps<typeof SearchFieldPrimitive.Root, "div">) {
    return (
        <PrimitivesDirection>
            <SearchFieldPrimitive.Root
                data-slot="search-field"
                className={cn(
                    field.body(),
                    "items-center",
                    className as string,
                )}
                {...props}
            />
        </PrimitivesDirection>
    );
}

function SearchFieldIcon({
    className,
    children,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="search-field-icon"
            aria-hidden="true"
            className={cn(field.inset(), "self-stretch", className as string)}
            {...props}
        >
            {children ?? <SearchIcon />}
        </span>
    );
}

function SearchFieldInput({
    className,
    ...props
}: PrimitivesProps<typeof SearchFieldPrimitive.Input, "input">) {
    return (
        <SearchFieldPrimitive.Input
            data-slot="search-field-input"
            className={cn(
                field.control(),
                "self-stretch [&::-webkit-search-cancel-button]:appearance-none",
                className as string,
            )}
            {...props}
        />
    );
}

function SearchFieldClearButton({
    className,
    children,
    ...props
}: PrimitivesProps<typeof SearchFieldPrimitive.ClearButton, "button">) {
    return (
        <SearchFieldPrimitive.ClearButton
            data-slot="search-field-clear-button"
            className={cn(
                clickable({ variant: "ghost", shape: "square", size: "sm" }),
                "me-0.5 shrink-0 text-palette-accent/85 data-empty:hidden",
                className as string,
            )}
            {...props}
        >
            {children ?? <XIcon />}
        </SearchFieldPrimitive.ClearButton>
    );
}

export const SearchField = {
    Root: SearchFieldRoot,
    Icon: SearchFieldIcon,
    Input: SearchFieldInput,
    ClearButton: SearchFieldClearButton,
};

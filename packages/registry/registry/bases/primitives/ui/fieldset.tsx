"use client";

import { Fieldset as FieldsetPrimitive } from "@fragiola/primitives-react/fieldset";
import { field } from "#/families/field";
import type { PrimitiveProps } from "#/lib/base";
import { cn } from "#/lib/cn";

// Fieldset — a group of fields under one name: a native `<fieldset>`, named
// by its Legend (`aria-labelledby`). `disabled` on the Root disables every
// field inside it. Fragiola Primitives' Fieldset provides the behaviour.
//
// The legend is a label (`field.label`): the name of a group of fields reads
// like the name of one field, at the label's size and weight. The root draws
// no box (no border, no padding of its own): the fields inside it are the
// boxes, a column apart like a form's.

function FieldsetRoot({
    className,
    ...props
}: PrimitiveProps<typeof FieldsetPrimitive.Root, "fieldset">) {
    return (
        <FieldsetPrimitive.Root
            data-slot="fieldset"
            className={cn(
                "m-0 flex min-w-0 flex-col gap-4 border-0 p-0",
                className as string,
            )}
            {...props}
        />
    );
}

function FieldsetLegend({
    className,
    ...props
}: PrimitiveProps<typeof FieldsetPrimitive.Legend, "div">) {
    return (
        <FieldsetPrimitive.Legend
            data-slot="fieldset-legend"
            className={cn(field.label(), "text-sm", className as string)}
            {...props}
        />
    );
}

export const Fieldset = {
    Root: FieldsetRoot,
    Legend: FieldsetLegend,
};

"use client";

import { Form as FormPrimitive } from "@fragiola/primitives-react/form";
import type { PrimitiveProps } from "#/lib/base";
import { cn } from "#/lib/cn";

// Form — a native `<form>` that its Fields validate together. Fragiola
// Primitives' Form provides the behaviour: `validationMode` for every Field
// inside it, and `errors` — a server's answer, keyed by a Field's `name` —
// shown on those Fields until their value changes.
//
// Errors are shown by the Fields, never by the form: a Field with an error
// is `data-invalid`, which applies `palette-danger` by inheritance
// (global.css), so its box and text turn red with nothing else, and its
// `Field.Error` shows the message (docs/visual-language.md, "invalid"). The
// form only lays the fields out, a column apart.

function Form({
    className,
    ...props
}: PrimitiveProps<typeof FormPrimitive, "form">) {
    return (
        <FormPrimitive
            data-slot="form"
            className={cn("flex w-full flex-col gap-4", className as string)}
            {...props}
        />
    );
}

export { Form };

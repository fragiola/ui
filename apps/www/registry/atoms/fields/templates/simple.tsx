import type * as React from "react";
import { field } from "#/families/field";
import { Field } from "#/ui/field";
import { Input } from "../input";

// Input.Template.Simple — the tightest case. label, description, error,
// required, inset (inside addon), addon (outside) — all legitimate by rule 2
// (content/behaviour). Survives with 7 props.
//
// The three rules:
// 1. No style of its own — no class, tv(), or hardcoded className beyond
//    field.inset() on the inset, which is a family piece (not template style).
// 2. No appearance props — no variant, size, color, contentClassName.
// 3. One className, going to the main piece (body) — the palette channel.
//
// Forbidden: contentProps / slotProps / any generic *Props bag. Props stay
// flat.
//
// Ceiling of 7 props: label, description, error, required, inset, addon,
// className. Input props (value, onChange, name, placeholder, type, etc.)
// are forwarded via ...props — they are behaviour, not template
// configuration. If an eighth is needed, stop and record it.

type SimpleProps = Omit<React.ComponentProps<typeof Input>, "className"> & {
    label?: React.ReactNode;
    description?: React.ReactNode;
    error?: React.ReactNode;
    required?: boolean;
    inset?: React.ReactNode;
    addon?: React.ReactNode;
    className?: string;
};

function Simple({
    label: labelContent,
    description,
    error,
    required,
    inset,
    addon,
    className,
    ...inputProps
}: SimpleProps) {
    return (
        <Field.Root>
            {labelContent ? (
                <Field.Label>
                    {labelContent}
                    {required ? <span aria-hidden="true">*</span> : null}
                </Field.Label>
            ) : null}
            <Field.Row>
                <Field.Body className={className as string}>
                    {inset ? (
                        <span className={field.inset()}>{inset}</span>
                    ) : null}
                    <Input {...inputProps} required={required} />
                </Field.Body>
                {addon ? (
                    <Field.Addon side="inline-end">{addon}</Field.Addon>
                ) : null}
            </Field.Row>
            {description ? (
                <Field.Description>{description}</Field.Description>
            ) : null}
            {error ? <Field.Error>{error}</Field.Error> : null}
        </Field.Root>
    );
}

export { Simple as TemplateSimple };

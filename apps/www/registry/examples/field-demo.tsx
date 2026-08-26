"use client";

import { SearchIcon } from "lucide-react";
import { Input, Numeric, Textarea } from "#/atoms/fields";
import { Field } from "#/ui/field";

export default function FieldDemo() {
    return (
        <div className="flex flex-col gap-6">
            {/* Basic field with label, description, and error */}
            <Field.Root>
                <Field.Label>Email</Field.Label>
                <Field.Row>
                    <Field.Body>
                        <Input placeholder="name@example.com" />
                    </Field.Body>
                </Field.Row>
                <Field.Description>
                    We will never share your email.
                </Field.Description>
            </Field.Root>

            {/* Field with inline-start and inline-end addons — one box */}
            <Field.Root>
                <Field.Label>Domain</Field.Label>
                <Field.Row>
                    <Field.Addon side="inline-start">https://</Field.Addon>
                    <Field.Body>
                        <Input placeholder="example.com" />
                    </Field.Body>
                    <Field.Addon side="inline-end">.com</Field.Addon>
                </Field.Row>
            </Field.Root>

            {/* Field with inset icon (inside the padding) */}
            <Field.Root>
                <Field.Label>Search</Field.Label>
                <Field.Row>
                    <Field.Body>
                        <span className="flex shrink-0 items-center justify-center gap-2 text-palette-accent/85 first:ps-3 last:pe-3">
                            <SearchIcon className="size-4" />
                        </span>
                        <Input placeholder="Search…" />
                    </Field.Body>
                </Field.Row>
            </Field.Root>

            {/* Block addon on top — wraps to its own line */}
            <Field.Root>
                <Field.Label>API key</Field.Label>
                <Field.Row>
                    <Field.Addon side="block-start">
                        Read-only — generated on save
                    </Field.Addon>
                    <Field.Body>
                        <Input placeholder="sk-…" readOnly />
                    </Field.Body>
                </Field.Row>
            </Field.Root>

            {/* Textarea — resize handle flush in the corner */}
            <Field.Root>
                <Field.Label>Bio</Field.Label>
                <Field.Row>
                    <Field.Body>
                        <Textarea
                            rows={4}
                            placeholder="Tell us about yourself"
                        />
                    </Field.Body>
                </Field.Row>
            </Field.Root>

            {/* Numeric — the thesis test: no box styling at all */}
            <Field.Root>
                <Field.Label>Quantity</Field.Label>
                <Field.Row>
                    <Field.Body>
                        <Numeric min={0} max={100} step={1} defaultValue={1} />
                    </Field.Body>
                    <Field.Addon side="inline-end">units</Field.Addon>
                </Field.Row>
                <Field.Description>
                    Use ArrowUp / ArrowDown to increment.
                </Field.Description>
            </Field.Root>

            {/* Invalid state — by inheritance, no class on any child */}
            <Field.Root invalid>
                <Field.Label>Username</Field.Label>
                <Field.Row>
                    <Field.Body>
                        <Input defaultValue="admin" />
                    </Field.Body>
                </Field.Row>
                <Field.Error>This username is taken.</Field.Error>
            </Field.Root>

            {/* Disabled state */}
            <Field.Root disabled>
                <Field.Label>Read-only field</Field.Label>
                <Field.Row>
                    <Field.Body>
                        <Input defaultValue="Cannot edit this" />
                    </Field.Body>
                </Field.Row>
            </Field.Root>
        </div>
    );
}

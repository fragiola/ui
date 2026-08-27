"use client";

import { Input } from "#/atoms/fields";
import { Field } from "#/ui/field";
import { PaletteGrid } from "@/components/preview/palette-grid";
import { SURFACES } from "@/lib/palette-sets";

// Each cell is a tinted surface palette. The invalid field on one cell does
// NOT tint its siblings — [data-invalid] is scoped to the Field.Root, and
// the palette inheritance means each cell reads its own roles. This is the
// palette-inheritance argument stated as a visible fact.
function DemoContent() {
    return (
        <div className="flex flex-col gap-4">
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

            {/* Invalid — the [data-invalid] tint is scoped to this
                Field.Root. The sibling fields in adjacent cells are
                unaffected. */}
            <Field.Root invalid>
                <Field.Label>Username</Field.Label>
                <Field.Row>
                    <Field.Body>
                        <Input defaultValue="admin" />
                    </Field.Body>
                </Field.Row>
                <Field.Error>This username is taken.</Field.Error>
            </Field.Root>

            {/* Disabled — reads roles from the cell's palette */}
            <Field.Root disabled>
                <Field.Label>Read-only</Field.Label>
                <Field.Row>
                    <Field.Body>
                        <Input defaultValue="Cannot edit" />
                    </Field.Body>
                </Field.Row>
            </Field.Root>
        </div>
    );
}

export default function FieldDemo() {
    return (
        <PaletteGrid palettes={SURFACES}>
            <DemoContent />
        </PaletteGrid>
    );
}

"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "#/atoms/fields";
import { Field } from "#/ui/field";
import { PaletteGrid } from "@/components/preview/palette-grid";
import { SURFACES } from "@/lib/palette-sets";

// Each cell is a tinted surface palette. The "one input" claim: the same
// Input bare, in a group, and with an inset — all reading roles from the
// cell. The field frame carries border, background and focus ring; the input
// carries none.
function DemoContent() {
    return (
        <div className="flex flex-col gap-6">
            {/* The "one input" claim: same Input bare, in a group, and with an inset */}
            <Field.Root>
                <Field.Label>Bare input</Field.Label>
                <Field.Row>
                    <Field.Body>
                        <Input placeholder="Just an input" />
                    </Field.Body>
                </Field.Row>
            </Field.Root>

            <Field.Root>
                <Field.Label>With inline-start addon</Field.Label>
                <Field.Row>
                    <Field.Addon side="inline-start">$</Field.Addon>
                    <Field.Body>
                        <Input placeholder="0.00" />
                    </Field.Body>
                </Field.Row>
            </Field.Root>

            <Field.Root>
                <Field.Label>With inset icon</Field.Label>
                <Field.Row>
                    <Field.Body>
                        <span className="flex shrink-0 items-center justify-center gap-2 text-palette-accent/85 first:ps-3 last:pe-3">
                            <SearchIcon className="size-4" />
                        </span>
                        <Input placeholder="Search…" />
                    </Field.Body>
                </Field.Row>
            </Field.Root>

            {/* Input.Template.Simple — 7 props, no appearance props */}
            <Input.Template.Simple
                label="Website"
                description="Enter your full URL."
                placeholder="example.com"
                addon="https://"
                required
            />
        </div>
    );
}

export default function InputDemo() {
    return (
        <PaletteGrid palettes={SURFACES}>
            <DemoContent />
        </PaletteGrid>
    );
}

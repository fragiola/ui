"use client";

import type { ReactNode } from "react";
import { Input } from "#/atoms/fields";
import { Field } from "#/ui/field";

// The palette class goes on the field element, not on a wrapping context.
// The floor is palette-surface; each Field.Root carries a palette-surface-*
// class — a neutral surface whose only difference from surface is a
// chromatic focus ring. The frame reads neutral; focusing shows the coloured
// ring. This is the Epic's exception: a field is a surface, not a coloured
// element, but its focus ring states the theme's colour.
//
// Axes shown, one per row, all aligned:
//   palettes   one field per surface-ring palette (default state)
//   states     default / invalid / disabled / required
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

export default function FieldDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            {/* palettes — one field per surface-ring palette; focus to see
                the ring colour. Frames read neutral in both themes. */}
            <Row label="palettes (focus to see ring)">
                {SURFACE_RING.map((palette) => (
                    <Field.Root
                        key={palette}
                        className={`palette-${palette} w-48`}
                    >
                        <Field.Label>{palette}</Field.Label>
                        <Field.Row>
                            <Field.Body>
                                <Input placeholder="Focus me" />
                            </Field.Body>
                        </Field.Row>
                    </Field.Root>
                ))}
            </Row>

            {/* states — default / invalid / disabled / required (palette
                surface-blue). Invalid arrives by palette inheritance: Base UI
                emits data-invalid on Field.Root, and danger.css registers
                [data-invalid] as a palette-danger applier — the whole subtree
                becomes danger with no extra class. */}
            <Row label="states">
                <Field.Root className="palette-surface-blue w-48">
                    <Field.Label>Default</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input placeholder="Default" />
                        </Field.Body>
                    </Field.Row>
                    <Field.Description>Helper text.</Field.Description>
                </Field.Root>

                <Field.Root invalid className="palette-surface-blue w-48">
                    <Field.Label>Invalid</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input defaultValue="admin" />
                        </Field.Body>
                    </Field.Row>
                    <Field.Error>This username is taken.</Field.Error>
                </Field.Root>

                <Field.Root disabled className="palette-surface-blue w-48">
                    <Field.Label>Disabled</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input defaultValue="Cannot edit" />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>

                <Field.Root className="palette-surface-blue w-48">
                    <Field.Label>Required</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input placeholder="Required" required />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>
            </Row>
        </div>
    );
}

// Row — a labelled, aligned row. The label is a <span>, not a heading.
function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-palette-accent/85">
                {label}
            </span>
            <div className="flex flex-wrap items-start gap-4">{children}</div>
        </div>
    );
}

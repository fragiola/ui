"use client";

import { SearchIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Input } from "#/atoms/fields";
import { Field } from "#/ui/field";

// The palette class goes on the field element, not on a wrapping context.
// The floor is palette-surface; each Field.Root carries a palette-surface-*
// class — a neutral surface whose only difference from surface is a
// chromatic focus ring. The frame reads neutral; focusing shows the coloured
// ring.
//
// The "one input" claim: the same Input bare, in a group with an addon, and
// with an inset icon — all reading roles from the same palette. The field
// frame carries border, background and focus ring; the input carries none.
//
// Axes shown, one per row, all aligned:
//   palettes   one bare input per surface-ring palette
//   composition  bare / inline-start addon / inline-end addon / inset icon
//   template   Input.Template.Simple (7 props, no appearance props)
//   states     disabled / invalid
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

export default function InputDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            {/* palettes — one bare input per surface-ring palette; focus to
                see the ring colour. */}
            <Row label="palettes (focus to see ring)">
                {SURFACE_RING.map((palette) => (
                    <Field.Root
                        key={palette}
                        className={`palette-${palette} w-48`}
                    >
                        <Field.Row>
                            <Field.Body>
                                <Input placeholder={palette} />
                            </Field.Body>
                        </Field.Row>
                    </Field.Root>
                ))}
            </Row>

            {/* composition — bare / inline-start addon / inline-end addon /
                inset icon (palette surface-blue) */}
            <Row label="composition">
                <Field.Root className="palette-surface-blue w-48">
                    <Field.Label>Bare</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input placeholder="Just an input" />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>

                <Field.Root className="palette-surface-blue w-48">
                    <Field.Label>Inline-start addon</Field.Label>
                    <Field.Row>
                        <Field.Addon side="inline-start">$</Field.Addon>
                        <Field.Body>
                            <Input placeholder="0.00" />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>

                <Field.Root className="palette-surface-blue w-48">
                    <Field.Label>Inline-end addon</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input placeholder="example" />
                        </Field.Body>
                        <Field.Addon side="inline-end">.com</Field.Addon>
                    </Field.Row>
                </Field.Root>

                <Field.Root className="palette-surface-blue w-48">
                    <Field.Label>Inset icon</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Field.Inset>
                                <SearchIcon className="size-4" />
                            </Field.Inset>
                            <Input placeholder="Search…" />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>
            </Row>

            {/* template — Input.Template.Simple: 7 props, no appearance
                props (palette surface-blue) */}
            <Row label="template">
                <Input.Template.Simple
                    className="palette-surface-blue w-48"
                    label="Website"
                    description="Enter your full URL."
                    placeholder="example"
                    addon="https://"
                    required
                />
            </Row>

            {/* states — disabled / invalid (palette surface-blue) */}
            <Row label="states">
                <Field.Root disabled className="palette-surface-blue w-48">
                    <Field.Label>Disabled</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input defaultValue="Cannot edit" />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>

                <Field.Root invalid className="palette-surface-blue w-48">
                    <Field.Label>Invalid</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input defaultValue="bad@email" />
                        </Field.Body>
                    </Field.Row>
                    <Field.Error>Enter a valid email address.</Field.Error>
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

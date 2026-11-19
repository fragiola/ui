"use client";

import { SearchIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Input } from "#/components/atoms/fields";
import { Field } from "#/components/ui/field";

// The surface-tier palettes: each is the neutral surface with one chromatic
// ring, so an input wearing one reads neutral and shows its colour only on
// focus. Literal here because examples are published source (the code panel
// shows this file verbatim, with a copy button).
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

// The "one input" claim, in a store's settings: the same Input with an inset
// icon, with an addon on either side, and as Input.Template.Simple. The
// field row carries the box (stroke, height, focus ring); the input carries
// none of it, and no field carries a palette class. Then the disabled and
// invalid states, and last the same input in each surface-ring palette
// (focus one to see its ring).
export default function InputDemo() {
    return (
        <div className="not-prose palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex max-w-sm flex-col gap-4">
                <Field.Root>
                    <Field.Row>
                        <Field.Body>
                            <Field.Inset>
                                <SearchIcon className="size-4" />
                            </Field.Inset>
                            <Input
                                aria-label="Search products"
                                placeholder="Search products…"
                            />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>

                <Input.Template.Simple
                    label="Store address"
                    description="Customers reach your store here."
                    placeholder="my-store"
                    addon={{ inline: { start: "https://" } }}
                    required
                />

                <Field.Root>
                    <Field.Label>Price</Field.Label>
                    <Field.Row>
                        <Field.Addon side="inline-start">$</Field.Addon>
                        <Field.Body>
                            <Input inputMode="decimal" placeholder="0.00" />
                        </Field.Body>
                        <Field.Addon side="inline-end">USD</Field.Addon>
                    </Field.Row>
                </Field.Root>
            </div>

            <Row label="states">
                <Field.Root disabled className="w-56">
                    <Field.Label>Store ID</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input defaultValue="st_51x9a" />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>

                <Field.Root invalid className="w-56">
                    <Field.Label>Support email</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input defaultValue="help@store" />
                        </Field.Body>
                    </Field.Row>
                    <Field.Error match>
                        Enter a valid email address.
                    </Field.Error>
                </Field.Root>
            </Row>

            {/* the same input, only its palette-* class changed */}
            <Row label="palettes">
                {SURFACE_RING.map((palette) => (
                    <Field.Root
                        key={palette}
                        className={`palette-${palette} w-40`}
                    >
                        <Field.Row>
                            <Field.Body>
                                <Input
                                    aria-label={palette}
                                    placeholder={palette}
                                />
                            </Field.Body>
                        </Field.Row>
                    </Field.Root>
                ))}
            </Row>
        </div>
    );
}

// Row — a captioned row. The caption is a <span>, not a heading.
function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-palette-accent/85">
                {label}
            </span>
            <div className="flex flex-wrap items-start gap-4">{children}</div>
        </div>
    );
}

"use client";

import { type ComponentProps, type ReactNode, useState } from "react";
import { ColorField } from "#/components/ui/color-field";
import { ColorSwatch } from "#/components/ui/color-swatch";
import { Field } from "#/components/ui/field";

// The surface-tier palettes: the neutral surface with one chromatic ring, so
// only the field's focus ring takes colour. Literal here because examples
// are published source (the code panel shows this file verbatim, with a
// copy button).
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

type Color = ComponentProps<typeof ColorField.Root>["value"];

// A brand colour in the default look: a hex ColorField in the field's row,
// a swatch of the value in the row's inset. Type `f60`, `#ff6600` or
// `rgb(255, 102, 0)` and press Enter or leave the field; a text that is no
// colour goes back to the value, and the arrows step it. The field is
// named by its label (`aria-labelledby`, on both bases). Then the channel
// mode (a hue spinbutton), a disabled field and one row of surface-ring
// palettes.
export default function ColorFieldDemo() {
    const [brand, setBrand] = useState<Color>("#2563eb");
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Field.Root className="max-w-xs">
                <Field.Label id="brand-label">Brand color</Field.Label>
                <Field.Row>
                    <Field.Inset>
                        <ColorSwatch
                            color={brand ?? undefined}
                            aria-hidden="true"
                            className="size-5 rounded-sm"
                        />
                    </Field.Inset>
                    <ColorField.Root
                        value={brand}
                        onValueChange={setBrand}
                        name="brand"
                    >
                        <ColorField.Input
                            aria-labelledby="brand-label"
                            placeholder="#000000"
                        />
                    </ColorField.Root>
                </Field.Row>
                <Field.Description>
                    Hex, rgb() or hsl(); the buttons and links use it.
                </Field.Description>
            </Field.Root>

            <div className="flex flex-wrap items-start gap-x-10 gap-y-6">
                <Row label="channel: hue">
                    <Field.Row className="w-40">
                        <ColorField.Root
                            channel="hue"
                            defaultValue="hsl(210, 80%, 50%)"
                        >
                            <ColorField.Input aria-label="Hue" />
                        </ColorField.Root>
                    </Field.Row>
                </Row>
                <Row label="disabled">
                    <Field.Row className="w-40 opacity-50">
                        <ColorField.Root defaultValue="#16a34a" disabled>
                            <ColorField.Input aria-label="Color, disabled" />
                        </ColorField.Root>
                    </Field.Row>
                </Row>
            </div>

            {/* the same field, only its palette-* class changed */}
            <Row label="palettes">
                <div className="flex flex-wrap gap-3">
                    {SURFACE_RING.map((palette) => (
                        <Field.Row
                            key={palette}
                            className={`palette-${palette} w-32`}
                        >
                            <ColorField.Root defaultValue="#2563eb">
                                <ColorField.Input
                                    aria-label={`Color, ${palette}`}
                                />
                            </ColorField.Root>
                        </Field.Row>
                    ))}
                </div>
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
            {children}
        </div>
    );
}

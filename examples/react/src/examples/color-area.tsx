"use client";

import { type ComponentProps, type ReactNode, useState } from "react";
import { ColorArea } from "#/components/ui/color-area";
import { ColorField } from "#/components/ui/color-field";
import { ColorSwatch } from "#/components/ui/color-swatch";
import { Field } from "#/components/ui/field";

type Color = NonNullable<ComponentProps<typeof ColorArea.Root>["value"]>;

// A highlight colour in the default look: `ColorArea.Template.Simple`, the
// saturation (across) and brightness (up) of one hue. Drag the thumb or use
// the arrows: both axes move from either of its sliders, and the focus
// follows the axis a key moved. The swatch and the hex field share the
// area's value. The area's ground is the colour being picked, never a
// palette. Then the area composed from its parts over red and green, and a
// disabled area.
export default function ColorAreaDemo() {
    const [value, setValue] = useState<Color>("hsb(200, 70%, 85%)");
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex max-w-xs flex-col gap-3">
                <ColorArea.Template.Simple
                    aria-label="Highlight color"
                    value={value}
                    onValueChange={setValue}
                />
                <div className="flex items-center gap-3">
                    <ColorSwatch color={value} aria-label="Highlight color" />
                    <Field.Row>
                        <ColorField.Root
                            value={value}
                            onValueChange={(next) => next && setValue(next)}
                        >
                            <ColorField.Input aria-label="Highlight color, hex" />
                        </ColorField.Root>
                    </Field.Row>
                </div>
            </div>

            <div className="flex flex-wrap items-start gap-x-10 gap-y-6">
                <Row label="red and green, from the parts">
                    <ColorArea.Root
                        aria-label="Red and green"
                        defaultValue="rgb(120, 60, 200)"
                        xChannel="red"
                        yChannel="green"
                        className="size-40"
                    >
                        <ColorArea.Thumb>
                            <ColorArea.Input axis="x" aria-label="Red" />
                            <ColorArea.Input axis="y" aria-label="Green" />
                        </ColorArea.Thumb>
                    </ColorArea.Root>
                </Row>
                <Row label="disabled">
                    <ColorArea.Template.Simple
                        aria-label="Color, disabled"
                        defaultValue="hsb(340, 60%, 70%)"
                        disabled
                        className="size-40"
                    />
                </Row>
            </div>
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

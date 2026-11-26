"use client";

import { type ComponentProps, type ReactNode, useState } from "react";
import { ColorField } from "#/components/ui/color-field";
import { ColorSwatch } from "#/components/ui/color-swatch";
import { ColorWheel } from "#/components/ui/color-wheel";
import { Field } from "#/components/ui/field";

type Color = NonNullable<ComponentProps<typeof ColorWheel.Root>["value"]>;

// A theme's hue in the default look: `ColorWheel.Template.Simple`, a ring of
// every hue. Press or drag on the ring, or use the arrows (they wrap past
// 360°). The swatch and the hue field (a ColorField with `channel="hue"`, a
// spinbutton) share the wheel's value. Then a smaller, thinner ring and a
// disabled wheel.
export default function ColorWheelDemo() {
    const [value, setValue] = useState<Color>("hsl(160, 70%, 45%)");
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex flex-wrap items-center gap-6">
                <ColorWheel.Template.Simple
                    aria-label="Theme hue"
                    value={value}
                    onValueChange={setValue}
                />
                <div className="flex w-40 flex-col gap-3">
                    <ColorSwatch
                        color={value}
                        aria-label="Theme color"
                        className="h-16 w-full"
                    />
                    <Field.Row>
                        <ColorField.Root
                            channel="hue"
                            value={value}
                            onValueChange={(next) => next && setValue(next)}
                        >
                            <ColorField.Input aria-label="Theme hue, degrees" />
                        </ColorField.Root>
                    </Field.Row>
                </div>
            </div>

            <div className="flex flex-wrap items-start gap-x-10 gap-y-6">
                <Row label="outerRadius 64, innerRadius 52">
                    <ColorWheel.Template.Simple
                        aria-label="Hue, small"
                        defaultValue="hsl(30, 90%, 55%)"
                        outerRadius={64}
                        innerRadius={52}
                    />
                </Row>
                <Row label="disabled">
                    <ColorWheel.Template.Simple
                        aria-label="Hue, disabled"
                        defaultValue="hsl(280, 60%, 55%)"
                        outerRadius={64}
                        innerRadius={52}
                        disabled
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

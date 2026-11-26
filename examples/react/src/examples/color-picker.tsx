"use client";

import { type ComponentProps, type ReactNode, useState } from "react";
import { ColorField } from "#/components/ui/color-field";
import { ColorPicker } from "#/components/ui/color-picker";
import { ColorSlider } from "#/components/ui/color-slider";
import { ColorSwatch } from "#/components/ui/color-swatch";
import { ColorWheel } from "#/components/ui/color-wheel";
import { Field } from "#/components/ui/field";

type Format = NonNullable<ComponentProps<typeof ColorPicker.Root>["format"]>;

// The channels each format shows, with their names.
const CHANNELS = {
    rgb: [
        ["red", "Red"],
        ["green", "Green"],
        ["blue", "Blue"],
    ],
    hsl: [
        ["hue", "Hue"],
        ["saturation", "Saturation"],
        ["lightness", "Lightness"],
    ],
    hsb: [
        ["hue", "Hue"],
        ["saturation", "Saturation"],
        ["brightness", "Brightness"],
    ],
} as const;

const SWATCHES = [
    { value: "#0f172a", label: "Ink" },
    { value: "#2563eb", label: "Ocean" },
    { value: "#16a34a", label: "Forest" },
    { value: "#f59e0b", label: "Amber" },
    { value: "#e11d48", label: "Rose" },
] as const;

// A theme colour in the default look: `ColorPicker.Template.Simple`, an
// area, a hue and an alpha slider, the colour's swatch and hex field, and a
// row of swatches. Every control binds to the picker (none has a value of
// its own), so dragging the area, typing a hex or choosing a swatch moves
// all of them. Then the picker composed from its parts: a wheel and a
// lightness slider, the format select switching the channel fields, and the
// eyedropper (only where the browser has one); and a disabled picker.
export default function ColorPickerDemo() {
    const [format, setFormat] = useState<Format>("hex");
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <ColorPicker.Template.Simple
                defaultValue="#2563eb"
                name="theme"
                swatches={SWATCHES}
                className="max-w-64"
            />

            <div className="flex flex-wrap items-start gap-x-10 gap-y-6">
                <Row label="parts: a wheel, the format and the eyedropper">
                    <ColorPicker.Root
                        defaultValue="hsl(160, 70%, 45%)"
                        format={format}
                        onFormatChange={setFormat}
                        className="w-72"
                    >
                        <div className="flex items-center gap-4">
                            <ColorWheel.Template.Simple
                                outerRadius={56}
                                innerRadius={42}
                            />
                            <ColorSwatch
                                aria-label="Chosen color"
                                className="h-16 grow"
                            />
                        </div>
                        <ColorSlider.Template.Simple
                            channel="lightness"
                            colorSpace="hsl"
                        />
                        <div className="flex items-center gap-2">
                            <ColorPicker.FormatSelect aria-label="Format">
                                <option value="hex">Hex</option>
                                <option value="rgb">RGB</option>
                                <option value="hsl">HSL</option>
                                <option value="hsb">HSB</option>
                            </ColorPicker.FormatSelect>
                            {format === "hex" ? (
                                <Field.Row>
                                    <ColorField.Root>
                                        <ColorField.Input aria-label="Hex" />
                                    </ColorField.Root>
                                </Field.Row>
                            ) : (
                                CHANNELS[format].map(([channel, name]) => (
                                    <Field.Row key={channel}>
                                        <ColorField.Root channel={channel}>
                                            <ColorField.Input
                                                aria-label={name}
                                            />
                                        </ColorField.Root>
                                    </Field.Row>
                                ))
                            )}
                            <ColorPicker.EyeDropperTrigger aria-label="Pick a color from the screen" />
                        </div>
                    </ColorPicker.Root>
                </Row>
                <Row label="disabled">
                    <ColorPicker.Template.Simple
                        defaultValue="#e11d48"
                        disabled
                        className="w-56"
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

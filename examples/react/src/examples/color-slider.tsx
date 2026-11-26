"use client";

import { type ComponentProps, type ReactNode, useState } from "react";
import { ColorSlider } from "#/components/ui/color-slider";
import { ColorSwatch } from "#/components/ui/color-swatch";

type Color = NonNullable<ComponentProps<typeof ColorSlider.Root>["value"]>;

// A badge colour in the default look: three `ColorSlider.Template.Simple`
// over one hsl value (hue, saturation, lightness) and its alpha. Each track
// is drawn in its channel's gradient, the colour being picked, never a
// palette; the alpha track shows the checkerboard through. Drag a thumb or
// use the arrows (Shift and Page Up / Page Down take bigger steps). Then a
// slider composed from its parts in rgb, a vertical one and a disabled one.
export default function ColorSliderDemo() {
    const [value, setValue] = useState<Color>("hsla(262, 80%, 60%, 0.9)");
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex max-w-sm items-start gap-4">
                <ColorSwatch
                    color={value}
                    aria-label="Badge color"
                    className="size-16"
                />
                <div className="flex grow flex-col gap-4">
                    {(["hue", "saturation", "lightness", "alpha"] as const).map(
                        (channel) => (
                            <ColorSlider.Template.Simple
                                key={channel}
                                channel={channel}
                                colorSpace="hsl"
                                value={value}
                                onValueChange={setValue}
                            />
                        ),
                    )}
                </div>
            </div>

            <div className="flex flex-wrap items-start gap-x-10 gap-y-6">
                <Row label="red, from the parts">
                    <ColorSlider.Root
                        channel="red"
                        defaultValue="rgb(200, 80, 40)"
                        className="w-56"
                    >
                        <ColorSlider.Label>Red</ColorSlider.Label>
                        <ColorSlider.Output />
                        <ColorSlider.Track>
                            <ColorSlider.Thumb />
                        </ColorSlider.Track>
                    </ColorSlider.Root>
                </Row>
                <Row label="vertical">
                    <ColorSlider.Root
                        channel="hue"
                        defaultValue="hsl(200, 90%, 50%)"
                        orientation="vertical"
                        className="h-40"
                    >
                        <ColorSlider.Track>
                            <ColorSlider.Thumb aria-label="Hue, vertical" />
                        </ColorSlider.Track>
                    </ColorSlider.Root>
                </Row>
                <Row label="disabled">
                    <ColorSlider.Template.Simple
                        channel="hue"
                        defaultValue="hsl(20, 90%, 50%)"
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

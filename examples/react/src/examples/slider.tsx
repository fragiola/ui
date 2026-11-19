"use client";

import type { ReactNode } from "react";
import { Slider } from "#/components/ui/slider";

// The chromatic palettes. Literal here because examples are published source
// (the code panel shows this file verbatim, with a copy button).
const CHROMATIC = [
    "blue",
    "purple",
    "green",
    "orange",
    "rose",
    "danger",
] as const;

// A search filter in the default look: a range slider (two thumbs) and a
// stepped one. The fill and the thumb's stroke are the palette's ring, the
// "on" colour, so with no palette class they are the floor's dark neutral.
// Then the disabled state and the vertical orientation, and last the same
// slider in each chromatic palette: the colour is the palette class on
// Slider.Root, there is no colour variant.
export default function SliderDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex max-w-sm flex-col gap-6">
                <Slider.Root defaultValue={[120, 480]} min={0} max={600}>
                    <div className="flex items-center justify-between">
                        <Slider.Label>Price</Slider.Label>
                        <Slider.Value />
                    </div>
                    <Slider.Control>
                        <Slider.Track>
                            <Slider.Indicator />
                            <Slider.Thumb
                                index={0}
                                aria-label="Minimum price"
                            />
                            <Slider.Thumb
                                index={1}
                                aria-label="Maximum price"
                            />
                        </Slider.Track>
                    </Slider.Control>
                </Slider.Root>

                <Slider.Root defaultValue={4} min={1} max={5} step={1}>
                    <div className="flex items-center justify-between">
                        <Slider.Label>Minimum rating</Slider.Label>
                        <Slider.Value />
                    </div>
                    <Slider.Control>
                        <Slider.Track>
                            <Slider.Indicator />
                            <Slider.Thumb />
                        </Slider.Track>
                    </Slider.Control>
                </Slider.Root>
            </div>

            <div className="flex flex-wrap items-start gap-x-10 gap-y-6">
                <Row label="disabled">
                    <Slider.Root
                        defaultValue={40}
                        disabled
                        aria-label="Volume"
                        className="w-40"
                    >
                        <Slider.Control>
                            <Slider.Track>
                                <Slider.Indicator />
                                <Slider.Thumb />
                            </Slider.Track>
                        </Slider.Control>
                    </Slider.Root>
                </Row>

                <Row label="vertical">
                    <Slider.Root
                        defaultValue={50}
                        orientation="vertical"
                        aria-label="Level"
                        className="h-24"
                    >
                        <Slider.Control>
                            <Slider.Track>
                                <Slider.Indicator />
                                <Slider.Thumb />
                            </Slider.Track>
                        </Slider.Control>
                    </Slider.Root>
                </Row>
            </div>

            {/* the same slider, only its palette-* class changed */}
            <Row label="palettes">
                <div className="flex flex-wrap items-center gap-4">
                    {CHROMATIC.map((palette) => (
                        <Slider.Root
                            key={palette}
                            defaultValue={60}
                            aria-label={palette}
                            className={`palette-${palette} w-20`}
                        >
                            <Slider.Control>
                                <Slider.Track>
                                    <Slider.Indicator />
                                    <Slider.Thumb />
                                </Slider.Track>
                            </Slider.Control>
                        </Slider.Root>
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

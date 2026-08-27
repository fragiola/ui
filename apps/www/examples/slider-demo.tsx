"use client";

import type { ReactNode } from "react";
import { Field } from "#/ui/field";
import { Slider } from "#/ui/slider";

// The palette class goes on the slider itself, not on a wrapping context.
// The floor is palette-surface; each slider carries its own palette-* class.
// The indicator fills with bg-palette-base and the thumb uses bg-palette-base
// + outline-palette-ring, so six palettes on one floor show six
// differently-coloured sliders at once.
//
// Axes shown, one per row, all aligned:
//   palettes  one bare slider per chromatic palette
//   range     two thumbs (range slider)
//   disabled  single thumb, disabled
//   vertical  orientation="vertical"
const CHROMATIC = [
    "blue",
    "purple",
    "green",
    "orange",
    "rose",
    "danger",
] as const;

export default function SliderDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            {/* palettes — one bare slider per chromatic palette */}
            <Row label="palettes">
                {CHROMATIC.map((palette) => (
                    <Slider.Root
                        key={palette}
                        defaultValue={60}
                        className={`palette-${palette} w-40`}
                    >
                        <Slider.Control>
                            <Slider.Track>
                                <Slider.Indicator />
                                <Slider.Thumb />
                            </Slider.Track>
                        </Slider.Control>
                    </Slider.Root>
                ))}
            </Row>

            {/* range — two thumbs, same component (palette blue) */}
            <Row label="range">
                <Slider.Root
                    defaultValue={[25, 75]}
                    className="palette-blue w-64"
                >
                    <Slider.Control>
                        <Slider.Track>
                            <Slider.Indicator />
                            <Slider.Thumb index={0} />
                            <Slider.Thumb index={1} />
                        </Slider.Track>
                    </Slider.Control>
                </Slider.Root>
            </Row>

            {/* steps — step=10 (palette blue) */}
            <Row label="steps (step=10)">
                <Slider.Root
                    defaultValue={50}
                    step={10}
                    className="palette-blue w-64"
                >
                    <Slider.Control>
                        <Slider.Track>
                            <Slider.Indicator />
                            <Slider.Thumb />
                        </Slider.Track>
                    </Slider.Control>
                </Slider.Root>
            </Row>

            {/* disabled — single thumb, disabled (palette blue) */}
            <Row label="disabled">
                <Slider.Root
                    defaultValue={40}
                    disabled
                    className="palette-blue w-64"
                >
                    <Slider.Control>
                        <Slider.Track>
                            <Slider.Indicator />
                            <Slider.Thumb />
                        </Slider.Track>
                    </Slider.Control>
                </Slider.Root>
            </Row>

            {/* vertical — orientation="vertical" (palette blue) */}
            <Row label="vertical">
                <Slider.Root
                    defaultValue={50}
                    orientation="vertical"
                    className="palette-blue h-40"
                >
                    <Slider.Control>
                        <Slider.Track>
                            <Slider.Indicator />
                            <Slider.Thumb />
                        </Slider.Track>
                    </Slider.Control>
                </Slider.Root>
            </Row>

            {/* field-wrapped — the composition claim: every box style
                comes from field.row, none from the slider (palette blue) */}
            <Row label="in field">
                <Field.Root className="palette-blue w-64">
                    <Field.Label>Volume</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Slider.Root defaultValue={60}>
                                <Slider.Control>
                                    <Slider.Track>
                                        <Slider.Indicator />
                                        <Slider.Thumb />
                                    </Slider.Track>
                                </Slider.Control>
                            </Slider.Root>
                        </Field.Body>
                    </Field.Row>
                    <Field.Description>
                        Drag to change the volume.
                    </Field.Description>
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
            <div className="flex flex-wrap items-center gap-4">{children}</div>
        </div>
    );
}

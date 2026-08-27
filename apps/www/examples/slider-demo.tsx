"use client";

import { Field } from "#/ui/field";
import { Slider } from "#/ui/slider";
import { PaletteGrid } from "@/components/preview/palette-grid";
import { SURFACES } from "@/lib/palette-sets";

// Each cell is a tinted surface palette. The composition claim: every box
// style comes from field.row, none from the slider. The slider track, indicator
// and thumb read roles from the cell. The invalid state is scoped to its own
// Field.Root.
function DemoContent() {
    return (
        <div className="flex flex-col gap-8">
            {/* The composition claim: every box style here comes from
                field.row, none from the slider. */}
            <Field.Root>
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

            {/* Invalid state — by inheritance, no class on any child */}
            <Field.Root invalid>
                <Field.Label>Sensitivity (invalid)</Field.Label>
                <Field.Row>
                    <Field.Body>
                        <Slider.Root defaultValue={30}>
                            <Slider.Control>
                                <Slider.Track>
                                    <Slider.Indicator />
                                    <Slider.Thumb />
                                </Slider.Track>
                            </Slider.Control>
                        </Slider.Root>
                    </Field.Body>
                </Field.Row>
                <Field.Error>Sensitivity is out of range.</Field.Error>
            </Field.Root>

            {/* Range slider — two thumbs, same component */}
            <Field.Root>
                <Field.Label>Price range</Field.Label>
                <Field.Row>
                    <Field.Body>
                        <Slider.Root defaultValue={[25, 75]}>
                            <Slider.Control>
                                <Slider.Track>
                                    <Slider.Indicator />
                                    <Slider.Thumb index={0} />
                                    <Slider.Thumb index={1} />
                                </Slider.Track>
                            </Slider.Control>
                        </Slider.Root>
                    </Field.Body>
                </Field.Row>
            </Field.Root>

            {/* Steps */}
            <Field.Root>
                <Field.Label>Steps (step=10)</Field.Label>
                <Field.Row>
                    <Field.Body>
                        <Slider.Root defaultValue={50} step={10}>
                            <Slider.Control>
                                <Slider.Track>
                                    <Slider.Indicator />
                                    <Slider.Thumb />
                                </Slider.Track>
                            </Slider.Control>
                        </Slider.Root>
                    </Field.Body>
                </Field.Row>
            </Field.Root>

            {/* Disabled */}
            <Field.Root disabled>
                <Field.Label>Disabled</Field.Label>
                <Field.Row>
                    <Field.Body>
                        <Slider.Root defaultValue={40}>
                            <Slider.Control>
                                <Slider.Track>
                                    <Slider.Indicator />
                                    <Slider.Thumb />
                                </Slider.Track>
                            </Slider.Control>
                        </Slider.Root>
                    </Field.Body>
                </Field.Row>
            </Field.Root>

            {/* Vertical */}
            <Field.Root>
                <Field.Label>Vertical</Field.Label>
                <Field.Row className="h-40">
                    <Field.Body className="items-center">
                        <Slider.Root defaultValue={50} orientation="vertical">
                            <Slider.Control>
                                <Slider.Track>
                                    <Slider.Indicator />
                                    <Slider.Thumb />
                                </Slider.Track>
                            </Slider.Control>
                        </Slider.Root>
                    </Field.Body>
                </Field.Row>
            </Field.Root>

            {/* Bare — usable outside Field */}
            <div className="flex flex-col gap-2">
                <span className="text-sm text-palette-accent/85">
                    Bare (no Field)
                </span>
                <Slider.Root defaultValue={70}>
                    <Slider.Control>
                        <Slider.Track>
                            <Slider.Indicator />
                            <Slider.Thumb />
                        </Slider.Track>
                    </Slider.Control>
                </Slider.Root>
            </div>
        </div>
    );
}

export default function SliderDemo() {
    return (
        <PaletteGrid palettes={SURFACES}>
            <DemoContent />
        </PaletteGrid>
    );
}

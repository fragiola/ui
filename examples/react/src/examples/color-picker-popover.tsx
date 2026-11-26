"use client";

import type { ReactNode } from "react";
import { ColorArea } from "#/components/ui/color-area";
import { ColorField } from "#/components/ui/color-field";
import { ColorPicker } from "#/components/ui/color-picker";
import { ColorPickerPopover } from "#/components/ui/color-picker-popover";
import { ColorSlider } from "#/components/ui/color-slider";
import { Field } from "#/components/ui/field";

// The surface-tier palettes: the neutral surface with one chromatic ring, so
// only the trigger's focus ring takes colour. Literal here because examples
// are published source (the code panel shows this file verbatim, with a
// copy button).
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

// A brand colour in a settings form, in the default look: a swatch trigger
// beside a hex field, both bound to one ColorPicker. The trigger opens the
// picker's controls in a popup; the focus moves into it, Escape or a press
// outside closes it and returns the focus to the trigger, and `name`
// submits the hex. The trigger and the field are named by the label
// (`aria-labelledby`, on both bases). Then
// `ColorPickerPopover.Template.Simple`, a disabled one and one row of
// surface-ring palettes.
export default function ColorPickerPopoverDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Field.Root className="max-w-xs">
                <Field.Label id="brand-color-label">Brand color</Field.Label>
                <ColorPicker.Root defaultValue="#7c3aed" name="brand">
                    <div className="flex gap-2">
                        <ColorPickerPopover.Root>
                            <ColorPickerPopover.Trigger
                                id="brand-color-trigger"
                                aria-labelledby="brand-color-label brand-color-trigger"
                            />
                            <ColorPickerPopover.Content aria-label="Choose brand color">
                                <ColorArea.Template.Simple />
                                <ColorSlider.Root
                                    channel="hue"
                                    colorSpace="hsb"
                                >
                                    <ColorSlider.Track>
                                        <ColorSlider.Thumb aria-label="Hue" />
                                    </ColorSlider.Track>
                                </ColorSlider.Root>
                            </ColorPickerPopover.Content>
                        </ColorPickerPopover.Root>
                        <Field.Row>
                            <ColorField.Root>
                                <ColorField.Input aria-labelledby="brand-color-label" />
                            </ColorField.Root>
                        </Field.Row>
                    </div>
                </ColorPicker.Root>
                <Field.Description>
                    Used for the buttons and the links.
                </Field.Description>
            </Field.Root>

            <div className="flex flex-wrap items-start gap-x-10 gap-y-6">
                <Row label="Template.Simple, with swatches">
                    <ColorPickerPopover.Template.Simple
                        aria-label="Accent color"
                        defaultValue="#16a34a"
                        swatches={[
                            "#0f172a",
                            "#2563eb",
                            "#16a34a",
                            "#f59e0b",
                            "#e11d48",
                        ]}
                    />
                </Row>
                <Row label="disabled">
                    <ColorPickerPopover.Template.Simple
                        aria-label="Accent color, disabled"
                        defaultValue="#f59e0b"
                        disabled
                    />
                </Row>
            </div>

            {/* the same picker, only its palette-* class changed */}
            <Row label="palettes">
                <div className="flex flex-wrap gap-3">
                    {SURFACE_RING.map((palette) => (
                        <div key={palette} className={`palette-${palette}`}>
                            <ColorPickerPopover.Template.Simple
                                aria-label={`Color, ${palette}`}
                                defaultValue="#2563eb"
                            />
                        </div>
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

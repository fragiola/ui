"use client";

import type { ReactNode } from "react";
import { Checkbox } from "#/ui/checkbox";
import { Field } from "#/ui/field";
import { Radio, RadioGroup } from "#/ui/radio";
import { Switch } from "#/ui/switch";

// The palette class goes on the field element, not on a wrapping context.
// The floor is palette-surface; each field carries a palette-surface-* class
// — a neutral surface whose only difference from surface is a chromatic
// focus ring. The choice controls (checkbox, radio, switch) read roles from
// the field's palette; focusing shows the coloured ring.
//
// Axes shown, one per row, all aligned:
//   palettes   one checkbox per surface-ring palette
//   checkbox   unchecked / checked / indeterminate / disabled
//   radio      radio group with disabled option
//   switch     unchecked / checked / disabled
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

export default function ChoiceDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            {/* palettes — one checkbox per surface-ring palette; focus to
                see the ring colour. */}
            <Row label="palettes (focus to see ring)">
                {SURFACE_RING.map((palette) => (
                    <Field.ChoiceRoot
                        key={palette}
                        className={`palette-${palette}`}
                    >
                        <Checkbox.Root id={`palette-${palette}`}>
                            <Checkbox.Indicator />
                        </Checkbox.Root>
                        <Field.Label htmlFor={`palette-${palette}`}>
                            {palette}
                        </Field.Label>
                    </Field.ChoiceRoot>
                ))}
            </Row>

            {/* checkbox states — unchecked / checked / indeterminate /
                disabled (palette surface-blue) */}
            <Row label="checkbox">
                <Field.ChoiceRoot className="palette-surface-blue">
                    <Checkbox.Root id="cb-unchecked">
                        <Checkbox.Indicator />
                    </Checkbox.Root>
                    <Field.Label htmlFor="cb-unchecked">Unchecked</Field.Label>
                </Field.ChoiceRoot>

                <Field.ChoiceRoot className="palette-surface-blue">
                    <Checkbox.Root id="cb-checked" defaultChecked>
                        <Checkbox.Indicator />
                    </Checkbox.Root>
                    <Field.Label htmlFor="cb-checked">Checked</Field.Label>
                </Field.ChoiceRoot>

                <Field.ChoiceRoot className="palette-surface-blue">
                    <Checkbox.Root id="cb-indeterminate" indeterminate>
                        <Checkbox.Indicator />
                    </Checkbox.Root>
                    <Field.Label htmlFor="cb-indeterminate">
                        Indeterminate
                    </Field.Label>
                </Field.ChoiceRoot>

                <Field.ChoiceRoot className="palette-surface-blue">
                    <Checkbox.Root id="cb-disabled" disabled>
                        <Checkbox.Indicator />
                    </Checkbox.Root>
                    <Field.Label htmlFor="cb-disabled">Disabled</Field.Label>
                </Field.ChoiceRoot>
            </Row>

            {/* checkbox with description (palette surface-blue) */}
            <Row label="checkbox + description">
                <Field.ChoiceRoot className="palette-surface-blue">
                    <Checkbox.Root id="newsletter" defaultChecked>
                        <Checkbox.Indicator />
                    </Checkbox.Root>
                    <div className="flex flex-col gap-1">
                        <Field.Label htmlFor="newsletter">
                            Subscribe to newsletter
                        </Field.Label>
                        <Field.Description>
                            Get notified about new releases.
                        </Field.Description>
                    </div>
                </Field.ChoiceRoot>
            </Row>

            {/* radio group — with disabled option (palette surface-blue) */}
            <Row label="radio group">
                <Field.Root className="palette-surface-blue">
                    <Field.Label>Notification preference</Field.Label>
                    <RadioGroup defaultValue="email">
                        <Field.ChoiceRoot>
                            <Radio.Root value="email">
                                <Radio.Indicator />
                            </Radio.Root>
                            <Field.Label>Email</Field.Label>
                        </Field.ChoiceRoot>
                        <Field.ChoiceRoot>
                            <Radio.Root value="sms">
                                <Radio.Indicator />
                            </Radio.Root>
                            <Field.Label>SMS</Field.Label>
                        </Field.ChoiceRoot>
                        <Field.ChoiceRoot>
                            <Radio.Root value="push" disabled>
                                <Radio.Indicator />
                            </Radio.Root>
                            <Field.Label>Push (disabled)</Field.Label>
                        </Field.ChoiceRoot>
                    </RadioGroup>
                </Field.Root>
            </Row>

            {/* switch — unchecked / checked / disabled (palette
                surface-blue) */}
            <Row label="switch">
                <Field.ChoiceRoot className="palette-surface-blue">
                    <Switch.Root id="sw-off">
                        <Switch.Thumb />
                    </Switch.Root>
                    <Field.Label htmlFor="sw-off">Off</Field.Label>
                </Field.ChoiceRoot>

                <Field.ChoiceRoot className="palette-surface-blue">
                    <Switch.Root id="sw-on" defaultChecked>
                        <Switch.Thumb />
                    </Switch.Root>
                    <Field.Label htmlFor="sw-on">On</Field.Label>
                </Field.ChoiceRoot>

                <Field.ChoiceRoot className="palette-surface-blue">
                    <Switch.Root id="sw-disabled" disabled>
                        <Switch.Thumb />
                    </Switch.Root>
                    <Field.Label htmlFor="sw-disabled">Disabled</Field.Label>
                </Field.ChoiceRoot>
            </Row>

            {/* switch with description (palette surface-blue) */}
            <Row label="switch + description">
                <Field.ChoiceRoot className="palette-surface-blue">
                    <Switch.Root id="autosave" defaultChecked>
                        <Switch.Thumb />
                    </Switch.Root>
                    <div className="flex flex-col gap-1">
                        <Field.Label htmlFor="autosave">Autosave</Field.Label>
                        <Field.Description>
                            Automatically save changes as you type.
                        </Field.Description>
                    </div>
                </Field.ChoiceRoot>
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
            <div className="flex flex-wrap items-start gap-4">{children}</div>
        </div>
    );
}

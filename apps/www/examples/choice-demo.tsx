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
// Three columns — one per choice type (checkbox, radio, switch). Three rows,
// one per axis:
//   palettes     one control per surface-ring palette (focus to see ring)
//   states       unchecked / checked / indeterminate / disabled
//   description control + label + description
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

export default function ChoiceDemo() {
    return (
        <div className="not-prose palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            {/* palettes — one control per surface-ring palette; focus to
                see the ring colour. */}
            <Section label="palettes (focus to see ring)">
                <Column title="Checkbox">
                    {SURFACE_RING.map((palette) => (
                        <Field.ChoiceRoot
                            key={palette}
                            className={`palette-${palette}`}
                        >
                            <Checkbox.Root
                                id={`cb-palette-${palette}`}
                                defaultChecked
                            >
                                <Checkbox.Indicator />
                            </Checkbox.Root>
                            <Field.Label htmlFor={`cb-palette-${palette}`}>
                                {palette}
                            </Field.Label>
                        </Field.ChoiceRoot>
                    ))}
                </Column>

                <Column title="Radio">
                    {SURFACE_RING.map((palette) => (
                        <RadioGroup
                            key={palette}
                            defaultValue={palette}
                            className={`palette-${palette}`}
                        >
                            <Field.ChoiceRoot>
                                <Radio.Root
                                    value={palette}
                                    id={`rd-palette-${palette}`}
                                >
                                    <Radio.Indicator />
                                </Radio.Root>
                                <Field.Label htmlFor={`rd-palette-${palette}`}>
                                    {palette}
                                </Field.Label>
                            </Field.ChoiceRoot>
                        </RadioGroup>
                    ))}
                </Column>

                <Column title="Switch">
                    {SURFACE_RING.map((palette) => (
                        <Field.ChoiceRoot
                            key={palette}
                            className={`palette-${palette}`}
                        >
                            <Switch.Root
                                id={`sw-palette-${palette}`}
                                defaultChecked
                            >
                                <Switch.Thumb />
                            </Switch.Root>
                            <Field.Label htmlFor={`sw-palette-${palette}`}>
                                {palette}
                            </Field.Label>
                        </Field.ChoiceRoot>
                    ))}
                </Column>
            </Section>

            {/* states — unchecked / checked / indeterminate / disabled
                (palette surface-blue) */}
            <Section label="states">
                <Column title="Checkbox">
                    <Field.ChoiceRoot className="palette-surface-blue">
                        <Checkbox.Root id="cb-unchecked">
                            <Checkbox.Indicator />
                        </Checkbox.Root>
                        <Field.Label htmlFor="cb-unchecked">
                            Unchecked
                        </Field.Label>
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
                        <Field.Label htmlFor="cb-disabled">
                            Disabled
                        </Field.Label>
                    </Field.ChoiceRoot>
                </Column>

                <Column title="Radio">
                    <RadioGroup
                        defaultValue="email"
                        className="palette-surface-blue"
                    >
                        <Field.ChoiceRoot>
                            <Radio.Root value="email" id="rd-email">
                                <Radio.Indicator />
                            </Radio.Root>
                            <Field.Label htmlFor="rd-email">
                                Email (selected)
                            </Field.Label>
                        </Field.ChoiceRoot>
                        <Field.ChoiceRoot>
                            <Radio.Root value="sms" id="rd-sms">
                                <Radio.Indicator />
                            </Radio.Root>
                            <Field.Label htmlFor="rd-sms">SMS</Field.Label>
                        </Field.ChoiceRoot>
                        <Field.ChoiceRoot>
                            <Radio.Root value="push" id="rd-push" disabled>
                                <Radio.Indicator />
                            </Radio.Root>
                            <Field.Label htmlFor="rd-push">
                                Push (disabled)
                            </Field.Label>
                        </Field.ChoiceRoot>
                    </RadioGroup>
                </Column>

                <Column title="Switch">
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
                        <Field.Label htmlFor="sw-disabled">
                            Disabled
                        </Field.Label>
                    </Field.ChoiceRoot>
                </Column>
            </Section>

            {/* description — control + label + description (palette
                surface-blue) */}
            <Section label="with description">
                <Column title="Checkbox">
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
                </Column>

                <Column title="Radio">
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
                        </RadioGroup>
                        <Field.Description>
                            Choose how you want to be notified.
                        </Field.Description>
                    </Field.Root>
                </Column>

                <Column title="Switch">
                    <Field.ChoiceRoot className="palette-surface-blue">
                        <Switch.Root id="autosave" defaultChecked>
                            <Switch.Thumb />
                        </Switch.Root>
                        <div className="flex flex-col gap-1">
                            <Field.Label htmlFor="autosave">
                                Autosave
                            </Field.Label>
                            <Field.Description>
                                Automatically save changes as you type.
                            </Field.Description>
                        </div>
                    </Field.ChoiceRoot>
                </Column>
            </Section>
        </div>
    );
}

// Section — a labelled row of three columns.
function Section({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-palette-accent/85">
                {label}
            </span>
            <div className="grid grid-cols-3 gap-4">{children}</div>
        </div>
    );
}

// Column — a titled column inside a section.
function Column({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-palette-accent/85">
                {title}
            </span>
            <div className="flex flex-col gap-3">{children}</div>
        </div>
    );
}

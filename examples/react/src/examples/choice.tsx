"use client";

import type { ReactNode } from "react";
import { Checkbox } from "#/components/ui/checkbox";
import { Field } from "#/components/ui/field";
import { Radio, RadioGroup } from "#/components/ui/radio";
import { Switch } from "#/components/ui/switch";

// The surface-tier palettes: each is the neutral surface with one chromatic
// ring, which is also the "on" colour of a checkbox, a radio and a switch.
// Literal here because examples are published source (the code panel shows
// this file verbatim, with a copy button).
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

// Notification settings in the default look: a switch, a radio group and a
// checkbox, each in a Field that gives it its label and description. The
// choices carry no palette class: "on" is the floor's ring, the dark
// neutral. Then the states a form needs, and last the same three controls
// in each surface-ring palette, which changes only the "on" colour and the
// focus ring.
export default function ChoiceDemo() {
    return (
        <div className="not-prose palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex max-w-md flex-col gap-5">
                <Field.ChoiceRoot>
                    <Switch.Root id="email-alerts" defaultChecked>
                        <Switch.Thumb />
                    </Switch.Root>
                    <div className="flex flex-col gap-1">
                        <Field.Label htmlFor="email-alerts">
                            Email alerts
                        </Field.Label>
                        <Field.Description>
                            Get an email when someone mentions you.
                        </Field.Description>
                    </div>
                </Field.ChoiceRoot>

                <Field.Root>
                    <Field.Label>Digest</Field.Label>
                    <RadioGroup defaultValue="daily">
                        <Field.ChoiceRoot>
                            <Radio.Root value="daily" id="digest-daily">
                                <Radio.Indicator />
                            </Radio.Root>
                            <Field.Label htmlFor="digest-daily">
                                Daily
                            </Field.Label>
                        </Field.ChoiceRoot>
                        <Field.ChoiceRoot>
                            <Radio.Root value="weekly" id="digest-weekly">
                                <Radio.Indicator />
                            </Radio.Root>
                            <Field.Label htmlFor="digest-weekly">
                                Weekly
                            </Field.Label>
                        </Field.ChoiceRoot>
                        <Field.ChoiceRoot>
                            <Radio.Root value="never" id="digest-never">
                                <Radio.Indicator />
                            </Radio.Root>
                            <Field.Label htmlFor="digest-never">
                                Never
                            </Field.Label>
                        </Field.ChoiceRoot>
                    </RadioGroup>
                </Field.Root>

                <Field.ChoiceRoot>
                    <Checkbox.Root id="product-news">
                        <Checkbox.Indicator />
                    </Checkbox.Root>
                    <div className="flex flex-col gap-1">
                        <Field.Label htmlFor="product-news">
                            Product news
                        </Field.Label>
                        <Field.Description>
                            A short note when we ship something new.
                        </Field.Description>
                    </div>
                </Field.ChoiceRoot>
            </div>

            <Row label="states">
                <Field.ChoiceRoot className="w-auto">
                    <Checkbox.Root id="select-some" indeterminate>
                        <Checkbox.Indicator />
                    </Checkbox.Root>
                    <Field.Label htmlFor="select-some">
                        Some selected
                    </Field.Label>
                </Field.ChoiceRoot>
                <Field.ChoiceRoot className="w-auto">
                    <Checkbox.Root id="locked-check" defaultChecked disabled>
                        <Checkbox.Indicator />
                    </Checkbox.Root>
                    <Field.Label htmlFor="locked-check">Disabled</Field.Label>
                </Field.ChoiceRoot>
                <Field.ChoiceRoot className="w-auto">
                    <Switch.Root id="locked-switch" disabled>
                        <Switch.Thumb />
                    </Switch.Root>
                    <Field.Label htmlFor="locked-switch">Disabled</Field.Label>
                </Field.ChoiceRoot>
            </Row>

            {/* the same controls, only their palette-* class changed */}
            <Row label="palettes">
                {SURFACE_RING.map((palette) => (
                    <div
                        key={palette}
                        className={`palette-${palette} flex items-center gap-3`}
                    >
                        <Checkbox.Root
                            defaultChecked
                            aria-label={`Checkbox, ${palette}`}
                        >
                            <Checkbox.Indicator />
                        </Checkbox.Root>
                        <RadioGroup
                            defaultValue="on"
                            aria-label={`Radio, ${palette}`}
                        >
                            <Radio.Root value="on" aria-label={palette}>
                                <Radio.Indicator />
                            </Radio.Root>
                        </RadioGroup>
                        <Switch.Root
                            defaultChecked
                            aria-label={`Switch, ${palette}`}
                        >
                            <Switch.Thumb />
                        </Switch.Root>
                    </div>
                ))}
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
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {children}
            </div>
        </div>
    );
}

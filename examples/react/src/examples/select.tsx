"use client";

import type { ReactNode } from "react";
import { Field } from "#/components/ui/field";
import { Select } from "#/components/ui/select";

// The surface-tier palettes: each is the neutral surface with one chromatic
// ring, so a select wearing one reads neutral and shows its colour only on
// focus. Literal here because examples are published source (the code panel
// shows this file verbatim, with a copy button).
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

const TIMEZONES = {
    pst: "Pacific (PST)",
    est: "Eastern (EST)",
    brt: "Brasília (BRT)",
    gmt: "Greenwich (GMT)",
    cet: "Central (CET)",
    eet: "Eastern (EET)",
};

const DATE_FORMATS = {
    dmy: "DD/MM/YYYY",
    mdy: "MM/DD/YYYY",
    ymd: "YYYY-MM-DD",
};

// Regional settings in the default look: a select with grouped items, a
// label per group and a separator, and a plain one. The trigger is the same
// box as a field; the popup reads the roles of the palette it was opened
// from, through the portal. `items` maps each value to its label, so the
// trigger shows the label of the chosen item. Then the disabled and invalid
// states, and last the same select in each surface-ring palette (focus one
// to see its ring).
export default function SelectDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex flex-wrap items-start gap-4">
                <Field.Root className="w-60">
                    <Field.Label>Timezone</Field.Label>
                    <Select.Root items={TIMEZONES} defaultValue="pst">
                        <Select.Trigger>
                            <Select.Value placeholder="Select a timezone" />
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Group>
                                <Select.Label>Americas</Select.Label>
                                <Select.Item value="pst">
                                    Pacific (PST)
                                </Select.Item>
                                <Select.Item value="est">
                                    Eastern (EST)
                                </Select.Item>
                                <Select.Item value="brt">
                                    Brasília (BRT)
                                </Select.Item>
                            </Select.Group>
                            <Select.Separator />
                            <Select.Group>
                                <Select.Label>Europe</Select.Label>
                                <Select.Item value="gmt">
                                    Greenwich (GMT)
                                </Select.Item>
                                <Select.Item value="cet">
                                    Central (CET)
                                </Select.Item>
                                <Select.Item value="eet">
                                    Eastern (EET)
                                </Select.Item>
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                </Field.Root>

                <Field.Root className="w-44">
                    <Field.Label>Date format</Field.Label>
                    <Select.Root items={DATE_FORMATS} defaultValue="dmy">
                        <Select.Trigger>
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Item value="dmy">DD/MM/YYYY</Select.Item>
                            <Select.Item value="mdy">MM/DD/YYYY</Select.Item>
                            <Select.Item value="ymd">YYYY-MM-DD</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </Field.Root>
            </div>

            <Row label="states">
                <Field.Root disabled className="w-44">
                    <Field.Label>Currency</Field.Label>
                    <Select.Root>
                        <Select.Trigger>
                            <Select.Value placeholder="USD" />
                        </Select.Trigger>
                    </Select.Root>
                </Field.Root>

                <Field.Root invalid className="w-44">
                    <Field.Label>Country</Field.Label>
                    <Select.Root>
                        <Select.Trigger>
                            <Select.Value placeholder="Select a country" />
                        </Select.Trigger>
                    </Select.Root>
                    <Field.Error match>Select a country.</Field.Error>
                </Field.Root>
            </Row>

            {/* the same select, only its palette-* class changed */}
            <Row label="palettes">
                {SURFACE_RING.map((palette) => (
                    <Field.Root
                        key={palette}
                        className={`palette-${palette} w-40`}
                    >
                        <Select.Root>
                            <Select.Trigger
                                aria-label={`Frequency, ${palette}`}
                            >
                                <Select.Value placeholder={palette} />
                            </Select.Trigger>
                            <Select.Content>
                                <Select.Item value="daily">Daily</Select.Item>
                                <Select.Item value="weekly">Weekly</Select.Item>
                                <Select.Item value="monthly">
                                    Monthly
                                </Select.Item>
                            </Select.Content>
                        </Select.Root>
                    </Field.Root>
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
            <div className="flex flex-wrap items-start gap-4">{children}</div>
        </div>
    );
}

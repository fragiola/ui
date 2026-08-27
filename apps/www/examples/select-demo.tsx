"use client";

import type { ReactNode } from "react";
import { Field } from "#/ui/field";
import { Select } from "#/ui/select";

// The palette class goes on the field element, not on a wrapping context.
// The floor is palette-surface; each Field.Root carries a palette-surface-*
// class — a neutral surface whose only difference from surface is a
// chromatic focus ring. The select trigger, content and items read roles
// from the field's palette; focusing the trigger shows the coloured ring.
// The portal content inherits the palette from the owning subtree.
//
// Axes shown, one per row, all aligned:
//   palettes   one select per surface-ring palette
//   groups     grouped items with labels and separator
//   states     disabled / invalid
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

export default function SelectDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            {/* palettes — one select per surface-ring palette; focus to see
                the ring colour. */}
            <Row label="palettes (focus to see ring)">
                {SURFACE_RING.map((palette) => (
                    <Field.Root
                        key={palette}
                        className={`palette-${palette} w-44`}
                    >
                        <Select.Root defaultValue="apple">
                            <Select.Trigger>
                                <Select.Value />
                            </Select.Trigger>
                            <Select.Content>
                                <Select.Item value="apple">Apple</Select.Item>
                                <Select.Item value="banana">Banana</Select.Item>
                                <Select.Item value="cherry">Cherry</Select.Item>
                            </Select.Content>
                        </Select.Root>
                    </Field.Root>
                ))}
            </Row>

            {/* groups — grouped items with labels and separator (palette
                surface-blue) */}
            <Row label="groups">
                <Field.Root className="palette-surface-blue w-56">
                    <Field.Label>Timezone</Field.Label>
                    <Select.Root>
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
            </Row>

            {/* states — disabled / invalid (palette surface-blue) */}
            <Row label="states">
                <Field.Root disabled className="palette-surface-blue w-44">
                    <Field.Label>Disabled</Field.Label>
                    <Select.Root>
                        <Select.Trigger>
                            <Select.Value placeholder="Cannot select" />
                        </Select.Trigger>
                    </Select.Root>
                </Field.Root>

                <Field.Root invalid className="palette-surface-blue w-44">
                    <Field.Label>Invalid</Field.Label>
                    <Select.Root>
                        <Select.Trigger>
                            <Select.Value placeholder="Select a fruit" />
                        </Select.Trigger>
                    </Select.Root>
                    <Field.Error>Select a fruit.</Field.Error>
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
            <div className="flex flex-wrap items-start gap-4">{children}</div>
        </div>
    );
}

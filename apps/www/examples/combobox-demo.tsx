"use client";

import type { ReactNode } from "react";
import { Combobox } from "#/ui/combobox";
import { Field } from "#/ui/field";

// The palette class goes on the field element, not on a wrapping context.
// The floor is palette-surface; each Field.Root carries a palette-surface-*
// class — a neutral surface whose only difference from surface is a
// chromatic focus ring. The combobox — input, trigger, list and items —
// reads roles from the field's palette; focusing the input shows the
// coloured ring. The portal content inherits the palette from the owning
// subtree.
//
// Combobox.Label labels Combobox.Trigger only. When Combobox.Input is the
// form control, use Field.Label instead — that is what is done here, so the
// console stays clean.
//
// Axes shown, one per row, all aligned:
//   palettes   one combobox per surface-ring palette
//   grouped    groups with labels and separator
//   multiselect  multiple selection with chips
//   states     disabled
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

const frameworks = [
    { value: "react", label: "React" },
    { value: "solid", label: "Solid" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" },
    { value: "angular", label: "Angular" },
];

export default function ComboboxDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            {/* palettes — one combobox per surface-ring palette; focus the
                input to see the ring colour. Field.Label is used instead of
                Combobox.Label because Combobox.Input is the form control. */}
            <Row label="palettes (focus input to see ring)">
                {SURFACE_RING.map((palette) => (
                    <Field.Root
                        key={palette}
                        className={`palette-${palette} w-48`}
                    >
                        <Field.Label>{palette}</Field.Label>
                        <Combobox.Root items={frameworks}>
                            <Combobox.InputGroup>
                                <Combobox.Input placeholder="Search…" />
                                <Combobox.Trigger />
                            </Combobox.InputGroup>
                            <Combobox.Content>
                                <Combobox.List>
                                    {(item) => (
                                        <Combobox.Item
                                            key={item.value}
                                            value={item}
                                        >
                                            {item.label}
                                        </Combobox.Item>
                                    )}
                                </Combobox.List>
                                <Combobox.Empty>No results.</Combobox.Empty>
                            </Combobox.Content>
                        </Combobox.Root>
                    </Field.Root>
                ))}
            </Row>

            {/* grouped — groups with labels and separator (palette
                surface-blue) */}
            <Row label="grouped">
                <Field.Root className="palette-surface-blue w-56">
                    <Field.Label>Framework</Field.Label>
                    <Combobox.Root>
                        <Combobox.InputGroup>
                            <Combobox.Input placeholder="Search…" />
                            <Combobox.Trigger />
                        </Combobox.InputGroup>
                        <Combobox.Content>
                            <Combobox.List>
                                <Combobox.Group>
                                    <Combobox.GroupLabel>
                                        Frontend
                                    </Combobox.GroupLabel>
                                    <Combobox.Item value="react">
                                        React
                                    </Combobox.Item>
                                    <Combobox.Item value="vue">
                                        Vue
                                    </Combobox.Item>
                                    <Combobox.Item value="svelte">
                                        Svelte
                                    </Combobox.Item>
                                </Combobox.Group>
                                <Combobox.Separator />
                                <Combobox.Group>
                                    <Combobox.GroupLabel>
                                        Backend
                                    </Combobox.GroupLabel>
                                    <Combobox.Item value="node">
                                        Node.js
                                    </Combobox.Item>
                                    <Combobox.Item value="deno">
                                        Deno
                                    </Combobox.Item>
                                    <Combobox.Item value="bun">
                                        Bun
                                    </Combobox.Item>
                                </Combobox.Group>
                            </Combobox.List>
                            <Combobox.Empty>No results.</Combobox.Empty>
                        </Combobox.Content>
                    </Combobox.Root>
                </Field.Root>
            </Row>

            {/* multiselect — multiple selection with chips (palette
                surface-blue) */}
            <Row label="multiselect">
                <Field.Root className="palette-surface-blue w-56">
                    <Field.Label>Frameworks (multi)</Field.Label>
                    <Combobox.Root multiple items={frameworks}>
                        <Combobox.Chips />
                        <Combobox.InputGroup>
                            <Combobox.Input placeholder="Search…" />
                            <Combobox.Trigger />
                            <Combobox.Clear />
                        </Combobox.InputGroup>
                        <Combobox.Content>
                            <Combobox.List>
                                {(item) => (
                                    <Combobox.Item
                                        key={item.value}
                                        value={item}
                                    >
                                        {item.label}
                                    </Combobox.Item>
                                )}
                            </Combobox.List>
                            <Combobox.Empty>No results.</Combobox.Empty>
                        </Combobox.Content>
                    </Combobox.Root>
                </Field.Root>
            </Row>

            {/* states — disabled (palette surface-blue) */}
            <Row label="states">
                <Field.Root disabled className="palette-surface-blue w-48">
                    <Field.Label>Disabled</Field.Label>
                    <Combobox.Root items={frameworks}>
                        <Combobox.InputGroup>
                            <Combobox.Input placeholder="Cannot search" />
                            <Combobox.Trigger />
                        </Combobox.InputGroup>
                    </Combobox.Root>
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

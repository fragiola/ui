"use client";

import type { ReactNode } from "react";
import React from "react";
import { field } from "#/components/families/field";
import { Combobox } from "#/components/ui/combobox";
import { Field } from "#/components/ui/field";

// The surface-tier palettes: each is the neutral surface with one chromatic
// ring. Literal here because examples are published source (the code panel
// shows this file verbatim, with a copy button).
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

// A project's settings in the default look: a filtering combobox with
// grouped options, and a multiple one whose choices become chips. The
// fields carry no palette class; the popup reads the roles of the palette it
// was opened from, through the portal. Then the disabled and invalid
// states, and last the same combobox in each surface-ring palette (focus
// one to see its ring).
//
// Combobox.Label labels Combobox.Trigger only. When Combobox.Input is the
// form control, use Field.Label instead — that is what is done here, so the
// console stays clean.
const frameworks = [
    { value: "react", label: "React" },
    { value: "solid", label: "Solid" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" },
    { value: "angular", label: "Angular" },
];

export default function ComboboxDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex flex-wrap items-start gap-4">
                <Field.Root className="w-56">
                    <Field.Label>Stack</Field.Label>
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

                {/* Multiple selection with chips. In multiselect,
                Combobox.Chips IS the input group: it holds the chips (via
                Combobox.Value) and the input together. The input goes inside the Value render prop, after
                the chips — not in a separate InputGroup. Each chip carries a
                ChipRemove button. Items use string values (item.value); the
                Combobox.Value render prop looks up the label from frameworks
                so chips display the human-readable name. */}
                <Field.Root className="w-72">
                    <Field.Label>Frameworks</Field.Label>
                    <Combobox.Root
                        multiple
                        items={frameworks}
                        defaultValue={["react"]}
                    >
                        <Combobox.Chips
                            className={`${field.row()} flex-row items-center gap-1.5 px-3 py-2`}
                        >
                            <Combobox.Value>
                                {(values: string[]) => (
                                    <React.Fragment>
                                        {values.map((value) => {
                                            const framework = frameworks.find(
                                                (f) => f.value === value,
                                            );
                                            return (
                                                <Combobox.Chip key={value}>
                                                    {framework?.label ?? value}
                                                    <Combobox.ChipRemove
                                                        aria-label={`Remove ${framework?.label ?? value}`}
                                                    />
                                                </Combobox.Chip>
                                            );
                                        })}
                                        <Combobox.Input placeholder="Search…" />
                                    </React.Fragment>
                                )}
                            </Combobox.Value>
                            <Combobox.Trigger />
                            <Combobox.Clear />
                        </Combobox.Chips>
                        <Combobox.Content>
                            <Combobox.List>
                                {(item: { value: string; label: string }) => (
                                    <Combobox.Item
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </Combobox.Item>
                                )}
                            </Combobox.List>
                            <Combobox.Empty>No results.</Combobox.Empty>
                        </Combobox.Content>
                    </Combobox.Root>
                </Field.Root>
            </div>

            <Row label="states">
                <Field.Root disabled className="w-48">
                    <Field.Label>Region</Field.Label>
                    <Combobox.Root items={frameworks}>
                        <Combobox.InputGroup>
                            <Combobox.Input placeholder="eu-west-1" />
                            <Combobox.Trigger />
                        </Combobox.InputGroup>
                    </Combobox.Root>
                </Field.Root>

                <Field.Root invalid className="w-48">
                    <Field.Label>Owner</Field.Label>
                    <Combobox.Root items={frameworks}>
                        <Combobox.InputGroup>
                            <Combobox.Input placeholder="Search people…" />
                            <Combobox.Trigger />
                        </Combobox.InputGroup>
                    </Combobox.Root>
                    <Field.Error match>Choose an owner.</Field.Error>
                </Field.Root>
            </Row>

            {/* the same combobox, only its palette-* class changed */}
            <Row label="palettes">
                {SURFACE_RING.map((palette) => (
                    <Field.Root
                        key={palette}
                        className={`palette-${palette} w-40`}
                    >
                        <Combobox.Root items={frameworks}>
                            <Combobox.InputGroup>
                                <Combobox.Input
                                    aria-label={palette}
                                    placeholder={palette}
                                />
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

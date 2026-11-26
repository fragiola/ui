"use client";

import { type ReactNode, useState } from "react";
import { ColorSwatch } from "#/components/ui/color-swatch";
import { ColorSwatchPicker } from "#/components/ui/color-swatch-picker";
import { Field } from "#/components/ui/field";

// The surface-tier palettes: the neutral surface with one chromatic ring, so
// only the chosen swatch's frame and the focus ring take colour. Literal
// here because examples are published source (the code panel shows this
// file verbatim, with a copy button).
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

const LABELS = [
    { value: "#64748b", label: "Slate" },
    { value: "#2563eb", label: "Ocean" },
    { value: "#7c3aed", label: "Violet" },
    { value: "#16a34a", label: "Forest" },
    { value: "#f59e0b", label: "Amber" },
    { value: "#ea580c", label: "Tangerine" },
    { value: "#e11d48", label: "Rose" },
] as const;

// A project's label colour in the default look: one option per colour, each
// a named ColorSwatch. Tab into the list, move with the arrows (they wrap
// along a row), choose with Space or Enter; a focus move never chooses.
// The chosen swatch is `checked`: the ring frame around it. The list is
// named by its label (`aria-labelledby`, on both bases) and `name` submits
// the hex. Then `Template.Simple` wrapping into rows (the up and down
// arrows move between them), a disabled picker and one row of surface-ring
// palettes.
export default function ColorSwatchPickerDemo() {
    const [label, setLabel] = useState<string>("Ocean");
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Field.Root className="max-w-xs">
                <Field.Label id="label-color">Label color</Field.Label>
                <ColorSwatchPicker.Root
                    aria-labelledby="label-color"
                    defaultValue="#2563eb"
                    name="label"
                    onValueChange={(value) =>
                        setLabel(
                            LABELS.find(
                                (entry) =>
                                    value !== null &&
                                    "red" in value &&
                                    entry.value === toHex(value),
                            )?.label ?? "Custom",
                        )
                    }
                >
                    {LABELS.map((entry) => (
                        <ColorSwatchPicker.Item
                            key={entry.value}
                            value={entry.value}
                        >
                            <ColorSwatch
                                color={entry.value}
                                aria-label={entry.label}
                            />
                        </ColorSwatchPicker.Item>
                    ))}
                </ColorSwatchPicker.Root>
                <Field.Description>The label is {label}.</Field.Description>
            </Field.Root>

            <div className="flex flex-wrap items-start gap-x-10 gap-y-6">
                <Row label="rows, Template.Simple">
                    <ColorSwatchPicker.Template.Simple
                        aria-label="Accent"
                        className="w-48"
                        colors={[
                            "#ef4444",
                            "#f97316",
                            "#eab308",
                            "#22c55e",
                            "#06b6d4",
                            "#3b82f6",
                            "#8b5cf6",
                            "#ec4899",
                            "#78716c",
                            "#0f172a",
                        ]}
                    />
                </Row>
                <Row label="disabled">
                    <ColorSwatchPicker.Template.Simple
                        aria-label="Accent, disabled"
                        defaultValue="#2563eb"
                        disabled
                        colors={LABELS.slice(0, 4)}
                    />
                </Row>
            </div>

            {/* the same picker, only its palette-* class changed */}
            <Row label="palettes">
                {SURFACE_RING.map((palette) => (
                    <ColorSwatchPicker.Template.Simple
                        key={palette}
                        aria-label={`Accent, ${palette}`}
                        className={`palette-${palette}`}
                        defaultValue="#2563eb"
                        colors={LABELS.slice(0, 3)}
                    />
                ))}
            </Row>
        </div>
    );
}

/** An rgb colour as `#rrggbb` (the picker reports the chosen swatch's). */
function toHex(value: { red: number; green: number; blue: number }) {
    return `#${[value.red, value.green, value.blue]
        .map((channel) => channel.toString(16).padStart(2, "0"))
        .join("")}`;
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

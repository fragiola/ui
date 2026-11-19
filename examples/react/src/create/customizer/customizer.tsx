import type { ReactNode } from "react";
import { Clickable } from "#/components/atoms/clickable";
import { Field } from "#/components/ui/field";
import { Select } from "#/components/ui/select";
import { Slider } from "#/components/ui/slider";
import {
    AXES,
    AXIS_LABELS,
    AXIS_NAMES,
    CHROMAS,
    type Design,
    DIRECTIONS,
    PRESETS,
    SCHEMES,
    TINTS,
} from "../design/design";

// The customizer: every option of the design, one compact picker each, so
// the whole panel fits beside the preview. It edits a Design and nothing
// else: the preview document applies it, this document never changes.

type Props = { design: Design; set: (patch: Partial<Design>) => void };

export function Customizer({ design, set }: Props) {
    return (
        <div className="flex flex-col gap-6">
            <Group label="Colour">
                <div
                    role="radiogroup"
                    aria-label="Colour"
                    className="col-span-full grid grid-cols-3 gap-1.5"
                >
                    {PRESETS.map((preset) => {
                        const selected = design.hue === preset.hue;
                        return (
                            <Clickable.Button
                                key={preset.name}
                                role="radio"
                                aria-checked={selected}
                                variant={selected ? "outline" : "ghost"}
                                size="sm"
                                onClick={() => set({ hue: preset.hue })}
                                className="justify-start px-2 text-xs"
                            >
                                <span
                                    aria-hidden
                                    className={`size-3 shrink-0 rounded-full bg-palette-base ${
                                        preset.hue === null
                                            ? "palette-neutral"
                                            : `palette-${preset.name}`
                                    }`}
                                />
                                {preset.name}
                            </Clickable.Button>
                        );
                    })}
                </div>
                <Slider.Root
                    aria-label="Hue"
                    min={0}
                    max={359}
                    value={design.hue ?? 250}
                    onValueChange={(value) =>
                        set({ hue: Array.isArray(value) ? value[0] : value })
                    }
                    className="col-span-full"
                >
                    <div className="flex justify-between text-xs text-palette-accent/85">
                        <span>Hue</span>
                        <span className="tabular-nums">
                            {design.hue ?? "neutral"}
                        </span>
                    </div>
                    <Slider.Control className="h-6">
                        <Slider.Track className="bg-[linear-gradient(to_right,oklch(0.65_0.15_0),oklch(0.65_0.15_60),oklch(0.65_0.15_120),oklch(0.65_0.15_180),oklch(0.65_0.15_240),oklch(0.65_0.15_300),oklch(0.65_0.15_360))] rtl:bg-[linear-gradient(to_left,oklch(0.65_0.15_0),oklch(0.65_0.15_60),oklch(0.65_0.15_120),oklch(0.65_0.15_180),oklch(0.65_0.15_240),oklch(0.65_0.15_300),oklch(0.65_0.15_360))]">
                            <Slider.Thumb />
                        </Slider.Track>
                    </Slider.Control>
                </Slider.Root>
                <Picker
                    label="Chroma"
                    values={CHROMAS}
                    value={design.chroma}
                    disabled={design.hue === null}
                    onChange={(chroma) => set({ chroma })}
                />
                <Picker
                    label="Neutral tint"
                    values={TINTS}
                    value={design.tint}
                    disabled={design.hue === null}
                    onChange={(tint) => set({ tint })}
                />
            </Group>

            <Group label="Design axes">
                {AXIS_NAMES.map((axis) => (
                    <Picker
                        key={axis}
                        label={AXIS_LABELS[axis]}
                        values={AXES[axis]}
                        value={design.axes[axis]}
                        onChange={(level) =>
                            set({ axes: { ...design.axes, [axis]: level } })
                        }
                    />
                ))}
            </Group>

            <Group label="Preview">
                <Picker
                    label="Scheme"
                    values={SCHEMES}
                    value={design.scheme}
                    onChange={(scheme) => set({ scheme })}
                />
                <Picker
                    label="Direction"
                    values={DIRECTIONS}
                    value={design.dir}
                    onChange={(dir) => set({ dir })}
                />
            </Group>
        </div>
    );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
    return (
        <fieldset className="grid grid-cols-2 gap-3">
            <legend className="mb-3 font-mono text-xs text-palette-accent/85">
                {label.toLowerCase()}
            </legend>
            {children}
        </fieldset>
    );
}

function Picker<T extends string>({
    label,
    values,
    value,
    disabled,
    onChange,
}: {
    label: string;
    values: readonly T[];
    value: T;
    disabled?: boolean;
    onChange: (value: T) => void;
}) {
    return (
        <Field.Root disabled={disabled} className="min-w-0">
            <Field.Label className="text-xs">{label}</Field.Label>
            <Select.Root
                value={value}
                disabled={disabled}
                onValueChange={(next) => onChange(next as T)}
            >
                <Select.Trigger className="h-8 py-1 text-xs">
                    <Select.Value />
                </Select.Trigger>
                <Select.Content>
                    {values.map((v) => (
                        <Select.Item key={v} value={v}>
                            {v}
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Root>
        </Field.Root>
    );
}

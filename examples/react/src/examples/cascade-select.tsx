"use client";

import { useState } from "react";
import {
    type CascadeItem,
    CascadeSelect,
} from "#/components/ui/cascade-select";
import { Field } from "#/components/ui/field";

// A shipping destination chosen level by level: a region, then a country,
// then a city. Hovering or Right (Left in RTL) opens a level, Left goes
// back, and choosing a city closes. The trigger shows the whole path; the
// form submits it joined by "/". Named by its label on every base
// (`aria-labelledby`). Then the disabled state.
const DESTINATIONS: CascadeItem[] = [
    {
        value: "europe",
        label: "Europe",
        children: [
            {
                value: "france",
                label: "France",
                children: [
                    { value: "paris", label: "Paris" },
                    { value: "lyon", label: "Lyon" },
                    { value: "marseille", label: "Marseille" },
                ],
            },
            {
                value: "portugal",
                label: "Portugal",
                children: [
                    { value: "lisbon", label: "Lisbon" },
                    { value: "porto", label: "Porto" },
                ],
            },
        ],
    },
    {
        value: "americas",
        label: "Americas",
        children: [
            {
                value: "brazil",
                label: "Brazil",
                children: [
                    { value: "sao-paulo", label: "São Paulo" },
                    { value: "recife", label: "Recife" },
                ],
            },
            {
                value: "canada",
                label: "Canada",
                children: [
                    { value: "toronto", label: "Toronto" },
                    { value: "montreal", label: "Montréal", disabled: true },
                ],
            },
        ],
    },
    { value: "antarctica", label: "Antarctica", disabled: true },
];

export default function CascadeSelectDemo() {
    const [path, setPath] = useState<readonly string[]>([
        "europe",
        "portugal",
        "lisbon",
    ]);
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Field.Root className="w-72">
                <Field.Label id="destination-label">Destination</Field.Label>
                <CascadeSelect.Template.Simple
                    items={DESTINATIONS}
                    value={path}
                    onValueChange={(value: readonly string[]) => setPath(value)}
                    name="destination"
                    placeholder="Choose a city"
                    separator=" / "
                    aria-labelledby="destination-label"
                />
                <Field.Description>
                    Submits “{path.join("/") || "nothing"}”.
                </Field.Description>
            </Field.Root>

            <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-palette-accent/85">
                    disabled
                </span>
                <CascadeSelect.Template.Simple
                    items={DESTINATIONS}
                    disabled
                    placeholder="Choose a city"
                    aria-labelledby="destination-label"
                    className="w-72"
                />
            </div>
        </div>
    );
}

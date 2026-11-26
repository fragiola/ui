"use client";

import { ComboboxVirtual } from "#/components/ui/combobox-virtual";
import { Field } from "#/components/ui/field";

// A combobox over 10,000 cities that renders only the matches in view:
// typing filters all of them, the arrows wrap through the input, and the
// chosen city stays reachable. It is Combobox's twin — the same input box,
// popup and options — and is Fragiola Primitives' Combobox on every base,
// so its input is named by its label (`aria-labelledby`).
const CITIES = Array.from(
    { length: 10_000 },
    (_, i) =>
        `${["North", "South", "East", "West", "New"][i % 5]} ${["Haven", "Bridge", "Field", "Port", "Ridge", "Falls"][i % 6]} ${Math.floor(i / 30) + 1}`,
);

export default function ComboboxVirtualDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-3 bg-palette-base text-palette-contrast">
            <Field.Root className="w-64">
                <Field.Label id="city-label">City</Field.Label>
                <ComboboxVirtual.Root items={CITIES}>
                    <ComboboxVirtual.InputGroup>
                        <ComboboxVirtual.Input
                            aria-labelledby="city-label"
                            placeholder="Search 10,000 cities…"
                        />
                        <ComboboxVirtual.Clear />
                        <ComboboxVirtual.Trigger />
                    </ComboboxVirtual.InputGroup>
                    <ComboboxVirtual.Content className="max-h-80">
                        <ComboboxVirtual.Empty>
                            No city found.
                        </ComboboxVirtual.Empty>
                        <ComboboxVirtual.List>
                            {(city: string) => (
                                <ComboboxVirtual.Item key={city} value={city}>
                                    {city}
                                </ComboboxVirtual.Item>
                            )}
                        </ComboboxVirtual.List>
                    </ComboboxVirtual.Content>
                </ComboboxVirtual.Root>
            </Field.Root>
        </div>
    );
}

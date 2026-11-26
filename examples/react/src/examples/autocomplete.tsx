"use client";

import { Autocomplete } from "#/components/ui/autocomplete";
import { Field } from "#/components/ui/field";

const CITIES = [
    "Amsterdam",
    "Athens",
    "Barcelona",
    "Berlin",
    "Lisbon",
    "London",
    "Madrid",
    "Paris",
    "Prague",
    "Rome",
    "Vienna",
];

// A trip form in the default look: the destination is free text, and the
// list suggests cities that match what is typed (the arrows move, Enter
// picks, Escape closes). Picking fills the input; nothing is selected, so
// any city may be typed. The box is the field's, the popup the menu's, the
// items menu items. Then the disabled state.
export default function AutocompleteDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Field.Root className="max-w-sm">
                <Field.Label>Destination</Field.Label>
                <Autocomplete.Root items={CITIES}>
                    <Autocomplete.InputGroup>
                        <Autocomplete.Input placeholder="City…" />
                        <Autocomplete.Clear />
                        <Autocomplete.Trigger />
                    </Autocomplete.InputGroup>
                    <Autocomplete.Content>
                        <Autocomplete.Empty>
                            No city matches.
                        </Autocomplete.Empty>
                        <Autocomplete.List>
                            {(city: string) => (
                                <Autocomplete.Item key={city} value={city}>
                                    {city}
                                </Autocomplete.Item>
                            )}
                        </Autocomplete.List>
                    </Autocomplete.Content>
                </Autocomplete.Root>
                <Field.Description>Type a city, or pick one.</Field.Description>
            </Field.Root>

            <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-palette-accent/85">
                    states
                </span>
                <Field.Root className="max-w-sm" disabled>
                    <Field.Label>Return</Field.Label>
                    <Autocomplete.Root items={CITIES} disabled>
                        <Autocomplete.InputGroup>
                            <Autocomplete.Input placeholder="City…" />
                            <Autocomplete.Trigger />
                        </Autocomplete.InputGroup>
                    </Autocomplete.Root>
                </Field.Root>
            </div>
        </div>
    );
}

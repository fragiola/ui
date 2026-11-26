import type { ReactNode } from "react";
import { Autocomplete } from "#/components/ui/autocomplete";
import { AutocompleteVirtual } from "#/components/ui/autocomplete-virtual";
import { Combobox } from "#/components/ui/combobox";
import { ComboboxVirtual } from "#/components/ui/combobox-virtual";
import { Command } from "#/components/ui/command";
import { CommandVirtual } from "#/components/ui/command-virtual";
import { Listbox } from "#/components/ui/listbox";
import { ListboxVirtual } from "#/components/ui/listbox-virtual";
import { Select } from "#/components/ui/select";
import { SelectVirtual } from "#/components/ui/select-virtual";

// Each virtual list beside its twin (Epic #166): the twin over 50 items,
// the virtual one over 10,000 — the spec's scenario items, "Item <n>", item
// 7777 labelled "Zulu" and item 3 disabled. They must look the same (the
// trigger, the popup, the rows, the highlight, the check), and the virtual
// one must scroll 10,000 rows smoothly and reach "Zulu" by typing. On the
// Base UI base the twins are Base UI's and the virtual ones Fragiola
// Primitives' (primitives-backed), so this is also the cross-base check.
const ITEMS = Array.from({ length: 10_000 }, (_, i) => ({
    value: `item-${i + 1}`,
    label: i === 7776 ? "Zulu" : `Item ${i + 1}`,
    disabled: i === 2,
}));
const FEW = ITEMS.slice(0, 50);
const LABELS = ITEMS.map((item) => item.label);

function Pair({
    name,
    twin,
    virtual,
}: {
    name: string;
    twin: ReactNode;
    virtual: ReactNode;
}) {
    return (
        <section className="flex flex-col gap-2">
            <span className="font-mono text-xs text-palette-accent/85">
                {name}: twin (50) · virtual (10,000)
            </span>
            <div className="flex flex-wrap items-start gap-6">
                <div className="w-60">{twin}</div>
                <div className="w-60">{virtual}</div>
            </div>
        </section>
    );
}

export default function VirtualTwins() {
    return (
        <div className="palette-surface flex flex-col gap-8 rounded-lg border border-palette-line bg-palette-base p-6 text-palette-contrast">
            <Pair
                name="select"
                twin={
                    <Select.Root items={FEW}>
                        <Select.Trigger aria-label="Select">
                            <Select.Value placeholder="Select an item" />
                        </Select.Trigger>
                        <Select.Content className="max-h-80">
                            {FEW.map((item) => (
                                <Select.Item
                                    key={item.value}
                                    value={item.value}
                                    disabled={item.disabled}
                                >
                                    {item.label}
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Root>
                }
                virtual={
                    <SelectVirtual.Root items={ITEMS}>
                        <SelectVirtual.Trigger aria-label="Select virtual">
                            <SelectVirtual.Value placeholder="Select an item" />
                        </SelectVirtual.Trigger>
                        <SelectVirtual.Content className="max-h-80">
                            <SelectVirtual.List>
                                {(item) => (
                                    <SelectVirtual.Item
                                        key={item.value}
                                        value={item.value}
                                        disabled={item.disabled}
                                    >
                                        {item.label}
                                    </SelectVirtual.Item>
                                )}
                            </SelectVirtual.List>
                        </SelectVirtual.Content>
                    </SelectVirtual.Root>
                }
            />
            <Pair
                name="combobox"
                twin={
                    <Combobox.Root items={LABELS.slice(0, 50)}>
                        <Combobox.InputGroup>
                            <Combobox.Input aria-label="Combobox" />
                            <Combobox.Trigger />
                        </Combobox.InputGroup>
                        <Combobox.Content className="max-h-80">
                            <Combobox.List>
                                {(label: string) => (
                                    <Combobox.Item key={label} value={label}>
                                        {label}
                                    </Combobox.Item>
                                )}
                            </Combobox.List>
                        </Combobox.Content>
                    </Combobox.Root>
                }
                virtual={
                    <ComboboxVirtual.Root items={LABELS}>
                        <ComboboxVirtual.InputGroup>
                            <ComboboxVirtual.Input aria-label="Combobox virtual" />
                            <ComboboxVirtual.Trigger />
                        </ComboboxVirtual.InputGroup>
                        <ComboboxVirtual.Content className="max-h-80">
                            <ComboboxVirtual.List>
                                {(label: string) => (
                                    <ComboboxVirtual.Item
                                        key={label}
                                        value={label}
                                    >
                                        {label}
                                    </ComboboxVirtual.Item>
                                )}
                            </ComboboxVirtual.List>
                        </ComboboxVirtual.Content>
                    </ComboboxVirtual.Root>
                }
            />
            <Pair
                name="autocomplete"
                twin={
                    <Autocomplete.Root items={LABELS.slice(0, 50)}>
                        <Autocomplete.InputGroup>
                            <Autocomplete.Input aria-label="Autocomplete" />
                        </Autocomplete.InputGroup>
                        <Autocomplete.Content className="max-h-80">
                            <Autocomplete.List>
                                {(label: string) => (
                                    <Autocomplete.Item
                                        key={label}
                                        value={label}
                                    >
                                        {label}
                                    </Autocomplete.Item>
                                )}
                            </Autocomplete.List>
                        </Autocomplete.Content>
                    </Autocomplete.Root>
                }
                virtual={
                    <AutocompleteVirtual.Root items={LABELS}>
                        <AutocompleteVirtual.InputGroup>
                            <AutocompleteVirtual.Input aria-label="Autocomplete virtual" />
                        </AutocompleteVirtual.InputGroup>
                        <AutocompleteVirtual.Content className="max-h-80">
                            <AutocompleteVirtual.List>
                                {(label: string) => (
                                    <AutocompleteVirtual.Item
                                        key={label}
                                        value={label}
                                    >
                                        {label}
                                    </AutocompleteVirtual.Item>
                                )}
                            </AutocompleteVirtual.List>
                        </AutocompleteVirtual.Content>
                    </AutocompleteVirtual.Root>
                }
            />
            <Pair
                name="listbox"
                twin={
                    <Listbox.Root
                        multiple
                        aria-label="Listbox"
                        className="max-h-80"
                    >
                        {FEW.map((item) => (
                            <Listbox.Item
                                key={item.value}
                                value={item.value}
                                disabled={item.disabled}
                            >
                                {item.label}
                            </Listbox.Item>
                        ))}
                    </Listbox.Root>
                }
                virtual={
                    <ListboxVirtual.Root
                        multiple
                        aria-label="Listbox virtual"
                        items={ITEMS}
                        className="max-h-80"
                    >
                        {(item) => (
                            <ListboxVirtual.Item
                                key={item.value}
                                value={item.value}
                                disabled={item.disabled}
                            >
                                {item.label}
                            </ListboxVirtual.Item>
                        )}
                    </ListboxVirtual.Root>
                }
            />
            <Pair
                name="command"
                twin={
                    <Command.Root className="h-auto">
                        <Command.Input aria-label="Command" />
                        <Command.List>
                            {FEW.map((item) => (
                                <Command.Item
                                    key={item.value}
                                    value={item.label}
                                    disabled={item.disabled}
                                >
                                    {item.label}
                                </Command.Item>
                            ))}
                        </Command.List>
                        <Command.Empty>No results.</Command.Empty>
                    </Command.Root>
                }
                virtual={
                    <CommandVirtual.Root className="h-auto">
                        <CommandVirtual.Input aria-label="Command virtual" />
                        <CommandVirtual.List
                            items={ITEMS.map((item) => ({
                                ...item,
                                value: item.label,
                            }))}
                        >
                            {(entry: { value: string; disabled?: boolean }) => (
                                <CommandVirtual.Item
                                    key={entry.value}
                                    value={entry.value}
                                    disabled={entry.disabled}
                                >
                                    {entry.value}
                                </CommandVirtual.Item>
                            )}
                        </CommandVirtual.List>
                        <CommandVirtual.Empty>No results.</CommandVirtual.Empty>
                    </CommandVirtual.Root>
                }
            />
        </div>
    );
}

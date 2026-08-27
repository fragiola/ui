"use client";

import { Combobox } from "#/ui/combobox";
import { PaletteGrid } from "@/components/preview/palette-grid";
import { SURFACES } from "@/lib/palette-sets";

// Each cell is a tinted surface palette. The combobox — input, trigger, list
// and items — reads roles from the cell. The portal content inherits the
// palette from the cell that owns the root.
const frameworks = [
    { value: "react", label: "React" },
    { value: "solid", label: "Solid" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" },
    { value: "angular", label: "Angular" },
];

function DemoContent() {
    return (
        <div className="flex flex-col gap-8">
            {/* Basic — single selection */}
            <Combobox.Root items={frameworks}>
                <Combobox.Label>Framework</Combobox.Label>
                <Combobox.InputGroup>
                    <Combobox.Input placeholder="Search…" />
                    <Combobox.Trigger />
                    <Combobox.Clear />
                </Combobox.InputGroup>
                <Combobox.Content>
                    <Combobox.List>
                        {(item) => (
                            <Combobox.Item key={item.value} value={item}>
                                {item.label}
                            </Combobox.Item>
                        )}
                    </Combobox.List>
                    <Combobox.Empty>No results found.</Combobox.Empty>
                </Combobox.Content>
            </Combobox.Root>

            {/* Multiselect with chips */}
            <Combobox.Root multiple items={frameworks}>
                <Combobox.Label>Frameworks (multi)</Combobox.Label>
                <Combobox.InputGroup>
                    <Combobox.Input placeholder="Search…" />
                    <Combobox.Trigger />
                    <Combobox.Clear />
                </Combobox.InputGroup>
                <Combobox.Content>
                    <Combobox.List>
                        {(item) => (
                            <Combobox.Item key={item.value} value={item}>
                                {item.label}
                            </Combobox.Item>
                        )}
                    </Combobox.List>
                    <Combobox.Empty>No results found.</Combobox.Empty>
                </Combobox.Content>
            </Combobox.Root>

            {/* Grouped */}
            <Combobox.Root>
                <Combobox.Label>Grouped</Combobox.Label>
                <Combobox.InputGroup>
                    <Combobox.Input placeholder="Search…" />
                    <Combobox.Trigger />
                </Combobox.InputGroup>
                <Combobox.Content>
                    <Combobox.List>
                        <Combobox.Group>
                            <Combobox.GroupLabel>Frontend</Combobox.GroupLabel>
                            <Combobox.Item value="react">React</Combobox.Item>
                            <Combobox.Item value="vue">Vue</Combobox.Item>
                            <Combobox.Item value="svelte">Svelte</Combobox.Item>
                        </Combobox.Group>
                        <Combobox.Separator />
                        <Combobox.Group>
                            <Combobox.GroupLabel>Backend</Combobox.GroupLabel>
                            <Combobox.Item value="node">Node.js</Combobox.Item>
                            <Combobox.Item value="deno">Deno</Combobox.Item>
                            <Combobox.Item value="bun">Bun</Combobox.Item>
                        </Combobox.Group>
                    </Combobox.List>
                    <Combobox.Empty>No results found.</Combobox.Empty>
                </Combobox.Content>
            </Combobox.Root>
        </div>
    );
}

export default function ComboboxDemo() {
    return (
        <PaletteGrid palettes={SURFACES}>
            <DemoContent />
        </PaletteGrid>
    );
}

"use client";

import { AutocompleteVirtual } from "#/components/ui/autocomplete-virtual";
import { Field } from "#/components/ui/field";

// A search box suggesting from 10,000 tags that renders only the matches in
// view: picking one fills the input, the text stays the value. It is
// Autocomplete's twin — the same box, popup and rows — and is Fragiola
// Primitives' Autocomplete on every base, so its input is named by its
// label (`aria-labelledby`).
const TAGS = Array.from(
    { length: 10_000 },
    (_, i) =>
        `${["design", "frontend", "backend", "infra", "docs", "research"][i % 6]}-${i + 1}`,
);

export default function AutocompleteVirtualDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-3 bg-palette-base text-palette-contrast">
            <Field.Root className="w-64">
                <Field.Label id="tag-label">Tag</Field.Label>
                <AutocompleteVirtual.Root items={TAGS}>
                    <AutocompleteVirtual.InputGroup>
                        <AutocompleteVirtual.Input
                            aria-labelledby="tag-label"
                            placeholder="Search 10,000 tags…"
                        />
                        <AutocompleteVirtual.Clear />
                        <AutocompleteVirtual.Trigger />
                    </AutocompleteVirtual.InputGroup>
                    <AutocompleteVirtual.Content className="max-h-80">
                        <AutocompleteVirtual.Empty>
                            No tag found.
                        </AutocompleteVirtual.Empty>
                        <AutocompleteVirtual.List>
                            {(tag: string) => (
                                <AutocompleteVirtual.Item key={tag} value={tag}>
                                    {tag}
                                </AutocompleteVirtual.Item>
                            )}
                        </AutocompleteVirtual.List>
                    </AutocompleteVirtual.Content>
                </AutocompleteVirtual.Root>
            </Field.Root>
        </div>
    );
}

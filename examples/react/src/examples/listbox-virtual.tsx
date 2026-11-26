"use client";

import { useState } from "react";
import { Field } from "#/components/ui/field";
import {
    ListboxVirtual,
    type ListboxVirtualItem,
} from "#/components/ui/listbox-virtual";

// A list of 10,000 customers that renders only the rows in view: Tab into
// it, then End, Page Down or typing a name reach any of them, and Shift and
// Ctrl+A choose ranges and every customer, all of it kept in the form value.
// It is Listbox's twin: the same box and rows.
const CUSTOMERS: ListboxVirtualItem[] = Array.from(
    { length: 10_000 },
    (_, i) => ({
        value: `customer-${i + 1}`,
        label: `Customer ${String(i + 1).padStart(5, "0")}`,
        disabled: i % 97 === 3,
    }),
);

export default function ListboxVirtualDemo() {
    const [chosen, setChosen] = useState<string[]>([]);
    return (
        <div className="palette-surface flex w-full flex-col gap-3 bg-palette-base text-palette-contrast">
            <Field.Root className="w-64">
                <Field.Label id="customers-label">Customers</Field.Label>
                <ListboxVirtual.Root
                    multiple
                    aria-labelledby="customers-label"
                    items={CUSTOMERS}
                    value={chosen}
                    onValueChange={(value: string[]) => setChosen(value)}
                    name="customers"
                    className="max-h-72"
                >
                    {(item: ListboxVirtualItem) => (
                        <ListboxVirtual.Item
                            key={item.value}
                            value={item.value}
                            disabled={item.disabled}
                        >
                            {item.label}
                        </ListboxVirtual.Item>
                    )}
                </ListboxVirtual.Root>
                <Field.Description>
                    {chosen.length.toLocaleString("en-US")} of 10,000 chosen
                </Field.Description>
            </Field.Root>
        </div>
    );
}

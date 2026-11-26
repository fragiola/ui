"use client";

import { Field } from "#/components/ui/field";
import {
    type SelectItemData,
    SelectVirtual,
} from "#/components/ui/select-virtual";

// A select over 10,000 products that renders only the options in view:
// End highlights the last product, typing jumps to a name, and the
// highlighted option scrolls into view. It is Select's twin — the same
// trigger, popup and options — and is Fragiola Primitives' Select on every
// base, so it is named by its label (`aria-labelledby`).
const PRODUCTS: SelectItemData[] = Array.from({ length: 10_000 }, (_, i) => ({
    value: `sku-${i + 1}`,
    label: `SKU ${String(i + 1).padStart(5, "0")}`,
}));

export default function SelectVirtualDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-3 bg-palette-base text-palette-contrast">
            <Field.Root className="w-60">
                <Field.Label id="product-label">Product</Field.Label>
                <SelectVirtual.Root items={PRODUCTS} name="product">
                    <SelectVirtual.Trigger
                        id="product-trigger"
                        aria-labelledby="product-label product-trigger"
                    >
                        <SelectVirtual.Value placeholder="Select a product" />
                    </SelectVirtual.Trigger>
                    <SelectVirtual.Content className="max-h-80">
                        <SelectVirtual.List>
                            {(item: SelectItemData) => (
                                <SelectVirtual.Item
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </SelectVirtual.Item>
                            )}
                        </SelectVirtual.List>
                    </SelectVirtual.Content>
                </SelectVirtual.Root>
            </Field.Root>
        </div>
    );
}

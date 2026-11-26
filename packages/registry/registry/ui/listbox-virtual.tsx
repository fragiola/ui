"use client";

import {
    type ListboxVirtualItem,
    ListboxVirtual as ListboxVirtualPrimitive,
    type ListboxVirtualRootProps,
} from "@fragiola/primitives-react/listbox-virtual";
import { menu } from "#/families/menu";
import { cn } from "#/lib/cn";
import { PrimitivesDirection } from "#/lib/primitives-backed";
import { Listbox } from "#/ui/listbox";

// Listbox Virtual — a Listbox of thousands of options that renders only the
// ones in view (spec/virtual-lists.md): the keys, the typeahead, the ranges
// and the form value still reach every option, each option carries its
// place in the set (`aria-setsize`, `aria-posinset`), and `onLoadMore` asks
// for the next page when the last row comes into view.
//
// Primitives-backed, like Listbox. It is Listbox's twin: the Root is
// `menu.list` and the options are `Listbox.Item` (`menu.option`), so the
// two look the same. The Root takes `items` (`{ value, label, disabled? }`)
// and a function that returns a `ListboxVirtual.Item` for each one in view.
// A virtual list is flat (no groups) and vertical, and scrolls itself: give
// it a height (`max-h-80`).

function ListboxVirtualRoot({ className, ...props }: ListboxVirtualRootProps) {
    return (
        <PrimitivesDirection>
            <ListboxVirtualPrimitive.Root
                data-slot="listbox"
                className={cn(menu.list(), className as string)}
                {...(props as ListboxVirtualRootProps)}
            />
        </PrimitivesDirection>
    );
}

export type { ListboxVirtualItem, ListboxVirtualRootProps };

export const ListboxVirtual = {
    Root: ListboxVirtualRoot,
    Item: Listbox.Item,
};

"use client";

import {
    type AnyTypes,
    type ItemOf,
    type RootProps,
    type TreeFeatures,
    type TreeTypes,
    useTree,
} from "@fragiola/tree-react";
import type * as React from "react";
import {
    Checkbox,
    DropIndicator,
    Empty,
    Group,
    Item,
    ItemContent,
    Items,
    Label,
    LiveRegion,
    LoadError,
    Loading,
    Rename,
    Retry,
    Root,
    Toggle,
    VirtualItems,
} from "../parts";

// Tree.Template.Simple — a whole tree in one line, from a model (or a
// document and its features) and, optionally, how an item looks:
//
//   const features = [selection({ mode: "multiple" }), dragAndDrop()] as const;
//   <Tree.Template.Simple<Types, typeof features>
//       defaultTree={json}
//       features={features}
//       aria-label="Project files"
//       icon={(item) => (item.kind === "folder" ? <FolderIcon /> : <FileIcon />)}
//   />
//
// Every item, its toggle and its group, recursively, and the live region.
// The rest follows the features the model has installed — read from the
// model (`model.get("features")`), never from an appearance prop:
//   drag-and-drop / foreign-drop  the drop indicator
//   checkboxes                    a check box in each row
//   rename                        the rename field (F2)
//   async-children                the loading and load-error rows, with Retry
//   virtualization                the rows in view, flat (no groups)
// Selection, type-ahead and the keyboard need no part: they are the
// package's. It is assembled from the `Tree.*` parts and nothing else: a
// tree that outgrows it (a context menu, a row of its own, a status per
// item) copies this file and edits the parts. Other templates are examples
// to copy, never registry code.
//
// The template rules (the same as Input.Template.Simple):
// 1. No style of its own — no class, no tv(), nothing beyond the parts.
// 2. No appearance props — no variant, size, color, density, indentation.
// 3. One className, going to the main piece (Root): its size and scroll
//    (a virtualized tree needs both), and the palette channel.
//
// Forbidden: renderItem / itemProps / any *Props bag. Props stay flat.
//
// Ceiling of 7 props; it uses 4: label, icon, empty and className. Root's
// own props — model, defaultTree, features, aria-label, expandedItemIds,
// selectedItemIds, checkedItemIds, loadChildren, announce, keyMap,
// expandOnClick, treeRef… — are behaviour, forwarded via ...props, not
// template configuration. If an eighth is needed, stop and record it.
//
// Names: each item is named by its label (`aria-label`), so a parent's name
// is not its children's text; the tree's name is the consumer's
// (`aria-label` or `aria-labelledby`). The rows' words are the parts'
// English defaults.

type SimpleProps<
    T extends TreeTypes = AnyTypes,
    F extends TreeFeatures = readonly [],
> = Omit<RootProps<T, F>, "children" | "className"> & {
    /** An item's label, in its row: its `label` unless given. */
    label?: ((item: ItemOf<T>) => React.ReactNode) | undefined;
    /** An icon before the label (decorative: give it `aria-hidden`). */
    icon?: ((item: ItemOf<T>) => React.ReactNode) | undefined;
    /** What an empty tree shows: "No items" unless given. */
    empty?: React.ReactNode;
    className?: string;
};

function Simple<
    T extends TreeTypes = AnyTypes,
    F extends TreeFeatures = readonly [],
>({ label, icon, empty, className, ...rootProps }: SimpleProps<T, F>) {
    return (
        <Root<T, F> className={className} {...(rootProps as RootProps<T, F>)}>
            <Body<T> label={label} icon={icon} empty={empty} />
        </Root>
    );
}

type Show<T extends TreeTypes> = {
    label: ((item: ItemOf<T>) => React.ReactNode) | undefined;
    icon: ((item: ItemOf<T>) => React.ReactNode) | undefined;
    checkboxes: boolean;
    rename: boolean;
    async: boolean;
    flat: boolean;
};

// Inside the root: the model is there, and so are its features.
function Body<T extends TreeTypes>({
    label,
    icon,
    empty,
}: Pick<SimpleProps<T>, "label" | "icon" | "empty">) {
    const { model } = useTree<T>();
    const installed = new Set(model.get("features").map(({ name }) => name));
    const show: Show<T> = {
        label,
        icon,
        checkboxes: installed.has("checkboxes"),
        rename: installed.has("rename"),
        async: installed.has("async-children"),
        flat: installed.has("virtualization"),
    };
    const item = (node: ItemOf<T>) => <SimpleItem item={node} show={show} />;
    return (
        <>
            {show.flat ? (
                <VirtualItems<T>>{item}</VirtualItems>
            ) : (
                <Items<T>>{item}</Items>
            )}
            {(installed.has("drag-and-drop") ||
                installed.has("foreign-drop")) && <DropIndicator />}
            <Empty>{empty}</Empty>
            <LiveRegion />
        </>
    );
}

function SimpleItem<T extends TreeTypes>({
    item,
    show,
}: {
    item: ItemOf<T>;
    show: Show<T>;
}) {
    return (
        <Item<T> item={item} aria-label={item.label}>
            <ItemContent>
                <Toggle />
                {show.checkboxes && <Checkbox<T> item={item} />}
                {show.icon?.(item)}
                <Label>{show.label ? show.label(item) : item.label}</Label>
                {show.rename && <Rename<T> item={item} />}
            </ItemContent>
            {show.async && (
                <>
                    <Loading />
                    <LoadError>
                        Could not load.
                        <Retry<T> item={item} />
                    </LoadError>
                </>
            )}
            {!show.flat && (
                <Group<T>>
                    {(child) => <SimpleItem item={child} show={show} />}
                </Group>
            )}
        </Item>
    );
}

export { Simple as TemplateSimple };

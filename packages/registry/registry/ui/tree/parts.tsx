"use client";

import {
    type AnyTypes,
    type GroupProps,
    type ItemContentProps,
    type ItemOf,
    type ItemProps,
    type LiveRegionProps,
    type RootProps,
    type ToggleProps,
    type TreeFeatures,
    Tree as TreePrimitive,
    type TreeTypes,
    useTree,
    useTreeItem,
} from "@fragiola/tree-react";
import type { AsyncChildrenFeature } from "@fragiola/tree-react/async-children";
import type { CheckboxesFeature } from "@fragiola/tree-react/checkboxes";
import {
    DropIndicator as DropIndicatorPrimitive,
    type DropIndicatorProps,
} from "@fragiola/tree-react/drag-and-drop";
import {
    type UseTreeItemRenameOptions,
    useTreeItemRename,
} from "@fragiola/tree-react/rename";
import { VirtualItems as VirtualItemsPrimitive } from "@fragiola/tree-react/virtualization";
import {
    ChevronRightIcon,
    CircleAlertIcon,
    LoaderCircleIcon,
    MinusIcon,
} from "lucide-react";
import type * as React from "react";
import { Clickable } from "#/atoms/clickable";
import { Input } from "#/atoms/fields";
import { iconSize } from "#/atoms/icon";
import { tree } from "#/families/tree";
import { cn } from "#/lib/cn";
import { Checkbox as CheckboxBox } from "#/ui/checkbox";
import { Field } from "#/ui/field";

// The tree's parts, styled. Expansion, selection, focus, the APG keyboard
// and type-ahead, drag and drop, checks, rename, async loading and
// virtualization come from @fragiola/tree-react; appearance comes from the
// `tree` family. Each part that wraps a primitive of the package keeps its
// name and only adds its member's classes — `render`, `ref`, handlers and
// the rest pass through untouched, and the generic registry type
// (`Tree.Item<Types>`) is kept. `Items` and `VirtualItems` render no element
// of their own, so they are the package's, unchanged.
//
// What the package leaves to the app is a part here too, built on the
// registry: the Label, the Checkbox (on Checkbox), Rename (on Field +
// Input), the Loading and LoadError rows with their Retry (on Clickable),
// and Empty. The package writes no text: these parts' English defaults
// ("Loading…", "Could not load.", "Retry", "No items") are content, replaced
// with `children`.
//
// The model API (createTreeModel, the features, commands, types, hooks) is
// not re-exported: it is imported from the package, the single source for
// it.

type ClassName<State> =
    | string
    | ((state: State) => string | undefined)
    | undefined;

// A primitive's className is a string or a function of its state: the
// member's classes go in front of either, and cn lets the consumer's win.
function withClass<State>(
    base: string,
    className: ClassName<State>,
): string | ((state: State) => string) {
    if (typeof className === "function") {
        return (state: State) => cn(base, className(state));
    }
    return cn(base, className);
}

// The tree (`role="tree"`). Name it: `aria-label` or `aria-labelledby`.
function Root<
    T extends TreeTypes = AnyTypes,
    F extends TreeFeatures = readonly [],
>({ className, ...props }: RootProps<T, F>) {
    return (
        <TreePrimitive.Root<T, F>
            data-slot="tree"
            className={withClass(tree.root(), className)}
            {...(props as RootProps<T, F>)}
        />
    );
}

// The root items and, with virtualization, the rows in view: no element.
const Items = TreePrimitive.Items;
const VirtualItems = VirtualItemsPrimitive;

function Item<T extends TreeTypes = AnyTypes>({
    className,
    ...props
}: ItemProps<T>) {
    return (
        <TreePrimitive.Item<T>
            data-slot="tree-item"
            className={withClass(tree.item(), className)}
            {...props}
        />
    );
}

// An item's row: what a press selects and a drag starts from.
function ItemContent({ className, ...props }: ItemContentProps) {
    return (
        <TreePrimitive.ItemContent
            data-slot="tree-item-content"
            className={withClass(tree.row(), className)}
            {...props}
        />
    );
}

function Group<T extends TreeTypes = AnyTypes>({
    className,
    ...props
}: GroupProps<T>) {
    return (
        <TreePrimitive.Group<T>
            data-slot="tree-group"
            className={withClass(tree.group(), className)}
            {...props}
        />
    );
}

// The expand / collapse affordance: a chevron unless given children. Hidden
// from assistive technology by the package (the item says `aria-expanded`).
function Toggle({ className, children, ...props }: ToggleProps) {
    return (
        <TreePrimitive.Toggle
            data-slot="tree-toggle"
            className={withClass(tree.toggle(), className)}
            {...props}
        >
            {children ?? <ChevronRightIcon className={iconSize.buttonSm} />}
        </TreePrimitive.Toggle>
    );
}

// The live region: visually hidden. It says what the root's `announce`
// returns; without one, nothing.
function LiveRegion({ className, ...props }: LiveRegionProps) {
    return (
        <TreePrimitive.LiveRegion
            data-slot="tree-live-region"
            className={withClass(tree.liveRegion(), className)}
            {...props}
        />
    );
}

// Where a drag would drop: inside the root, after the items. It renders only
// while there is a target.
function DropIndicator({ className, ...props }: DropIndicatorProps) {
    return (
        <DropIndicatorPrimitive
            data-slot="tree-drop-indicator"
            className={withClass(tree.dropIndicator(), className)}
            {...props}
        />
    );
}

// An item's label, in its row. Hidden while the item renames.
function Label({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="tree-label"
            className={cn(tree.label(), className)}
            {...props}
        />
    );
}

type CheckboxProps<T extends TreeTypes> = Omit<
    React.ComponentProps<typeof CheckboxBox.Root>,
    "checked" | "defaultChecked" | "indeterminate" | "className" | "render"
> & {
    /** The item whose check it shows and toggles. */
    item: ItemOf<T>;
    className?: string;
};

// An item's check (the checkboxes() feature): the registry's Checkbox,
// controlled by the item's check state, toggling it on a press. As the
// package's checkboxes guide asks, it is hidden from assistive technology
// (the item says `aria-checked`, Space toggles it), never takes focus (a
// press focuses the item, so the arrows keep working) and never starts a
// drag or a selection (`data-tree-no-drag`).
function Checkbox<T extends TreeTypes = AnyTypes>({
    item,
    className,
    ...props
}: CheckboxProps<T>) {
    const { model } = useTree<T, readonly [CheckboxesFeature]>();
    const { state } = useTreeItem<T>(item);
    return (
        <CheckboxBox.Root
            data-slot="tree-checkbox"
            data-tree-no-drag=""
            aria-hidden
            checked={state.checked}
            indeterminate={state.indeterminate}
            disabled={state.disabled}
            onCheckedChange={() => {
                model.run("item.toggle-check", { itemId: item.id });
            }}
            // the box is a span with no tab stop: a press lands on the item
            render={({ tabIndex: _tabIndex, ...box }) => <span {...box} />}
            className={cn(tree.checkbox(), className)}
            {...props}
        >
            {state.indeterminate ? (
                <span className={tree.checkboxDash()}>
                    <MinusIcon className={iconSize.buttonSm} />
                </span>
            ) : (
                <CheckboxBox.Indicator />
            )}
        </CheckboxBox.Root>
    );
}

type RenameProps<T extends TreeTypes> = Omit<
    React.ComponentProps<typeof Input>,
    "defaultValue" | "value" | "className"
> &
    UseTreeItemRenameOptions & {
        /** The item it renames. */
        item: ItemOf<T>;
        className?: string;
    };

// An item's rename field (the rename() feature; F2 starts it), rendered only
// while the item renames: the registry's Input in a Field frame (rule 3: the
// frame is Field.Row, the control carries no body). It opens with the label,
// focused and selected; Enter commits, Escape cancels. A refused name marks
// the field invalid (`data-invalid` on Field.Root turns it danger). Named
// "Rename <label>" unless given an `aria-label`.
function Rename<T extends TreeTypes = AnyTypes>({
    item,
    onRenameError,
    className,
    onChange,
    onKeyDown,
    onBlur,
    ...props
}: RenameProps<T>) {
    const rename = useTreeItemRename<T>(item, { onRenameError });
    if (!rename.state.renaming) return null;
    // the consumer's handlers run after the rename's, never instead of them
    return (
        <Field.Root
            data-slot="tree-rename"
            invalid={rename.state.invalid}
            className={tree.rename()}
        >
            <Field.Row className={tree.renameFrame()}>
                <Input
                    aria-label={`Rename ${item.label}`}
                    {...rename.props}
                    className={cn(tree.renameInput(), className)}
                    {...props}
                    onChange={(event) => {
                        rename.props.onChange?.(event);
                        onChange?.(event);
                    }}
                    onKeyDown={(event) => {
                        rename.props.onKeyDown?.(event);
                        onKeyDown?.(event);
                    }}
                    onBlur={(event) => {
                        rename.props.onBlur?.(event);
                        onBlur?.(event);
                    }}
                />
            </Field.Row>
        </Field.Root>
    );
}

// The row shown while an item's children load (the asyncChildren() feature),
// one level below it. Put it in the item, after its row.
function Loading({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="tree-loading"
            aria-hidden
            className={cn(tree.loading(), className)}
            {...props}
        >
            <span className={tree.statusMark()}>
                <LoaderCircleIcon className={iconSize.buttonSm} />
            </span>
            {children ?? "Loading…"}
        </div>
    );
}

// The row shown after an item's children failed to load, one level below
// it. Put it in the item, after its row; a Retry inside it loads again.
// The failure is announced through the root's `announce` (`load-error`).
function LoadError({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="tree-load-error"
            className={cn(tree.loadError(), className)}
            {...props}
        >
            <span className={tree.statusMark()}>
                <CircleAlertIcon className={iconSize.buttonSm} />
            </span>
            {children ?? "Could not load."}
        </div>
    );
}

type RetryProps<T extends TreeTypes> = Omit<
    React.ComponentProps<typeof Clickable.Button>,
    "variant" | "size" | "shape"
> & {
    /** The item whose children it loads again. */
    item: ItemOf<T>;
};

// Loads an item's children again (`engine.run("load-children")`). Named
// "Retry loading <label>" unless given an `aria-label`.
function Retry<T extends TreeTypes = AnyTypes>({
    item,
    className,
    children,
    onClick,
    ...props
}: RetryProps<T>) {
    const { engine } = useTree<T, readonly [AsyncChildrenFeature]>();
    return (
        <Clickable.Button
            data-slot="tree-retry"
            variant="ghost"
            size="sm"
            aria-label={`Retry loading ${item.label}`}
            className={cn(tree.retry(), className as string)}
            onClick={(event) => {
                onClick?.(event);
                engine.run("load-children", { itemId: item.id });
            }}
            {...props}
        >
            {children ?? "Retry"}
        </Clickable.Button>
    );
}

// What an empty tree shows, inside the root. Hidden while the tree has items.
function Empty({ className, children, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="tree-empty"
            className={cn(tree.empty(), className)}
            {...props}
        >
            {children ?? "No items"}
        </div>
    );
}

export {
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
};

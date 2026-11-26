"use client";

import {
    type CascadeItem,
    CascadeSelect as CascadeSelectPrimitive,
    type CascadeSelectRootProps,
} from "@fragiola/primitives-react/cascade-select";
import { CheckIcon, ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { field } from "#/families/field";
import { menu } from "#/families/menu";
import { popup } from "#/families/popup";
import { POSITIONER_DEFAULTS } from "#/lib/base";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";

// Cascade Select — one path through a tree of options (a region, then a
// country, then a city) from a button whose popup shows one list per level,
// side by side. The focus stays on the trigger (the APG select-only
// combobox); Up and Down move in a level, Right (Left in RTL) and Enter open
// a parent's level, Left goes back, and choosing a leaf closes. It submits
// the path in a form (`name`, joined by `valueSeparator`).
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// cascader, so this one shared file wraps Fragiola Primitives' on every
// base.
//
// It is Select's recombination, field + popup + menu:
//   Trigger  a field row (`field.row`) with the chevron, as Select's.
//   Content  the floating box (`popup.content`), its levels side by side.
//   Level    one list per depth, a `line` rule between them (logical).
//   Item     `menu.selectableItem`: highlighted, the chosen path
//            (`data-selected`) and an open parent (`data-expanded`, as a
//            submenu's trigger) are lit; a parent shows a chevron at the
//            inline end (mirrored in RTL), a chosen leaf the check.
// `CascadeSelect.Template.Simple` is the common select: every level of the
// tree, an Item per entry. On Base UI, name the trigger with
// `aria-labelledby`: Base UI's Field does not reach it.

function CascadeSelectRoot(props: CascadeSelectRootProps) {
    return (
        <PrimitivesDirection>
            <CascadeSelectPrimitive.Root {...props} />
        </PrimitivesDirection>
    );
}

function CascadeSelectTrigger({
    className,
    children,
    ...props
}: PrimitivesProps<typeof CascadeSelectPrimitive.Trigger, "button">) {
    return (
        <CascadeSelectPrimitive.Trigger
            data-slot="cascade-select-trigger"
            className={cn(
                field.row(),
                "flex-row items-center justify-between gap-2 px-3 py-2",
                className as string,
            )}
            {...props}
        >
            {children}
            <ChevronDownIcon className="size-icon shrink-0 text-palette-accent/85" />
        </CascadeSelectPrimitive.Trigger>
    );
}

function CascadeSelectValue({
    className,
    ...props
}: PrimitivesProps<typeof CascadeSelectPrimitive.Value, "span">) {
    return (
        <CascadeSelectPrimitive.Value
            data-slot="cascade-select-value"
            className={cn(
                "truncate text-sm text-palette-accent data-placeholder:text-palette-accent/85",
                className as string,
            )}
            {...props}
        />
    );
}

function CascadeSelectContent({
    className,
    align = "start",
    alignOffset = 0,
    side = "bottom",
    sideOffset = 4,
    ...props
}: PrimitivesProps<typeof CascadeSelectPrimitive.Popup, "div"> &
    Pick<
        PrimitivesProps<typeof CascadeSelectPrimitive.Positioner, "div">,
        "align" | "alignOffset" | "side" | "sideOffset"
    >) {
    return (
        <CascadeSelectPrimitive.Portal>
            <CascadeSelectPrimitive.Positioner
                {...POSITIONER_DEFAULTS}
                className="isolate z-50 outline-none"
                align={align}
                alignOffset={alignOffset}
                side={side}
                sideOffset={sideOffset}
            >
                <CascadeSelectPrimitive.Popup
                    data-slot="cascade-select-content"
                    className={cn(
                        popup.content(),
                        "flex w-auto overflow-x-auto p-0",
                        className as string,
                    )}
                    {...props}
                />
            </CascadeSelectPrimitive.Positioner>
        </CascadeSelectPrimitive.Portal>
    );
}

function CascadeSelectLevel({
    className,
    ...props
}: PrimitivesProps<typeof CascadeSelectPrimitive.Level, "div">) {
    return (
        <CascadeSelectPrimitive.Level
            data-slot="cascade-select-level"
            className={cn(
                "flex max-h-72 min-w-40 flex-col gap-px overflow-y-auto p-2 not-first:border-s not-first:border-palette-line",
                className as string,
            )}
            {...props}
        />
    );
}

function CascadeSelectItem({
    className,
    children,
    ...props
}: PrimitivesProps<typeof CascadeSelectPrimitive.Item, "div">) {
    return (
        <CascadeSelectPrimitive.Item
            data-slot="cascade-select-item"
            className={cn(
                menu.selectableItem(),
                "data-expanded:bg-palette-soft data-expanded:text-palette-contrast",
                className as string,
            )}
            {...props}
        >
            <CascadeSelectPrimitive.ItemIndicator
                data-slot="cascade-select-item-indicator"
                className={cn(
                    menu.itemIndicator(),
                    "in-data-has-children:hidden",
                )}
            >
                <CheckIcon />
            </CascadeSelectPrimitive.ItemIndicator>
            {children}
            <ChevronRightIcon
                aria-hidden="true"
                className="absolute inset-e-2 hidden text-palette-accent/85 in-data-has-children:block rtl:rotate-180"
            />
        </CascadeSelectPrimitive.Item>
    );
}

function depthOf(items: readonly CascadeItem[]): number {
    let depth = 0;
    for (const item of items) {
        if (item.children?.length) {
            depth = Math.max(depth, depthOf(item.children));
        }
    }
    return depth + 1;
}

/** The common cascade select: the trigger, and a level per depth of the tree. */
function CascadeSelectTemplateSimple({
    items,
    placeholder,
    separator,
    className,
    "aria-labelledby": labelledBy,
    ...props
}: CascadeSelectRootProps & {
    placeholder?: string;
    /** Shows the whole path joined by it, instead of the last label. */
    separator?: string;
    className?: string;
    "aria-labelledby"?: string;
}) {
    const levels = Array.from({ length: depthOf(items) }, (_, depth) => depth);
    return (
        <CascadeSelectRoot items={items} {...props}>
            <CascadeSelectTrigger
                className={className}
                aria-labelledby={labelledBy}
            >
                <CascadeSelectValue
                    placeholder={placeholder}
                    separator={separator}
                />
            </CascadeSelectTrigger>
            <CascadeSelectContent>
                {levels.map((depth) => (
                    <CascadeSelectLevel key={depth} depth={depth}>
                        {(entries: readonly CascadeItem[]) =>
                            entries.map((entry) => (
                                <CascadeSelectItem
                                    key={entry.value}
                                    value={entry.value}
                                >
                                    {entry.label}
                                </CascadeSelectItem>
                            ))
                        }
                    </CascadeSelectLevel>
                ))}
            </CascadeSelectContent>
        </CascadeSelectRoot>
    );
}

export type { CascadeItem };

export const CascadeSelect = {
    Root: CascadeSelectRoot,
    Trigger: CascadeSelectTrigger,
    Value: CascadeSelectValue,
    Content: CascadeSelectContent,
    Level: CascadeSelectLevel,
    Item: CascadeSelectItem,
    Template: { Simple: CascadeSelectTemplateSimple },
};

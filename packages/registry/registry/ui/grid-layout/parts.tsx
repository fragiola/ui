"use client";

import {
    type CellsProps,
    type DragHandleProps,
    type DragPreviewProps,
    type DragSourceProps,
    GridLayout as GridLayoutPrimitive,
    type ItemProps,
    type PlaceholderProps,
    type ResizeHandleProps,
    type RootProps,
    type RootState,
} from "@fragiola/grid-layout-react";
import { GripVertical } from "lucide-react";
import type * as React from "react";
import { tile } from "#/families/tile";
import { cn } from "#/lib/cn";

// Grid Layout's parts, styled. Dragging, resizing, collision and compaction,
// breakpoints, the keyboard, drops from outside and RTL come from
// @fragiola/grid-layout-react; appearance comes from the `tile` family. Each
// part wraps the primitive of the same name and only adds its member's
// classes — `render`, `ref`, handlers and the rest pass through untouched,
// and `className` stays a string or a function of the part's state. `Items`
// renders no element of its own: it is the package's, unchanged.
//
// Three pieces the package leaves to the app are parts here too: a card's
// Header, Title and Content. They are plain elements wearing their member,
// what Template.Simple puts in each item.
//
// The model API (createGridLayoutRef, useGridLayoutRef, the compactors, the
// constraints, the hooks, the types) is not re-exported: it is imported from
// the package, the single source for it.

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

// The grid, a `group` (the package sets no role): name it with
// `aria-label`. A refused drop turns it danger, from its state: a palette
// takes no Tailwind variant (families/tile.ts). The danger member comes
// last, so a palette class the consumer gives (the palette channel) does
// not swallow it. Its size across is its container's; its height follows
// the layout.
function Root({ className, ...props }: RootProps) {
    return (
        <GridLayoutPrimitive.Root
            data-slot="grid-layout"
            role="group"
            className={(state: RootState) =>
                cn(
                    tile.root(),
                    typeof className === "function"
                        ? className(state)
                        : className,
                    state.dropRefused && tile.refused(),
                )
            }
            {...props}
        />
    );
}

// The grid's background: one element per cell, placed by the engine, before
// the items so it is drawn under them. `className` applies to each cell.
function Cells({ className, ...props }: CellsProps) {
    return (
        <GridLayoutPrimitive.Cells
            data-slot="grid-layout-cells"
            className={withClass(tile.cells(), className)}
            {...props}
        />
    );
}

// The committed layout's items, a children function: no element, no style.
const Items = GridLayoutPrimitive.Items;

// An item, as a card: a `group`, so its name is read. Name it
// (`aria-label`): the primitives set no text.
function Item({ className, ...props }: ItemProps) {
    return (
        <GridLayoutPrimitive.Item
            data-slot="grid-layout-item"
            role="group"
            className={withClass(tile.item(), className)}
            {...props}
        />
    );
}

// Where its item drags from, and the item's tab stop: a button described
// as a drag handle (Space or Enter grabs its item), with a grip icon unless
// given children. "Move" unless the consumer names it — say what it moves
// ("Move Revenue").
function DragHandle({ className, children, ...props }: DragHandleProps) {
    return (
        <GridLayoutPrimitive.DragHandle
            data-slot="grid-layout-drag-handle"
            role="button"
            aria-roledescription="drag handle"
            aria-label="Move"
            className={withClass(tile.dragHandle(), className)}
            {...props}
        >
            {children ?? <GripVertical aria-hidden="true" />}
        </GridLayoutPrimitive.DragHandle>
    );
}

// A side or corner its item is resized from (`side`: `top`, `bottom`,
// `start`, `end` or a corner). Pointer only — the keyboard resizes a grabbed
// item with Shift + arrows — so it takes no focus and needs no name.
function ResizeHandle({ className, ...props }: ResizeHandleProps) {
    return (
        <GridLayoutPrimitive.ResizeHandle
            data-slot="grid-layout-resize-handle"
            className={withClass(tile.resizeHandle(), className)}
            {...props}
        />
    );
}

// Where the held item would land, inside the root after the items: rendered
// only during a gesture.
function Placeholder({ className, ...props }: PlaceholderProps) {
    return (
        <GridLayoutPrimitive.Placeholder
            data-slot="grid-layout-placeholder"
            className={withClass(tile.placeholder(), className)}
            {...props}
        />
    );
}

// Anything on the page that brings a new item in. Outside the root it takes
// the grid's `gridLayoutRef`. Name it (`aria-label`) when its text does not.
function DragSource({ className, ...props }: DragSourceProps) {
    return (
        <GridLayoutPrimitive.DragSource
            data-slot="grid-layout-drag-source"
            className={withClass(tile.dragSource(), className)}
            {...props}
        />
    );
}

// What follows the pointer while it brings a new item: rendered only then.
// A refused drop turns it danger, from its state, last (see Root).
function DragPreview({ className, ...props }: DragPreviewProps) {
    return (
        <GridLayoutPrimitive.DragPreview
            data-slot="grid-layout-drag-preview"
            className={(state) =>
                cn(
                    tile.dragPreview(),
                    typeof className === "function"
                        ? className(state)
                        : className,
                    state.refused && tile.refused(),
                )
            }
            {...props}
        />
    );
}

// A card's top row: its drag handle, its title and its actions.
function Header({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="grid-layout-header"
            className={cn(tile.header(), className)}
            {...props}
        />
    );
}

// A card's name, as text.
function Title({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="grid-layout-title"
            className={cn(tile.title(), className)}
            {...props}
        />
    );
}

// A card's content: the rest of the card.
function Content({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="grid-layout-content"
            className={cn(tile.content(), className)}
            {...props}
        />
    );
}

export {
    Cells,
    Content,
    DragHandle,
    DragPreview,
    DragSource,
    Header,
    Item,
    Items,
    Placeholder,
    ResizeHandle,
    Root,
    Title,
};

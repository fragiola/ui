"use client";

import {
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
} from "./grid-layout/parts";

// GridLayout — draggable, resizable dashboard grids (collision and
// compaction, responsive breakpoints, the keyboard, items brought in from
// outside, RTL) from @fragiola/grid-layout-react, styled by the `tile`
// family. A special component: a styled layer over a published package,
// installed with one command.
//
// One export, `GridLayout`: the package's parts under the same names (Root,
// Cells, Items, Item, DragHandle, ResizeHandle, Placeholder, DragSource,
// DragPreview), each wearing its `tile` member, plus a card's Header, Title
// and Content. The model, when code drives the grid, is the package's:
//
//   import { useGridLayoutRef } from "@fragiola/grid-layout-react";
//
// See the parts for what each one adds, and families/tile.ts for why it
// looks the way it does.

export const GridLayout = {
    Root,
    Cells,
    Items,
    Item,
    Header,
    Title,
    Content,
    DragHandle,
    ResizeHandle,
    Placeholder,
    DragSource,
    DragPreview,
};

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
import { Template } from "./grid-layout/templates";

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
// GridLayout.Template.Simple renders a whole dashboard from a layout and an
// item's content; the parts are there for the dashboard that outgrows it.
//
// See the parts for what each one adds, and families/tile.ts for why it
// looks the way it does.

export const GridLayout = {
    Template,
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

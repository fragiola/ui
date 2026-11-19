"use client";

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
} from "./tree/parts";

// Tree — an accessible tree view (expand and collapse, selection, the APG
// keyboard and type-ahead, drag and drop, tri-state checks, inline rename,
// async children, virtualization) from @fragiola/tree-react, styled by the
// `tree` family. A special component: a styled layer over a published
// package, installed with one command.
//
// One export, `Tree`: the package's parts under the same names (Root, Items,
// Item, ItemContent, Group, Toggle, LiveRegion, and the features' DropIndicator
// and VirtualItems), each wearing its `tree` member, plus the pieces the
// package leaves to the app (Label, Checkbox, Rename, Loading, LoadError,
// Retry, Empty). The model and the features are the package's:
//
//   import { createTreeModel } from "@fragiola/tree-react";
//   import { selection } from "@fragiola/tree-react/selection";
//
// See the parts for what each one adds, and families/tree.ts for why it
// looks the way it does.

export const Tree = {
    Root,
    Items,
    VirtualItems,
    Item,
    ItemContent,
    Group,
    Toggle,
    Label,
    Checkbox,
    Rename,
    Loading,
    LoadError,
    Retry,
    Empty,
    DropIndicator,
    LiveRegion,
};

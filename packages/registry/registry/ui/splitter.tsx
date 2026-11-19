"use client";

import { Grip, Group, Panel, Separator } from "./splitter/parts";

// Splitter — resizable split views (pointer and keyboard resizing, nested
// groups, collapsible panels, size constraints in any unit, RTL) from
// @fragiola/splitter-react, styled by the `split` family. A special
// component: a styled layer over a published package, installed with one
// command.
//
// One export, `Splitter`: the package's three primitives under the same
// names, each wearing its `split` member, plus the Grip a separator shows.
// The model, when code drives the layout, is the package's:
//
//   import { useSplitterRef } from "@fragiola/splitter-react";
//
// See the parts for what each one adds, and families/split.ts for why it
// looks the way it does.

export const Splitter = {
    Group,
    Panel,
    Separator,
    Grip,
};

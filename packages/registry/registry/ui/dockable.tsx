"use client";

import {
    Border,
    BorderContent,
    Borders,
    DragGroup,
    DragSource,
    DropIndicator,
    DropZone,
    EdgeIndicator,
    Panel,
    Panels,
    Popout,
    Root,
    Row,
    Splitter,
    Tab,
    TabLabel,
    TabList,
    TabSet,
    TabSetContent,
    TabSetHeader,
} from "./dockable/parts";

// Dockable — a docking layout (tabs, splitters, drag and drop, borders,
// popout windows) from @fragiola/dockable-react, styled by the `dock`
// family. The first special component: a styled layer over a published
// package, installed with one command.
//
// One export, `Dockable`: the package's primitives under the same names,
// each wearing its `dock` member, plus the pieces a tabset header needs
// (TabSetHeader, TabLabel). The model is the package's:
//
//   import { createModel } from "@fragiola/dockable-react";
//   const [model] = useState(() => createModel<Types>(json));
//
// See the parts for what each one adds, and families/dock.ts for why it
// looks the way it does.

export const Dockable = {
    Root,
    Row,
    Splitter,
    TabSet,
    TabSetHeader,
    TabList,
    Tab,
    TabLabel,
    TabSetContent,
    Panels,
    Panel,
    DropIndicator,
    EdgeIndicator,
    Borders,
    Border,
    BorderContent,
    Popout,
    DragGroup,
    DragSource,
    DropZone,
};

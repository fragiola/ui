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
    MaximizeTrigger,
    Panel,
    Panels,
    Popout,
    PopoutTrigger,
    Root,
    Row,
    Splitter,
    Tab,
    TabClose,
    TabLabel,
    TabList,
    TabOverflowMenu,
    TabOverflowTrigger,
    TabSet,
    TabSetActions,
    TabSetContent,
    TabSetHeader,
} from "./dockable/parts";
import { Template } from "./dockable/templates";

// Dockable — a docking layout (tabs, splitters, drag and drop, borders,
// popout windows) from @fragiola/dockable-react, styled by the `dock`
// family. The first special component: a styled layer over a published
// package, installed with one command.
//
// One export, `Dockable`: the package's primitives under the same names,
// each wearing its `dock` member, plus the pieces a tabset header needs that
// the package leaves to the app (TabSetHeader, TabLabel, TabClose,
// TabSetActions, MaximizeTrigger, TabOverflowMenu). The model is the
// package's:
//
//   import { createModel } from "@fragiola/dockable-react";
//   const [model] = useState(() => createModel<Types>(json));
//
// Dockable.Template.Simple renders the whole layout from a model and a
// tab's content; the parts are there for the layout that outgrows it.
//
// See the parts for what each one adds, and families/dock.ts for why it
// looks the way it does.

export const Dockable = {
    Template,
    Root,
    Row,
    Splitter,
    TabSet,
    TabSetHeader,
    TabList,
    Tab,
    TabLabel,
    TabClose,
    TabOverflowTrigger,
    TabOverflowMenu,
    TabSetActions,
    MaximizeTrigger,
    PopoutTrigger,
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

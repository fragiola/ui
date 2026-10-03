"use client";

import {
    type AnyTypes,
    type BorderContentProps,
    type BorderProps,
    Dockable as DockablePrimitive,
    type DockableTypes,
    type DropIndicatorProps,
    type EdgeIndicatorProps,
    type PanelProps,
    type PopoutProps,
    type RootProps,
    type RowProps,
    type SplitterProps,
    type TabListProps,
    type TabProps,
    type TabSetContentProps,
    type TabSetProps,
} from "@fragiola/dockable-react";
import type * as React from "react";
import { dock } from "#/families/dock";
import { cn } from "#/lib/cn";

// Dockable's parts, styled. Behaviour, accessibility, measurement and drag
// and drop come from @fragiola/dockable-react; appearance comes from the
// `dock` family. Each part wraps the primitive of the same name and only adds
// its member's classes — `render`, `ref`, handlers and the rest pass through
// untouched, and the generic registry type (`Dockable.Row<Types>`) is kept.
//
// The model API (createModel, commands, types) is not re-exported: it is
// imported from the package, the single source for it.

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

function Root<T extends DockableTypes = AnyTypes>({
    className,
    ...props
}: RootProps<T>) {
    return (
        <DockablePrimitive.Root
            data-slot="dockable"
            className={withClass(dock.root(), className)}
            {...props}
        />
    );
}

// A row lays its children out by weight; the root row carries the gutter.
// Its splitters default to the styled one, with a name.
function Row<T extends DockableTypes = AnyTypes>({
    className,
    renderSplitter = (splitter) => <Splitter {...splitter} />,
    ...props
}: RowProps<T>) {
    return (
        <DockablePrimitive.Row
            data-slot="dockable-row"
            className={withClass(dock.row(), className)}
            renderSplitter={renderSplitter}
            {...props}
        />
    );
}

// A splitter has no name of its own (`role="separator"`): "Resize" unless
// the consumer gives one.
function Splitter<T extends DockableTypes = AnyTypes>({
    className,
    ...props
}: SplitterProps<T>) {
    return (
        <DockablePrimitive.Splitter
            data-slot="dockable-splitter"
            aria-label="Resize"
            className={withClass(dock.splitter(), className)}
            {...props}
        />
    );
}

function TabSet<T extends DockableTypes = AnyTypes>({
    className,
    ...props
}: TabSetProps<T>) {
    return (
        <DockablePrimitive.TabSet
            data-slot="dockable-tabset"
            className={withClass(dock.tabset(), className)}
            {...props}
        />
    );
}

// The bar above a tabset's content — not a primitive: the place for the
// tab list, the overflow trigger and the actions.
function TabSetHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dockable-tabset-header"
            className={cn(dock.header(), className)}
            {...props}
        />
    );
}

function TabList<T extends DockableTypes = AnyTypes>({
    className,
    ...props
}: TabListProps<T>) {
    return (
        <DockablePrimitive.TabList
            data-slot="dockable-tab-list"
            className={withClass(dock.tabList(), className)}
            {...props}
        />
    );
}

// The tab carries the active tabset's marker after its content, so a
// hand-composed layout marks it too.
function Tab<T extends DockableTypes = AnyTypes>({
    className,
    children,
    ...props
}: TabProps<T>) {
    return (
        <DockablePrimitive.Tab
            data-slot="dockable-tab"
            className={withClass(dock.tab(), className)}
            {...props}
        >
            {children}
            <span aria-hidden="true" className={dock.tabMarker()} />
        </DockablePrimitive.Tab>
    );
}

function TabLabel({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="dockable-tab-label"
            className={cn(dock.tabLabel(), className)}
            {...props}
        />
    );
}

function TabSetContent(props: TabSetContentProps) {
    return (
        <DockablePrimitive.TabSetContent
            data-slot="dockable-tabset-content"
            {...props}
        />
    );
}

function Panel<T extends DockableTypes = AnyTypes>({
    className,
    ...props
}: PanelProps<T>) {
    return (
        <DockablePrimitive.Panel
            data-slot="dockable-panel"
            className={withClass(dock.panel(), className)}
            {...props}
        />
    );
}

function DropIndicator({ className, ...props }: DropIndicatorProps) {
    return (
        <DockablePrimitive.DropIndicator
            data-slot="dockable-drop-indicator"
            className={withClass(dock.dropIndicator(), className)}
            {...props}
        />
    );
}

function EdgeIndicator({ className, ...props }: EdgeIndicatorProps) {
    return (
        <DockablePrimitive.EdgeIndicator
            data-slot="dockable-edge-indicator"
            className={withClass(dock.edgeIndicator(), className)}
            {...props}
        />
    );
}

function Border<T extends DockableTypes = AnyTypes>({
    className,
    ...props
}: BorderProps<T>) {
    return (
        <DockablePrimitive.Border
            data-slot="dockable-border"
            className={withClass(dock.border(), className)}
            {...props}
        />
    );
}

// A border's panel area defaults its splitter to the styled one too.
function BorderContent<T extends DockableTypes = AnyTypes>({
    className,
    renderSplitter = (border) => <Splitter node={border} />,
    ...props
}: BorderContentProps<T>) {
    return (
        <DockablePrimitive.BorderContent
            data-slot="dockable-border-content"
            className={withClass(dock.borderContent(), className)}
            renderSplitter={renderSplitter}
            {...props}
        />
    );
}

function Popout<T extends DockableTypes = AnyTypes>({
    className,
    ...props
}: PopoutProps<T>) {
    return (
        <DockablePrimitive.Popout
            data-slot="dockable-popout"
            className={withClass(dock.popoutRoot(), className)}
            {...props}
        />
    );
}

// Structural or behavioural only — no look to add: the panel layer, the
// border frame, and the drag and drop helpers the app gives its own look.
const { Panels, Borders, DragGroup, DragSource, DropZone } = DockablePrimitive;

export {
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
};

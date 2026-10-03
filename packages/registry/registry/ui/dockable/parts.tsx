"use client";

import {
    type AnyTypes,
    type BorderContentProps,
    type BorderProps,
    Dockable as DockablePrimitive,
    type DockableTypes,
    type DropIndicatorProps,
    type EdgeIndicatorProps,
    MAIN_LAYOUT,
    type PanelProps,
    type PopoutProps,
    type PopoutTriggerProps,
    type RootProps,
    type RowProps,
    type SplitterProps,
    type TabContainer,
    type TabListProps,
    type TabOf,
    type TabOverflowTriggerProps,
    type TabProps,
    type TabSetContentProps,
    type TabSetProps,
    type TabsetNode,
    useDockable,
    useModelState,
    useTabOverflow,
} from "@fragiola/dockable-react";
import {
    ArrowDownToLineIcon,
    ChevronDownIcon,
    Maximize2Icon,
    Minimize2Icon,
    SquareArrowOutUpRightIcon,
    XIcon,
} from "lucide-react";
import type * as React from "react";
import { Clickable } from "#/atoms/clickable";
import { iconSize } from "#/atoms/icon";
import { dock } from "#/families/dock";
import { cn } from "#/lib/cn";
import { DropdownMenu } from "#/ui/dropdown-menu";

// Dockable's parts, styled. Behaviour, accessibility, measurement and drag
// and drop come from @fragiola/dockable-react; appearance comes from the
// `dock` family. Each part wraps the primitive of the same name and only adds
// its member's classes — `render`, `ref`, handlers and the rest pass through
// untouched, and the generic registry type (`Dockable.Row<Types>`) is kept.
//
// The pieces the package leaves to the app — a tab's close button, the
// tabset's maximize button, the overflow menu — are parts here too, built on
// Clickable and DropdownMenu. Each asks the model before it renders
// (`model.can`) and acts through a command (`model.run`), so a middleware
// veto or a pinned tab hides the button instead of leaving one that does
// nothing. They read the model with `useModelState`, which re-renders them
// when the answer changes. Their accessible names are English defaults; a
// consumer's `aria-label` wins.
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

// In a popout window the strip keeps every tab and scrolls (`overflow`
// defaults to false there): the overflow menu is a DropdownMenu, whose
// popup portals into the main document's body — it would open in the other
// window. In the main layout Dockable manages overflow, as by default. An
// explicit `overflow` wins either way.
function TabList<T extends DockableTypes = AnyTypes>({
    className,
    overflow,
    ...props
}: TabListProps<T>) {
    const { layoutId } = useDockable<T>();
    const managed = overflow ?? layoutId === MAIN_LAYOUT;
    const strip = managed ? dock.tabList() : dock.scrollingTabList();
    return (
        <DockablePrimitive.TabList
            data-slot="dockable-tab-list"
            className={withClass(strip, className)}
            overflow={managed}
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

// The header's buttons, after the tab list and the overflow trigger.
function TabSetActions({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dockable-tabset-actions"
            className={cn(dock.actions(), className)}
            {...props}
        />
    );
}

type ActionProps = Omit<
    React.ComponentProps<typeof Clickable.Button>,
    "variant" | "size" | "shape"
>;

// A tab's close button, rendered only while `tab.close` would apply (the
// tab's enableClose, not pinned, no veto). The tab stays the tab stop —
// Ctrl+Delete closes it from the keyboard (Dockable's keyMap) — so the
// button is out of the tab sequence, and a press on it neither selects the
// tab nor activates its tabset.
function TabClose<T extends DockableTypes = AnyTypes>({
    node,
    className,
    children,
    onClick,
    onPointerDown,
    ...props
}: ActionProps & { node: TabOf<T> }) {
    const { model } = useDockable<T>();
    const closeable = useModelState<T, boolean>((_, current) =>
        current.can("tab.close", { tabId: node.id }),
    );
    if (!closeable) return null;
    return (
        <Clickable.Button
            data-slot="dockable-tab-close"
            variant="icon"
            size="xs"
            shape="square"
            tabIndex={-1}
            aria-label={`Close ${node.label}`}
            className={cn(dock.tabAction(), className as string)}
            {...props}
            onPointerDown={(event) => {
                event.stopPropagation();
                onPointerDown?.(event);
            }}
            onClick={(event) => {
                event.stopPropagation();
                onClick?.(event);
                if (!event.defaultPrevented) {
                    model.run("tab.close", { tabId: node.id });
                }
            }}
        >
            {children ?? <XIcon className={iconSize.buttonSm} />}
        </Clickable.Button>
    );
}

// Maximizes the tabset, or restores the layout when it is the maximized one
// — a toggle (`aria-pressed`), so its name stays the same. Rendered only
// while the model allows the change (a tabset alone in its layout cannot
// maximize).
function MaximizeTrigger<T extends DockableTypes = AnyTypes>({
    node,
    children,
    onClick,
    ...props
}: ActionProps & { node: TabsetNode<T> }) {
    const { model } = useDockable<T>();
    const maximized = useModelState<T, boolean>((_, current) =>
        current.is("tabset-maximized", { tabsetId: node.id }),
    );
    const allowed = useModelState<T, boolean>((_, current) =>
        current.can("tabset.maximize", {
            tabsetId: node.id,
            value: !current.is("tabset-maximized", { tabsetId: node.id }),
        }),
    );
    if (!allowed) return null;
    return (
        <Clickable.Button
            data-slot="dockable-maximize-trigger"
            variant="icon"
            size="sm"
            shape="square"
            aria-label="Maximize"
            aria-pressed={maximized}
            {...props}
            onClick={(event) => {
                onClick?.(event);
                if (!event.defaultPrevented) {
                    model.run("tabset.maximize", {
                        tabsetId: node.id,
                        value: !maximized,
                    });
                }
            }}
        >
            {children ??
                (maximized ? (
                    <Minimize2Icon className={iconSize.buttonSm} />
                ) : (
                    <Maximize2Icon className={iconSize.buttonSm} />
                ))}
        </Clickable.Button>
    );
}

// Pops the selected tab out into a window and, in a window, docks it back.
// The primitive renders nothing when neither is possible; here it renders a
// Clickable whose name and icon follow its mode.
function PopoutTrigger<T extends DockableTypes = AnyTypes>({
    render,
    ...props
}: PopoutTriggerProps<T>) {
    return (
        <DockablePrimitive.PopoutTrigger<T>
            data-slot="dockable-popout-trigger"
            render={
                render ??
                ((button, state) => (
                    <Clickable.Button
                        variant="icon"
                        size="sm"
                        shape="square"
                        {...button}
                        aria-label={
                            button["aria-label"] ??
                            (state.mode === "dock" ? "Dock back" : "Pop out")
                        }
                    >
                        {button.children ??
                            (state.mode === "dock" ? (
                                <ArrowDownToLineIcon
                                    className={iconSize.buttonSm}
                                />
                            ) : (
                                <SquareArrowOutUpRightIcon
                                    className={iconSize.buttonSm}
                                />
                            ))}
                    </Clickable.Button>
                ))
            }
            {...props}
        />
    );
}

// The button that lists the tabs that do not fit. The primitive renders it
// only while tabs are hidden and reserves its width in the strip; it shows
// how many.
function TabOverflowTrigger<T extends DockableTypes = AnyTypes>({
    render,
    ...props
}: TabOverflowTriggerProps<T>) {
    return (
        <DockablePrimitive.TabOverflowTrigger<T>
            data-slot="dockable-tab-overflow-trigger"
            render={
                render ??
                ((button, state) => (
                    <Clickable.Button
                        variant="ghost"
                        size="sm"
                        {...button}
                        aria-label={
                            button["aria-label"] ??
                            `${state.hiddenTabs.length} more tabs`
                        }
                    >
                        {button.children ?? (
                            <>
                                {state.hiddenTabs.length}
                                <ChevronDownIcon
                                    className={iconSize.buttonSm}
                                />
                            </>
                        )}
                    </Clickable.Button>
                ))
            }
            {...props}
        />
    );
}

// The overflow trigger as a DropdownMenu of the hidden tabs, of a tabset or
// a border (`node`). Choosing one runs `tab.select`, which brings it into the
// strip.
function TabOverflowMenu<T extends DockableTypes = AnyTypes>({
    node,
    ...props
}: Omit<TabOverflowTriggerProps<T>, "render"> & { node: TabContainer<T> }) {
    const { model } = useDockable<T>();
    const { hiddenTabs } = useTabOverflow(node);
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger
                render={<TabOverflowTrigger<T> {...props} />}
            />
            <DropdownMenu.Content align="end">
                {hiddenTabs.map((tab) => (
                    <DropdownMenu.Item
                        key={tab.id}
                        onClick={() =>
                            model.run("tab.select", { tabId: tab.id })
                        }
                    >
                        <span className={dock.tabLabel()}>{tab.label}</span>
                    </DropdownMenu.Item>
                ))}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
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
};

"use client";

import type {
    AnyTypes,
    BorderNode,
    DockableTypes,
    RootProps,
    RowNode,
    TabOf,
    TabsetNode,
} from "@fragiola/dockable-react";
import type * as React from "react";
import {
    Border,
    Borders,
    DropIndicator,
    MaximizeTrigger,
    Panel,
    Panels,
    Popout,
    PopoutTrigger,
    Root,
    Row,
    Tab,
    TabClose,
    TabLabel,
    TabList,
    TabOverflowMenu,
    TabSet,
    TabSetActions,
    TabSetContent,
    TabSetHeader,
} from "../parts";

// Dockable.Template.Simple — the whole layout in one line, so a page does
// not re-assemble the tree every time:
//
//   <Dockable.Template.Simple model={model}>
//       {(tab) => <Content tab={tab} />}
//   </Dockable.Template.Simple>
//
// Rows and tabsets (the recursion), splitters, every tab's panel, the drop
// indicator, a close button on every tabset tab that may close, the overflow
// menu, maximize, the borders the model declares (tool panels: their tabs
// open and close the panel, with no close button), and popout windows with
// their trigger — each shown only while the model allows it. It is assembled from
// the `Dockable.*` parts and nothing else: a layout that outgrows it copies
// this file and edits the parts. Other templates are examples to copy, never
// registry code.
//
// The template rules (the same as Input.Template.Simple):
// 1. No style of its own — no class, no tv(), nothing beyond the parts.
// 2. No appearance props — no variant, size, color, density.
// 3. One className, going to the main piece (Root): the palette channel.
//    The popout windows repeat it (Popout reads the root's palette).
//
// Forbidden: renderTab / tabsetProps / any *Props bag. Props stay flat.
//
// Ceiling of 7 props; it uses 3: model, children (a tab's content, as
// Dockable.Panels gives it), className. Root's own props — popoutURL,
// keyMap, realtimeResize, supportsPopout, onPopoutOpen, onExternalDrag… —
// are behaviour, forwarded via ...props, not template configuration.
// popoutMirrorRoot defaults to true here: the theme lives on <html>
// (`data-theme`), and a window that did not mirror it would lose it. If an
// eighth is needed, stop and record it.
//
// Accessible names are the parts' English defaults ("Tabs", "Resize",
// "Close <tab>", "Maximize", "Pop out").

type SimpleProps<T extends DockableTypes = AnyTypes> = Omit<
    RootProps<T>,
    "children" | "className"
> & {
    /** A tab's content, in its panel — `tab.data` narrows on `tab.component`. */
    children: (tab: TabOf<T>) => React.ReactNode;
    className?: string;
};

function Simple<T extends DockableTypes = AnyTypes>({
    model,
    children,
    className,
    popoutMirrorRoot = true,
    ...rootProps
}: SimpleProps<T>) {
    return (
        <Root
            model={model}
            className={className}
            popoutMirrorRoot={popoutMirrorRoot}
            {...rootProps}
        >
            <Borders<T> renderBar={(border) => <SimpleBorder node={border} />}>
                <Row<T>>{renderNode}</Row>
            </Borders>
            <Panels<T>>
                {(tab) => <Panel node={tab}>{children(tab)}</Panel>}
            </Panels>
            <DropIndicator />
            <Popout<T>>
                {() => (
                    <>
                        <Row<T>>{renderNode}</Row>
                        <DropIndicator />
                    </>
                )}
            </Popout>
        </Root>
    );
}

// A row's child: a tabset, or a nested row rendered by this same function.
function renderNode<T extends DockableTypes>(
    node: TabsetNode<T> | RowNode<T>,
): React.ReactNode {
    if (node.type === "row") {
        return <Row<T> node={node}>{renderNode}</Row>;
    }
    return <SimpleTabSet<T> node={node} />;
}

function SimpleTabSet<T extends DockableTypes>({
    node,
}: {
    node: TabsetNode<T>;
}) {
    return (
        <TabSet<T> node={node}>
            <TabSetHeader>
                <TabList<T> aria-label="Tabs">
                    {(tab) => <SimpleTab<T> tab={tab} />}
                </TabList>
                <TabOverflowMenu<T> node={node} />
                <TabSetActions>
                    <PopoutTrigger<T> />
                    <MaximizeTrigger<T> node={node} />
                </TabSetActions>
            </TabSetHeader>
            <TabSetContent />
        </TabSet>
    );
}

// A border's strip, with its tabs; its panel area is Borders' default.
function SimpleBorder<T extends DockableTypes>({
    node,
}: {
    node: BorderNode<T>;
}) {
    return (
        <Border<T> node={node}>
            <TabList<T> aria-label="Panels">
                {(tab) => (
                    <Tab<T> node={tab}>
                        <TabLabel>{tab.label}</TabLabel>
                    </Tab>
                )}
            </TabList>
            <TabOverflowMenu<T> node={node} />
        </Border>
    );
}

function SimpleTab<T extends DockableTypes>({ tab }: { tab: TabOf<T> }) {
    return (
        <Tab<T> node={tab}>
            <TabLabel>{tab.label}</TabLabel>
            <TabClose<T> node={tab} />
        </Tab>
    );
}

export { Simple as TemplateSimple };

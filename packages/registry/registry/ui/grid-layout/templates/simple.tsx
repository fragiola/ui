"use client";

import {
    type LayoutItem,
    RESIZE_SIDES,
    type ResizeSide,
    type RootProps,
} from "@fragiola/grid-layout-react";
import type * as React from "react";
import {
    Cells,
    Content,
    DragHandle,
    DragPreview,
    Header,
    Item,
    Items,
    Placeholder,
    ResizeHandle,
    Root,
    Title,
} from "../parts";

// GridLayout.Template.Simple — a draggable, resizable dashboard in one line,
// so a page does not assemble the grid's parts every time:
//
//   <GridLayout.Template.Simple
//       defaultLayout={layout}
//       rowHeight={64}
//       itemTitle={(item) => widgets[item.id].title}
//   >
//       {(item) => <Widget id={item.id} />}
//   </GridLayout.Template.Simple>
//
// The grid's background, then each item of the layout as a card — a header
// with its drag handle and its title, the content `children` gives, a resize
// handle on each side and corner — then the placeholder and the preview of
// an item brought in from outside. It is assembled from the `GridLayout.*`
// parts and nothing else: a dashboard that outgrows it (actions in a header,
// a card without a handle, a widget sidebar) copies this file and edits the
// parts. Other templates are examples to copy, never registry code.
//
// The template rules (the same as Input.Template.Simple):
// 1. No style of its own — no class, no tv(), nothing beyond the parts.
// 2. No appearance props — no variant, size, color, density.
// 3. One className, going to the main piece (Root): the palette channel.
//
// Forbidden: renderItem / itemProps / any *Props bag. Props stay flat.
//
// Ceiling of 7 props; it uses 4: children (an item's content), itemTitle
// (an item's name), resizeHandles (which sides resize) and className. Root's
// own props — layout, defaultLayout, layouts, onLayoutChange, breakpoints,
// cols, rowHeight, gap, compactor, preventCollision, constraints, draggable,
// resizable, gridLayoutRef, onDrop… — are behaviour, forwarded via ...props,
// not template configuration. If an eighth is needed, stop and record it.
//
// Names: each item is named by its title (its id without `itemTitle`), its
// handle "Move <title>". An item brought in from a drag source shows the
// source's `data` in the preview when it is a string.

type SimpleProps = Omit<RootProps, "children" | "className"> & {
    /** What an item shows, under its header. */
    children: (item: LayoutItem) => React.ReactNode;
    /** An item's name: its header's text and its accessible name (default: its id). */
    itemTitle?: (item: LayoutItem) => string;
    /** The sides and corners an item is resized from (default: all eight). */
    resizeHandles?: readonly ResizeSide[];
    className?: string;
};

function Simple({
    children,
    itemTitle,
    resizeHandles = RESIZE_SIDES,
    className,
    ...rootProps
}: SimpleProps) {
    return (
        <Root className={className} {...rootProps}>
            <Cells />
            <Items>
                {(item) => {
                    const name = itemTitle?.(item) ?? item.id;
                    return (
                        <Item itemId={item.id} aria-label={name}>
                            <Header>
                                <DragHandle aria-label={`Move ${name}`} />
                                <Title>{name}</Title>
                            </Header>
                            <Content>{children(item)}</Content>
                            {resizeHandles.map((side) => (
                                <ResizeHandle key={side} side={side} />
                            ))}
                        </Item>
                    );
                }}
            </Items>
            <Placeholder />
            <DragPreview>
                {(state) =>
                    typeof state.data === "string" ? state.data : null
                }
            </DragPreview>
        </Root>
    );
}

export { Simple as TemplateSimple };

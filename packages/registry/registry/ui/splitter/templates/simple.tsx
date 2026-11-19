"use client";

import type {
    AnyTypes,
    GroupProps,
    SplitterTypes,
} from "@fragiola/splitter-react";
import * as React from "react";
import { Grip, Group, Separator } from "../parts";

// Splitter.Template.Simple — a split view in one line, so a page does not
// place a separator between every pair of panels by hand:
//
//   <Splitter.Template.Simple className="h-80">
//       <Splitter.Panel id="files" defaultSize="25%" minSize="10rem" collapsible>…</Splitter.Panel>
//       <Splitter.Panel id="editor">…</Splitter.Panel>
//   </Splitter.Template.Simple>
//
// A group of the panels it is given, with a separator and its grip between
// each pair. Every direct child is a panel (false, null and undefined are
// skipped, so a conditional panel just works); a panel that holds another
// Template.Simple nests it. Sizes, constraints and collapsing are the
// panels' own props. It is assembled from the `Splitter.*` parts and
// nothing else: a layout that outgrows it (a separator of its own, a name
// per separator, content in one) copies this file and edits the parts.
// Other templates are examples to copy, never registry code.
//
// The template rules (the same as Input.Template.Simple):
// 1. No style of its own — no class, no tv(), nothing beyond the parts.
// 2. No appearance props — no variant, size, color, density.
// 3. One className, going to the main piece (Group): its size, and the
//    palette channel.
//
// Forbidden: renderSeparator / separatorProps / any *Props bag. Props stay
// flat.
//
// Ceiling of 7 props; it uses 2: children (the panels) and className.
// Group's own props — orientation, layout, defaultLayout, onLayoutChange,
// onLayoutCommit, disabled, model, splitterRef, keyboardStep,
// resetOnDoubleClick… — are behaviour, forwarded via ...props, not template
// configuration. If an eighth is needed, stop and record it.
//
// Accessible names are the parts' English default ("Resize"); a page that
// needs one name per separator composes the parts.

type SimpleProps<T extends SplitterTypes = AnyTypes> = Omit<
    GroupProps<T>,
    "children" | "className"
> & {
    /** The panels, in order: `Splitter.Panel`s. */
    children: React.ReactNode;
    className?: string;
};

function Simple<T extends SplitterTypes = AnyTypes>({
    children,
    className,
    ...groupProps
}: SimpleProps<T>) {
    const panels = React.Children.toArray(children);
    return (
        <Group<T> className={className} {...groupProps}>
            {panels.map((panel, index) => (
                <React.Fragment key={keyOf(panel, index)}>
                    {index > 0 && (
                        <Separator>
                            <Grip />
                        </Separator>
                    )}
                    {panel}
                </React.Fragment>
            ))}
        </Group>
    );
}

// Children.toArray gives every element a key; a string or a number has none.
function keyOf(node: React.ReactNode, index: number): React.Key {
    return React.isValidElement(node) && node.key != null ? node.key : index;
}

export { Simple as TemplateSimple };

"use client";

import {
    type AnyTypes,
    type GroupProps,
    type PanelProps,
    type SeparatorProps,
    Splitter as SplitterPrimitive,
    type SplitterTypes,
} from "@fragiola/splitter-react";
import type * as React from "react";
import { split } from "#/families/split";
import { cn } from "#/lib/cn";

// Splitter's parts, styled. Resizing (pointer, keyboard, double click),
// collapsing, constraints, nesting, RTL and the Window Splitter ARIA come
// from @fragiola/splitter-react; appearance comes from the `split` family.
// Each part wraps the primitive of the same name and only adds its member's
// classes — `render`, `ref`, handlers and the rest pass through untouched,
// and the generic registry type (`Splitter.Panel<Types>`) is kept.
//
// One piece the package leaves to the app is a part here too: the Grip, a
// separator's content. The bare Separator stays a plain rule; the template
// puts a Grip in each one.
//
// The model API (createModel, commands, types, hooks) is not re-exported:
// it is imported from the package, the single source for it.

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

// The outermost group creates the model (unless given one); a group inside
// a Panel nests in it. Its size is the consumer's.
function Group<T extends SplitterTypes = AnyTypes>({
    className,
    ...props
}: GroupProps<T>) {
    return (
        <SplitterPrimitive.Group<T>
            data-slot="splitter-group"
            className={withClass(split.group(), className)}
            {...props}
        />
    );
}

function Panel<T extends SplitterTypes = AnyTypes>({
    className,
    ...props
}: PanelProps<T>) {
    return (
        <SplitterPrimitive.Panel<T>
            data-slot="splitter-panel"
            className={withClass(split.panel(), className)}
            {...props}
        />
    );
}

// A separator has no name of its own (`role="separator"`): "Resize" unless
// the consumer gives one — say what it resizes ("Resize the file tree").
function Separator({ className, ...props }: SeparatorProps) {
    return (
        <SplitterPrimitive.Separator
            data-slot="splitter-separator"
            aria-label="Resize"
            className={withClass(split.separator(), className)}
            {...props}
        />
    );
}

// A separator's grip, shown while it is hovered, dragged or focused.
// Decorative: the separator carries the name and the values.
function Grip({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="splitter-grip"
            aria-hidden="true"
            className={cn(split.grip(), className)}
            {...props}
        />
    );
}

export { Grip, Group, Panel, Separator };

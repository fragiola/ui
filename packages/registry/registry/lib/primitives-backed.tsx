"use client";

import { DirectionProvider } from "@fragiola/primitives-react/direction";
import { mergeProps } from "@fragiola/primitives-react/render";
import * as React from "react";
import { useProvidedDirection } from "#/lib/base";

// The bridge of the primitives-backed components (docs/architecture.md §5,
// "Bases"): a component only Fragiola Primitives has is one shared file that
// imports `@fragiola/primitives-react` on every base. On the Base UI base it
// sits beside Base UI's components, so two things have to reach it the way
// they reach the base's own.
//
// - The direction. Fragiola Primitives' components read their own
//   DirectionProvider, else the element's computed direction (`dir`). Under
//   the base's DirectionProvider (Base UI's, on the Base UI base), the
//   direction it gives is passed on to them (`useProvidedDirection`, the
//   base's adapter). On Fragiola Primitives it is the same provider already.
// - The state. A wrapper that maps a primitive's state onto the attribute the
//   foundation reads (a chosen swatch's or tag's `data-selected` onto
//   `data-checked`) renders through `renderMarked`, which keeps the
//   consumer's `render` (an element or a function) and both refs.
// - The props. A Fragiola Primitives part declares its own props and forwards
//   any other (`[key: string]: unknown`); `PrimitivesProps` adds the element's,
//   so a primitives-backed wrapper types `onClick` or `aria-*` the same way on
//   every base (the default base's `PrimitiveProps`, written once here).
//
// Shared, on the bases guard's explicit list (bases.ts, PRIMITIVES_BACKED);
// it imports only the direction and render entries.

/** Gives the primitives-backed component inside it the base's direction. */
export function PrimitivesDirection({
    children,
}: {
    children?: React.ReactNode;
}) {
    const direction = useProvidedDirection();
    if (direction === undefined) return children;
    return (
        <DirectionProvider direction={direction}>{children}</DirectionProvider>
    );
}

type Declared<T> = {
    [K in keyof T as string extends K
        ? never
        : number extends K
          ? never
          : symbol extends K
            ? never
            : K]: T[K];
};

/** A primitives-backed wrapper's props: the part's own and its element's. */
export type PrimitivesProps<
    Part extends React.ElementType,
    Element extends keyof React.JSX.IntrinsicElements = "div",
> = Declared<React.ComponentProps<Part>> &
    Omit<
        React.ComponentProps<Element>,
        keyof Declared<React.ComponentProps<Part>>
    >;

type AnyRef = React.Ref<unknown> | undefined;

function mergeRefs(...refs: unknown[]): React.RefCallback<unknown> {
    return (node) => {
        for (const ref of refs as AnyRef[]) {
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.RefObject<unknown>).current = node;
        }
    };
}

/**
 * A part's `render` function that adds `marks` (attributes computed from
 * the part's state) to the part's props, then renders the consumer's
 * `render` (an element or a function) or `fallback`. Both refs are kept: the
 * primitive's registers the element (its roving focus), the consumer's is
 * theirs.
 */
export function renderMarked<State>(
    render: unknown,
    marks: (state: State) => Record<string, unknown>,
    fallback: (props: Record<string, unknown>) => React.ReactNode,
) {
    return (props: Record<string, unknown>, state: State): React.ReactNode => {
        const marked: Record<string, unknown> = { ...props, ...marks(state) };
        if (typeof render === "function") {
            return (render as (p: unknown, s: unknown) => React.ReactNode)(
                marked,
                state,
            );
        }
        if (React.isValidElement(render)) {
            const own = render.props as Record<string, unknown>;
            return React.cloneElement(
                render as React.ReactElement<Record<string, unknown>>,
                {
                    ...mergeProps(marked, own),
                    ref: mergeRefs(marked.ref, own.ref),
                },
            );
        }
        return fallback(marked);
    };
}

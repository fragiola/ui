"use client";

import { DirectionProvider } from "@fragiola/primitives-react/direction";
import type * as React from "react";
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
// - The props. A Fragiola Primitives part declares its own props and forwards
//   any other (`[key: string]: unknown`); `PrimitivesProps` adds the element's,
//   so a primitives-backed wrapper types `onClick` or `aria-*` the same way on
//   every base (the default base's `PrimitiveProps`, written once here).
//
// Shared, on the bases guard's explicit list (bases.ts, PRIMITIVES_BACKED);
// it imports only the direction entry.

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

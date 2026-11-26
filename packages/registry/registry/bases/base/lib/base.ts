import { useDirection } from "@base-ui/react/direction-provider";
import type { useRender } from "@base-ui/react/use-render";
import type * as React from "react";

// The base's adapter: what the registry needs from its primitive library
// that is not a component it wraps. Every base exports the same names
// (packages/registry/bases.ts), so code importing them runs on any base.
//
// - DirectionProvider: the direction the primitives read (RTL: keyboard
//   navigation, slider direction, submenu sides).
// - useProvidedDirection: the direction a DirectionProvider of this base
//   gives, for the primitives-backed components (lib/primitives-backed.tsx),
//   which read Fragiola Primitives' own; `undefined` leaves them theirs.
// - CollapsiblePrimitive: the unstyled Collapsible, for compositions that
//   need it (a collapsible sidebar menu).
// - PrimitiveProps<typeof Part, "element">: a wrapper's props, the part's
//   own and its element's, as one type on every base.
// - RenderComponentProps<"element">: the props of a part written with the
//   base's useRender.
// - POSITIONER_DEFAULTS: what every Positioner the registry renders gets.
// - ControlValue and controlText: a field control's value as an input's
//   (`string | number | readonly string[]`), and what the base's control takes.
//
// This file is Base UI's: its parts' props already carry their element's.

export { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
export { DirectionProvider } from "@base-ui/react/direction-provider";

/**
 * Base UI's provided direction, for the primitives-backed components. Base
 * UI's `useDirection` reads "ltr" without a provider, which a provider set to
 * "ltr" also reads, so only "rtl" is passed on: otherwise the components keep
 * their own reading (their provider, else the element's computed direction,
 * which follows `dir`).
 */
export function useProvidedDirection(): "rtl" | undefined {
    return useDirection() === "rtl" ? "rtl" : undefined;
}

export type PrimitiveProps<
    Part extends React.ElementType,
    _Element extends keyof React.JSX.IntrinsicElements = "div",
> = React.ComponentProps<Part>;

export type RenderComponentProps<
    Element extends keyof React.JSX.IntrinsicElements,
    State = Record<string, unknown>,
> = useRender.ComponentProps<Element, State>;

export type ControlValue = string | number | readonly string[];

/** Base UI's field control takes an input's value as it is. */
export function controlText(
    value: ControlValue | undefined,
): ControlValue | undefined {
    return value;
}

// Base UI's own collision padding (5px), the value every base's positioners
// use; Base UI's wrappers need not pass it.
export const POSITIONER_DEFAULTS: { collisionPadding?: number } = {
    collisionPadding: 5,
};

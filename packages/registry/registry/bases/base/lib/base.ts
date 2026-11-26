// The base's own primitives that the registry does not wrap, for
// compositions that need the unstyled part (a collapsible sidebar menu) and
// for the direction the primitives read (RTL: keyboard navigation, slider
// direction, submenu sides). Every base exports the same names
// (packages/registry/bases.ts), so code importing them runs on any base.
//
// This file is Base UI's.

export { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
export { DirectionProvider } from "@base-ui/react/direction-provider";

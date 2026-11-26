"use client";

import { ColorSwatchPicker as ColorSwatchPickerPrimitive } from "@fragiola/primitives-react/color-swatch-picker";
import type * as React from "react";
import { color } from "#/families/color";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
    renderMarked,
} from "#/lib/primitives-backed";
import { ColorSwatch } from "#/ui/color-swatch";

// ColorSwatchPicker — one colour of a palette of swatches
// (spec/color-swatch-picker.md): a `listbox` whose options take the focus
// (roving), the arrows moving along a row (wrapping) and between the rows the
// layout wraps into, Space or Enter choosing; RTL swaps Left and Right. A
// focus move never chooses. `name` submits the chosen colour as hex. Inside
// a ColorPicker, a picker without a value of its own binds to the picker's
// colour.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// swatch picker, so this one shared file wraps Fragiola Primitives' on every
// base.
//
// The look is the `color` family's:
//   Root   the list (`swatchPicker`), wrapping into rows; name it
//          (`aria-label`, or a Field's label)
//   Item   one option (`swatchItem`): the chosen one gets `data-checked`
//          from its state, so the foundation's `checked` draws the `ring`
//          frame around its swatch; the others take the `hover` fill; the
//          focus is the standalone ring. Its content is a ColorSwatch of
//          its `value` unless you give one (name it: `aria-label="Ocean"`)
//   Template.Simple  an option per colour of `colors`.

type P = typeof ColorSwatchPickerPrimitive;

function ColorSwatchPickerRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <ColorSwatchPickerPrimitive.Root
                data-slot="color-swatch-picker"
                className={cn(color.swatchPicker(), className as string)}
                {...props}
            />
        </PrimitivesDirection>
    );
}

function ColorSwatchPickerItem({
    className,
    render,
    children,
    ...props
}: PrimitivesProps<P["Item"], "div">) {
    // The primitive marks the chosen option `data-selected`; the foundation's
    // `checked` reads `data-checked`, so the item adds it from the state (as
    // the calendar's dates do), and renders the consumer's `render` or the
    // default div.
    return (
        <ColorSwatchPickerPrimitive.Item
            data-slot="color-swatch-picker-item"
            className={cn(color.swatchItem(), className as string)}
            render={renderMarked(
                render,
                (state: { selected: boolean }) => ({
                    "data-checked": state.selected ? "" : undefined,
                }),
                (marked) => <div {...marked} />,
            )}
            {...props}
        >
            {children ?? <ColorSwatch color={props.value} />}
        </ColorSwatchPickerPrimitive.Item>
    );
}

/**
 * The common swatch picker: one option per colour of `colors` (a string or
 * a `Color`; give `{ value, label }` to name it). Every Root prop is
 * forwarded; `className` goes to the list. Name it (`aria-label`).
 */
function ColorSwatchPickerTemplateSimple({
    colors,
    ...props
}: PrimitivesProps<P["Root"], "div"> & {
    colors: readonly (
        | React.ComponentProps<P["Item"]>["value"]
        | { value: React.ComponentProps<P["Item"]>["value"]; label: string }
    )[];
}) {
    return (
        <ColorSwatchPickerRoot {...props}>
            {colors.map((entry, index) => {
                const named =
                    typeof entry === "object" && "label" in entry
                        ? entry
                        : undefined;
                const value = named ? named.value : entry;
                return (
                    <ColorSwatchPickerItem
                        // biome-ignore lint/suspicious/noArrayIndexKey: a palette may repeat a colour; its place is its identity
                        key={index}
                        value={
                            value as React.ComponentProps<P["Item"]>["value"]
                        }
                    >
                        <ColorSwatch
                            color={
                                value as React.ComponentProps<
                                    P["Item"]
                                >["value"]
                            }
                            aria-label={named?.label}
                        />
                    </ColorSwatchPickerItem>
                );
            })}
        </ColorSwatchPickerRoot>
    );
}

export const ColorSwatchPicker = {
    Root: ColorSwatchPickerRoot,
    Item: ColorSwatchPickerItem,
    Template: { Simple: ColorSwatchPickerTemplateSimple },
};

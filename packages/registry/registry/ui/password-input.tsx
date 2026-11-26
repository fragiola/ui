"use client";

import { PasswordInput as PasswordInputPrimitive } from "@fragiola/primitives-react/password-input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { clickable } from "#/atoms/clickable";
import { field } from "#/families/field";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";

// PasswordInput — a password with a button that shows and hides it. The
// trigger is a toggle button (`aria-pressed`, `aria-controls` the input)
// whose name is yours (`aria-label="Show password"`): it does not change
// with the state. The text is hidden again on submit and reset, the
// selection is kept when the type changes, and the input keeps the focus
// on a press.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// password input, so this one shared file wraps Fragiola Primitives' on
// every base.
//
// The control is only its middle (rule 3): it goes in a `Field.Row`, which
// draws the box.
//   Root               the control's area, `field.body`
//   Input              the bare control, `field.control`
//   VisibilityTrigger  a small ghost Clickable inside the area, at its
//                      inline end, with the eye (hidden) or the crossed eye
//                      (shown) unless it is given children

function PasswordInputRoot({
    className,
    ...props
}: PrimitivesProps<typeof PasswordInputPrimitive.Root, "div">) {
    return (
        <PrimitivesDirection>
            <PasswordInputPrimitive.Root
                data-slot="password-input"
                className={cn(
                    field.body(),
                    "items-center",
                    className as string,
                )}
                {...props}
            />
        </PrimitivesDirection>
    );
}

function PasswordInputInput({
    className,
    ...props
}: PrimitivesProps<typeof PasswordInputPrimitive.Input, "input">) {
    return (
        <PasswordInputPrimitive.Input
            data-slot="password-input-input"
            className={cn(field.control(), "self-stretch", className as string)}
            {...props}
        />
    );
}

function PasswordInputVisibilityTrigger({
    className,
    children,
    ...props
}: PrimitivesProps<typeof PasswordInputPrimitive.VisibilityTrigger, "button">) {
    return (
        <PasswordInputPrimitive.VisibilityTrigger
            data-slot="password-input-visibility-trigger"
            className={cn(
                clickable({ variant: "ghost", shape: "square", size: "sm" }),
                "me-0.5 shrink-0 text-palette-accent/85",
                className as string,
            )}
            {...props}
        >
            {children ?? (
                <>
                    <EyeIcon className="in-data-visible:hidden" />
                    <EyeOffIcon className="hidden in-data-visible:block" />
                </>
            )}
        </PasswordInputPrimitive.VisibilityTrigger>
    );
}

export const PasswordInput = {
    Root: PasswordInputRoot,
    Input: PasswordInputInput,
    VisibilityTrigger: PasswordInputVisibilityTrigger,
};

"use client";

import { Rating as RatingPrimitive } from "@fragiola/primitives-react/rating";
import { StarIcon } from "lucide-react";
import { foundation } from "#/families/foundation";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";

// Rating — a score chosen among stars (spec/rating.md, the APG's rating
// radio group): one tab stop on the checked star, the arrows (swapped in
// RTL), Home and End move the value and the focus together; a mouse over the
// stars previews the value under it; a press chooses it. `allowHalf` steps
// by halves (the inline-start half of a star), `allowClear` lets a second
// press clear it, `readOnly` shows a score that stays focusable. The
// HiddenInput submits it (`name`, `required`).
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// rating, so this one shared file wraps Fragiola Primitives' on every base.
//
// A filled star is "on", so it is `ring` (docs/visual-language.md, "States");
// an empty one is the `line` ground, as a rail. No family of its own.
//   Root        a row of stars; dimmed when disabled; name it
//               (`aria-label`, or `aria-labelledby` a label's id)
//   Item        one star (a `radio`), with the standalone focus ring; its
//               default mark is a star drawn empty, half or whole from the
//               star's state (`highlighted`, `half`), the preview included;
//               name it (`aria-label="3 stars"`)
//   HiddenInput what the form submits
//   Template.Simple  a star per step of `count`, named "1 star", "2 stars",
//               ..., and the half value on the star that holds it, plus the
//               HiddenInput.

type P = typeof RatingPrimitive;

type ItemState = { highlighted: boolean; half: boolean };

/** A star drawn empty (`line`), half or whole (`ring`) from its state. */
function RatingStar({ highlighted, half }: ItemState) {
    return (
        <>
            <StarIcon aria-hidden="true" className="fill-current" />
            <span
                aria-hidden="true"
                className={cn(
                    "absolute inset-y-0 start-0 flex overflow-hidden text-palette-ring",
                    half ? "w-1/2" : highlighted ? "w-full" : "w-0",
                )}
            >
                <StarIcon className="shrink-0 fill-current" />
            </span>
        </>
    );
}

function RatingRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <RatingPrimitive.Root
                data-slot="rating"
                className={cn(
                    foundation.disabled(),
                    "inline-flex items-center gap-0.5",
                    className as string,
                )}
                {...props}
            />
        </PrimitivesDirection>
    );
}

function RatingItem({
    className,
    children,
    ...props
}: PrimitivesProps<P["Item"], "button">) {
    return (
        <RatingPrimitive.Item
            data-slot="rating-item"
            className={cn(
                foundation.focus(),
                `
                relative inline-flex shrink-0 cursor-pointer rounded-sm
                text-palette-line transition-colors duration-150
                data-readonly:cursor-default disabled:cursor-not-allowed
                [&_svg:not([class*='size-'])]:size-icon-lg
                `,
                className as string,
            )}
            {...props}
        >
            {children ?? ((state: ItemState) => <RatingStar {...state} />)}
        </RatingPrimitive.Item>
    );
}

function RatingHiddenInput(props: PrimitivesProps<P["HiddenInput"], "input">) {
    return (
        <RatingPrimitive.HiddenInput
            data-slot="rating-hidden-input"
            {...props}
        />
    );
}

/** A star named by its score: 3 stars, or 2.5 stars on the star that holds a half value. */
function starName(index: number, value: number): string {
    const score = value === index - 0.5 ? value : index;
    const unit = score === 1 ? "star" : "stars";
    return `${score} ${unit}`;
}

/**
 * The common rating: a star per step of `count` (5), each named by its
 * score in English (1 star, 2 stars, and 2.5 stars on the star that holds
 * a half value), and the HiddenInput. Every Root prop is forwarded;
 * `className` goes to the row. Name it (`aria-label`).
 */
function RatingTemplateSimple(
    props: Omit<PrimitivesProps<P["Root"], "div">, "children">,
) {
    return (
        <RatingRoot {...props}>
            {({ items, value }: { items: number[]; value: number }) => (
                <>
                    {items.map((index) => (
                        <RatingItem
                            key={index}
                            index={index}
                            aria-label={starName(index, value)}
                        />
                    ))}
                    <RatingHiddenInput />
                </>
            )}
        </RatingRoot>
    );
}

export const Rating = {
    Root: RatingRoot,
    Item: RatingItem,
    HiddenInput: RatingHiddenInput,
    Template: { Simple: RatingTemplateSimple },
};

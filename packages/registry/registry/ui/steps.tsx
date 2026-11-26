"use client";

import { Steps as StepsPrimitive } from "@fragiola/primitives-react/steps";
import { CheckIcon } from "lucide-react";
import * as React from "react";
import { Clickable } from "#/atoms/clickable";
import { foundation } from "#/families/foundation";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";

// Steps — a process in a fixed number of steps (a checkout, an onboarding,
// a setup): the list of steps with the current one marked, the current
// step's content, Previous and Next, and what shows once every step is
// done. With `linear`, a step is reached only once the ones before it are
// valid (`isStepValid`). The list is an `ol` whose current step carries
// `aria-current="step"`; its triggers are buttons (Tab reaches them).
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// steps, so this one shared file wraps Fragiola Primitives' on every base.
//
// The states are the foundation's, mapped onto the attributes its members
// read (as the calendar does): a completed step's indicator is `checked`
// (the `ring` disc with a check) and its separator the `ring` fill on the
// `rail`; the current step's indicator is `current` (soft, contrast, the
// label weight); a step to come is the control box (`box`) with its number
// in secondary text. Horizontal or vertical by `orientation`, never by a
// variant: the parts read `data-orientation`.

type ItemState = { completed: boolean; current: boolean; index: number };

// Adds the foundation's attributes to a part from its step's state, then
// renders the consumer's `render` or the default element.
function withStepState(
    Element: "span" | "div",
    render: unknown,
    children?: (state: ItemState) => React.ReactNode,
) {
    return (props: Record<string, unknown>, state: ItemState) => {
        const mapped: Record<string, unknown> = {
            ...props,
            "data-checked": state.completed ? "" : undefined,
            "data-active": state.current ? "" : undefined,
        };
        if (children) mapped.children = children(state);
        if (typeof render === "function") {
            return (render as (p: unknown, s: unknown) => React.ReactNode)(
                mapped,
                state,
            );
        }
        if (React.isValidElement(render)) {
            return React.cloneElement(
                render as React.ReactElement<Record<string, unknown>>,
                mapped,
            );
        }
        return <Element {...mapped} />;
    };
}

function StepsRoot({
    className,
    ...props
}: PrimitivesProps<typeof StepsPrimitive.Root, "div">) {
    return (
        <PrimitivesDirection>
            <StepsPrimitive.Root
                data-slot="steps"
                className={cn("flex flex-col gap-6", className as string)}
                {...props}
            />
        </PrimitivesDirection>
    );
}

function StepsList({
    className,
    ...props
}: PrimitivesProps<typeof StepsPrimitive.List, "ol">) {
    return (
        <StepsPrimitive.List
            data-slot="steps-list"
            className={cn(
                "flex w-full items-start gap-3 data-[orientation=vertical]:flex-col data-[orientation=vertical]:gap-0",
                className as string,
            )}
            {...props}
        />
    );
}

function StepsItem({
    className,
    ...props
}: PrimitivesProps<typeof StepsPrimitive.Item, "li">) {
    return (
        <StepsPrimitive.Item
            data-slot="steps-item"
            className={cn(
                `
                relative flex flex-1 items-center gap-3 last:flex-none
                data-[orientation=vertical]:flex-none
                data-[orientation=vertical]:items-start
                data-[orientation=vertical]:pb-6
                data-[orientation=vertical]:last:pb-0
                `,
                className as string,
            )}
            {...props}
        />
    );
}

function StepsTrigger({
    className,
    ...props
}: PrimitivesProps<typeof StepsPrimitive.Trigger, "button">) {
    return (
        <StepsPrimitive.Trigger
            data-slot="steps-trigger"
            className={cn(
                foundation.focus(),
                foundation.disabled(),
                `
                group/step flex shrink-0 items-start gap-3 rounded-md text-start
                `,
                className as string,
            )}
            {...props}
        />
    );
}

function StepsIndicator({
    className,
    render,
    children,
    ...props
}: PrimitivesProps<typeof StepsPrimitive.Indicator, "span">) {
    // The step's number, or a check once it is done (the consumer's
    // children replace the number).
    return (
        <StepsPrimitive.Indicator
            data-slot="steps-indicator"
            className={cn(
                foundation.box(),
                foundation.current(),
                foundation.checked(),
                `
                flex size-8 shrink-0 items-center justify-center rounded-full
                text-sm tabular-nums text-palette-accent/85
                [&_svg]:size-icon
                `,
                className as string,
            )}
            render={withStepState("span", render, (state) =>
                state.completed ? <CheckIcon /> : (children ?? state.index + 1),
            )}
            {...props}
        />
    );
}

function StepsTitle({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="steps-title"
            className={cn(
                "block text-sm font-medium text-palette-accent/85 group-aria-[current=step]/step:text-palette-contrast group-data-completed/step:text-palette-contrast",
                className,
            )}
            {...props}
        />
    );
}

// The title and description beside the indicator, lined up with its centre.
function StepsText({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="steps-text"
            className={cn("flex flex-col gap-0.5 pt-1.5", className)}
            {...props}
        />
    );
}

function StepsDescription({
    className,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="steps-description"
            className={cn(foundation.secondary(), "block text-sm", className)}
            {...props}
        />
    );
}

function StepsSeparator({
    className,
    render,
    ...props
}: PrimitivesProps<typeof StepsPrimitive.Separator, "div">) {
    return (
        <StepsPrimitive.Separator
            data-slot="steps-separator"
            className={cn(
                foundation.rail(),
                foundation.checked(),
                `
                h-px min-w-6 flex-1 rounded-full
                data-[orientation=vertical]:absolute
                data-[orientation=vertical]:start-4
                data-[orientation=vertical]:top-10
                data-[orientation=vertical]:bottom-2
                data-[orientation=vertical]:h-auto
                data-[orientation=vertical]:w-px
                data-[orientation=vertical]:min-w-0
                data-[orientation=vertical]:-translate-x-1/2
                rtl:data-[orientation=vertical]:translate-x-1/2
                `,
                className as string,
            )}
            render={withStepState("div", render)}
            {...props}
        />
    );
}

function StepsContent({
    className,
    ...props
}: PrimitivesProps<typeof StepsPrimitive.Content, "div">) {
    return (
        <StepsPrimitive.Content
            data-slot="steps-content"
            className={cn("outline-none", className as string)}
            {...props}
        />
    );
}

function StepsCompletedContent({
    className,
    ...props
}: PrimitivesProps<typeof StepsPrimitive.CompletedContent, "div">) {
    return (
        <StepsPrimitive.CompletedContent
            data-slot="steps-completed-content"
            className={className as string}
            {...props}
        />
    );
}

function StepsPrevTrigger({
    ...props
}: PrimitivesProps<typeof StepsPrimitive.PrevTrigger, "button">) {
    return (
        <StepsPrimitive.PrevTrigger
            data-slot="steps-prev-trigger"
            render={<Clickable.Button variant="outline" />}
            {...props}
        />
    );
}

function StepsNextTrigger({
    ...props
}: PrimitivesProps<typeof StepsPrimitive.NextTrigger, "button">) {
    return (
        <StepsPrimitive.NextTrigger
            data-slot="steps-next-trigger"
            render={<Clickable.Button />}
            {...props}
        />
    );
}

/** A step of `Steps.Template.Simple`. */
export type Step = {
    title: React.ReactNode;
    description?: React.ReactNode;
    content: React.ReactNode;
};

// Back and Next, side by side.
function StepsActions({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="steps-actions"
            className={cn("flex gap-2", className)}
            {...props}
        />
    );
}

/** The common process: the steps, the current step's content, Back and Next. */
function StepsTemplateSimple({
    steps,
    completed,
    "aria-label": label = "Progress",
    className,
    ...props
}: Omit<React.ComponentProps<typeof StepsRoot>, "count" | "children"> & {
    steps: readonly Step[];
    /** What shows once every step is done. */
    completed?: React.ReactNode;
    /** Names the list of steps (default "Progress"). */
    "aria-label"?: string;
}) {
    return (
        <StepsRoot count={steps.length} className={className} {...props}>
            <StepsList aria-label={label}>
                {steps.map((step, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: a step is its position
                    <StepsItem key={index} index={index}>
                        <StepsTrigger>
                            <StepsIndicator />
                            <StepsText>
                                <StepsTitle>{step.title}</StepsTitle>
                                {step.description ? (
                                    <StepsDescription>
                                        {step.description}
                                    </StepsDescription>
                                ) : null}
                            </StepsText>
                        </StepsTrigger>
                        {index < steps.length - 1 ? <StepsSeparator /> : null}
                    </StepsItem>
                ))}
            </StepsList>
            {steps.map((step, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: a step is its position
                <StepsContent key={index} index={index}>
                    {step.content}
                </StepsContent>
            ))}
            {completed ? (
                <StepsCompletedContent>{completed}</StepsCompletedContent>
            ) : null}
            <StepsActions>
                <StepsPrevTrigger>Back</StepsPrevTrigger>
                <StepsNextTrigger className="palette-neutral">
                    Next
                </StepsNextTrigger>
            </StepsActions>
        </StepsRoot>
    );
}

export const Steps = {
    Root: StepsRoot,
    List: StepsList,
    Item: StepsItem,
    Trigger: StepsTrigger,
    Indicator: StepsIndicator,
    Text: StepsText,
    Title: StepsTitle,
    Description: StepsDescription,
    Separator: StepsSeparator,
    Content: StepsContent,
    CompletedContent: StepsCompletedContent,
    PrevTrigger: StepsPrevTrigger,
    NextTrigger: StepsNextTrigger,
    Actions: StepsActions,
    Template: { Simple: StepsTemplateSimple },
};

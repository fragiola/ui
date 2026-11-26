"use client";

import type { ReactNode } from "react";
import { Badge } from "#/components/atoms/badge";
import { Clickable } from "#/components/atoms/clickable";
import { Spinner } from "#/components/ui/spinner";

// An invoices page while it works, in the default look: a Save button that
// is saving (disabled, the spinner in the button's colour and icon size, the
// text saying what happens so the spinner is hidden from assistive
// technology), a sync badge, and a list that is loading, its spinner
// announced as a status. The spinner follows the motion axis: still at
// `none` and under prefers-reduced-motion, where the open circle alone says
// "loading". Then the icon sizes, set by a class.
export default function SpinnerDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex flex-wrap items-center gap-3">
                <Clickable.Button className="palette-neutral" disabled>
                    <Spinner aria-hidden />
                    Saving…
                </Clickable.Button>
                <Clickable.Button variant="outline" disabled>
                    <Spinner aria-hidden />
                    Exporting
                </Clickable.Button>
                <Badge className="gap-1">
                    <Spinner aria-hidden className="size-icon-xs" />
                    Syncing
                </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-palette-accent/85">
                <Spinner aria-label="Loading invoices" />
                Loading invoices
            </div>

            <Row label="sizes">
                <Spinner className="size-icon-sm" />
                <Spinner />
                <Spinner className="size-icon-lg" />
            </Row>
        </div>
    );
}

// Row — a captioned row. The caption is a <span>, not a heading.
function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-palette-accent/85">
                {label}
            </span>
            <div className="flex flex-wrap items-center gap-4">{children}</div>
        </div>
    );
}

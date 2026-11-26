"use client";

import { BoldIcon, ItalicIcon, PinIcon, UnderlineIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Toggle } from "#/components/ui/toggle";

// The surface-tier palettes: the neutral surface with one chromatic ring.
// Literal here because examples are published source (the code panel shows
// this file verbatim, with a copy button).
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

// A note's formatting in the default look: icon toggles named by their
// `aria-label`, and an outline toggle with its text. A pressed toggle is
// `current` (soft, contrast text, medium weight), like the current tab; it
// carries no palette class. Then the disabled state, and last the same
// toggle in each surface-ring palette: only the focus ring changes.
export default function ToggleDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                    <Toggle shape="square" aria-label="Bold" defaultPressed>
                        <BoldIcon />
                    </Toggle>
                    <Toggle shape="square" aria-label="Italic">
                        <ItalicIcon />
                    </Toggle>
                    <Toggle shape="square" aria-label="Underline">
                        <UnderlineIcon />
                    </Toggle>
                </div>
                <Toggle variant="outline">
                    <PinIcon />
                    Pin note
                </Toggle>
            </div>

            <Row label="states">
                <Toggle shape="square" aria-label="Bold, disabled" disabled>
                    <BoldIcon />
                </Toggle>
                <Toggle variant="outline" defaultPressed disabled>
                    Pinned
                </Toggle>
            </Row>

            {/* the same toggle, only its palette-* class changed */}
            <Row label="palettes">
                {SURFACE_RING.map((palette) => (
                    <Toggle
                        key={palette}
                        variant="outline"
                        defaultPressed
                        className={`palette-${palette}`}
                    >
                        Pinned
                    </Toggle>
                ))}
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
            <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
                {children}
            </div>
        </div>
    );
}

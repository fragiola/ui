"use client";

import type { ReactNode } from "react";
import { Progress } from "#/components/ui/progress";

// The chromatic palettes. Literal here because examples are published source
// (the code panel shows this file verbatim, with a copy button).
const CHROMATIC = [
    "blue",
    "purple",
    "green",
    "orange",
    "rose",
    "danger",
] as const;

// An upload list in the default look: the fill is the palette's ring, the
// "on" colour, so with no palette class it is the floor's dark neutral.
// Then the indeterminate state (value={null}), for work whose length is
// unknown, and last the same bar in each chromatic palette: the colour is
// the palette class on Progress.Root, there is no colour variant.
export default function ProgressDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex max-w-sm flex-col gap-4">
                <Upload name="quarterly-report.pdf" value={100} />
                <Upload name="team-photo.jpg" value={64} />
                <Upload name="recording.mp4" value={12} />
            </div>

            <Row label="indeterminate">
                <Progress.Root value={null} className="max-w-sm">
                    <Progress.Label>Connecting…</Progress.Label>
                    <Progress.Track>
                        <Progress.Indicator />
                    </Progress.Track>
                </Progress.Root>
            </Row>

            {/* the same bar, only its palette-* class changed */}
            <Row label="palettes">
                <div className="flex flex-wrap items-center gap-4">
                    {CHROMATIC.map((palette) => (
                        <Progress.Root
                            key={palette}
                            value={65}
                            aria-label={palette}
                            className={`palette-${palette} w-20`}
                        >
                            <Progress.Track>
                                <Progress.Indicator />
                            </Progress.Track>
                        </Progress.Root>
                    ))}
                </div>
            </Row>
        </div>
    );
}

function Upload({ name, value }: { name: string; value: number }) {
    return (
        <Progress.Root value={value}>
            <div className="flex items-center justify-between">
                <Progress.Label>{name}</Progress.Label>
                <Progress.Value />
            </div>
            <Progress.Track>
                <Progress.Indicator />
            </Progress.Track>
        </Progress.Root>
    );
}

// Row — a captioned row. The caption is a <span>, not a heading.
function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-palette-accent/85">
                {label}
            </span>
            {children}
        </div>
    );
}

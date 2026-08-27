"use client";

import type { ReactNode } from "react";
import { Progress } from "#/ui/progress";

// The palette class goes on the Progress.Root, not on a wrapping context.
// The floor is palette-surface; each progress bar carries its own palette-*
// class. The indicator fills with bg-palette-base — the palette's colour —
// so six palettes on one floor show six differently-coloured bars at once.
//
// Axes shown, one per row, all aligned:
//   palettes  one bar per chromatic palette (value 65%)
//   value     0% / mid / 100%
//   indeterminate  value=null
const CHROMATIC = [
    "blue",
    "purple",
    "green",
    "orange",
    "rose",
    "danger",
] as const;

export default function ProgressDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            {/* palettes — one bar per chromatic palette, same value */}
            <Row label="palettes">
                {CHROMATIC.map((palette) => (
                    <Progress.Root
                        key={palette}
                        value={65}
                        className={`palette-${palette} w-40`}
                    >
                        <Progress.Track>
                            <Progress.Indicator />
                        </Progress.Track>
                    </Progress.Root>
                ))}
            </Row>

            {/* value axis: 0% / mid / 100% (palette blue) */}
            <Row label="value">
                <Progress.Root value={0} className="palette-blue w-40">
                    <div className="flex items-center justify-between">
                        <Progress.Label>Empty</Progress.Label>
                        <Progress.Value />
                    </div>
                    <Progress.Track>
                        <Progress.Indicator />
                    </Progress.Track>
                </Progress.Root>
                <Progress.Root value={42} className="palette-blue w-40">
                    <div className="flex items-center justify-between">
                        <Progress.Label>Mid</Progress.Label>
                        <Progress.Value />
                    </div>
                    <Progress.Track>
                        <Progress.Indicator />
                    </Progress.Track>
                </Progress.Root>
                <Progress.Root value={100} className="palette-blue w-40">
                    <div className="flex items-center justify-between">
                        <Progress.Label>Full</Progress.Label>
                        <Progress.Value />
                    </div>
                    <Progress.Track>
                        <Progress.Indicator />
                    </Progress.Track>
                </Progress.Root>
            </Row>

            {/* indeterminate — value=null (palette blue) */}
            <Row label="indeterminate">
                <Progress.Root value={null} className="palette-blue w-40">
                    <Progress.Label>Connecting…</Progress.Label>
                    <Progress.Track>
                        <Progress.Indicator />
                    </Progress.Track>
                </Progress.Root>
            </Row>
        </div>
    );
}

// Row — a labelled, aligned row. The label is a <span>, not a heading.
function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-palette-accent/85">
                {label}
            </span>
            <div className="flex flex-wrap items-center gap-4">{children}</div>
        </div>
    );
}

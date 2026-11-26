"use client";

import type { ReactNode } from "react";
import { Meter } from "#/components/ui/meter";

// The chromatic palettes. Literal here because examples are published
// source (the code panel shows this file verbatim, with a copy button).
const PALETTES = ["blue", "purple", "green", "orange", "rose"] as const;

// A workspace's usage in the default look: storage against its quota (the
// value formatted as a percentage) and seats against the plan, each a
// labelled meter whose fill is `ring`. Then one row of palettes: the same
// meter, only its palette-* class changed.
export default function MeterDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex max-w-sm flex-col gap-5">
                <Meter.Root value={62}>
                    <Meter.Label>Storage</Meter.Label>
                    <Meter.Value />
                    <Meter.Track>
                        <Meter.Indicator />
                    </Meter.Track>
                </Meter.Root>
                <Meter.Root value={8} max={10} format={{ style: "decimal" }}>
                    <Meter.Label>Seats</Meter.Label>
                    <Meter.Value>
                        {(formatted) => `${formatted} of 10`}
                    </Meter.Value>
                    <Meter.Track>
                        <Meter.Indicator />
                    </Meter.Track>
                </Meter.Root>
            </div>

            {/* the same meter, only its palette-* class changed */}
            <Row label="palettes">
                {PALETTES.map((palette) => (
                    <Meter.Root
                        key={palette}
                        value={70}
                        aria-label={`Usage, ${palette}`}
                        className={`palette-${palette} w-24`}
                    >
                        <Meter.Track>
                            <Meter.Indicator />
                        </Meter.Track>
                    </Meter.Root>
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
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {children}
            </div>
        </div>
    );
}

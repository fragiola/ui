"use client";

import { KanbanIcon, ListIcon, RowsIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Text } from "#/components/atoms/text";
import { SegmentedControl } from "#/components/ui/segmented-control";

// The surface-tier palettes: the neutral surface with one chromatic ring, so
// only the focus ring takes colour. Literal here because examples are
// published source (the code panel shows this file verbatim, with a copy
// button).
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

const ISSUES = [
    "Fix the login redirect",
    "Ship the billing page",
    "Write the changelog",
];

// A project's issue list in the default look: a view switcher over it, and a
// density picker named by its label. The checked segment is `current`
// (soft, contrast text, medium weight); its fill slides to the next one. The
// control carries no palette class. Then the states a reader needs (a
// disabled segment, a disabled control, the vertical orientation), and last
// the same control in each surface-ring palette: only the focus ring changes.
export default function SegmentedControlDemo() {
    const [view, setView] = useState<string | null>("list");
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex max-w-md flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-sm font-medium">Issues</span>
                    <SegmentedControl.Root
                        aria-label="View"
                        value={view}
                        onValueChange={setView}
                    >
                        <SegmentedControl.Item value="list">
                            <ListIcon aria-hidden="true" />
                            <SegmentedControl.ItemText>
                                List
                            </SegmentedControl.ItemText>
                        </SegmentedControl.Item>
                        <SegmentedControl.Item value="board">
                            <KanbanIcon aria-hidden="true" />
                            <SegmentedControl.ItemText>
                                Board
                            </SegmentedControl.ItemText>
                        </SegmentedControl.Item>
                        <SegmentedControl.Item value="timeline">
                            <RowsIcon aria-hidden="true" />
                            <SegmentedControl.ItemText>
                                Timeline
                            </SegmentedControl.ItemText>
                        </SegmentedControl.Item>
                    </SegmentedControl.Root>
                </div>
                <p className="text-sm text-palette-accent/85">
                    {ISSUES.length} open issues, shown as a {view ?? "list"}.
                </p>

                <div className="flex flex-col gap-2">
                    <Text.Label id="density-label">Row density</Text.Label>
                    <SegmentedControl.Root
                        aria-labelledby="density-label"
                        name="density"
                        defaultValue="comfortable"
                    >
                        <SegmentedControl.Item value="compact">
                            Compact
                        </SegmentedControl.Item>
                        <SegmentedControl.Item value="comfortable">
                            Comfortable
                        </SegmentedControl.Item>
                        <SegmentedControl.Item value="spacious">
                            Spacious
                        </SegmentedControl.Item>
                    </SegmentedControl.Root>
                </div>
            </div>

            <Row label="states">
                <SegmentedControl.Root aria-label="Period" defaultValue="week">
                    <SegmentedControl.Item value="day">
                        Day
                    </SegmentedControl.Item>
                    <SegmentedControl.Item value="week">
                        Week
                    </SegmentedControl.Item>
                    <SegmentedControl.Item value="month" disabled>
                        Month
                    </SegmentedControl.Item>
                </SegmentedControl.Root>
                <SegmentedControl.Root
                    aria-label="Plan"
                    defaultValue="monthly"
                    disabled
                >
                    <SegmentedControl.Item value="monthly">
                        Monthly
                    </SegmentedControl.Item>
                    <SegmentedControl.Item value="yearly">
                        Yearly
                    </SegmentedControl.Item>
                </SegmentedControl.Root>
                <SegmentedControl.Root
                    aria-label="Align"
                    defaultValue="top"
                    orientation="vertical"
                >
                    <SegmentedControl.Item value="top">
                        Top
                    </SegmentedControl.Item>
                    <SegmentedControl.Item value="middle">
                        Middle
                    </SegmentedControl.Item>
                    <SegmentedControl.Item value="bottom">
                        Bottom
                    </SegmentedControl.Item>
                </SegmentedControl.Root>
            </Row>

            {/* the same control, only its palette-* class changed */}
            <Row label="palettes">
                {SURFACE_RING.map((palette) => (
                    <SegmentedControl.Root
                        key={palette}
                        aria-label={`View, ${palette}`}
                        defaultValue="list"
                        className={`palette-${palette}`}
                    >
                        <SegmentedControl.Item value="list">
                            List
                        </SegmentedControl.Item>
                        <SegmentedControl.Item value="board">
                            Board
                        </SegmentedControl.Item>
                    </SegmentedControl.Root>
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

"use client";

import type { ReactNode } from "react";
import { Clickable } from "#/atoms/clickable";
import { Tooltip } from "#/ui/tooltip";

// The floor is palette-surface. The tooltip content travels through a portal
// but inherits the palette from the owning subtree. The provider coordinates
// the delay between the two triggers — moving from one to the next opens the
// second tooltip without waiting for the delay again.
export default function TooltipDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            <Row label="provider coordinates delay">
                <Tooltip.Provider>
                    <Tooltip.Root>
                        <Tooltip.Trigger
                            render={<Clickable.Button variant="outline" />}
                        >
                            Hover me
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                            This is a tooltip — a transient text label.
                        </Tooltip.Content>
                    </Tooltip.Root>

                    {/* Moving from one trigger to the next opens the second
                        tooltip without waiting for the delay again. */}
                    <Tooltip.Root>
                        <Tooltip.Trigger
                            render={<Clickable.Button variant="outline" />}
                        >
                            Then me
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                            The provider coordinates the delay — no wait.
                        </Tooltip.Content>
                    </Tooltip.Root>
                </Tooltip.Provider>
            </Row>
        </div>
    );
}

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

"use client";

import { Clickable } from "#/atoms/clickable";
import { Tooltip } from "#/ui/tooltip";
import { PaletteGrid } from "@/components/preview/palette-grid";
import { SURFACES } from "@/lib/palette-sets";

// Each cell is a tinted surface palette. The tooltip content travels through
// a portal but inherits the palette from the cell that owns the provider.
// The provider coordinates the delay between the two triggers in each cell.
function DemoContent() {
    return (
        <div className="flex flex-wrap gap-4">
            {/* A single tooltip — provider coordinates delay between siblings */}
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
        </div>
    );
}

export default function TooltipDemo() {
    return (
        <PaletteGrid palettes={SURFACES}>
            <DemoContent />
        </PaletteGrid>
    );
}

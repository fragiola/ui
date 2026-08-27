"use client";

import { Progress } from "#/ui/progress";
import { PaletteGrid } from "@/components/preview/palette-grid";
import { CHROMATIC } from "@/lib/palette-sets";

// Each cell is a chromatic palette. The progress indicator reads the cell's
// accent — the bar fills with the palette's colour. Determinate, indeterminate
// and the value label are the same across every cell; only the colour changes.
function DemoContent() {
    return (
        <div className="flex flex-col gap-8">
            {/* Determinate */}
            <Progress.Root value={65}>
                <div className="flex items-center justify-between">
                    <Progress.Label>Uploading</Progress.Label>
                    <Progress.Value />
                </div>
                <Progress.Track>
                    <Progress.Indicator />
                </Progress.Track>
            </Progress.Root>

            {/* Indeterminate */}
            <Progress.Root value={null}>
                <Progress.Label>Connecting…</Progress.Label>
                <Progress.Track>
                    <Progress.Indicator />
                </Progress.Track>
            </Progress.Root>

            {/* With a value label (custom format) */}
            <Progress.Root value={42}>
                <div className="flex items-center justify-between">
                    <Progress.Label>Storage</Progress.Label>
                    <Progress.Value>
                        {(formatted) => `${formatted} used`}
                    </Progress.Value>
                </div>
                <Progress.Track>
                    <Progress.Indicator />
                </Progress.Track>
            </Progress.Root>
        </div>
    );
}

export default function ProgressDemo() {
    return (
        <PaletteGrid palettes={CHROMATIC}>
            <DemoContent />
        </PaletteGrid>
    );
}

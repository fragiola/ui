"use client";

import { Separator } from "#/ui/separator";
import { PaletteGrid } from "@/components/preview/palette-grid";
import { SURFACES } from "@/lib/palette-sets";

// Each cell is a tinted surface palette. The separator reads the cell's line
// role — the same line colour as the border, derived from the palette. The
// surrounding text uses accent/85 for secondary text.
function DemoContent() {
    return (
        <div className="flex flex-col gap-8">
            {/* Horizontal */}
            <div className="flex flex-col gap-4">
                <span className="text-sm text-palette-accent/85">
                    Above the separator
                </span>
                <Separator />
                <span className="text-sm text-palette-accent/85">
                    Below the separator
                </span>
            </div>

            {/* With label (composition) */}
            <div className="flex items-center gap-4">
                <span className="text-sm text-palette-accent/85">Start</span>
                <Separator className="flex-1" />
                <span className="text-sm text-palette-accent/85">End</span>
            </div>

            {/* Vertical */}
            <div className="flex h-8 items-center gap-4">
                <span className="text-sm text-palette-accent/85">Left</span>
                <Separator orientation="vertical" />
                <span className="text-sm text-palette-accent/85">Right</span>
            </div>
        </div>
    );
}

export default function SeparatorDemo() {
    return (
        <PaletteGrid palettes={SURFACES}>
            <DemoContent />
        </PaletteGrid>
    );
}

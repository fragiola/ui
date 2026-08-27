"use client";
import { CheckIcon } from "lucide-react";
import { Badge } from "#/atoms/badge";
import { PaletteGrid } from "@/components/preview/palette-grid";
import { CHROMATIC } from "@/lib/palette-sets";

// Each cell is a chromatic palette. The badge reads roles from the cell —
// the variant axis (default / solid / outline) is the same across every
// palette, only the colour changes. This is the palette-as-concept argument:
// the same component, six colours, zero variants.
function DemoContent() {
    return (
        <div className="flex flex-col gap-6">
            {/* variant axis: default / solid / outline */}
            <div className="flex flex-wrap items-center gap-3">
                <Badge>Default</Badge>
                <Badge variant="solid">Solid</Badge>
                <Badge variant="outline">Outline</Badge>
            </div>

            {/* with icon */}
            <div className="flex flex-wrap items-center gap-3">
                <Badge>
                    <CheckIcon />
                    Verified
                </Badge>
            </div>
        </div>
    );
}

export default function BadgeDemo() {
    return (
        <PaletteGrid palettes={CHROMATIC}>
            <DemoContent />
        </PaletteGrid>
    );
}

"use client";

import { CheckIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "#/atoms/badge";

// The palette class goes on the badge itself, not on a wrapping context.
// The floor is palette-surface; each badge carries its own palette-* class
// and styles only itself. Six palettes, one subtree, side by side — the
// architecture's claim made visible.
//
// Axes shown, one per row, all aligned:
//   variant  soft / solid / outline
//   with-icon  soft + icon
const CHROMATIC = [
    "blue",
    "purple",
    "green",
    "orange",
    "rose",
    "danger",
] as const;

export default function BadgeDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            {/* soft — one badge per chromatic palette */}
            <Row label="soft">
                {CHROMATIC.map((palette) => (
                    <Badge key={palette} className={`palette-${palette}`}>
                        {palette}
                    </Badge>
                ))}
            </Row>

            {/* solid — one badge per chromatic palette */}
            <Row label="solid">
                {CHROMATIC.map((palette) => (
                    <Badge
                        key={palette}
                        className={`palette-${palette}`}
                        variant="solid"
                    >
                        {palette}
                    </Badge>
                ))}
            </Row>

            {/* outline — one badge per chromatic palette */}
            <Row label="outline">
                {CHROMATIC.map((palette) => (
                    <Badge
                        key={palette}
                        className={`palette-${palette}`}
                        variant="outline"
                    >
                        {palette}
                    </Badge>
                ))}
            </Row>

            {/* with icon — soft variant, one badge per chromatic palette */}
            <Row label="with icon">
                {CHROMATIC.map((palette) => (
                    <Badge key={palette} className={`palette-${palette}`}>
                        <CheckIcon />
                        Verified
                    </Badge>
                ))}
            </Row>
        </div>
    );
}

// Row — a labelled, aligned row of badges. The label is a <span>, not a
// heading, so it does not pollute the page's table of contents.
function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-palette-accent/85">
                {label}
            </span>
            <div className="flex flex-wrap items-center gap-2">{children}</div>
        </div>
    );
}

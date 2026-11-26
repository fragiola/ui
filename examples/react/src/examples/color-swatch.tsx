"use client";

import type { ReactNode } from "react";
import { ColorSwatch } from "#/components/ui/color-swatch";

// The colours of a design's palette, named: a swatch is an image to
// assistive technologies, so each one gets its colour's name
// (`aria-label`); without one its name is the colour's CSS text. A
// translucent colour shows the checkerboard through it. Then the sizes, set
// with a class.
const PALETTE = [
    { color: "#0f172a", name: "Ink" },
    { color: "#2563eb", name: "Ocean" },
    { color: "#16a34a", name: "Forest" },
    { color: "#f59e0b", name: "Amber" },
    { color: "#e11d48", name: "Rose" },
    { color: "#ffffff", name: "Paper" },
] as const;

export default function ColorSwatchDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <ul className="flex flex-wrap gap-4">
                {PALETTE.map(({ color, name }) => (
                    <li
                        key={name}
                        className="flex flex-col items-center gap-1.5"
                    >
                        <ColorSwatch
                            color={color}
                            aria-label={name}
                            className="size-12"
                        />
                        <span className="text-xs text-palette-accent/85">
                            {name}
                        </span>
                    </li>
                ))}
            </ul>

            <div className="flex flex-wrap items-start gap-x-10 gap-y-6">
                <Row label="transparency">
                    <ColorSwatch color="rgba(37, 99, 235, 0.5)" />
                    <ColorSwatch color="rgba(225, 29, 72, 0.2)" />
                    <ColorSwatch color="#00000000" aria-label="Transparent" />
                </Row>
                <Row label="sizes">
                    <ColorSwatch
                        color="#2563eb"
                        className="size-5 rounded-sm"
                    />
                    <ColorSwatch color="#2563eb" />
                    <ColorSwatch
                        color="#2563eb"
                        className="size-12 rounded-lg"
                    />
                </Row>
            </div>
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
            <div className="flex flex-wrap items-center gap-3">{children}</div>
        </div>
    );
}

"use client";

import { PlayIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Clickable } from "#/components/atoms/clickable";
import { AspectRatio } from "#/components/ui/aspect-ratio";

// A course page, in the default look: the lesson's video frame at 16:9,
// its play button centred over it, and the frame's height following its
// width as the page narrows. The box clips its content, so `rounded-lg` on
// it rounds what is inside. Then the common ratios side by side, each box
// as wide as the others and as tall as its ratio says.
export default function AspectRatioDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <figure className="flex max-w-lg flex-col gap-2">
                <AspectRatio
                    ratio={16 / 9}
                    className="flex items-center justify-center rounded-lg border border-palette-line bg-palette-soft"
                >
                    <Clickable.Button
                        className="palette-neutral rounded-pill"
                        shape="square"
                        aria-label="Play lesson 3"
                    >
                        <PlayIcon />
                    </Clickable.Button>
                </AspectRatio>
                <figcaption className="text-sm text-palette-accent/85">
                    Lesson 3 · Composing palettes (12 min)
                </figcaption>
            </figure>

            <Row label="ratios">
                {(
                    [
                        ["1 / 1", 1],
                        ["4 / 3", 4 / 3],
                        ["16 / 9", 16 / 9],
                    ] as const
                ).map(([label, ratio]) => (
                    <div key={label} className="w-32">
                        <AspectRatio
                            ratio={ratio}
                            className="flex items-center justify-center rounded-md border border-dashed border-palette-line font-mono text-xs text-palette-accent/85"
                        >
                            {label}
                        </AspectRatio>
                    </div>
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
            <div className="flex flex-wrap items-start gap-4">{children}</div>
        </div>
    );
}

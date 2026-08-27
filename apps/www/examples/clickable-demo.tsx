"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import type { ReactNode } from "react";
import { Clickable } from "#/atoms/clickable";
import { CHROMATIC } from "@/lib/palette-sets";

// The palette class goes on the button itself, not on a wrapping context.
// The floor is palette-surface; each button carries its own palette-* class
// and styles only itself. This is the architecture's claim: N palettes can
// coexist in the same subtree, each scoped to the element that needs it.
//
// Axes shown, one per row, all aligned:
//   variant  solid / outline / ghost / icon
//   size     sm / md
//   disabled solid / outline / ghost / icon
export default function ClickableDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            {/* solid — one button per chromatic palette */}
            <Row label="solid">
                {CHROMATIC.map((palette) => (
                    <Clickable.Button
                        key={palette}
                        className={`palette-${palette}`}
                        variant="solid"
                        size="md"
                    >
                        {palette}
                    </Clickable.Button>
                ))}
            </Row>

            {/* outline — one button per chromatic palette */}
            <Row label="outline">
                {CHROMATIC.map((palette) => (
                    <Clickable.Button
                        key={palette}
                        className={`palette-${palette}`}
                        variant="outline"
                        size="md"
                    >
                        {palette}
                    </Clickable.Button>
                ))}
            </Row>

            {/* ghost — one button per chromatic palette */}
            <Row label="ghost">
                {CHROMATIC.map((palette) => (
                    <Clickable.Button
                        key={palette}
                        className={`palette-${palette}`}
                        variant="ghost"
                        size="md"
                    >
                        {palette}
                    </Clickable.Button>
                ))}
            </Row>

            {/* size axis: sm / md (variant solid, palette blue) */}
            <Row label="size">
                <Clickable.Button
                    className="palette-blue"
                    variant="solid"
                    size="sm"
                >
                    Small
                </Clickable.Button>
                <Clickable.Button
                    className="palette-blue"
                    variant="solid"
                    size="md"
                >
                    Medium
                </Clickable.Button>
            </Row>

            {/* icon — variant="icon" + shape="square", sm / md, per palette */}
            <Row label="icon">
                {CHROMATIC.map((palette) => (
                    <Clickable.Button
                        key={palette}
                        className={`palette-${palette}`}
                        variant="icon"
                        shape="square"
                        size="md"
                        aria-label={palette}
                    >
                        <PlusIcon />
                    </Clickable.Button>
                ))}
                <Clickable.Button
                    className="palette-blue"
                    variant="icon"
                    shape="square"
                    size="sm"
                    aria-label="Small add"
                >
                    <PlusIcon />
                </Clickable.Button>
            </Row>

            {/* disabled — no pointer events, same variants */}
            <Row label="disabled">
                <Clickable.Button
                    className="palette-blue"
                    variant="solid"
                    size="md"
                    disabled
                >
                    Solid
                </Clickable.Button>
                <Clickable.Button
                    className="palette-blue"
                    variant="outline"
                    size="md"
                    disabled
                >
                    Outline
                </Clickable.Button>
                <Clickable.Button
                    className="palette-blue"
                    variant="ghost"
                    size="md"
                    disabled
                >
                    Ghost
                </Clickable.Button>
                <Clickable.Button
                    className="palette-danger"
                    variant="icon"
                    shape="square"
                    size="md"
                    disabled
                    aria-label="Delete"
                >
                    <Trash2Icon />
                </Clickable.Button>
            </Row>
        </div>
    );
}

// Row — a labelled, aligned row of buttons. The label is a <span>, not a
// heading, so it does not pollute the page's table of contents. Items align
// to center and wrap cleanly on narrow viewports.
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

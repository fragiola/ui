"use client";

import { PlusIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Clickable } from "#/atoms/clickable";

// PaletteShowcase — the claim, on screen: N palettes coexisting on one neutral
// floor. The floor is palette-surface and paints itself from roles; every
// button carries its own palette-* class and styles only itself (Epic #39).
//
// Deliberately NOT ComponentPreview: the landing page shows the result, the
// docs show the source. No <details>, no source read from disk.
//
// The palette names are literal here. lib/palette-sets.ts was deleted in Epic
// #39 on purpose — a shared list made every consumer render "all palettes",
// which is a test matrix, not a demonstration.
//
// "use client" because registry/atoms/clickable is a client module: a server
// component cannot reach into its namespace object to find Clickable.Button.

const PALETTES = [
    "blue",
    "purple",
    "green",
    "orange",
    "rose",
    "danger",
] as const;

export function PaletteShowcase() {
    return (
        <div className="palette-surface flex flex-col gap-5 rounded-lg border border-palette-line bg-palette-base p-5 sm:gap-6 sm:p-8">
            <Row>
                {PALETTES.map((palette) => (
                    <Clickable.Button
                        className={`palette-${palette}`}
                        key={palette}
                        variant="solid"
                    >
                        {palette}
                    </Clickable.Button>
                ))}
            </Row>

            <Row>
                {PALETTES.map((palette) => (
                    <Clickable.Button
                        className={`palette-${palette}`}
                        key={palette}
                        variant="outline"
                    >
                        {palette}
                    </Clickable.Button>
                ))}
            </Row>

            <Row>
                {PALETTES.map((palette) => (
                    <Clickable.Button
                        className={`palette-${palette}`}
                        key={palette}
                        variant="ghost"
                    >
                        {palette}
                    </Clickable.Button>
                ))}
            </Row>

            <Row>
                {PALETTES.map((palette) => (
                    <Clickable.Button
                        aria-label={`Add, ${palette}`}
                        className={`palette-${palette}`}
                        key={palette}
                        shape="square"
                        variant="icon"
                    >
                        <PlusIcon />
                    </Clickable.Button>
                ))}
            </Row>
        </div>
    );
}

// A row of buttons: centred, aligned, and wrapping cleanly at 375px. No axis
// label — a landing page shows the result, and the docs name the axes.
function Row({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {children}
        </div>
    );
}

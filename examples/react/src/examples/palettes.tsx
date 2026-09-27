"use client";

import { PlusIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Clickable } from "#/components/atoms/clickable";

// The chromatic palettes. Literal here because examples are published source
// (the code panel shows this file verbatim, with a copy button); an import of
// site chrome would break for whoever copies it.
const PALETTES = [
    "blue",
    "purple",
    "green",
    "orange",
    "rose",
    "danger",
] as const;

// N palettes coexisting on one neutral floor. The floor is palette-surface
// and paints itself from roles; every button carries its own palette-* class
// and styles only itself. Nothing here is a colour variant: the same
// component reads the same six roles from whichever palette it wears.
//
// One row per variant — solid, outline, ghost, icon — and no axis labels:
// this is the landing's demonstration, the Clickable example names the axes.
export default function PalettesDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-5 rounded-lg border border-palette-line bg-palette-base p-5 sm:gap-6 sm:p-8">
            <Row>
                {PALETTES.map((palette) => (
                    <Clickable.Button
                        key={palette}
                        className={`palette-${palette}`}
                        variant="solid"
                    >
                        {palette}
                    </Clickable.Button>
                ))}
            </Row>

            <Row>
                {PALETTES.map((palette) => (
                    <Clickable.Button
                        key={palette}
                        className={`palette-${palette}`}
                        variant="outline"
                    >
                        {palette}
                    </Clickable.Button>
                ))}
            </Row>

            <Row>
                {PALETTES.map((palette) => (
                    <Clickable.Button
                        key={palette}
                        className={`palette-${palette}`}
                        variant="ghost"
                    >
                        {palette}
                    </Clickable.Button>
                ))}
            </Row>

            <Row>
                {PALETTES.map((palette) => (
                    <Clickable.Button
                        key={palette}
                        className={`palette-${palette}`}
                        variant="icon"
                        shape="square"
                        aria-label={`Add, ${palette}`}
                    >
                        <PlusIcon />
                    </Clickable.Button>
                ))}
            </Row>
        </div>
    );
}

// A row of buttons: centred, aligned, and wrapping cleanly at 375px.
function Row({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {children}
        </div>
    );
}

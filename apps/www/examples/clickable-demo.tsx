"use client";

import { ChevronRightIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Clickable } from "#/atoms/clickable";
import { PaletteGrid } from "@/components/preview/palette-grid";
import { CHROMATIC } from "@/lib/palette-sets";

// The demo content rendered once per chromatic palette. The palette class is
// on the PaletteGrid cell, not on each button — the cell scopes the palette,
// and every button inside reads roles from it. This is the architecture's
// core claim: a subtree carries its own palette.
function DemoContent() {
    return (
        <div className="flex flex-col gap-4">
            {/* variant axis: solid / outline / ghost */}
            <div className="flex flex-wrap items-center gap-2">
                <Clickable.Button variant="solid" size="md">
                    Solid
                </Clickable.Button>
                <Clickable.Button variant="outline" size="md">
                    Outline
                </Clickable.Button>
                <Clickable.Button variant="ghost" size="md">
                    Ghost
                </Clickable.Button>
            </div>

            {/* icon — variant="icon" + shape="square" */}
            <div className="flex flex-wrap items-center gap-2">
                <Clickable.Button
                    variant="icon"
                    shape="square"
                    size="md"
                    aria-label="Add"
                >
                    <PlusIcon />
                </Clickable.Button>
                <Clickable.Button
                    variant="icon"
                    shape="square"
                    size="md"
                    aria-label="Next"
                >
                    <ChevronRightIcon />
                </Clickable.Button>
                <Clickable.Button
                    variant="icon"
                    shape="square"
                    size="md"
                    disabled
                    aria-label="Delete"
                >
                    <Trash2Icon />
                </Clickable.Button>
            </div>

            {/* disabled — no pointer events */}
            <Clickable.Button disabled>Disabled</Clickable.Button>
        </div>
    );
}

export default function ClickableDemo() {
    return (
        <PaletteGrid palettes={CHROMATIC}>
            <DemoContent />
        </PaletteGrid>
    );
}

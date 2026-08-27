import type { ReactNode } from "react";

// PaletteGrid — renders its children once per palette, each occurrence inside
// a cell carrying that palette's class, with the palette name as a visible
// label.
//
// The palette storytelling lives in the example, not in the chrome. The grid
// does not inject palettes around the demo — it provides the surface, the
// example decides what to show. The label is a <span>, not a heading, so it
// does not pollute the page's table of contents.
//
// Server component. No interactivity needed. Reads roles only — no colour
// literal, no !important, logical properties on the inline axis.

type PaletteGridProps = {
    /** Which palettes to render. Use a named set from lib/palette-sets. */
    palettes: readonly string[];
    /** The demo content, rendered once per palette. */
    children: ReactNode;
    /** Container className — layout is the caller's, not the grid's. */
    className?: string;
};

export function PaletteGrid({
    palettes,
    children,
    className,
}: PaletteGridProps) {
    return (
        <div
            className={
                className ??
                "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }
        >
            {palettes.map((palette) => (
                <div
                    key={palette}
                    className={`palette-${palette} rounded-md border border-palette-line bg-palette-base p-4 flex flex-col gap-3`}
                >
                    <span className="text-xs font-mono text-palette-accent/85">
                        {palette}
                    </span>
                    <div className="flex-1">{children}</div>
                </div>
            ))}
        </div>
    );
}

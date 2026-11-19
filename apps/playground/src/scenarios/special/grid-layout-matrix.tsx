import type { Layout } from "@fragiola/grid-layout-react";
import { GridLayout } from "#/components/ui/grid-layout";

// The same dashboard under each condition, beside the default: a palette
// class on the root (it tints the dots, the placeholder and the drop
// outline; the cards stay raised), each density (the cards' header,
// padding, handles and dots follow the spacing scale; the row height and the
// gap are the engine's pixels, so they do not), right-to-left (the first
// column is on the right, `start` handles on the right edge, the diagonal
// cursors mirror), and the other design axes on a frame. Drag a card or
// pull a corner in any of them.
const frames: {
    label: string;
    className?: string;
    attrs?: Record<string, string>;
}[] = [
    { label: "default" },
    { label: "palette-surface-blue", className: "palette-surface-blue" },
    { label: "palette-surface-rose", className: "palette-surface-rose" },
    { label: "dir=rtl", attrs: { dir: "rtl" } },
    { label: "density compact", attrs: { "data-density": "compact" } },
    { label: "density spacious", attrs: { "data-density": "spacious" } },
    { label: "radius flat", attrs: { "data-radius": "flat" } },
    { label: "radius full", attrs: { "data-radius": "full" } },
    { label: "text large", attrs: { "data-text": "large" } },
    { label: "elevation raised", attrs: { "data-elevation": "raised" } },
    { label: "motion none", attrs: { "data-motion": "none" } },
];

const LAYOUT: Layout = [
    { id: "a", x: 0, y: 0, w: 2, h: 2 },
    { id: "b", x: 2, y: 0, w: 2, h: 1 },
    { id: "c", x: 2, y: 1, w: 2, h: 1, static: true },
    { id: "d", x: 4, y: 0, w: 2, h: 2 },
];

export default function GridLayoutMatrix() {
    return (
        <div className="grid w-[64rem] max-w-full grid-cols-1 gap-6 md:grid-cols-2">
            {frames.map(({ label, className, attrs }) => (
                <figure key={label} className="flex flex-col gap-1" {...attrs}>
                    <figcaption className="text-xs text-palette-accent/85">
                        {label}
                    </figcaption>
                    <GridLayout.Template.Simple
                        defaultLayout={LAYOUT}
                        cols={6}
                        rowHeight={64}
                        itemTitle={(item) => `${item.id.toUpperCase()}`}
                        resizeHandles={["end", "bottom", "bottom-end"]}
                        aria-label={label}
                        className={className}
                    >
                        {(item) =>
                            item.static ? (
                                <span className="text-palette-accent/85">
                                    static
                                </span>
                            ) : null
                        }
                    </GridLayout.Template.Simple>
                </figure>
            ))}
        </div>
    );
}

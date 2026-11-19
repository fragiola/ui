import { type Layout, useBreakpoint } from "@fragiola/grid-layout-react";
import { GridLayout } from "#/components/ui/grid-layout";

// Responsive breakpoints: the grid takes the widest breakpoint its own width
// reaches (never the window's), with that breakpoint's columns and layout.
// Drag the frame's corner to resize it: lg 12 columns, md 8, sm 4. lg is
// given; md and sm are generated from it the first time, then kept.
const BREAKPOINTS = { lg: 720, md: 480, sm: 0 };
const COLS = { lg: 12, md: 8, sm: 4 };
const LAYOUTS: Record<string, Layout> = {
    lg: [
        { id: "a", x: 0, y: 0, w: 4, h: 2 },
        { id: "b", x: 4, y: 0, w: 4, h: 2 },
        { id: "c", x: 8, y: 0, w: 4, h: 2 },
        { id: "d", x: 0, y: 2, w: 8, h: 2 },
        { id: "e", x: 8, y: 2, w: 4, h: 2 },
    ],
};

export default function GridLayoutResponsive() {
    return (
        <div className="w-[56rem] max-w-full resize-x overflow-auto rounded-md border border-palette-line p-2">
            <GridLayout.Template.Simple
                breakpoints={BREAKPOINTS}
                cols={COLS}
                defaultLayouts={LAYOUTS}
                rowHeight={48}
                itemTitle={(item) => item.id.toUpperCase()}
                resizeHandles={["end", "bottom", "bottom-end"]}
                aria-label="Responsive"
            >
                {() => <Breakpoint />}
            </GridLayout.Template.Simple>
        </div>
    );
}

function Breakpoint() {
    const { breakpoint, cols } = useBreakpoint();
    return (
        <p className="text-palette-accent/85">
            {breakpoint}, {cols} columns
        </p>
    );
}

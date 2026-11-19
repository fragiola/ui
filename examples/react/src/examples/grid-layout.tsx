"use client";

import type { Layout } from "@fragiola/grid-layout-react";
import { GridLayout } from "#/components/ui/grid-layout";

// A dashboard in one line: GridLayout.Template.Simple renders each item of
// the layout as a card, with a header (its drag handle and title), the
// content you give it and a resize handle on every side and corner. Drag a
// card by its handle and the others move out of the way, then settle
// upwards; pull an edge or a corner to resize it. From the keyboard, Tab to
// a handle: Space grabs, the arrows move, Shift + arrows resize, Space
// drops and Escape puts it back. The dots show the grid while you arrange.
// The grid is as wide as its container (here the frame: `w-full`), and as
// tall as its layout.
const LAYOUT: Layout = [
    { id: "revenue", x: 0, y: 0, w: 3, h: 2 },
    { id: "orders", x: 3, y: 0, w: 3, h: 2 },
    { id: "visitors", x: 6, y: 0, w: 3, h: 2 },
    { id: "uptime", x: 9, y: 0, w: 3, h: 2, minW: 2 },
    { id: "traffic", x: 0, y: 2, w: 8, h: 3, minW: 4 },
    { id: "notes", x: 8, y: 2, w: 4, h: 3 },
];

const WIDGETS: Record<string, { title: string; value: string; text: string }> =
    {
        revenue: { title: "Revenue", value: "$48.2k", text: "+12% this week" },
        orders: { title: "Orders", value: "1,284", text: "+4% this week" },
        visitors: { title: "Visitors", value: "23.9k", text: "−3% this week" },
        uptime: { title: "Uptime", value: "99.98%", text: "30 days" },
        traffic: {
            title: "Traffic",
            value: "312k",
            text: "Page views over the last 30 days.",
        },
        notes: {
            title: "Notes",
            value: "3",
            text: "Ship the Q3 report. Review the funnel. Plan the launch.",
        },
    };

export default function GridLayoutExample() {
    return (
        <GridLayout.Template.Simple
            defaultLayout={LAYOUT}
            rowHeight={56}
            itemTitle={(item) => WIDGETS[item.id]?.title ?? item.id}
            aria-label="Dashboard"
            className="w-full"
        >
            {(item) => {
                const widget = WIDGETS[item.id];
                return (
                    <div className="flex flex-col gap-1">
                        <span className="text-2xl font-semibold tabular-nums">
                            {widget?.value}
                        </span>
                        <span className="text-palette-accent/85">
                            {widget?.text}
                        </span>
                    </div>
                );
            }}
        </GridLayout.Template.Simple>
    );
}

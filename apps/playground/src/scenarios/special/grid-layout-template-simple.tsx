import type { Layout } from "@fragiola/grid-layout-react";
import { useState } from "react";
import { GridLayout } from "#/components/ui/grid-layout";

// GridLayout.Template.Simple with its four props: a layout (Root's, forwarded),
// the content and the title of each item, and className. Drag a card by its
// handle, pull any edge or corner, and watch the others compact upwards; the
// committed layout is printed below, once per change (never during a
// gesture).
const LAYOUT: Layout = [
    { id: "a", x: 0, y: 0, w: 4, h: 2 },
    { id: "b", x: 4, y: 0, w: 4, h: 3 },
    { id: "c", x: 8, y: 0, w: 4, h: 2 },
    { id: "d", x: 0, y: 2, w: 4, h: 2 },
    { id: "e", x: 8, y: 2, w: 4, h: 3 },
];

export default function GridLayoutTemplateSimple() {
    const [layout, setLayout] = useState<Layout>(LAYOUT);
    return (
        <div className="flex w-[56rem] max-w-full flex-col gap-4">
            <GridLayout.Template.Simple
                defaultLayout={LAYOUT}
                rowHeight={56}
                onLayoutChange={setLayout}
                itemTitle={(item) => `Widget ${item.id.toUpperCase()}`}
                aria-label="Template.Simple"
            >
                {(item) => (
                    <p className="text-palette-accent/85">
                        {item.w} columns, {item.h} rows
                    </p>
                )}
            </GridLayout.Template.Simple>
            <pre dir="ltr" className="text-xs text-palette-accent/85">
                {layout
                    .map((i) => `${i.id}: ${i.x},${i.y} ${i.w}×${i.h}`)
                    .join("\n")}
            </pre>
        </div>
    );
}

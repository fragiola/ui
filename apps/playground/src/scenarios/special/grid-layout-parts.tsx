import { type Layout, RESIZE_SIDES } from "@fragiola/grid-layout-react";
import { Lock } from "lucide-react";
import { GridLayout } from "#/components/ui/grid-layout";

// The parts assembled by hand: the dots (shown during a gesture), cards with
// a header (the drag handle, the title), a resize handle on every side and
// corner, and the placeholder. "Pinned" is static (the soft fill, no
// handle, never moved); "Fixed size" cannot be resized (no handles);
// "Locked" cannot be dragged (its handle dims). Drag by a handle, pull an
// edge or a corner (the opposite one stays), or Tab to a handle: Space
// grabs, the arrows move, Shift + arrows resize, Space drops, Escape puts
// it back. Theme, direction and the design axes come from the toolbar.
const LAYOUT: Layout = [
    { id: "revenue", x: 0, y: 0, w: 4, h: 2 },
    { id: "orders", x: 4, y: 0, w: 4, h: 2 },
    { id: "pinned", x: 8, y: 0, w: 4, h: 2, static: true },
    { id: "visitors", x: 0, y: 2, w: 6, h: 3 },
    { id: "fixed", x: 6, y: 2, w: 3, h: 2, resizable: false },
    { id: "locked", x: 9, y: 2, w: 3, h: 2, draggable: false },
];

const TITLES: Record<string, string> = {
    revenue: "Revenue",
    orders: "Orders",
    pinned: "Pinned",
    visitors: "Visitors",
    fixed: "Fixed size",
    locked: "Locked",
};

export default function GridLayoutParts() {
    return (
        <div className="w-[56rem] max-w-full">
            <GridLayout.Root
                defaultLayout={LAYOUT}
                rowHeight={56}
                aria-label="Parts"
            >
                <GridLayout.Cells />
                <GridLayout.Items>
                    {(item) => {
                        const title = TITLES[item.id] ?? item.id;
                        return (
                            <GridLayout.Item
                                itemId={item.id}
                                aria-label={title}
                            >
                                <GridLayout.Header>
                                    {item.static ? (
                                        <Lock
                                            aria-hidden="true"
                                            className="mx-1 size-icon text-palette-accent/85"
                                        />
                                    ) : (
                                        <GridLayout.DragHandle
                                            aria-label={`Move ${title}`}
                                        />
                                    )}
                                    <GridLayout.Title>{title}</GridLayout.Title>
                                </GridLayout.Header>
                                <GridLayout.Content>
                                    <p className="text-palette-accent/85">
                                        {item.w} × {item.h} at {item.x},{" "}
                                        {item.y}
                                    </p>
                                </GridLayout.Content>
                                {RESIZE_SIDES.map((side) => (
                                    <GridLayout.ResizeHandle
                                        key={side}
                                        side={side}
                                    />
                                ))}
                            </GridLayout.Item>
                        );
                    }}
                </GridLayout.Items>
                <GridLayout.Placeholder />
            </GridLayout.Root>
        </div>
    );
}

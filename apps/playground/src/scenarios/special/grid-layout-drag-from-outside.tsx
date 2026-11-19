import {
    type Layout,
    useGridLayout,
    useGridLayoutRef,
    veto,
} from "@fragiola/grid-layout-react";
import { Ban, ChartColumn, StickyNote } from "lucide-react";
import { useEffect, useState } from "react";
import { GridLayout } from "#/components/ui/grid-layout";

// Drag sources outside the grid (through a `gridLayoutRef`), the drag
// preview and the drop states. Drag "Note" or "Chart" onto the grid: the
// preview card follows the pointer off the grid and fades over it, where the
// solid placeholder shows the new item and the grid gets its dashed ring
// outline. "Refused" is vetoed by a middleware: over the grid the outline,
// the dots and the preview turn danger, and no placeholder shows. "Disabled"
// starts nothing. From the keyboard: Tab to a source, Enter brings its item
// in grabbed, the arrows place it, Enter adds it, Escape gives up. Drag a
// card off the grid: it fades, the dots hide, and released there it goes
// back.
const START: Layout = [
    { id: "note-0", x: 0, y: 0, w: 3, h: 2 },
    { id: "chart-0", x: 3, y: 0, w: 5, h: 3 },
];

export default function GridLayoutDragFromOutside() {
    const gridLayoutRef = useGridLayoutRef();
    const [count, setCount] = useState(1);
    return (
        <div className="flex w-[60rem] max-w-full gap-4">
            <aside
                aria-label="Widgets"
                className="flex w-44 shrink-0 flex-col gap-2"
            >
                <GridLayout.DragSource
                    gridLayoutRef={gridLayoutRef}
                    itemId={`note-${count}`}
                    item={{ w: 3, h: 2 }}
                    data="Note"
                >
                    <StickyNote aria-hidden="true" />
                    Note
                </GridLayout.DragSource>
                <GridLayout.DragSource
                    gridLayoutRef={gridLayoutRef}
                    itemId={`chart-${count}`}
                    item={{ w: 4, h: 3, minW: 3 }}
                    data="Chart"
                >
                    <ChartColumn aria-hidden="true" />
                    Chart
                </GridLayout.DragSource>
                <GridLayout.DragSource
                    gridLayoutRef={gridLayoutRef}
                    itemId={`refused-${count}`}
                    item={{ w: 3, h: 2 }}
                    data="Refused"
                >
                    <Ban aria-hidden="true" />
                    Refused
                </GridLayout.DragSource>
                <GridLayout.DragSource
                    gridLayoutRef={gridLayoutRef}
                    item={{ w: 3, h: 2 }}
                    disabled
                >
                    Disabled
                </GridLayout.DragSource>
            </aside>
            <GridLayout.Root
                gridLayoutRef={gridLayoutRef}
                defaultLayout={START}
                rowHeight={48}
                onDrop={() => setCount((n) => n + 1)}
                aria-label="Dashboard"
                className="min-h-80 flex-1 self-start border border-dashed border-palette-line"
            >
                <Rules />
                <GridLayout.Cells />
                <GridLayout.Items>
                    {(item) => (
                        <GridLayout.Item itemId={item.id} aria-label={item.id}>
                            <GridLayout.Content>{item.id}</GridLayout.Content>
                            <GridLayout.ResizeHandle side="bottom-end" />
                        </GridLayout.Item>
                    )}
                </GridLayout.Items>
                <GridLayout.Placeholder />
            </GridLayout.Root>
            <GridLayout.DragPreview gridLayoutRef={gridLayoutRef}>
                {(state) =>
                    typeof state.data === "string" ? state.data : null
                }
            </GridLayout.DragPreview>
        </div>
    );
}

// Refuses every item whose id says "refused", in the preview's dry run and
// on the drop alike.
function Rules() {
    const { model } = useGridLayout();
    useEffect(
        () =>
            model.use((ctx, next) =>
                ctx.command === "item.add" &&
                ctx.payload.item.id.startsWith("refused")
                    ? veto("Refused by the rules.")
                    : next(),
            ),
        [model],
    );
    return null;
}

"use client";

import {
    type DropDetails,
    type Layout,
    useGridLayoutEvents,
    useGridLayoutRef,
} from "@fragiola/grid-layout-react";
import { ChartLine, Gauge, type LucideIcon, StickyNote, X } from "lucide-react";
import { useRef, useState } from "react";
import { Clickable } from "#/components/atoms/clickable";
import { GridLayout } from "#/components/ui/grid-layout";

// A dashboard builder composed from the parts, for what Template.Simple does
// not do: a sidebar of widgets to drag in (drag sources outside the grid,
// through a `gridLayoutRef`), a remove button in each card's header, a
// corner handle only, and announcements in the app's own words. Drag a
// widget onto the grid — or Tab to it and press Enter, place it with the
// arrows and Enter again. The layout never holds what an item shows: the
// app keeps it, by id. Copy it and change what your app needs.

type Kind = "metric" | "chart" | "note";

const KINDS: Record<
    Kind,
    { title: string; icon: LucideIcon; w: number; h: number }
> = {
    metric: { title: "Metric", icon: Gauge, w: 3, h: 2 },
    chart: { title: "Chart", icon: ChartLine, w: 6, h: 3 },
    note: { title: "Note", icon: StickyNote, w: 3, h: 3 },
};

const START: Layout = [
    { id: "metric-1", x: 0, y: 0, w: 3, h: 2 },
    { id: "chart-1", x: 3, y: 0, w: 6, h: 3 },
    { id: "note-1", x: 9, y: 0, w: 3, h: 3 },
];

const START_KINDS: Record<string, Kind> = {
    "metric-1": "metric",
    "chart-1": "chart",
    "note-1": "note",
};

export default function GridLayoutDashboardBuilder() {
    const gridLayoutRef = useGridLayoutRef();
    const grid = useRef<HTMLElement>(null);
    const [kinds, setKinds] = useState(START_KINDS);
    const [message, setMessage] = useState("");
    const nameOf = (id: string) => {
        const kind = kinds[id];
        return kind ? `${KINDS[kind].title} ${id.split("-")[1]}` : id;
    };
    // A new widget's id: its kind and the next number of that kind.
    const nextId = (kind: Kind) => {
        const numbers = Object.keys(kinds)
            .filter((id) => kinds[id] === kind)
            .map((id) => Number(id.split("-")[1]));
        return `${kind}-${Math.max(0, ...numbers) + 1}`;
    };
    const add = ({ item, data }: DropDetails) =>
        setKinds((all) => ({ ...all, [item.id]: data as Kind }));
    const remove = (id: string) => {
        gridLayoutRef.current?.model.run("item.remove", { itemId: id });
        setKinds(({ [id]: _removed, ...rest }) => rest);
        setMessage(`${nameOf(id)} removed.`);
        // The focus was on the removed card's button: move it to the first
        // card's handle, so the keyboard stays in the grid.
        requestAnimationFrame(() =>
            grid.current
                ?.querySelector<HTMLElement>(
                    "[data-grid-layout-part=drag-handle]",
                )
                ?.focus(),
        );
    };
    return (
        <div className="flex h-full gap-4 p-4">
            <aside
                aria-label="Widgets"
                className="flex w-40 shrink-0 flex-col gap-2"
            >
                <p className="text-palette-accent/85">Drag a widget in</p>
                {(Object.keys(KINDS) as Kind[]).map((kind) => {
                    const { title, icon: Icon, w, h } = KINDS[kind];
                    return (
                        <GridLayout.DragSource
                            key={kind}
                            gridLayoutRef={gridLayoutRef}
                            itemId={nextId(kind)}
                            item={{ w, h, minW: 2, minH: 2 }}
                            data={kind}
                            aria-label={`${title} widget`}
                        >
                            <Icon aria-hidden="true" />
                            {title}
                        </GridLayout.DragSource>
                    );
                })}
                <p role="status" className="text-xs text-palette-accent/85">
                    {message}
                </p>
            </aside>
            <GridLayout.Root
                ref={grid}
                gridLayoutRef={gridLayoutRef}
                defaultLayout={START}
                rowHeight={56}
                onDrop={add}
                aria-label="Your dashboard"
                className="min-h-full flex-1 self-start"
            >
                <Announcer nameOf={nameOf} onMessage={setMessage} />
                <GridLayout.Cells />
                <GridLayout.Items>
                    {(item) => {
                        const kind = kinds[item.id] ?? "note";
                        const name = nameOf(item.id);
                        return (
                            <GridLayout.Item itemId={item.id} aria-label={name}>
                                <GridLayout.Header>
                                    <GridLayout.DragHandle
                                        aria-label={`Move ${name}`}
                                    />
                                    <GridLayout.Title>{name}</GridLayout.Title>
                                    <Clickable.Button
                                        variant="icon"
                                        size="sm"
                                        shape="square"
                                        className="-me-2"
                                        aria-label={`Remove ${name}`}
                                        onClick={() => remove(item.id)}
                                    >
                                        <X aria-hidden="true" />
                                    </Clickable.Button>
                                </GridLayout.Header>
                                <GridLayout.Content>
                                    <Body kind={kind} />
                                </GridLayout.Content>
                                <GridLayout.ResizeHandle side="bottom-end" />
                            </GridLayout.Item>
                        );
                    }}
                </GridLayout.Items>
                <GridLayout.Placeholder />
            </GridLayout.Root>
            <GridLayout.DragPreview gridLayoutRef={gridLayoutRef}>
                {(state) => KINDS[state.data as Kind]?.title}
            </GridLayout.DragPreview>
        </div>
    );
}

function Body({ kind }: { kind: Kind }) {
    if (kind === "metric")
        return (
            <div className="flex flex-col gap-0.5">
                <span className="text-2xl font-semibold tabular-nums">
                    1,284
                </span>
                <span className="text-palette-accent/85">Orders today</span>
            </div>
        );
    if (kind === "chart")
        return (
            <svg
                viewBox="0 0 100 32"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="size-full min-h-8 fill-none stroke-palette-ring stroke-2"
            >
                <path
                    vectorEffect="non-scaling-stroke"
                    d="M0 26 L14 20 L28 23 L42 12 L56 16 L70 8 L84 11 L100 4"
                />
            </svg>
        );
    return (
        <p className="text-palette-accent/85">
            Ship the report. Review the funnel.
        </p>
    );
}

// Says each step in the app's words: the grid tells it (grab, move,
// resize, drop, cancel), a live region reads it.
function Announcer({
    nameOf,
    onMessage,
}: {
    nameOf: (id: string) => string;
    onMessage: (message: string) => void;
}) {
    useGridLayoutEvents((event) => {
        const name = event.external
            ? `New ${KINDS[event.data as Kind]?.title ?? "widget"}`
            : nameOf(event.itemId);
        const { x, y, w, h } = event.item;
        const place = `column ${x + 1}, row ${y + 1}`;
        const size = `${w} columns by ${h} rows`;
        const keyboard = event.source === "keyboard";
        if (event.type === "grab") onMessage(`${name} grabbed, at ${place}.`);
        if (event.type === "cancel" || event.type === "drop-cancel")
            onMessage(`${name} put back.`);
        // A step that ends, or one the keyboard takes: never each frame of
        // a pointer's drag.
        const step =
            keyboard ||
            event.type === "drop" ||
            event.type === "drag-stop" ||
            event.type === "resize-stop";
        if (event.refused && step && event.type !== "grab")
            onMessage(`${name} cannot go there.`);
        if (event.refused || event.outside) return;
        if (event.type === "move" && keyboard) onMessage(`${name}, ${place}.`);
        if (event.type === "resize" && keyboard) onMessage(`${name}, ${size}.`);
        if (event.type === "drop" || event.type === "drag-stop")
            onMessage(`${name} dropped at ${place}.`);
        if (event.type === "resize-stop") onMessage(`${name} is ${size}.`);
    });
    return null;
}

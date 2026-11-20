import type * as React from "react";
import { Splitter } from "#/components/ui/splitter";
import { cn } from "#/lib/cn";

// The same split view under each condition, side by side with the default:
// a palette class on the group (it re-tints the panels, the rule, the ring
// and the grip, nested groups included), each density (the hit area follows
// the spacing scale), right-to-left (the first panel sits on the right; the
// arrows mirror), the three handle marks (`data-handle`: line, grip, dots —
// the same as Dockable's, see dockable-handles) and the other design axes
// set on a frame. Focus a rule (Tab) to see its ring bar under each one.
const frames: {
    label: string;
    className?: string;
    attrs?: Record<string, string>;
}[] = [
    { label: "default" },
    { label: "palette-surface-blue", className: "palette-surface-blue" },
    { label: "palette-surface-rose", className: "palette-surface-rose" },
    { label: "palette-blue", className: "palette-blue" },
    { label: "dir=rtl", attrs: { dir: "rtl" } },
    { label: "density compact", attrs: { "data-density": "compact" } },
    { label: "density spacious", attrs: { "data-density": "spacious" } },
    { label: "handle line", attrs: { "data-handle": "line" } },
    { label: "handle grip", attrs: { "data-handle": "grip" } },
    { label: "handle dots", attrs: { "data-handle": "dots" } },
    {
        label: "handle dots, density compact",
        attrs: { "data-handle": "dots", "data-density": "compact" },
    },
    { label: "handle dots, rtl", attrs: { "data-handle": "dots", dir: "rtl" } },
    { label: "radius flat", attrs: { "data-radius": "flat" } },
    { label: "text large", attrs: { "data-text": "large" } },
    { label: "motion none", attrs: { "data-motion": "none" } },
];

export default function SplitterMatrix() {
    return (
        <div className="grid w-[60rem] max-w-full grid-cols-1 gap-4 sm:grid-cols-2">
            {frames.map(({ label, className, attrs }) => (
                <figure key={label} className="flex flex-col gap-1" {...attrs}>
                    <figcaption className="text-xs text-palette-accent/85">
                        {label}
                    </figcaption>
                    <View className={className} name={label} />
                </figure>
            ))}
        </div>
    );
}

function View({ className, name }: { className?: string; name: string }) {
    return (
        <Splitter.Group
            className={cn(
                "h-40 overflow-hidden rounded-md border border-palette-line",
                className,
            )}
        >
            <Splitter.Panel defaultSize="40%" minSize="15%">
                <Cell>Start</Cell>
            </Splitter.Panel>
            <Splitter.Separator aria-label={`Resize start, ${name}`}>
                <Splitter.Grip />
            </Splitter.Separator>
            <Splitter.Panel>
                <Splitter.Group orientation="vertical" className="h-full">
                    <Splitter.Panel>
                        <Cell>Top</Cell>
                    </Splitter.Panel>
                    <Splitter.Separator aria-label={`Resize top, ${name}`}>
                        <Splitter.Grip />
                    </Splitter.Separator>
                    <Splitter.Panel collapsible minSize="25%">
                        <Cell>Bottom</Cell>
                    </Splitter.Panel>
                </Splitter.Group>
            </Splitter.Panel>
        </Splitter.Group>
    );
}

function Cell({ children }: { children: React.ReactNode }) {
    return <p className="p-3 font-medium">{children}</p>;
}

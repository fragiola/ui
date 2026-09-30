import { useState } from "react";
import { Clickable } from "#/components/atoms/clickable";
import { Sidebar } from "#/components/ui/sidebar";

// Every collapse mode × variant × side of the sidebar, in a frame wide enough
// for the desktop layout and in one narrower than the 42rem threshold, where
// the Trigger opens the Drawer instead. The frames have a fixed height: the
// sidebar is sticky inside its Provider, never fixed to the viewport, so it
// must stay inside them.

const COLLAPSIBLE = ["offcanvas", "icon", "none"] as const;
const VARIANTS = ["sidebar", "floating", "inset"] as const;
const SIDES = ["start", "end"] as const;

export default function SidebarModes() {
    const [collapsible, setCollapsible] =
        useState<(typeof COLLAPSIBLE)[number]>("offcanvas");
    const [variant, setVariant] =
        useState<(typeof VARIANTS)[number]>("sidebar");
    const [side, setSide] = useState<(typeof SIDES)[number]>("start");

    const shell = (
        <Sidebar.Provider className="min-h-0 h-full">
            {side === "end" ? <Page /> : null}
            <Sidebar.Root
                collapsible={collapsible}
                variant={variant}
                side={side}
            >
                <div className="flex flex-col gap-2 p-4 text-sm">
                    <span className="font-medium">Sidebar</span>
                    <span className="text-palette-accent/85">
                        {collapsible} · {variant} · {side}
                    </span>
                </div>
                <Sidebar.Rail />
            </Sidebar.Root>
            {side === "start" ? <Page /> : null}
        </Sidebar.Provider>
    );

    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            <Choice
                label="collapsible"
                options={COLLAPSIBLE}
                value={collapsible}
                onChange={setCollapsible}
            />
            <Choice
                label="variant"
                options={VARIANTS}
                value={variant}
                onChange={setVariant}
            />
            <Choice
                label="side"
                options={SIDES}
                value={side}
                onChange={setSide}
            />
            <div className="h-96 w-[48rem] overflow-hidden rounded-lg border border-palette-line">
                {shell}
            </div>
            <div className="h-96 w-80 overflow-hidden rounded-lg border border-palette-line">
                {shell}
            </div>
        </div>
    );
}

function Page() {
    return (
        <Sidebar.Inset>
            <header className="flex h-12 items-center gap-2 border-b border-palette-line px-3">
                <Sidebar.Trigger />
                <span className="text-sm font-medium">Page</span>
            </header>
            <div className="p-4 text-sm text-palette-accent/85">
                The page beside the sidebar.
            </div>
        </Sidebar.Inset>
    );
}

function Choice<T extends string>({
    label,
    options,
    value,
    onChange,
}: {
    label: string;
    options: readonly T[];
    value: T;
    onChange: (value: T) => void;
}) {
    return (
        <div className="flex items-center gap-2">
            <span className="w-24 text-sm text-palette-accent/85">{label}</span>
            {options.map((option) => (
                <Clickable.Button
                    key={option}
                    size="sm"
                    variant={option === value ? "outline" : "ghost"}
                    aria-pressed={option === value}
                    onClick={() => onChange(option)}
                >
                    {option}
                </Clickable.Button>
            ))}
        </div>
    );
}

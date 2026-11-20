import { createModel, type LayoutJson } from "@fragiola/dockable-react";
import { useState } from "react";
import { Dockable } from "#/components/ui/dockable";
import { Splitter } from "#/components/ui/splitter";

// The resize handle's four levels (`data-handle`, architecture.md §4), each
// on a frame: a Dockable layout and a Splitter side by side, so the two
// handles read as one — the same mark, colours and states (hover, drag,
// Tab onto one for focus). Under `line`, `grip` and `dots` Dockable keeps
// its 6px gap between bordered tabsets, with no rule at rest; under `ide`
// the tabsets meet at a 1px seam that brightens on hover and thickens into
// a 3px `ring` bar while dragged, in both components, a row in RTL too.

type Types = { tabs: { note: { text: string } } };

const json: LayoutJson<Types> = {
    version: 1,
    root: {
        type: "row",
        children: [
            { type: "tabset", children: [note("Files", "A tabset.")] },
            {
                type: "row",
                children: [
                    { type: "tabset", children: [note("Editor", "Above.")] },
                    { type: "tabset", children: [note("Console", "Below.")] },
                ],
            },
        ],
    },
};

function note(label: string, text: string) {
    return { component: "note" as const, label, data: { text } };
}

const LEVELS = [
    { level: "line" },
    { level: "grip" },
    { level: "dots" },
    { level: "ide" },
    { level: "ide", dir: "rtl" },
] as const;

export default function DockableHandles() {
    return (
        <div className="flex w-[60rem] max-w-full flex-col gap-6">
            {LEVELS.map(({ level, ...rest }) => (
                <figure
                    key={`${level}-${"dir" in rest ? rest.dir : "ltr"}`}
                    data-handle={level}
                    dir={"dir" in rest ? rest.dir : undefined}
                    className="flex flex-col gap-1"
                >
                    <figcaption className="text-xs text-palette-accent/85">
                        data-handle="{level}"
                        {"dir" in rest ? `, dir="${rest.dir}"` : ""}
                    </figcaption>
                    <div className="grid grid-cols-2 gap-4">
                        <Layout />
                        <Splitter.Group className="h-48 overflow-hidden rounded-md border border-palette-line">
                            <Splitter.Panel defaultSize="40%">
                                <p className="p-3 text-xs">Start</p>
                            </Splitter.Panel>
                            <Splitter.Separator aria-label={`Resize, ${level}`}>
                                <Splitter.Grip />
                            </Splitter.Separator>
                            <Splitter.Panel>
                                <p className="p-3 text-xs">End</p>
                            </Splitter.Panel>
                        </Splitter.Group>
                    </div>
                </figure>
            ))}
        </div>
    );
}

function Layout() {
    const [model] = useState(() => createModel<Types>(json));
    return (
        <div className="h-48 overflow-hidden rounded-md border border-palette-line">
            <Dockable.Template.Simple model={model} className="size-full">
                {(tab) => <p className="p-3 text-xs">{tab.data.text}</p>}
            </Dockable.Template.Simple>
        </div>
    );
}

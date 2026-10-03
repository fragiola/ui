import { createModel, type LayoutJson } from "@fragiola/dockable-react";
import { useState } from "react";
import { Dockable } from "#/components/ui/dockable";

// Dockable.Template.Simple — the whole layout from a model and a tab's
// content: a docked start border and an overlaid bottom one, a tabset with
// more tabs than fit (the overflow menu), a tab that may not close, popout
// (every tab) and maximize in each header. `tab.data` narrows on
// `tab.component` in the child function. The toolbar's theme, direction and
// density reach every part; the frames below repeat the template under a
// surface-ring palette passed as its one className.

type Types = {
    tabs: {
        doc: { text: string };
        metric: { value: number };
    };
};

const doc = (label: string, text: string, extra: object = {}) => ({
    component: "doc" as const,
    label,
    data: { text },
    ...extra,
});

const json: LayoutJson<Types> = {
    version: 1,
    defaults: { tab: { enablePopout: true }, border: { size: 180 } },
    borders: [
        {
            location: "start",
            selected: 0,
            children: [doc("Explorer", "Files"), doc("Search", "Find")],
        },
        {
            location: "bottom",
            mode: "overlay",
            size: 120,
            children: [doc("Terminal", "$ pnpm dev")],
        },
    ],
    root: {
        type: "row",
        children: [
            {
                type: "tabset",
                weight: 60,
                children: [
                    doc("Overview", "Pinned in place: no close button.", {
                        enableClose: false,
                    }),
                    doc("Report", "Q3 numbers."),
                    doc("Roadmap", "Next quarter."),
                    doc("Changelog", "What shipped."),
                    doc("Budget", "Spend so far."),
                    doc("Hiring", "Open roles."),
                ],
            },
            {
                type: "tabset",
                weight: 40,
                children: [
                    {
                        component: "metric",
                        label: "Visitors",
                        data: { value: 1284 },
                    },
                    {
                        component: "metric",
                        label: "Signups",
                        data: { value: 96 },
                    },
                ],
            },
        ],
    },
};

function Layout({ className }: { className?: string }) {
    const [model] = useState(() => createModel<Types>(json));
    return (
        <Dockable.Template.Simple
            model={model}
            className={className}
            popoutURL={`${import.meta.env.BASE_URL}popout.html`}
        >
            {(tab) =>
                tab.component === "metric" ? (
                    <p className="p-4 text-2xl font-medium">
                        {tab.data.value.toLocaleString()}
                    </p>
                ) : (
                    <p className="p-4 text-palette-accent/85">
                        {tab.data.text}
                    </p>
                )
            }
        </Dockable.Template.Simple>
    );
}

export default function TemplateSimple() {
    return (
        <div className="flex w-[56rem] max-w-full flex-col gap-4">
            <div className="h-[28rem] overflow-hidden rounded-lg border border-palette-line">
                <Layout className="size-full" />
            </div>
            <div className="grid gap-4">
                {["palette-surface-blue", "palette-surface-rose"].map(
                    (palette) => (
                        <div
                            key={palette}
                            className="h-64 overflow-hidden rounded-lg border border-palette-line"
                        >
                            <Layout className={`size-full ${palette}`} />
                        </div>
                    ),
                )}
            </div>
        </div>
    );
}

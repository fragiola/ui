"use client";

import { createModel, type LayoutJson } from "@fragiola/dockable-react";
import { useState } from "react";
import { Dockable } from "#/components/ui/dockable";

// A docking layout in one line: Dockable.Template.Simple renders the model
// — rows, tabsets, splitters, the borders it declares — and the function
// child renders a tab's content. Drag a tab to another tabset, beside one or
// to the layout's edge; resize with the splitters (or Tab onto one and use
// the arrows); close a tab, maximize a tabset, pop a tab out into a window
// and dock it back. The narrow tabset hides what does not fit behind its
// overflow menu. "Overview" may not close: its header shows no button.
//
// The model is the package's: a JSON layout, created once. Each tab names a
// component and carries its data, and `tab.data` narrows on
// `tab.component` in the child function.

type Types = {
    tabs: {
        note: { text: string };
        metric: { value: string; change: string };
    };
};

const note = (label: string, text: string, extra: object = {}) => ({
    component: "note" as const,
    label,
    data: { text },
    ...extra,
});

const metric = (label: string, value: string, change: string) => ({
    component: "metric" as const,
    label,
    data: { value, change },
});

const json: LayoutJson<Types> = {
    version: 1,
    defaults: { tab: { enablePopout: true } },
    borders: [
        {
            location: "bottom",
            mode: "overlay",
            size: 140,
            children: [note("Activity", "3 deploys today, all green.")],
        },
    ],
    root: {
        type: "row",
        children: [
            {
                type: "tabset",
                weight: 62,
                children: [
                    note(
                        "Overview",
                        "The quarter at a glance. This tab may not close.",
                        { enableClose: false },
                    ),
                    note("Roadmap", "Billing page, then team settings."),
                    note("Changelog", "Popouts, borders and RTL shipped."),
                ],
            },
            {
                type: "row",
                weight: 38,
                children: [
                    {
                        type: "tabset",
                        children: [
                            metric("Visitors", "12,840", "+8% this week"),
                            metric("Signups", "964", "+3% this week"),
                            metric("Revenue", "$48.2k", "+12% this week"),
                            metric("Churn", "1.9%", "−0.2 pts this week"),
                            metric("Latency", "182 ms", "−14 ms this week"),
                        ],
                    },
                    {
                        type: "tabset",
                        children: [note("Notes", "Draft the release post.")],
                    },
                ],
            },
        ],
    },
};

export default function DockableExample() {
    const [model] = useState(() => createModel<Types>(json));
    return (
        <Dockable.Template.Simple
            model={model}
            // The host page the item installs, under this app's base path.
            popoutURL={`${import.meta.env.BASE_URL}popout.html`}
            className="h-full"
        >
            {(tab) =>
                tab.component === "metric" ? (
                    <div className="flex flex-col gap-1 p-4">
                        <span className="text-3xl font-medium">
                            {tab.data.value}
                        </span>
                        <span className="text-palette-accent/85">
                            {tab.data.change}
                        </span>
                    </div>
                ) : (
                    <p className="p-4 text-palette-accent/85">
                        {tab.data.text}
                    </p>
                )
            }
        </Dockable.Template.Simple>
    );
}

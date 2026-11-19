"use client";

import {
    FileCodeIcon,
    FolderTreeIcon,
    GitBranchIcon,
    type LucideIcon,
    SearchIcon,
} from "lucide-react";
import { split } from "#/components/families/split";
import { Splitter } from "#/components/ui/splitter";

// An editor's layout composed from the parts, for what Template.Simple does
// not do: a name for every separator, and a sidebar that collapses to a
// rail of icons. The sidebar collapses past its minimum (or with Enter on
// its rule) to 3rem; its labels wear `split.expanded`, hidden while the
// panel is collapsed, and the rail steps to the `soft` fill. The editor and
// the terminal are a vertical group nested in the main panel; the terminal
// collapses to nothing. Copy it and change what your app needs.

const VIEWS: { label: string; Icon: LucideIcon }[] = [
    { label: "Explorer", Icon: FolderTreeIcon },
    { label: "Search", Icon: SearchIcon },
    { label: "Source control", Icon: GitBranchIcon },
];

export default function SplitterIde() {
    return (
        <Splitter.Group className="h-full">
            <Splitter.Panel
                id="sidebar"
                defaultSize="24%"
                minSize="11rem"
                maxSize="40%"
                collapsible
                collapsedSize="3rem"
            >
                <nav aria-label="Views" className="flex flex-col gap-1 p-2">
                    {VIEWS.map(({ label, Icon }) => (
                        <button
                            key={label}
                            type="button"
                            aria-label={label}
                            className="flex h-8 items-center gap-2 rounded-md px-2 text-palette-accent/85 hover:bg-palette-soft hover:text-palette-contrast focus-visible:outline-2 focus-visible:outline-palette-ring"
                        >
                            <Icon
                                aria-hidden="true"
                                className="size-4 shrink-0"
                            />
                            <span
                                className={split.expanded({
                                    class: "truncate",
                                })}
                            >
                                {label}
                            </span>
                        </button>
                    ))}
                </nav>
            </Splitter.Panel>
            <Splitter.Separator aria-label="Resize the sidebar">
                <Splitter.Grip />
            </Splitter.Separator>
            <Splitter.Panel id="main">
                <Splitter.Group orientation="vertical" className="h-full">
                    <Splitter.Panel id="editor" minSize="30%">
                        <section
                            aria-label="Editor"
                            className="flex flex-col gap-2 p-4"
                        >
                            <h2 className="flex items-center gap-2 font-medium">
                                <FileCodeIcon
                                    aria-hidden="true"
                                    className="size-4"
                                />
                                app.tsx
                            </h2>
                            <pre
                                dir="ltr"
                                className="font-mono text-xs text-palette-accent/85"
                            >
                                {
                                    "export function App() {\n    return <Layout />;\n}"
                                }
                            </pre>
                        </section>
                    </Splitter.Panel>
                    <Splitter.Separator aria-label="Resize the terminal">
                        <Splitter.Grip />
                    </Splitter.Separator>
                    <Splitter.Panel
                        id="terminal"
                        defaultSize="30%"
                        minSize="20%"
                        collapsible
                    >
                        <section aria-label="Terminal" className="p-4">
                            <pre
                                dir="ltr"
                                className="font-mono text-xs text-palette-accent/85"
                            >
                                {"$ pnpm dev\n  ready in 312 ms"}
                            </pre>
                        </section>
                    </Splitter.Panel>
                </Splitter.Group>
            </Splitter.Panel>
        </Splitter.Group>
    );
}

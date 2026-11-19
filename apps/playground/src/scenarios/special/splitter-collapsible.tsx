import { FileIcon, FolderIcon, SearchIcon } from "lucide-react";
import { Splitter } from "#/components/ui/splitter";

// Collapsible panels. The sidebar collapses to a 3rem rail that keeps its
// icons (its labels are `split.expanded`, hidden while collapsed, and the
// rail steps to `soft`); the bottom panel collapses to nothing. Drag past a
// panel's minimum, or focus its separator and press Enter.
const items = [
    { label: "Files", Icon: FileIcon },
    { label: "Folders", Icon: FolderIcon },
    { label: "Search", Icon: SearchIcon },
];

export default function SplitterCollapsible() {
    return (
        <Splitter.Group className="h-80 w-[48rem] max-w-full overflow-hidden rounded-lg border border-palette-line">
            <Splitter.Panel
                id="sidebar"
                defaultSize="25%"
                minSize="10rem"
                collapsible
                collapsedSize="3rem"
            >
                <nav aria-label="Sidebar" className="flex flex-col gap-1 p-2">
                    {items.map(({ label, Icon }) => (
                        <a
                            key={label}
                            href={`#${label.toLowerCase()}`}
                            aria-label={label}
                            className="flex h-8 items-center gap-2 rounded-md px-2 hover:bg-palette-soft in-data-collapsed:justify-center"
                        >
                            <Icon
                                aria-hidden="true"
                                className="size-4 shrink-0"
                            />
                            <span className="truncate in-data-collapsed:hidden">
                                {label}
                            </span>
                        </a>
                    ))}
                </nav>
            </Splitter.Panel>
            <Splitter.Separator aria-label="Resize the sidebar">
                <Splitter.Grip />
            </Splitter.Separator>
            <Splitter.Panel id="main">
                <Splitter.Group orientation="vertical" className="h-full">
                    <Splitter.Panel id="content" minSize="30%">
                        <p className="p-4 text-palette-accent/85">
                            Press Enter on a separator to collapse the panel
                            before it.
                        </p>
                    </Splitter.Panel>
                    <Splitter.Separator aria-label="Resize the output">
                        <Splitter.Grip />
                    </Splitter.Separator>
                    <Splitter.Panel
                        id="output"
                        defaultSize="30%"
                        minSize="20%"
                        collapsible
                    >
                        <p className="p-4 text-palette-accent/85">
                            Output — collapses to nothing.
                        </p>
                    </Splitter.Panel>
                </Splitter.Group>
            </Splitter.Panel>
        </Splitter.Group>
    );
}

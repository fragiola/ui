import { FolderOpenIcon, PlusIcon, SearchIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Clickable } from "#/components/atoms/clickable";
import { Empty } from "#/components/ui/empty";

// A projects page before the first project, in the default look: a featured
// icon, a title, a line that says what to do, and the actions, the primary
// one palette-neutral. Empty draws no box, so here it sits in a dashed
// outline; the second one is a search with no results, straight on the
// floor, with a single ghost action.
export default function EmptyDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Empty.Root className="rounded-lg border border-dashed border-palette-line">
                <Empty.Header>
                    <Empty.Icon>
                        <FolderOpenIcon />
                    </Empty.Icon>
                    <Empty.Title>No projects yet</Empty.Title>
                    <Empty.Description>
                        Projects hold your boards, files and members. Create
                        one, or import it from another tool.
                    </Empty.Description>
                </Empty.Header>
                <Empty.Actions>
                    <Clickable.Button variant="outline">
                        Import
                    </Clickable.Button>
                    <Clickable.Button className="palette-neutral">
                        <PlusIcon />
                        New project
                    </Clickable.Button>
                </Empty.Actions>
            </Empty.Root>

            <Row label="no results">
                <Empty.Root>
                    <Empty.Header>
                        <Empty.Icon>
                            <SearchIcon />
                        </Empty.Icon>
                        <Empty.Title>No results for “roadmap”</Empty.Title>
                        <Empty.Description>
                            Check the spelling, or search all workspaces.
                        </Empty.Description>
                    </Empty.Header>
                    <Empty.Actions>
                        <Clickable.Button variant="ghost">
                            Clear search
                        </Clickable.Button>
                    </Empty.Actions>
                </Empty.Root>
            </Row>
        </div>
    );
}

// Row — a captioned row. The caption is a <span>, not a heading.
function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-palette-accent/85">
                {label}
            </span>
            {children}
        </div>
    );
}

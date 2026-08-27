"use client";

import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Collapsible } from "#/ui/collapsible";

// The floor is palette-surface. The collapsible shares the disclosure family
// with the accordion — the trigger, panel and content read roles from the
// floor. Shows: default closed, default open, and disabled.
export default function CollapsibleDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            <Row label="default closed">
                <Collapsible.Root>
                    <Collapsible.Trigger>
                        Click to expand
                        <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-panel-open:rotate-180" />
                    </Collapsible.Trigger>
                    <Collapsible.Panel>
                        <Collapsible.Content>
                            A collapsible is a single expand/collapse section.
                            An accordion is a group of collapsibles with
                            coordination. Both share the same trigger, panel and
                            content from the disclosure family.
                        </Collapsible.Content>
                    </Collapsible.Panel>
                </Collapsible.Root>
            </Row>

            <Row label="default open">
                <Collapsible.Root defaultOpen>
                    <Collapsible.Trigger>
                        Already open
                        <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-panel-open:rotate-180" />
                    </Collapsible.Trigger>
                    <Collapsible.Panel>
                        <Collapsible.Content>
                            This section starts open. The chevron is already
                            rotated because the trigger has
                            <code>data-panel-open</code>.
                        </Collapsible.Content>
                    </Collapsible.Panel>
                </Collapsible.Root>
            </Row>

            <Row label="disabled">
                <Collapsible.Root disabled>
                    <Collapsible.Trigger>
                        Disabled
                        <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-panel-open:rotate-180" />
                    </Collapsible.Trigger>
                    <Collapsible.Panel>
                        <Collapsible.Content>
                            This collapsible is disabled.
                        </Collapsible.Content>
                    </Collapsible.Panel>
                </Collapsible.Root>
            </Row>
        </div>
    );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-palette-accent/85">
                {label}
            </span>
            <div className="w-full max-w-md">{children}</div>
        </div>
    );
}

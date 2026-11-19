"use client";

import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Collapsible } from "#/components/ui/collapsible";

// An order summary whose details fold away, in the default look. The
// collapsible shares the disclosure family with the accordion: one trigger,
// one panel, read from the floor's palette. It starts open here
// (`defaultOpen`), so the chevron starts turned: the trigger carries
// data-panel-open. Then the one state a reader needs, disabled. A
// collapsible has no colour of its own, so there is no palettes row.
//
// The root carries a width (see the accordion example): a widthless root
// resizes with the open panel and the demo jumps.
export default function CollapsibleDemo() {
    return (
        <div className="palette-surface flex w-full max-w-xl flex-col gap-6 bg-palette-base text-palette-contrast">
            <Collapsible.Root defaultOpen>
                <Collapsible.Trigger>
                    Order #4821 · 3 items
                    <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-panel-open:rotate-180" />
                </Collapsible.Trigger>
                <Collapsible.Panel>
                    <Collapsible.Content>
                        Wool scarf, linen shirt and a canvas tote. Shipped on
                        March 4 from Lisbon; it arrives in two to four business
                        days.
                    </Collapsible.Content>
                </Collapsible.Panel>
            </Collapsible.Root>

            <Row label="disabled">
                <Collapsible.Root disabled>
                    <Collapsible.Trigger>
                        Order #4790 · archived
                        <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-panel-open:rotate-180" />
                    </Collapsible.Trigger>
                    <Collapsible.Panel>
                        <Collapsible.Content>
                            Archived orders cannot be opened.
                        </Collapsible.Content>
                    </Collapsible.Panel>
                </Collapsible.Root>
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

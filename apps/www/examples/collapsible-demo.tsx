"use client";

import { ChevronDownIcon } from "lucide-react";
import { Collapsible } from "#/ui/collapsible";
import { PaletteGrid } from "@/components/preview/palette-grid";
import { SURFACES } from "@/lib/palette-sets";

// Each cell is a tinted surface palette. The collapsible shares the disclosure
// family with the accordion — the trigger, panel and content read roles from
// the cell.
function DemoContent() {
    return (
        <div className="flex flex-col gap-4 w-full max-w-md">
            {/* Single collapsible — default closed */}
            <Collapsible.Root>
                <Collapsible.Trigger>
                    Click to expand
                    <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-[panel-open]:rotate-180" />
                </Collapsible.Trigger>
                <Collapsible.Panel>
                    <Collapsible.Content>
                        A collapsible is a single expand/collapse section. An
                        accordion is a group of collapsibles with coordination.
                        Both share the same trigger, panel and content from the
                        disclosure family.
                    </Collapsible.Content>
                </Collapsible.Panel>
            </Collapsible.Root>

            {/* Default open */}
            <Collapsible.Root defaultOpen>
                <Collapsible.Trigger>
                    Already open
                    <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-[panel-open]:rotate-180" />
                </Collapsible.Trigger>
                <Collapsible.Panel>
                    <Collapsible.Content>
                        This section starts open. The chevron is already rotated
                        because the trigger has
                        <code>data-panel-open</code>.
                    </Collapsible.Content>
                </Collapsible.Panel>
            </Collapsible.Root>

            {/* Disabled */}
            <Collapsible.Root disabled>
                <Collapsible.Trigger>
                    Disabled
                    <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-[panel-open]:rotate-180" />
                </Collapsible.Trigger>
                <Collapsible.Panel>
                    <Collapsible.Content>
                        This collapsible is disabled.
                    </Collapsible.Content>
                </Collapsible.Panel>
            </Collapsible.Root>
        </div>
    );
}

export default function CollapsibleDemo() {
    return (
        <PaletteGrid palettes={SURFACES}>
            <DemoContent />
        </PaletteGrid>
    );
}

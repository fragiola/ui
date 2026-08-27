"use client";

import { ChevronDownIcon } from "lucide-react";
import { Accordion } from "#/ui/accordion";

export default function AccordionDemo() {
    return (
        <Accordion.Root>
            <Accordion.Item>
                <Accordion.Header>
                    <Accordion.Trigger>
                        Is it accessible?
                        <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-[panel-open]:rotate-180" />
                    </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel>
                    <Accordion.Content>
                        Yes. It adheres to the WAI-ARIA design pattern and uses
                        Base UI's Accordion primitive for keyboard navigation,
                        focus management and aria-expanded.
                    </Accordion.Content>
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item>
                <Accordion.Header>
                    <Accordion.Trigger>
                        Is it styled?
                        <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-[panel-open]:rotate-180" />
                    </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel>
                    <Accordion.Content>
                        Yes. The trigger, panel and content come from the
                        disclosure family — zero variants, shared with the
                        collapsible component.
                    </Accordion.Content>
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item>
                <Accordion.Header>
                    <Accordion.Trigger>
                        Is it RTL-aware?
                        <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-[panel-open]:rotate-180" />
                    </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel>
                    <Accordion.Content>
                        Yes. The trigger uses logical padding (ps-4 pe-3) so the
                        inline padding flips under RTL.
                    </Accordion.Content>
                </Accordion.Panel>
            </Accordion.Item>

            {/* Disabled item */}
            <Accordion.Item disabled>
                <Accordion.Header>
                    <Accordion.Trigger>
                        Disabled item
                        <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-[panel-open]:rotate-180" />
                    </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel>
                    <Accordion.Content>
                        This item is disabled — pointer events are zeroed and
                        opacity is reduced.
                    </Accordion.Content>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion.Root>
    );
}

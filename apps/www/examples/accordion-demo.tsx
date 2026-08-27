"use client";

import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Accordion } from "#/ui/accordion";

// The floor is palette-surface — a neutral surface that belongs to no
// palette. The accordion shows its real axes: open/closed items, multiple
// vs single, and a disabled item. No palette showcasing — an accordion is
// not "a blue accordion".
export default function AccordionDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            {/* Multiple open (default) — multiple={true} is the default */}
            <Row label="multiple open (default)">
                <Accordion.Root>
                    <Accordion.Item>
                        <Accordion.Header>
                            <Accordion.Trigger>
                                Is it accessible?
                                <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-panel-open:rotate-180" />
                            </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Panel>
                            <Accordion.Content>
                                Yes. It adheres to the WAI-ARIA design pattern
                                and uses Base UI's Accordion primitive for
                                keyboard navigation, focus management and
                                aria-expanded.
                            </Accordion.Content>
                        </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item>
                        <Accordion.Header>
                            <Accordion.Trigger>
                                Is it styled?
                                <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-panel-open:rotate-180" />
                            </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Panel>
                            <Accordion.Content>
                                Yes. The trigger, panel and content come from
                                the disclosure family — zero variants, shared
                                with the collapsible component.
                            </Accordion.Content>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion.Root>
            </Row>

            {/* Single open */}
            <Row label="single open">
                <Accordion.Root multiple={false}>
                    <Accordion.Item>
                        <Accordion.Header>
                            <Accordion.Trigger>
                                First
                                <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-panel-open:rotate-180" />
                            </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Panel>
                            <Accordion.Content>
                                Only one item open at a time.
                            </Accordion.Content>
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item>
                        <Accordion.Header>
                            <Accordion.Trigger>
                                Second
                                <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-panel-open:rotate-180" />
                            </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Panel>
                            <Accordion.Content>
                                Opening this one closes the first.
                            </Accordion.Content>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion.Root>
            </Row>

            {/* Disabled item */}
            <Row label="disabled item">
                <Accordion.Root>
                    <Accordion.Item disabled>
                        <Accordion.Header>
                            <Accordion.Trigger>
                                Disabled item
                                <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-panel-open:rotate-180" />
                            </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Panel>
                            <Accordion.Content>
                                This item is disabled — pointer events are
                                zeroed and opacity is reduced.
                            </Accordion.Content>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion.Root>
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
            {children}
        </div>
    );
}

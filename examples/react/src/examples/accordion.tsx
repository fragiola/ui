"use client";

import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Accordion } from "#/components/ui/accordion";

// A pricing page's FAQ, in the default look. The accordion is a panel on
// the floor (a line border, no fill of its own); open items read the same
// as closed ones, only the chevron turns. More than one item can be open at
// once — `multiple={false}` on the root keeps one. Then the one state a
// reader needs, a disabled item. An accordion has no colour of its own, so
// there is no palettes row.
//
// The root carries a width. The preview centres its demo with flex, so a
// widthless root shrinks to its closed triggers and then stretches to the
// panel's paragraph on open — the whole demo jumped. Width comes from the
// container, never from the item.
export default function AccordionDemo() {
    return (
        <div className="palette-surface flex w-full max-w-xl flex-col gap-6 bg-palette-base text-palette-contrast">
            <Accordion.Root>
                <Accordion.Item>
                    <Accordion.Header>
                        <Accordion.Trigger>
                            Can I change my plan later?
                            <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-panel-open:rotate-180" />
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Panel>
                        <Accordion.Content>
                            Yes. Upgrades apply at once and are prorated;
                            downgrades take effect at the end of the billing
                            period.
                        </Accordion.Content>
                    </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item>
                    <Accordion.Header>
                        <Accordion.Trigger>
                            How do refunds work?
                            <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-panel-open:rotate-180" />
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Panel>
                        <Accordion.Content>
                            Annual plans can be refunded in full within 30 days.
                            Monthly plans are not refunded, but you can cancel
                            at any time.
                        </Accordion.Content>
                    </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item>
                    <Accordion.Header>
                        <Accordion.Trigger>
                            Do you offer a discount for nonprofits?
                            <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-panel-open:rotate-180" />
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Panel>
                        <Accordion.Content>
                            Yes. Write to us from your organisation's address
                            and we apply 50% off every plan.
                        </Accordion.Content>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion.Root>

            <Row label="disabled">
                <Accordion.Root>
                    <Accordion.Item disabled>
                        <Accordion.Header>
                            <Accordion.Trigger>
                                Enterprise contracts
                                <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-panel-open:rotate-180" />
                            </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Panel>
                            <Accordion.Content>
                                Talk to sales for a custom contract.
                            </Accordion.Content>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion.Root>
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

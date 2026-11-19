"use client";

import { ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Text } from "#/components/atoms/text";
import { Breadcrumb } from "#/components/ui/breadcrumb";

// A page header in the default look: the trail above the page's title. The
// links are secondary text and the current page reads in contrast; the
// breadcrumb carries no palette class and takes the floor's. Then a deep
// trail collapsed with an ellipsis, and a custom separator.
export default function BreadcrumbDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <header className="flex flex-col gap-2">
                <Breadcrumb.Root>
                    <Breadcrumb.List>
                        <Breadcrumb.Item>
                            <Breadcrumb.Link href="#">Acme</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator>
                            <ChevronRightIcon />
                        </Breadcrumb.Separator>
                        <Breadcrumb.Item>
                            <Breadcrumb.Link href="#">Settings</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator>
                            <ChevronRightIcon />
                        </Breadcrumb.Separator>
                        <Breadcrumb.Item>
                            <Breadcrumb.Page>Billing</Breadcrumb.Page>
                        </Breadcrumb.Item>
                    </Breadcrumb.List>
                </Breadcrumb.Root>
                <Text.Heading as="h2">Billing</Text.Heading>
            </header>

            {/* the middle of a deep trail, collapsed */}
            <Row label="collapsed">
                <Breadcrumb.Root>
                    <Breadcrumb.List>
                        <Breadcrumb.Item>
                            <Breadcrumb.Link href="#">Acme</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator>
                            <ChevronRightIcon />
                        </Breadcrumb.Separator>
                        <Breadcrumb.Item>
                            <Breadcrumb.Ellipsis />
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator>
                            <ChevronRightIcon />
                        </Breadcrumb.Separator>
                        <Breadcrumb.Item>
                            <Breadcrumb.Link href="#">Invoices</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator>
                            <ChevronRightIcon />
                        </Breadcrumb.Separator>
                        <Breadcrumb.Item>
                            <Breadcrumb.Page>INV-2041</Breadcrumb.Page>
                        </Breadcrumb.Item>
                    </Breadcrumb.List>
                </Breadcrumb.Root>
            </Row>

            {/* the separator is whatever you put in it */}
            <Row label="custom separator">
                <Breadcrumb.Root>
                    <Breadcrumb.List>
                        <Breadcrumb.Item>
                            <Breadcrumb.Link href="#">Projects</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator>
                            <span className="text-palette-accent/85">/</span>
                        </Breadcrumb.Separator>
                        <Breadcrumb.Item>
                            <Breadcrumb.Page>Website redesign</Breadcrumb.Page>
                        </Breadcrumb.Item>
                    </Breadcrumb.List>
                </Breadcrumb.Root>
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

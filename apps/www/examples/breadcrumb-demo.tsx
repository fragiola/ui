"use client";

import { ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Breadcrumb } from "#/ui/breadcrumb";

// The floor is palette-surface. The breadcrumb shows its real axes: basic,
// with ellipsis for collapsed items, and a custom separator. The current
// page uses contrast, links use accent.
export default function BreadcrumbDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            <Row label="basic">
                <Breadcrumb.Root>
                    <Breadcrumb.List>
                        <Breadcrumb.Item>
                            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator>
                            <ChevronRightIcon />
                        </Breadcrumb.Separator>
                        <Breadcrumb.Item>
                            <Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator>
                            <ChevronRightIcon />
                        </Breadcrumb.Separator>
                        <Breadcrumb.Item>
                            <Breadcrumb.Page>Components</Breadcrumb.Page>
                        </Breadcrumb.Item>
                    </Breadcrumb.List>
                </Breadcrumb.Root>
            </Row>

            <Row label="with ellipsis">
                <Breadcrumb.Root>
                    <Breadcrumb.List>
                        <Breadcrumb.Item>
                            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
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
                            <Breadcrumb.Link href="/docs/components">
                                Components
                            </Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator>
                            <ChevronRightIcon />
                        </Breadcrumb.Separator>
                        <Breadcrumb.Item>
                            <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
                        </Breadcrumb.Item>
                    </Breadcrumb.List>
                </Breadcrumb.Root>
            </Row>

            <Row label="custom separator">
                <Breadcrumb.Root>
                    <Breadcrumb.List>
                        <Breadcrumb.Item>
                            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator>
                            <span className="text-palette-accent/85">/</span>
                        </Breadcrumb.Separator>
                        <Breadcrumb.Item>
                            <Breadcrumb.Page>Current page</Breadcrumb.Page>
                        </Breadcrumb.Item>
                    </Breadcrumb.List>
                </Breadcrumb.Root>
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

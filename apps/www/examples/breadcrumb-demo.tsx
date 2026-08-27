"use client";
import { ChevronRightIcon } from "lucide-react";
import { Breadcrumb } from "#/ui/breadcrumb";

export default function BreadcrumbDemo() {
    return (
        <div className="flex flex-col gap-6">
            {/* Basic breadcrumb */}
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

            {/* With ellipsis for collapsed items */}
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

            {/* Custom separator */}
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator>
                        <span className="text-palette-accent/60">/</span>
                    </Breadcrumb.Separator>
                    <Breadcrumb.Item>
                        <Breadcrumb.Page>Current page</Breadcrumb.Page>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
        </div>
    );
}

"use client";

import type { ReactNode } from "react";
import { Pagination } from "#/components/ui/pagination";

// The footer of an invoice list in the default look: a count in secondary
// text and the pages, the current one lit as `current` (a soft fill, text in
// contrast). The pagination carries no palette class and takes the floor's.
// Then the first page, where there is no previous page to go to.
export default function PaginationDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="text-sm text-palette-accent/85">
                    Showing 161–180 of 412 invoices
                </span>
                <Pagination.Root>
                    <Pagination.Content>
                        <Pagination.Item>
                            <Pagination.Previous href="?page=8" />
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Link href="?page=1">1</Pagination.Link>
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Ellipsis />
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Link href="?page=8">8</Pagination.Link>
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Link href="?page=9" active>
                                9
                            </Pagination.Link>
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Link href="?page=10">
                                10
                            </Pagination.Link>
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Ellipsis />
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Link href="?page=21">
                                21
                            </Pagination.Link>
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Next href="?page=10" />
                        </Pagination.Item>
                    </Pagination.Content>
                </Pagination.Root>
            </div>

            {/* on the first page, Previous is disabled */}
            <Row label="first page">
                <Pagination.Root>
                    <Pagination.Content>
                        <Pagination.Item>
                            <Pagination.Previous href="?page=1" disabled />
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Link href="?page=1" active>
                                1
                            </Pagination.Link>
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Link href="?page=2">2</Pagination.Link>
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Link href="?page=3">3</Pagination.Link>
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Next href="?page=2" />
                        </Pagination.Item>
                    </Pagination.Content>
                </Pagination.Root>
            </Row>
        </div>
    );
}

// Row — a captioned row. The caption is a <span>, not a heading.
function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col items-start gap-2">
            <span className="font-mono text-xs text-palette-accent/85">
                {label}
            </span>
            {children}
        </div>
    );
}

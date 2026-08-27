"use client";

import type { ReactNode } from "react";
import { Pagination } from "#/ui/pagination";

// The floor is palette-surface. The pagination links and the active state
// read roles from the floor — the active link uses contrast, the rest use
// accent. Shows: basic, with ellipsis, and previous disabled at the start.
export default function PaginationDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            <Row label="basic">
                <Pagination.Root>
                    <Pagination.Content>
                        <Pagination.Item>
                            <Pagination.Previous href="?page=1" />
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Link href="?page=1">1</Pagination.Link>
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Link href="?page=2" active>
                                2
                            </Pagination.Link>
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Link href="?page=3">3</Pagination.Link>
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Link href="?page=4">4</Pagination.Link>
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Link href="?page=5">5</Pagination.Link>
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Next href="?page=3" />
                        </Pagination.Item>
                    </Pagination.Content>
                </Pagination.Root>
            </Row>

            <Row label="with ellipsis">
                <Pagination.Root>
                    <Pagination.Content>
                        <Pagination.Item>
                            <Pagination.Previous href="?page=1" />
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
                            <Pagination.Link href="?page=20">
                                20
                            </Pagination.Link>
                        </Pagination.Item>
                        <Pagination.Item>
                            <Pagination.Next href="?page=10" />
                        </Pagination.Item>
                    </Pagination.Content>
                </Pagination.Root>
            </Row>

            <Row label="previous disabled">
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
                            <Pagination.Next href="?page=2" />
                        </Pagination.Item>
                    </Pagination.Content>
                </Pagination.Root>
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

"use client";

import { Pagination } from "#/ui/pagination";
import { PaletteGrid } from "@/components/preview/palette-grid";
import { SURFACES } from "@/lib/palette-sets";

// Each cell is a tinted surface palette. The pagination links and the active
// state read roles from the cell — the active link uses contrast, the rest
// use accent.
function DemoContent() {
    return (
        <div className="flex flex-col gap-8">
            {/* Basic */}
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

            {/* With ellipsis */}
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
                        <Pagination.Link href="?page=10">10</Pagination.Link>
                    </Pagination.Item>
                    <Pagination.Item>
                        <Pagination.Ellipsis />
                    </Pagination.Item>
                    <Pagination.Item>
                        <Pagination.Link href="?page=20">20</Pagination.Link>
                    </Pagination.Item>
                    <Pagination.Item>
                        <Pagination.Next href="?page=10" />
                    </Pagination.Item>
                </Pagination.Content>
            </Pagination.Root>

            {/* Previous disabled at the start */}
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
        </div>
    );
}

export default function PaginationDemo() {
    return (
        <PaletteGrid palettes={SURFACES}>
            <DemoContent />
        </PaletteGrid>
    );
}

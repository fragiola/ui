"use client";

import {
    type DataGridFeature,
    type DataGridRef,
    useDataGrid,
} from "@fragiola/data-grid-react";
import type { PaginationTypes } from "@fragiola/data-grid-react/pagination";
import type * as React from "react";
import { useSyncExternalStore } from "react";
import { sheet } from "#/families/sheet";
import { cn } from "#/lib/cn";
import { Pagination as PaginationParts } from "#/ui/pagination";
import { Select } from "#/ui/select";
import { installed } from "./installed";

type PaginationProps<TRow> = Omit<React.ComponentProps<"nav">, "children"> & {
    /**
     * The grid it pages, from outside its Root (`useDataGridRef()`, the
     * same ref given to the Root). Inside the Root, leave it out.
     */
    gridRef?: DataGridRef<TRow> | undefined;
    /** Page sizes to choose from: a select of them unless left out. */
    pageSizes?: readonly number[] | undefined;
};

type PagedModel = NonNullable<
    ReturnType<
        typeof useDataGrid<unknown, readonly [DataGridFeature<PaginationTypes>]>
    >
>["model"];

const NONE = () => () => {};

// The pages to show: the first, the last, the current one and its
// neighbours; a gap between them is an ellipsis (`null`).
function pagesAround(current: number, count: number): (number | null)[] {
    const shown = new Set([0, count - 1, current - 1, current, current + 1]);
    const pages: (number | null)[] = [];
    for (let page = 0; page < count; page++) {
        if (shown.has(page)) pages.push(page);
        else if (pages.at(-1) !== null) pages.push(null);
    }
    return pages;
}

// The grid's pages (pagination()): the registry's Pagination — Previous,
// the pages (the first, the last, the current one and its neighbours) and
// Next, as buttons — wired to the model's page (`page-info`, `page.set`),
// with "Page 2 of 40" before them and, given `pageSizes`, the registry's
// Select of the page size (`page-size.set`). The rows of the page are the
// app's: rows in memory (`useLocalRows`) or a server's. Put it below the
// Root, with the Root's `gridRef`. Nothing without pagination() installed.
function Pagination<TRow>({
    gridRef,
    pageSizes,
    className,
    ...props
}: PaginationProps<TRow>) {
    const grid = useDataGrid<TRow>(gridRef);
    const model = grid?.model as PagedModel | undefined;
    // every command makes a new state: the pages follow it
    useSyncExternalStore(
        model ? (listener) => model.subscribe(listener) : NONE,
        () => model?.state,
        () => model?.state,
    );
    if (!model || !installed(grid?.model, "pagination")) return null;
    const { pageIndex, pageSize, pageCount } = model.get("page-info");
    const go = (page: number) => model.run("page.set", { pageIndex: page });
    const first = pageIndex <= 0;
    const last = pageIndex >= pageCount - 1;
    return (
        <PaginationParts.Root
            data-slot="data-grid-pagination"
            {...props}
            className={cn(sheet.pagination(), className)}
        >
            <span className={sheet.paginationStatus()} aria-live="polite">
                Page {Math.min(pageIndex + 1, pageCount)} of {pageCount}
            </span>
            <PaginationParts.Content>
                <PaginationParts.Item>
                    <PaginationParts.Previous
                        render={<button type="button" disabled={first} />}
                        disabled={first}
                        onClick={() => go(pageIndex - 1)}
                    />
                </PaginationParts.Item>
                {pagesAround(pageIndex, pageCount).map((page, index) =>
                    page === null ? (
                        <PaginationParts.Item
                            // a gap has no page: its place names it
                            // biome-ignore lint/suspicious/noArrayIndexKey: see above
                            key={`gap-${index}`}
                        >
                            <PaginationParts.Ellipsis />
                        </PaginationParts.Item>
                    ) : (
                        <PaginationParts.Item key={page}>
                            <PaginationParts.Link
                                render={<button type="button" />}
                                active={page === pageIndex}
                                aria-label={`Page ${page + 1}`}
                                onClick={() => go(page)}
                            >
                                {page + 1}
                            </PaginationParts.Link>
                        </PaginationParts.Item>
                    ),
                )}
                <PaginationParts.Item>
                    <PaginationParts.Next
                        render={<button type="button" disabled={last} />}
                        disabled={last}
                        onClick={() => go(pageIndex + 1)}
                    />
                </PaginationParts.Item>
            </PaginationParts.Content>
            {pageSizes && pageSizes.length > 0 && (
                <Select.Root
                    items={pageSizes.map((size) => ({
                        value: String(size),
                        label: String(size),
                    }))}
                    value={String(pageSize ?? "")}
                    onValueChange={(size) =>
                        model.run("page-size.set", { pageSize: Number(size) })
                    }
                >
                    <Select.Trigger
                        aria-label="Rows per page"
                        className={sheet.pageSize()}
                    >
                        <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                        {pageSizes.map((size) => (
                            <Select.Item key={size} value={String(size)}>
                                {size}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>
            )}
        </PaginationParts.Root>
    );
}

export { Pagination };

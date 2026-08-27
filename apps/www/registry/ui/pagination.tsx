"use client";

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    MoreHorizontalIcon,
} from "lucide-react";
import type * as React from "react";
import { Clickable } from "#/atoms/clickable";
import { cn } from "#/lib/cn";

// Pagination — a strip of links where one is the current page. No Base UI
// primitive: semantic HTML plus Clickable. Every clickable part is
// `Clickable` — `Link` for pages, `Previous` / `Next` as `Clickable.Link`
// with an icon. There is no button style in this file. If one appeared,
// `clickable`'s axes would be wrong and that would be the finding.
//
// The current page carries `aria-current="page"` and is visually
// distinguished by a fill strategy (`variant="outline"`), never by a
// hardcoded colour. The previous/next chevrons must invert under RTL —
// there is no logical utility for icon direction, so this is an `rtl:`
// variant (rotate-180). This is the most likely silent failure in this
// component.
//
// Pagination ships no page-computation logic. Which pages to render is the
// consumer's decision; the docs show one way in a demo, not in the component.
//
// No navigation family is created. Pagination is `Clickable` in a `<nav>` —
// it shares nothing structural with tabs or navigation-menu. The negative
// result is recorded in the port report.

function PaginationRoot({ className, ...props }: React.ComponentProps<"nav">) {
    return (
        <nav
            data-slot="pagination"
            aria-label="Pagination"
            className={cn("flex flex-col gap-2", className as string)}
            {...props}
        />
    );
}

function PaginationContent({
    className,
    ...props
}: React.ComponentProps<"ul">) {
    return (
        <ul
            data-slot="pagination-content"
            className={cn(
                "flex flex-row items-center gap-1",
                className as string,
            )}
            {...props}
        />
    );
}

function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
    return (
        <li
            data-slot="pagination-item"
            className={cn("list-none", className as string)}
            {...props}
        />
    );
}

function PaginationLink({
    className,
    active = false,
    ...props
}: React.ComponentProps<typeof Clickable.Link> & {
    /** Whether this is the current page. Sets aria-current and the fill. */
    active?: boolean;
}) {
    // The current page: aria-current="page" + variant="outline" (a fill
    // strategy, not a colour). Non-current pages: variant="ghost". Both are
    // Clickable.Link — no button style in this file.
    return (
        <Clickable.Link
            data-slot="pagination-link"
            aria-current={active ? "page" : undefined}
            variant={active ? "outline" : "ghost"}
            size="sm"
            shape="square"
            className={cn(className as string)}
            {...props}
        />
    );
}

function PaginationPrevious({
    className,
    children = "Previous",
    ...props
}: React.ComponentProps<typeof Clickable.Link>) {
    // The chevron inverts under RTL — there is no logical utility for icon
    // direction, so `rtl:rotate-180` is the correct tool. This is the most
    // likely silent failure: if misspelled, the chevron points the wrong way
    // in RTL with no error.
    return (
        <Clickable.Link
            data-slot="pagination-previous"
            variant="ghost"
            size="sm"
            className={cn("gap-1.5 px-2.5", className as string)}
            aria-label="Go to previous page"
            {...props}
        >
            <ChevronLeftIcon className="size-4 rtl:rotate-180" />
            {children}
        </Clickable.Link>
    );
}

function PaginationNext({
    className,
    children = "Next",
    ...props
}: React.ComponentProps<typeof Clickable.Link>) {
    return (
        <Clickable.Link
            data-slot="pagination-next"
            variant="ghost"
            size="sm"
            className={cn("gap-1.5 px-2.5", className as string)}
            aria-label="Go to next page"
            {...props}
        >
            {children}
            <ChevronRightIcon className="size-4 rtl:rotate-180" />
        </Clickable.Link>
    );
}

function PaginationEllipsis({
    className,
    ...props
}: React.ComponentProps<"span">) {
    // Decorative, with an sr-only label — consistent with the breadcrumb
    // ellipsis shipped in the first batch.
    return (
        <span
            data-slot="pagination-ellipsis"
            aria-hidden="true"
            className={cn(
                "flex size-8 items-center justify-center text-palette-accent/85",
                className as string,
            )}
            {...props}
        >
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">More pages</span>
        </span>
    );
}

export const Pagination = {
    Root: PaginationRoot,
    Content: PaginationContent,
    Item: PaginationItem,
    Link: PaginationLink,
    Previous: PaginationPrevious,
    Next: PaginationNext,
    Ellipsis: PaginationEllipsis,
};

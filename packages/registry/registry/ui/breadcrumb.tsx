"use client";

import { MoreHorizontalIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "#/lib/cn";

// Breadcrumb — a navigation trail. Uses a semantic <nav> with an ordered
// list <ol>. The last item is the current page (aria-current="page"), not a
// link. Separators are chevrons on the inline axis, RTL-aware via logical
// properties.
//
// The breadcrumb is a COMPONENT, not a style family. It has no variants —
// the visual differences (separator type, truncation) are composition, not
// variation. Use `render` on Breadcrumb.Item to stitch a router link.
//
// ─── SEPARATOR ──────────────────────────────────────────────────────────────
// The default separator is a ChevronRightIcon. The inline axis uses logical
// vocabulary: the separator points in the reading direction and flips
// automatically under RTL because the icon is mirrored by the browser's
// direction context. An explicit separator can be passed as a child to
// Breadcrumb.Separator.
//
// ─── ELLIPSIS ───────────────────────────────────────────────────────────────
// Breadcrumb.Ellipsis is a non-interactive marker for collapsed items. It
// uses MoreHorizontalIcon and aria-hidden.

function BreadcrumbRoot({ className, ...props }: React.ComponentProps<"nav">) {
    return (
        <nav
            data-slot="breadcrumb"
            aria-label="breadcrumb"
            className={cn(className as string)}
            {...props}
        />
    );
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
    return (
        <ol
            data-slot="breadcrumb-list"
            className={cn(
                "flex flex-wrap items-center gap-1.5 text-sm text-palette-accent/85",
                className as string,
            )}
            {...props}
        />
    );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
    return (
        <li
            data-slot="breadcrumb-item"
            className={cn(
                "inline-flex items-center gap-1.5",
                className as string,
            )}
            {...props}
        />
    );
}

function BreadcrumbLink({ className, ...props }: React.ComponentProps<"a">) {
    return (
        <a
            data-slot="breadcrumb-link"
            className={cn(
                "rounded-md px-1 py-0.5 text-palette-accent/85 transition-colors hover:text-palette-contrast hover:bg-palette-soft",
                className as string,
            )}
            {...props}
        />
    );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="breadcrumb-page"
            aria-current="page"
            aria-disabled="true"
            className={cn(
                "rounded-md px-1 py-0.5 font-normal text-palette-contrast",
                className as string,
            )}
            {...props}
        />
    );
}

function BreadcrumbSeparator({
    className,
    ...props
}: React.ComponentProps<"li">) {
    return (
        <li
            data-slot="breadcrumb-separator"
            aria-hidden="true"
            className={cn(
                "inline-flex items-center text-palette-accent/60 [&_svg]:size-3.5",
                className as string,
            )}
            {...props}
        />
    );
}

function BreadcrumbEllipsis({
    className,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="breadcrumb-ellipsis"
            aria-hidden="true"
            className={cn(
                "flex size-4 items-center justify-center",
                className as string,
            )}
            {...props}
        >
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">More</span>
        </span>
    );
}

export const Breadcrumb = {
    Root: BreadcrumbRoot,
    List: BreadcrumbList,
    Item: BreadcrumbItem,
    Link: BreadcrumbLink,
    Page: BreadcrumbPage,
    Separator: BreadcrumbSeparator,
    Ellipsis: BreadcrumbEllipsis,
};

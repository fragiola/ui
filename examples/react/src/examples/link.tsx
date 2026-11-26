"use client";

import { Link } from "#/components/ui/link";

// A docs page's navigation: the page you are on is the current link, a
// section not published yet is a disabled link (still reachable with Tab
// and announced as unavailable; its press goes nowhere), and the rest are
// plain links, all with Text.Link's look. A router's link goes through
// `render`.
const PAGES = [
    { href: "#introduction", label: "Introduction" },
    { href: "#installation", label: "Installation", current: true },
    { href: "#theming", label: "Theming" },
    { href: "#migration", label: "Migration guide", disabled: true },
];

export default function LinkDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-4 bg-palette-base text-palette-contrast">
            <nav aria-label="Documentation">
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                    {PAGES.map((page) => (
                        <li key={page.href}>
                            <Link
                                href={page.href}
                                current={page.current}
                                disabled={page.disabled}
                            >
                                {page.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

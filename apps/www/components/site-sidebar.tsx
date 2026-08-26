"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/navigation";

export function SiteSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-60 shrink-0 border-e border-palette-line bg-palette-base hidden md:block">
            <nav className="p-4">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`block px-3 py-1.5 text-sm rounded-sm transition-colors ${
                                        active
                                            ? "bg-palette-soft text-palette-contrast font-semibold"
                                            : "text-palette-accent/85 hover:bg-palette-soft hover:text-palette-contrast"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}

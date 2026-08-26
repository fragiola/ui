"use client";

import Link from "next/link";
import { usePreferences } from "@/components/providers";

export function SiteHeader() {
    const {
        theme,
        toggleTheme,
        density,
        setDensity,
        direction,
        toggleDirection,
    } = usePreferences();

    return (
        <header className="border-b border-palette-line bg-palette-base">
            <div className="flex items-center justify-between px-6 h-14">
                <Link
                    href="/"
                    className="text-palette-contrast font-semibold text-lg"
                >
                    Fragiola
                </Link>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setDensity("compact")}
                        className="px-2 py-1 text-xs rounded-sm border border-palette-line text-palette-contrast hover:bg-palette-soft"
                        data-active={density === "compact"}
                    >
                        Compact
                    </button>
                    <button
                        type="button"
                        onClick={() => setDensity("default")}
                        className="px-2 py-1 text-xs rounded-sm border border-palette-line text-palette-contrast hover:bg-palette-soft"
                        data-active={density === "default"}
                    >
                        Default
                    </button>
                    <button
                        type="button"
                        onClick={() => setDensity("spacious")}
                        className="px-2 py-1 text-xs rounded-sm border border-palette-line text-palette-contrast hover:bg-palette-soft"
                        data-active={density === "spacious"}
                    >
                        Spacious
                    </button>
                    <span className="w-px h-5 bg-palette-line" />
                    <button
                        type="button"
                        onClick={toggleDirection}
                        className="px-2 py-1 text-xs rounded-sm border border-palette-line text-palette-contrast hover:bg-palette-soft"
                    >
                        {direction === "ltr" ? "LTR" : "RTL"}
                    </button>
                    <span className="w-px h-5 bg-palette-line" />
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="px-2 py-1 text-xs rounded-sm border border-palette-line text-palette-contrast hover:bg-palette-soft"
                    >
                        {theme === "light" ? "Dark" : "Light"}
                    </button>
                </div>
            </div>
        </header>
    );
}

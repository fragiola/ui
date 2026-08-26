"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/code-block";
import {
    PaletteSwitcher,
    type PreviewPalette,
} from "@/components/palette-switcher";

type ComponentPreviewProps = {
    source: string;
    children: React.ReactNode;
};

export function ComponentPreview({ source, children }: ComponentPreviewProps) {
    const [palette, setPalette] = useState<PreviewPalette>("surface");
    const [showCode, setShowCode] = useState(false);

    return (
        <div className="rounded-md border border-palette-line overflow-hidden">
            <div className="flex items-center justify-between border-b border-palette-line bg-palette-base px-3 py-2">
                <PaletteSwitcher active={palette} onChange={setPalette} />
                <button
                    type="button"
                    onClick={() => setShowCode((v) => !v)}
                    className="text-xs text-palette-accent/85 hover:text-palette-contrast transition-colors"
                >
                    {showCode ? "Hide code" : "Show code"}
                </button>
            </div>
            <div className={`palette-${palette} p-8`}>{children}</div>
            {showCode && (
                <div className="border-t border-palette-line">
                    <CodeBlock code={source} language="tsx" />
                </div>
            )}
        </div>
    );
}

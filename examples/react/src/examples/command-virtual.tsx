"use client";

import { useState } from "react";
import { CommandVirtual } from "#/components/ui/command-virtual";

// A palette over 10,000 commands — every file of a large repository — that
// renders only the matches in view. Typing "settings" highlights the best
// match among thousands; the arrows, Home and End reach any of them. It is
// Command's twin: the same input, rows and empty state.
const AREAS = ["app", "billing", "settings", "reports", "auth"];

const FILES = Array.from({ length: 10_000 }, (_, i) => {
    const area = AREAS[i % AREAS.length] ?? "app";
    return { value: `src/${area}/module-${i + 1}.ts`, keywords: [area] };
});

export default function CommandVirtualDemo() {
    const [opened, setOpened] = useState<string | null>(null);
    return (
        <div className="palette-surface flex w-full flex-col items-start gap-3 bg-palette-base text-palette-contrast">
            <CommandVirtual.Root className="h-auto max-w-md">
                <CommandVirtual.Input
                    aria-label="Go to file"
                    placeholder="Go to file…"
                />
                <CommandVirtual.List items={FILES}>
                    {(file: (typeof FILES)[number]) => (
                        <CommandVirtual.Item
                            key={file.value}
                            value={file.value}
                            keywords={file.keywords}
                            onSelect={setOpened}
                        >
                            <span className="truncate">{file.value}</span>
                        </CommandVirtual.Item>
                    )}
                </CommandVirtual.List>
                <CommandVirtual.Empty>No file found.</CommandVirtual.Empty>
            </CommandVirtual.Root>
            <span className="text-sm text-palette-accent/85">
                {opened ? `Opened ${opened}.` : "10,000 files."}
            </span>
        </div>
    );
}

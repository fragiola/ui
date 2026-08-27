"use client";

import type { ReactNode } from "react";
import { Separator } from "#/ui/separator";

// The floor is palette-surface. The separator reads the floor's line role —
// the same line colour as the border. Shows: horizontal, with content on
// either side, and vertical.
export default function SeparatorDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            <Row label="horizontal">
                <div className="flex flex-col gap-4">
                    <span className="text-sm text-palette-accent/85">
                        Above the separator
                    </span>
                    <Separator />
                    <span className="text-sm text-palette-accent/85">
                        Below the separator
                    </span>
                </div>
            </Row>

            <Row label="between content">
                <div className="flex items-center gap-4">
                    <span className="text-sm text-palette-accent/85">
                        Start
                    </span>
                    <Separator className="flex-1" />
                    <span className="text-sm text-palette-accent/85">End</span>
                </div>
            </Row>

            <Row label="vertical">
                <div className="flex h-8 items-center gap-4">
                    <span className="text-sm text-palette-accent/85">Left</span>
                    <Separator orientation="vertical" />
                    <span className="text-sm text-palette-accent/85">
                        Right
                    </span>
                </div>
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

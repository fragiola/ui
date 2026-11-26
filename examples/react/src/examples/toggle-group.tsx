"use client";

import {
    AlignCenterIcon,
    AlignLeftIcon,
    AlignRightIcon,
    BoldIcon,
    ItalicIcon,
    StrikethroughIcon,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { Toggle } from "#/components/ui/toggle";
import { ToggleGroup } from "#/components/ui/toggle-group";

// A paragraph's alignment, one pressed at most, and its text styles, any
// number pressed (`multiple`), in the default look. Each group is one tab
// stop: Tab enters it, the arrows move between its toggles (swapped in
// RTL), Space or Enter presses. Then the disabled and vertical groups.
export default function ToggleGroupDemo() {
    const [align, setAlign] = useState<string[]>(["left"]);
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex flex-wrap items-center gap-4">
                <ToggleGroup
                    aria-label="Alignment"
                    value={align}
                    onValueChange={setAlign}
                >
                    <Toggle value="left" shape="square" aria-label="Align left">
                        <AlignLeftIcon />
                    </Toggle>
                    <Toggle
                        value="center"
                        shape="square"
                        aria-label="Align center"
                    >
                        <AlignCenterIcon />
                    </Toggle>
                    <Toggle
                        value="right"
                        shape="square"
                        aria-label="Align right"
                    >
                        <AlignRightIcon />
                    </Toggle>
                </ToggleGroup>
                <ToggleGroup
                    aria-label="Text style"
                    multiple
                    defaultValue={["bold"]}
                >
                    <Toggle value="bold" shape="square" aria-label="Bold">
                        <BoldIcon />
                    </Toggle>
                    <Toggle value="italic" shape="square" aria-label="Italic">
                        <ItalicIcon />
                    </Toggle>
                    <Toggle
                        value="strike"
                        shape="square"
                        aria-label="Strikethrough"
                    >
                        <StrikethroughIcon />
                    </Toggle>
                </ToggleGroup>
                <span className="text-sm text-palette-accent/85">
                    Aligned {align[0] ?? "nowhere"}
                </span>
            </div>

            <Row label="states">
                <ToggleGroup
                    aria-label="Plan"
                    defaultValue={["monthly"]}
                    disabled
                >
                    <Toggle value="monthly" variant="outline">
                        Monthly
                    </Toggle>
                    <Toggle value="yearly" variant="outline">
                        Yearly
                    </Toggle>
                </ToggleGroup>
                <ToggleGroup
                    aria-label="Sort"
                    orientation="vertical"
                    defaultValue={["newest"]}
                >
                    <Toggle value="newest">Newest</Toggle>
                    <Toggle value="oldest">Oldest</Toggle>
                    <Toggle value="popular">Popular</Toggle>
                </ToggleGroup>
            </Row>
        </div>
    );
}

// Row — a captioned row. The caption is a <span>, not a heading.
function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-palette-accent/85">
                {label}
            </span>
            <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
                {children}
            </div>
        </div>
    );
}

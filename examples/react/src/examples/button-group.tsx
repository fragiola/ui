"use client";

import {
    AlignCenterIcon,
    AlignLeftIcon,
    AlignRightIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Clickable } from "#/components/atoms/clickable";
import { ButtonGroup } from "#/components/ui/button-group";

// A calendar's header, in the default look: Previous, Today and Next joined
// into one outline group, their strokes shared; a split button, a solid
// primary action and its menu trigger separated by a rule; and the same
// group in a column. Each button stays its own tab stop and keeps its own
// focus ring; a focused one rises above its neighbours. The join is
// logical: under dir="rtl" the row, its rounded ends and the chevrons'
// order mirror (the last row). Then one row of palettes: the colour is the
// palette class on each button.
export default function ButtonGroupDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex flex-wrap items-center gap-4">
                <ButtonGroup.Root aria-label="Month">
                    <Clickable.Button
                        variant="outline"
                        shape="square"
                        aria-label="Previous month"
                    >
                        <ChevronLeftIcon className="rtl:rotate-180" />
                    </Clickable.Button>
                    <Clickable.Button variant="outline">Today</Clickable.Button>
                    <Clickable.Button
                        variant="outline"
                        shape="square"
                        aria-label="Next month"
                    >
                        <ChevronRightIcon className="rtl:rotate-180" />
                    </Clickable.Button>
                </ButtonGroup.Root>

                <ButtonGroup.Root aria-label="Publish">
                    <Clickable.Button className="palette-neutral">
                        Publish
                    </Clickable.Button>
                    <ButtonGroup.Separator />
                    <Clickable.Button
                        className="palette-neutral"
                        shape="square"
                        aria-label="More publish options"
                    >
                        <ChevronDownIcon />
                    </Clickable.Button>
                </ButtonGroup.Root>
            </div>

            <Row label="vertical">
                <ButtonGroup.Root orientation="vertical" aria-label="Align">
                    <Clickable.Button
                        variant="outline"
                        shape="square"
                        aria-label="Align start"
                    >
                        <AlignLeftIcon />
                    </Clickable.Button>
                    <Clickable.Button
                        variant="outline"
                        shape="square"
                        aria-label="Align center"
                    >
                        <AlignCenterIcon />
                    </Clickable.Button>
                    <Clickable.Button
                        variant="outline"
                        shape="square"
                        aria-label="Align end"
                    >
                        <AlignRightIcon />
                    </Clickable.Button>
                </ButtonGroup.Root>
            </Row>

            <Row label='dir="rtl"'>
                <div dir="rtl">
                    <ButtonGroup.Root aria-label="Month">
                        <Clickable.Button
                            variant="outline"
                            shape="square"
                            aria-label="Previous month"
                        >
                            <ChevronLeftIcon className="rtl:rotate-180" />
                        </Clickable.Button>
                        <Clickable.Button variant="outline">
                            Today
                        </Clickable.Button>
                        <Clickable.Button
                            variant="outline"
                            shape="square"
                            aria-label="Next month"
                        >
                            <ChevronRightIcon className="rtl:rotate-180" />
                        </Clickable.Button>
                    </ButtonGroup.Root>
                </div>
            </Row>

            {/* the same group, only its buttons' palette-* class changed */}
            <Row label="palettes">
                {(["neutral", "blue", "green", "danger"] as const).map(
                    (palette) => (
                        <ButtonGroup.Root key={palette} aria-label={palette}>
                            <Clickable.Button className={`palette-${palette}`}>
                                {palette}
                            </Clickable.Button>
                            <ButtonGroup.Separator />
                            <Clickable.Button
                                className={`palette-${palette}`}
                                shape="square"
                                aria-label={`More ${palette} options`}
                            >
                                <ChevronDownIcon />
                            </Clickable.Button>
                        </ButtonGroup.Root>
                    ),
                )}
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
            <div className="flex flex-wrap items-center gap-2">{children}</div>
        </div>
    );
}

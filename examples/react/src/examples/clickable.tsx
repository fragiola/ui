"use client";

import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import type { ReactNode } from "react";
import { Clickable } from "#/components/atoms/clickable";
import { Text } from "#/components/atoms/text";

// The chromatic palettes. Literal here because examples are published source
// (the code panel shows this file verbatim, with a copy button); an import of
// site chrome would break for whoever copies it.
const CHROMATIC = [
    "blue",
    "purple",
    "green",
    "orange",
    "rose",
    "danger",
] as const;

// A settings card's actions, in the default look: the primary action is a
// solid button in palette-neutral (the default action palette), the
// secondary one an outline button and the quiet ones ghost and icon buttons,
// which take the floor's palette. Then the size and the disabled state, and
// last the same solid button in each chromatic palette: the colour is the
// palette class on the button, there is no colour variant.
export default function ClickableDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <Text.Heading as="h3">Workspace</Text.Heading>
                    <Text.Paragraph className="text-palette-accent/85">
                        Changes apply to every member of the workspace.
                    </Text.Paragraph>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Clickable.Button className="palette-neutral">
                        Save changes
                    </Clickable.Button>
                    <Clickable.Button variant="outline">
                        Cancel
                    </Clickable.Button>
                    <Clickable.Button variant="ghost">
                        <PlusIcon />
                        Invite
                    </Clickable.Button>
                    <Clickable.Button
                        variant="icon"
                        shape="square"
                        aria-label="Rename workspace"
                    >
                        <PencilIcon />
                    </Clickable.Button>
                    <Clickable.Button
                        className="palette-danger"
                        variant="icon"
                        shape="square"
                        aria-label="Delete workspace"
                    >
                        <Trash2Icon />
                    </Clickable.Button>
                </div>
            </div>

            {/* sm sits in dense rows (a toolbar, a table cell); md is
                h-control, the height of a field */}
            <Row label="size">
                <Clickable.Button className="palette-neutral" size="sm">
                    Small
                </Clickable.Button>
                <Clickable.Button className="palette-neutral">
                    Medium
                </Clickable.Button>
            </Row>

            <Row label="disabled">
                <Clickable.Button className="palette-neutral" disabled>
                    Save changes
                </Clickable.Button>
                <Clickable.Button variant="outline" disabled>
                    Cancel
                </Clickable.Button>
            </Row>

            {/* the same button, only its palette-* class changed */}
            <Row label="palettes">
                {CHROMATIC.map((palette) => (
                    <Clickable.Button
                        key={palette}
                        className={`palette-${palette}`}
                    >
                        {palette}
                    </Clickable.Button>
                ))}
            </Row>
        </div>
    );
}

// Row — a captioned row. The caption is a <span>, not a heading, so it does
// not pollute the page's table of contents.
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

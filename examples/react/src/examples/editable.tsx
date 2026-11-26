"use client";

import { type ReactNode, useState } from "react";
import { Text } from "#/components/atoms/text";
import { Editable } from "#/components/ui/editable";

// A project's settings in the default look: its name is
// Editable.Template.Simple, a text that becomes the field's box in place
// (the text does not move: the box only gains its stroke). Focusing it, or
// the pencil, starts the edit with the text selected; Enter or the check
// saves, Escape or the cross reverts, and the focus returns to the pencil.
// The description is composed from the parts: a double press (or its
// pencil, the keyboard's way) edits it, and leaving it saves. Each is named by its label through `aria-labelledby`,
// which works on both bases. Then the states a reader needs: an empty value
// showing its placeholder, a read-only and a disabled one.
export default function EditableDemo() {
    const [saved, setSaved] = useState<string | null>(null);
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex max-w-md flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                    <Text.Label id="project-name">Project name</Text.Label>
                    <Editable.Template.Simple
                        aria-labelledby="project-name"
                        name="project"
                        defaultValue="Fragiola website"
                        onValueCommit={setSaved}
                    />
                    <span className="text-xs text-palette-accent/85">
                        {saved === null
                            ? "Focus the name, or press the pencil, to rename it."
                            : `Saved “${saved}”.`}
                    </span>
                </div>

                <div className="flex flex-col gap-1.5">
                    <Text.Label id="project-description">
                        Description
                    </Text.Label>
                    <Editable.Root
                        activationMode="dblclick"
                        submitMode="blur"
                        placeholder="Add a description"
                        defaultValue="The marketing site and the docs, in one export."
                    >
                        <Editable.Area>
                            <Editable.Preview />
                            <Editable.Input aria-labelledby="project-description" />
                        </Editable.Area>
                        <Editable.EditTrigger aria-label="Edit description" />
                    </Editable.Root>
                    <span className="text-xs text-palette-accent/85">
                        Double-click it, or press the pencil, to edit; leaving
                        the field saves it.
                    </span>
                </div>
            </div>

            <Row label="states">
                <div className="flex w-56 flex-col gap-1.5">
                    <Text.Label id="team-empty">Team</Text.Label>
                    <Editable.Template.Simple
                        aria-labelledby="team-empty"
                        placeholder="No team yet"
                    />
                </div>
                <div className="flex w-56 flex-col gap-1.5">
                    <Text.Label id="owner-readonly">
                        Owner, read-only
                    </Text.Label>
                    <Editable.Template.Simple
                        aria-labelledby="owner-readonly"
                        defaultValue="Ada Lovelace"
                        readOnly
                    />
                </div>
                <div className="flex w-56 flex-col gap-1.5">
                    <Text.Label id="region-disabled">
                        Region, disabled
                    </Text.Label>
                    <Editable.Template.Simple
                        aria-labelledby="region-disabled"
                        defaultValue="eu-west-1"
                        disabled
                    />
                </div>
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

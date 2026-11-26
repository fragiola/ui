"use client";

import { type ReactNode, useState } from "react";
import { Text } from "#/components/atoms/text";
import { TagsInput } from "#/components/ui/tags-input";

// The surface-tier palettes: the neutral surface with one chromatic ring, so
// only the focus ring takes colour. Literal here because examples are
// published source (the code panel shows this file verbatim, with a copy
// button).
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

const isEmail = (text: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);

// An invitation's recipients in the default look: Enter, a comma or a paste
// adds addresses as tags (the same chips as a Combobox's), Backspace at the
// start and the arrows reach the tags, Backspace or Delete removes one, and
// a refused text stays in the field with the reason below it. The parts are
// composed here; the keywords below are TagsInput.Template.Simple, editable
// by Enter or a double press on a tag. The control is named by its label
// through `aria-labelledby`, which works on both bases. Then the disabled
// state, and last the same control in each surface-ring palette: only the
// focus ring changes.
export default function TagsInputDemo() {
    const [refused, setRefused] = useState<string | null>(null);
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex max-w-md flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <Text.Label id="recipients-label">Invite people</Text.Label>
                    <TagsInput.Root
                        name="recipients"
                        defaultValue={["ada@example.com", "grace@example.com"]}
                        max={5}
                        validate={isEmail}
                        onValueChange={() => setRefused(null)}
                        onValueInvalid={(text, { cause }) =>
                            setRefused(
                                cause === "duplicate"
                                    ? `${text} is already invited.`
                                    : cause === "max"
                                      ? "Up to 5 people at a time."
                                      : `${text} is not an email address.`,
                            )
                        }
                    >
                        {({ value }) => (
                            <>
                                <TagsInput.Control>
                                    {value.map((email, index) => (
                                        <TagsInput.Tag
                                            key={email}
                                            index={index}
                                        >
                                            <TagsInput.TagText>
                                                {email}
                                            </TagsInput.TagText>
                                            <TagsInput.TagRemove
                                                aria-label={`Remove ${email}`}
                                            />
                                        </TagsInput.Tag>
                                    ))}
                                    <TagsInput.Input
                                        aria-labelledby="recipients-label"
                                        placeholder="name@example.com"
                                    />
                                </TagsInput.Control>
                                <TagsInput.ClearTrigger aria-label="Clear recipients" />
                            </>
                        )}
                    </TagsInput.Root>
                    {refused ? (
                        <Text.Error role="status">{refused}</Text.Error>
                    ) : (
                        <span className="text-xs text-palette-accent/85">
                            Press Enter or type a comma to add someone.
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <Text.Label id="keywords-label">Keywords</Text.Label>
                    <TagsInput.Template.Simple
                        aria-labelledby="keywords-label"
                        defaultValue={["design", "accessibility", "rtl"]}
                        editable
                        placeholder="Add a keyword…"
                    />
                </div>
            </div>

            <Row label="states">
                <div className="flex w-72 flex-col gap-2">
                    <Text.Label id="locked-label">Labels, disabled</Text.Label>
                    <TagsInput.Template.Simple
                        aria-labelledby="locked-label"
                        defaultValue={["billing", "urgent"]}
                        disabled
                    />
                </div>
            </Row>

            {/* the same control, only its palette-* class changed */}
            <Row label="palettes">
                {SURFACE_RING.map((palette) => (
                    <TagsInput.Template.Simple
                        key={palette}
                        aria-label={`Tags, ${palette}`}
                        defaultValue={["tag"]}
                        className={`palette-${palette} w-56`}
                    />
                ))}
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
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {children}
            </div>
        </div>
    );
}

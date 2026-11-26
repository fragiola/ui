"use client";

import { type ReactNode, useState } from "react";
import { TagGroup } from "#/components/ui/tag-group";

// The surface-tier palettes: the neutral surface with one chromatic ring, so
// only the focus ring and the chosen tag's fill take colour. Literal here
// because examples are published source (the code panel shows this file
// verbatim, with a copy button).
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

const TOPICS = [
    { value: "design", label: "Design" },
    { value: "engineering", label: "Engineering" },
    { value: "research", label: "Research" },
    { value: "marketing", label: "Marketing" },
    { value: "support", label: "Support" },
];

// A board's topic filter in the default look: one tab stop, the arrows,
// Home and End move through the tags, Space, Enter or a press toggles one
// (a chosen tag is `checked`, the `ring` fill), and Delete, Backspace or a
// tag's remove button removes it from the filter (the app removes it in
// `onRemove`, and the focus moves on). The tags are the same chips as a
// Combobox's and a Tags Input's. Then a single choice from
// TagGroup.Template.Simple with a disabled tag, and last the same group in
// each surface-ring palette.
export default function TagGroupDemo() {
    const [topics, setTopics] = useState(TOPICS);
    const [chosen, setChosen] = useState<string[]>(["design"]);
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex max-w-md flex-col gap-3">
                <TagGroup.Root
                    selectionMode="multiple"
                    value={chosen}
                    onValueChange={setChosen}
                    onRemove={(value) => {
                        setTopics((all) =>
                            all.filter((t) => t.value !== value),
                        );
                        setChosen((all) => all.filter((v) => v !== value));
                    }}
                >
                    <TagGroup.Label>Topics</TagGroup.Label>
                    <TagGroup.List>
                        {topics.map((topic) => (
                            <TagGroup.Tag key={topic.value} value={topic.value}>
                                <TagGroup.TagCell>
                                    {topic.label}
                                    <TagGroup.RemoveButton
                                        aria-label={`Remove ${topic.label}`}
                                    />
                                </TagGroup.TagCell>
                            </TagGroup.Tag>
                        ))}
                    </TagGroup.List>
                    {topics.length === 0 ? (
                        <p className="text-sm text-palette-accent/85">
                            No topics left.{" "}
                            <button
                                type="button"
                                className="underline underline-offset-4"
                                onClick={() => setTopics(TOPICS)}
                            >
                                Restore them
                            </button>
                        </p>
                    ) : null}
                </TagGroup.Root>
                <p className="text-sm text-palette-accent/85">
                    {chosen.length
                        ? `Showing ${chosen.length} of ${topics.length} topics.`
                        : "Showing every topic."}
                </p>
            </div>

            <Row label="states">
                <TagGroup.Template.Simple
                    label="Status"
                    selectionMode="single"
                    defaultValue={["open"]}
                    disabledKeys={["archived"]}
                    tags={[
                        { value: "open", label: "Open" },
                        { value: "closed", label: "Closed" },
                        { value: "archived", label: "Archived" },
                    ]}
                />
            </Row>

            {/* the same group, only its palette-* class changed */}
            <Row label="palettes">
                {SURFACE_RING.map((palette) => (
                    <TagGroup.Template.Simple
                        key={palette}
                        aria-label={`Size, ${palette}`}
                        selectionMode="single"
                        defaultValue={["M"]}
                        tags={["S", "M", "L"]}
                        className={`palette-${palette}`}
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

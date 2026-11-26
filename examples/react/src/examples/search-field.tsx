"use client";

import { useState } from "react";
import { Field } from "#/components/ui/field";
import { SearchField } from "#/components/ui/search-field";

const MEMBERS = [
    "Ada Lovelace",
    "Alan Turing",
    "Grace Hopper",
    "Linus Torvalds",
];

// A team list's search in the default look: typing filters the list,
// Escape or the clear button empties it (the button hides while the field
// is empty, and its name is the example's), and Enter submits the query.
// The control is only its middle: SearchField.Root sits in the field's row.
// Then the disabled state.
export default function SearchFieldDemo() {
    const [query, setQuery] = useState("");
    const [submitted, setSubmitted] = useState<string | null>(null);
    const shown = MEMBERS.filter((member) =>
        member.toLowerCase().includes(query.toLowerCase()),
    );
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex max-w-sm flex-col gap-3">
                <Field.Row>
                    <SearchField.Root
                        value={query}
                        onValueChange={setQuery}
                        onSubmit={setSubmitted}
                    >
                        <SearchField.Icon />
                        <SearchField.Input
                            aria-label="Search members"
                            placeholder="Search members…"
                        />
                        <SearchField.ClearButton aria-label="Clear search" />
                    </SearchField.Root>
                </Field.Row>
                <ul className="flex flex-col gap-1 text-sm">
                    {shown.map((member) => (
                        <li key={member}>{member}</li>
                    ))}
                    {shown.length === 0 ? (
                        <li className="text-palette-accent/85">
                            No member matches.
                        </li>
                    ) : null}
                </ul>
                {submitted !== null ? (
                    <p className="text-sm text-palette-accent/85">
                        Searched for “{submitted}”.
                    </p>
                ) : null}
            </div>

            <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-palette-accent/85">
                    states
                </span>
                <Field.Row className="max-w-sm opacity-50">
                    <SearchField.Root defaultValue="archived" disabled>
                        <SearchField.Icon />
                        <SearchField.Input aria-label="Search, disabled" />
                        <SearchField.ClearButton aria-label="Clear search" />
                    </SearchField.Root>
                </Field.Row>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { Field } from "#/components/ui/field";
import { Listbox } from "#/components/ui/listbox";

// Two lists that stay on the page: a plan, one of a few, and the
// notification channels, several at once (Shift extends a range, Ctrl+A
// chooses every one). The focus moves to the options and draws its ring;
// what is chosen is the soft fill and the check. Each list is named by its
// label (`aria-labelledby`), which works on every base. Then the disabled
// state, and the same list in each surface-ring palette.
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

export default function ListboxDemo() {
    const [channels, setChannels] = useState<string[]>(["email"]);
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex flex-wrap items-start gap-6">
                <Field.Root className="w-56">
                    <Field.Label id="plan-label">Plan</Field.Label>
                    <Listbox.Root
                        aria-labelledby="plan-label"
                        defaultValue="team"
                        name="plan"
                    >
                        <Listbox.Item value="free">Free</Listbox.Item>
                        <Listbox.Item value="team">Team</Listbox.Item>
                        <Listbox.Item value="business">Business</Listbox.Item>
                        <Listbox.Item value="enterprise" disabled>
                            Enterprise
                        </Listbox.Item>
                    </Listbox.Root>
                </Field.Root>
                <Field.Root className="w-56">
                    <Field.Label id="channels-label">Notify me by</Field.Label>
                    <Listbox.Root
                        multiple
                        aria-labelledby="channels-label"
                        value={channels}
                        onValueChange={(value: string[]) => setChannels(value)}
                        className="max-h-48"
                    >
                        <Listbox.Group>
                            <Listbox.GroupLabel>Direct</Listbox.GroupLabel>
                            <Listbox.Item value="email">Email</Listbox.Item>
                            <Listbox.Item value="sms">SMS</Listbox.Item>
                            <Listbox.Item value="push">Push</Listbox.Item>
                        </Listbox.Group>
                        <Listbox.Separator />
                        <Listbox.Group>
                            <Listbox.GroupLabel>Team</Listbox.GroupLabel>
                            <Listbox.Item value="slack">Slack</Listbox.Item>
                            <Listbox.Item value="teams">Teams</Listbox.Item>
                        </Listbox.Group>
                    </Listbox.Root>
                    <Field.Description>
                        {channels.length} chosen
                    </Field.Description>
                </Field.Root>
            </div>

            <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-palette-accent/85">
                    disabled
                </span>
                <Listbox.Root aria-label="Region" disabled className="w-56">
                    <Listbox.Item value="eu">Europe</Listbox.Item>
                    <Listbox.Item value="us">United States</Listbox.Item>
                </Listbox.Root>
            </div>

            <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-palette-accent/85">
                    palettes
                </span>
                <div className="flex flex-wrap gap-3">
                    {SURFACE_RING.map((palette) => (
                        <Listbox.Root
                            key={palette}
                            aria-label={palette}
                            defaultValue="b"
                            className={`palette-${palette} w-32`}
                        >
                            <Listbox.Item value="a">Daily</Listbox.Item>
                            <Listbox.Item value="b">Weekly</Listbox.Item>
                        </Listbox.Root>
                    ))}
                </div>
            </div>
        </div>
    );
}

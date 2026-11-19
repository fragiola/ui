"use client";

import { useState } from "react";
import { Badge } from "#/components/atoms/badge";
import { Clickable } from "#/components/atoms/clickable";
import { Input } from "#/components/atoms/fields";
import { Text } from "#/components/atoms/text";
import { Checkbox } from "#/components/ui/checkbox";
import { Field } from "#/components/ui/field";
import { Progress } from "#/components/ui/progress";
import { Switch } from "#/components/ui/switch";

// One class, and the colour changes. Nothing in a component is a colour
// variant: a component reads six roles from the palette class it carries, so
// re-colouring it is swapping that class — and a new colour is a new palette
// file, never an edit to the component.
//
// Two tiers, one name. A solid thing (the button, the badge, the progress
// bar) carries the chromatic palette, `palette-blue`. A control on the floor
// (the field, the switch, the checkbox) carries its surface twin,
// `palette-surface-blue`: still a neutral box, with the colour only where it
// is "on" or focused. The default is the neutral pair.
//
// The picker is this demo's own state; the card below it is what you would
// copy. Only the strings in `tone` change when you pick.
const COLOURS = [
    "neutral",
    "blue",
    "purple",
    "green",
    "orange",
    "rose",
] as const;
type Colour = (typeof COLOURS)[number];

function tone(colour: Colour) {
    return colour === "neutral"
        ? { action: "palette-neutral", control: "palette-surface" }
        : { action: `palette-${colour}`, control: `palette-surface-${colour}` };
}

export default function PalettesDemo() {
    const [colour, setColour] = useState<Colour>("neutral");
    const { action, control } = tone(colour);

    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div
                role="radiogroup"
                aria-label="Colour"
                className="flex flex-wrap items-center justify-center gap-2"
            >
                {COLOURS.map((name) => (
                    <Clickable.Button
                        key={name}
                        role="radio"
                        aria-checked={name === colour}
                        variant={name === colour ? "outline" : "ghost"}
                        size="sm"
                        onClick={() => setColour(name)}
                    >
                        <span
                            aria-hidden
                            className={`${tone(name).action} size-3 rounded-full bg-palette-base`}
                        />
                        {name}
                    </Clickable.Button>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
                <InviteCard action={action} control={control} />
                <pre className="overflow-x-auto rounded-lg bg-palette-soft p-4 font-mono text-xs leading-relaxed text-palette-accent">
                    <code>
                        {`<Clickable.Button className="${action}">
<Badge className="${action}">
<Progress.Root className="${action}">

<Field.Root className="${control}">
<Switch.Root className="${control}">
<Checkbox.Root className="${control}">`}
                    </code>
                </pre>
            </div>
        </div>
    );
}

function InviteCard({ action, control }: { action: string; control: string }) {
    return (
        <section className="flex flex-col gap-5 rounded-lg border border-palette-line p-5">
            <header className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <Text.Heading as="h3" className="text-base">
                        Invite your team
                    </Text.Heading>
                    <Text.Paragraph className="text-palette-accent/85">
                        Members get access to every project.
                    </Text.Paragraph>
                </div>
                <Badge variant="solid" className={action}>
                    Pro
                </Badge>
            </header>

            <Field.Root className={control}>
                <Field.Label>Email</Field.Label>
                <Field.Row>
                    <Field.Body>
                        <Input type="email" placeholder="ada@example.com" />
                    </Field.Body>
                </Field.Row>
            </Field.Root>

            <Field.ChoiceRoot className={control}>
                <Switch.Root id="invite-welcome" defaultChecked>
                    <Switch.Thumb />
                </Switch.Root>
                <Field.Label htmlFor="invite-welcome">
                    Send a welcome email
                </Field.Label>
            </Field.ChoiceRoot>

            <Field.ChoiceRoot className={control}>
                <Checkbox.Root id="invite-admin">
                    <Checkbox.Indicator />
                </Checkbox.Root>
                <Field.Label htmlFor="invite-admin">Make admin</Field.Label>
            </Field.ChoiceRoot>

            <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs text-palette-accent/85">
                    <span id="invite-seats">Seats</span>
                    <span>3 of 5</span>
                </div>
                <Progress.Root
                    value={60}
                    aria-labelledby="invite-seats"
                    className={action}
                >
                    <Progress.Track>
                        <Progress.Indicator />
                    </Progress.Track>
                </Progress.Root>
            </div>

            <footer className="flex justify-end gap-2">
                <Clickable.Button variant="outline">Cancel</Clickable.Button>
                <Clickable.Button className={action}>
                    Send invite
                </Clickable.Button>
            </footer>
        </section>
    );
}

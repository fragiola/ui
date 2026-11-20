"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "#/components/atoms/badge";
import { Clickable } from "#/components/atoms/clickable";
import { Input } from "#/components/atoms/fields";
import { Text } from "#/components/atoms/text";
import {
    cssValue,
    generatePalette,
    ROLES,
    type Themed,
} from "#/components/lib/colour/palette";
import { Checkbox } from "#/components/ui/checkbox";
import { Field } from "#/components/ui/field";
import { Progress } from "#/components/ui/progress";
import { Slider } from "#/components/ui/slider";
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
// A new colour is one more palette, never a variant. Pick a hue and "Add
// palette": the registry's generator (`lib/colour/palette`, the one the
// Create page uses) turns it into both tiers, six roles in both themes, and
// the demo registers them as real CSS classes — `my-palette-1` and its twin
// `my-palette-surface-1`, then `my-palette-2`, … — in a <style> of this
// document, the way an app adds a palette file. It is then one more colour
// to pick, and the card repaints from its classes exactly like a preset.
//
// The picker, the hue and the added palettes are this demo's own state; the
// card below it is what you would copy. Only the strings in `tone` change
// when you pick, and the code beside the card shows exactly that: the card's
// components in the order they render, each with its palette class and
// nothing else (no text, no styling, never the palette's CSS).
const COLOURS = [
    "neutral",
    "blue",
    "purple",
    "green",
    "orange",
    "rose",
] as const;

/** A palette made from a hue: its class and the CSS of both tiers. */
type Added = { name: string; css: string[] };

function tone(colour: string) {
    if (colour === "neutral")
        return { action: "palette-neutral", control: "palette-surface" };
    if (colour.startsWith("my-palette-"))
        return {
            action: colour,
            control: colour.replace("my-palette-", "my-palette-surface-"),
        };
    return {
        action: `palette-${colour}`,
        control: `palette-surface-${colour}`,
    };
}

/** One palette class in both themes, all six roles: [light, dark]. */
function rules(name: string, roles: Themed) {
    return (["light", "dark"] as const).map((theme) => {
        const lines = ROLES.map(
            (role) => `    --palette-${role}: ${cssValue(roles[theme][role])};`,
        );
        return `:root[data-theme="${theme}"] .${name} {\n${lines.join("\n")}\n}`;
    });
}

function makePalette(index: number, hue: number): Added {
    const name = `my-palette-${index}`;
    const surface = `my-palette-surface-${index}`;
    // The solid tier (button, badge, progress) and its surface twin (field,
    // switch, checkbox), as the shipped palettes come in pairs.
    const palette = generatePalette({ name, hue });
    return {
        name,
        css: [
            ...rules(name, palette.solid),
            ...rules(surface, palette.surface),
        ],
    };
}

/** The hue's colour, as the generator makes it: the light theme's base. */
const swatch = (hue: number) =>
    cssValue(generatePalette({ hue }).solid.light.base);

export default function PalettesDemo() {
    const [colour, setColour] = useState<string>("neutral");
    const [hue, setHue] = useState(160);
    const [added, setAdded] = useState<Added[]>([]);
    const { action, control } = tone(colour);

    function add() {
        const palette = makePalette(added.length + 1, hue);
        setAdded([...added, palette]);
        setColour(palette.name);
    }

    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            {/* The added palettes, registered as CSS — what a palette file is. */}
            <style data-palettes-added="">
                {added.flatMap((p) => p.css).join("\n")}
            </style>

            <div className="flex flex-wrap items-end justify-center gap-4">
                <Slider.Root
                    className="w-full max-w-xs"
                    min={0}
                    max={359}
                    value={hue}
                    onValueChange={(v) =>
                        setHue(Array.isArray(v) ? (v[0] ?? 0) : v)
                    }
                >
                    <div className="flex items-center justify-between">
                        <Slider.Label>Hue</Slider.Label>
                        <span className="flex items-center gap-2 text-sm tabular-nums">
                            <span
                                aria-hidden
                                data-hue-swatch=""
                                className="size-4 rounded-full border border-palette-line"
                                style={{ background: swatch(hue) }}
                            />
                            {hue}°
                        </span>
                    </div>
                    <Slider.Control>
                        <Slider.Track>
                            <Slider.Indicator />
                            <Slider.Thumb aria-label="Hue" />
                        </Slider.Track>
                    </Slider.Control>
                </Slider.Root>
                <Clickable.Button variant="outline" onClick={add}>
                    <PlusIcon />
                    Add palette
                </Clickable.Button>
            </div>

            <div
                role="radiogroup"
                aria-label="Colour"
                className="flex flex-wrap items-center justify-center gap-2"
            >
                {[...COLOURS, ...added.map((p) => p.name)].map((name) => (
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

            <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-stretch">
                <InviteCard action={action} control={control} />
                <pre
                    data-palette-code=""
                    className="h-full overflow-x-auto rounded-lg bg-palette-soft p-4 font-mono text-xs leading-relaxed text-palette-accent"
                >
                    <code>{outline(action, control)}</code>
                </pre>
            </div>
        </div>
    );
}

/** The card's components in render order, each with only its palette class. */
function outline(action: string, control: string) {
    const lines = [
        ["Badge", action],
        ["Field.Root", control],
        ["Switch.Root", control],
        ["Checkbox.Root", control],
        ["Progress.Root", action],
        ["Clickable.Button", ""],
        ["Clickable.Button", action],
    ].map(([name, palette]) =>
        palette ? `  <${name} className="${palette}" />` : `  <${name} />`,
    );
    return ["<Card>", ...lines, "</Card>"].join("\n");
}

function InviteCard({ action, control }: { action: string; control: string }) {
    return (
        <section
            data-palette-target=""
            className="flex flex-col gap-5 rounded-lg border border-palette-line p-5"
        >
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

            <Field.ChoiceRoot>
                <Switch.Root
                    id="invite-welcome"
                    defaultChecked
                    className={control}
                >
                    <Switch.Thumb />
                </Switch.Root>
                <Field.Label htmlFor="invite-welcome">
                    Send a welcome email
                </Field.Label>
            </Field.ChoiceRoot>

            <Field.ChoiceRoot>
                <Checkbox.Root id="invite-admin" className={control}>
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

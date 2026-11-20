"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "#/components/atoms/badge";
import { Clickable } from "#/components/atoms/clickable";
import { Text } from "#/components/atoms/text";
import {
    cssValue,
    generatePalette,
    ROLES,
    type Roles,
} from "#/components/lib/colour/palette";
import { Progress } from "#/components/ui/progress";
import { Slider } from "#/components/ui/slider";

// A new colour is a new palette, never a variant. Pick a hue and "Add
// palette": the registry's generator (`lib/colour/palette`, the one the
// Create page uses) turns it into the six roles, in both themes, and the
// demo registers them as a real CSS class — `my-palette-1`, `my-palette-2`,
// … — in a <style> of this document, the way an app adds a palette file.
// Selecting a palette hands that class to the target: the button, its focus
// ring, the badge and the progress bar repaint. No component prop changes,
// and no component has a colour variant to change.
//
// The hue, the list and the selection are this demo's own state; what you
// would copy is the code panel: one CSS rule, and one class.

type Palette = { name: string; hue: number; css: string };

/** One palette class, both themes, all six roles. */
function rule(name: string, roles: { light: Roles; dark: Roles }) {
    return (["light", "dark"] as const)
        .map((theme) => {
            const lines = ROLES.map(
                (role) =>
                    `    --palette-${role}: ${cssValue(roles[theme][role])};`,
            );
            return `:root[data-theme="${theme}"] .${name} {\n${lines.join("\n")}\n}`;
        })
        .join("\n");
}

function makePalette(index: number, hue: number): Palette {
    const name = `my-palette-${index}`;
    // The solid palette: a button, a badge, a progress bar wear it.
    const { solid } = generatePalette({ name, hue });
    return { name, hue, css: rule(name, solid) };
}

/** The hue's colour, as the generator makes it: the light theme's base. */
const swatch = (hue: number) =>
    cssValue(generatePalette({ hue }).solid.light.base);

export default function PaletteMakerDemo() {
    const [hue, setHue] = useState(160);
    const [palettes, setPalettes] = useState<Palette[]>([]);
    const [selected, setSelected] = useState("palette-neutral");
    const current = palettes.find((p) => p.name === selected);

    function add() {
        const palette = makePalette(palettes.length + 1, hue);
        setPalettes([...palettes, palette]);
        setSelected(palette.name);
    }

    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            {/* The palettes, registered as CSS — what a palette file is. */}
            <style data-palette-maker="">
                {palettes.map((p) => p.css).join("\n")}
            </style>

            <div className="flex flex-wrap items-end gap-4">
                <Slider.Root
                    className="min-w-48 flex-1"
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
                aria-label="Palette"
                className="flex flex-wrap items-center gap-2"
            >
                {["palette-neutral", ...palettes.map((p) => p.name)].map(
                    (name) => (
                        <Clickable.Button
                            key={name}
                            role="radio"
                            aria-checked={name === selected}
                            variant={name === selected ? "outline" : "ghost"}
                            size="sm"
                            onClick={() => setSelected(name)}
                        >
                            <span
                                aria-hidden
                                className={`${name} size-3 rounded-full bg-palette-base`}
                            />
                            {name}
                        </Clickable.Button>
                    ),
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:items-start">
                <Target palette={selected} />
                <pre
                    data-palette-code=""
                    className="overflow-x-auto rounded-lg bg-palette-soft p-4 font-mono text-xs leading-relaxed text-palette-accent"
                >
                    <code>
                        {current
                            ? `/* palettes.css — the new palette, hue ${current.hue} */\n${current.css}\n\n`
                            : "/* palette-neutral ships with the registry */\n\n"}
                        {`<Clickable.Button className="${selected}">
<Badge className="${selected}">
<Progress.Root className="${selected}">`}
                    </code>
                </pre>
            </div>
        </div>
    );
}

// What you would copy: every coloured thing takes the one class.
function Target({ palette }: { palette: string }) {
    return (
        <section
            data-palette-target=""
            className="flex flex-col gap-5 rounded-lg border border-palette-line p-5"
        >
            <header className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <Text.Heading as="h3" className="text-base">
                        Storage
                    </Text.Heading>
                    <Text.Paragraph className="text-palette-accent/85">
                        6.4 of 10 GB used this month.
                    </Text.Paragraph>
                </div>
                <Badge variant="solid" className={palette}>
                    Pro
                </Badge>
            </header>

            <Progress.Root
                value={64}
                aria-label="Storage used"
                className={palette}
            >
                <Progress.Track>
                    <Progress.Indicator />
                </Progress.Track>
            </Progress.Root>

            <footer className="flex flex-wrap items-center gap-4">
                <Clickable.Button className={palette}>Upgrade</Clickable.Button>
                {/* The same button with its focus ring drawn, as the
                    keyboard shows it: the ring is the palette's too. */}
                <Clickable.Button
                    tabIndex={-1}
                    aria-hidden
                    className={`${palette} outline-2 outline-offset-2 outline-palette-ring`}
                >
                    Focused
                </Clickable.Button>
            </footer>
        </section>
    );
}

import type { ReactNode } from "react";
import { ColorArea } from "#/components/ui/color-area";
import { ColorSlider } from "#/components/ui/color-slider";
import { ColorSwatchPicker } from "#/components/ui/color-swatch-picker";
import { ColorWheel } from "#/components/ui/color-wheel";

// The Epic #169 risk: a colour thumb sits on whatever colour is picked. Each
// thumb is the foundation's knob (the palette's `base` over a light shadow)
// with the colour inside it and a `contrast` hairline around it: the knob
// must read over black and saturated colours, the hairline over white —
// and the other way round in the dark theme (switch it in the toolbar).
// Every row puts the three thumbs over white, black and saturated grounds.
const GROUNDS = [
    { label: "white", area: "hsb(0, 0%, 100%)", hsl: "hsl(0, 0%, 100%)" },
    { label: "black", area: "hsb(0, 0%, 0%)", hsl: "hsl(0, 0%, 0%)" },
    { label: "red", area: "hsb(0, 100%, 100%)", hsl: "hsl(0, 100%, 50%)" },
    { label: "yellow", area: "hsb(60, 100%, 100%)", hsl: "hsl(60, 100%, 50%)" },
    { label: "blue", area: "hsb(240, 100%, 100%)", hsl: "hsl(240, 100%, 50%)" },
    { label: "green", area: "hsb(120, 100%, 80%)", hsl: "hsl(120, 100%, 40%)" },
] as const;

export default function ThumbContrast() {
    return (
        <div className="palette-surface flex flex-col gap-8 bg-palette-base p-6 text-palette-contrast">
            {GROUNDS.map((ground) => (
                <Row key={ground.label} label={ground.label}>
                    <ColorArea.Template.Simple
                        aria-label={`Area, ${ground.label}`}
                        defaultValue={ground.area}
                        className="size-32"
                    />
                    <ColorSlider.Root
                        channel="lightness"
                        defaultValue={ground.hsl}
                        className="w-48"
                    >
                        <ColorSlider.Track>
                            <ColorSlider.Thumb
                                aria-label={`Lightness, ${ground.label}`}
                            />
                        </ColorSlider.Track>
                    </ColorSlider.Root>
                    <ColorSlider.Root
                        channel="alpha"
                        defaultValue={ground.hsl}
                        className="w-48"
                    >
                        <ColorSlider.Track>
                            <ColorSlider.Thumb
                                aria-label={`Alpha, ${ground.label}`}
                            />
                        </ColorSlider.Track>
                    </ColorSlider.Root>
                    <ColorWheel.Template.Simple
                        aria-label={`Hue, ${ground.label}`}
                        defaultValue={ground.hsl}
                        outerRadius={48}
                        innerRadius={30}
                    />
                </Row>
            ))}
            <Row label="swatch picker: white, black, saturated">
                <ColorSwatchPicker.Template.Simple
                    aria-label="Grounds"
                    defaultValue="#ffffff"
                    colors={[
                        "#ffffff",
                        "#000000",
                        "#ff0000",
                        "#ffff00",
                        "#0000ff",
                    ]}
                />
            </Row>
        </div>
    );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-palette-accent/85">
                {label}
            </span>
            <div className="flex flex-wrap items-center gap-8">{children}</div>
        </div>
    );
}

import { Badge } from "#/components/atoms/badge";
import { Clickable } from "#/components/atoms/clickable";
import { Input } from "#/components/atoms/fields";
import {
    type Chroma,
    generatePalette,
    serializePalette,
} from "#/components/lib/colour/palette";
import { Checkbox } from "#/components/ui/checkbox";
import { Field } from "#/components/ui/field";
import { Progress } from "#/components/ui/progress";
import { Switch } from "#/components/ui/switch";

// The palette generator at its edges: the hues where white text, a dark
// text or the template's curve are hardest (red, amber, yellow, lime, cyan,
// violet), each at every chroma, both tiers. Use the toolbar for the scheme,
// the direction and the axes. Every pair's contrast is printed beside it.

const HUES = [0, 45, 70, 95, 115, 130, 195, 285] as const;
const CHROMAS: Chroma[] = ["muted", "default", "vivid"];

const PALETTES = HUES.flatMap((hue) =>
    CHROMAS.map((chroma) =>
        generatePalette({ name: `edge-${hue}-${chroma}`, hue, chroma }),
    ),
);

export default function ThemeBuilderEdges() {
    return (
        <div className="palette-surface flex flex-col gap-6 bg-palette-base p-6 text-palette-contrast">
            <style>{PALETTES.map(serializePalette).join("\n\n")}</style>
            {PALETTES.map((palette) => (
                <section
                    key={palette.name}
                    className={`palette-surface-${palette.name} flex flex-wrap items-center gap-4`}
                >
                    <span className="w-36 font-mono text-xs text-palette-accent/85">
                        {palette.name}
                    </span>
                    <Clickable.Button className={`palette-${palette.name}`}>
                        Save
                    </Clickable.Button>
                    <Badge
                        variant="solid"
                        className={`palette-${palette.name}`}
                    >
                        New
                    </Badge>
                    <Badge className={`palette-${palette.name}`}>Soft</Badge>
                    <Field.Root className="w-40">
                        <Field.Row>
                            <Field.Body>
                                <Input placeholder="Focus me" />
                            </Field.Body>
                        </Field.Row>
                    </Field.Root>
                    <Checkbox.Root defaultChecked aria-label="Checked">
                        <Checkbox.Indicator />
                    </Checkbox.Root>
                    <Switch.Root defaultChecked aria-label="On">
                        <Switch.Thumb />
                    </Switch.Root>
                    <Progress.Root
                        value={60}
                        aria-label="Progress"
                        className={`palette-${palette.name} w-32`}
                    >
                        <Progress.Track>
                            <Progress.Indicator />
                        </Progress.Track>
                    </Progress.Root>
                    <span className="font-mono text-[10px] text-palette-accent/85">
                        {palette.checks
                            .map((c) => `${c.theme[0]}:${c.ratio}`)
                            .join(" ")}
                    </span>
                </section>
            ))}
        </div>
    );
}

import { InstallCommand } from "@/components/install-command";
import { ComponentPreview } from "@/components/preview";

export default function InputPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Input
                </h1>
                <p className="text-sm text-palette-accent/85">
                    One input component — <code>Input</code>,{" "}
                    <code>Textarea</code> and <code>Numeric</code>. None of them
                    carry a border, background, height, radius, focus ring,
                    invalid state or theme. The box comes from the row around
                    them.
                </p>
            </div>

            <InstallCommand name="input" />

            <ComponentPreview name="input-demo" />

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    The one-input claim
                </h2>
                <p className="text-sm text-palette-accent/85">
                    The baseline offered three ways to write a field and two
                    different input components — <code>Input</code> (with its
                    own border) and <code>InputGroupInput</code> (borderless,
                    because the group would double the border). Fragiola has one
                    input, used bare, in a group with addons, and with an inset
                    icon — no second component anywhere.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Numeric — the thesis test
                </h2>
                <p className="text-sm text-palette-accent/85">
                    <code>Numeric</code> is a control written from scratch. It
                    contains no box styling of any kind — no border, background,
                    height, focus ring, invalid state or theme. If writing it
                    required one line of box styling, the rule would be wrong.
                    It does not.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Input.Template.Simple
                </h2>
                <p className="text-sm text-palette-accent/85">
                    A composition template with at most seven of its own props,
                    no appearance props, and no props bag. It obeys three rules:
                    no style of its own, no appearance props, one{" "}
                    <code>className</code> going to the main piece (the palette
                    channel).
                </p>
            </section>
        </div>
    );
}

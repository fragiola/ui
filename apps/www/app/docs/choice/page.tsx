import ChoiceDemo from "#/examples/choice-demo";
import { ComponentPreviewServer } from "@/components/component-preview-server";
import { InstallCommand } from "@/components/install-command";

export default function ChoicePage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Choice Controls
                </h1>
                <p className="text-sm text-palette-accent/85">
                    Checkbox, Radio + RadioGroup, and Switch — three components
                    sharing one <code>choice</code> style family. The box, the
                    focus ring, the checked state and the disabled state are
                    written once.
                </p>
            </div>

            <InstallCommand name="checkbox" />

            <ComponentPreviewServer name="choice-demo">
                <ChoiceDemo />
            </ComponentPreviewServer>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Style family
                </h2>
                <p className="text-sm text-palette-accent/85">
                    The <code>choice</code> family has five members —{" "}
                    <code>root</code>, <code>control</code>,{" "}
                    <code>indicator</code>, <code>label</code>,{" "}
                    <code>description</code> — and zero variants. Checkbox and
                    Radio use <code>root</code> + <code>indicator</code>; Switch
                    uses <code>root</code> (the track) + <code>control</code>{" "}
                    (the thumb). Each component overrides only what differs:
                    Radio adds <code>rounded-full</code>, Switch adds{" "}
                    <code>w-9 h-5 rounded-full</code> and a translate on the
                    thumb.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Field.ChoiceRoot
                </h2>
                <p className="text-sm text-palette-accent/85">
                    Checkable controls use <code>Field.ChoiceRoot</code> instead
                    of <code>Field.Root</code> — a horizontal row (control on
                    the left, label on the right) instead of a vertical column.
                    The same Label, Description and Error members are reused.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    State normalization
                </h2>
                <p className="text-sm text-palette-accent/85">
                    Base UI emits <code>data-checked</code> and{" "}
                    <code>data-unchecked</code> (not{" "}
                    <code>data-state=checked</code>). The family uses{" "}
                    <code>data-checked:bg-palette-base</code> and{" "}
                    <code>data-checked:text-palette-contrast</code> — the
                    indicator icon inherits the text colour and inverts
                    automatically.
                </p>
            </section>
        </div>
    );
}

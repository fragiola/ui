import { InstallCommand } from "@/components/install-command";
import { ComponentPreview } from "@/components/preview";

export default function SliderPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Slider
                </h1>
                <p className="text-sm text-palette-accent/85">
                    The thesis test of the control/body rule for a non-text
                    control. <code>Slider</code> carries no border, no
                    background box, no height, no focus ring on a box, no
                    invalid state and no theme of its own. Every box style
                    visible in the preview below comes from{" "}
                    <code>field.row</code> — none from the slider.
                </p>
            </div>

            <InstallCommand name="slider" />

            <ComponentPreview name="slider-demo" />

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Composition
                </h2>
                <p className="text-sm text-palette-accent/85">
                    The <code>Control</code> carries the{" "}
                    <code>field-control</code> marker class, which is what the{" "}
                    <code>field-focus</code> custom variant matches — focusing
                    the thumb fires the row's outline. The thumb's own focus
                    ring uses <code>palette-ring</code>. The fill grows from the
                    inline start and inverts under RTL (the primitive sets{" "}
                    <code>inset-inline-start</code> inline, a logical property).
                    Vertical orientation is behaviour from the primitive, not a
                    style variant. Range sliders work with the same component.
                </p>
                <p className="text-sm text-palette-accent/85">
                    The slider is also usable bare, outside <code>Field</code>.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    The track family
                </h2>
                <p className="text-sm text-palette-accent/85">
                    <code>Slider</code> and <code>Progress</code> share the{" "}
                    <code>track</code> family: <code>track.rail</code> (the
                    rail) and <code>track.fill</code> (the filled portion).
                    Those are the two things they genuinely share; the thumb,
                    the interaction and the indeterminate state live in the
                    components. Installing <code>slider</code> after{" "}
                    <code>progress</code> writes exactly one file —{" "}
                    <code>slider.tsx</code> itself.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Parts
                </h2>
                <table className="w-full text-sm border border-palette-line rounded-md overflow-hidden">
                    <thead className="bg-palette-soft">
                        <tr>
                            <th className="text-start px-3 py-2 text-palette-contrast font-semibold">
                                Part
                            </th>
                            <th className="text-start px-3 py-2 text-palette-contrast font-semibold">
                                Source
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-palette-line">
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Root</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                Base UI <code>Slider.Root</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Label</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Text.Label</code> +{" "}
                                <code>field.label()</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Value</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                Base UI <code>Slider.Value</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Control</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>field-control</code> marker + layout
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Track</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>track.rail()</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Indicator</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>track.fill()</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Thumb</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>palette-ring</code> focus + layout
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

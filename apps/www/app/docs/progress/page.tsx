import ProgressDemo from "#/examples/progress-demo";
import { ComponentPreviewServer } from "@/components/component-preview-server";
import { InstallCommand } from "@/components/install-command";

export default function ProgressPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Progress
                </h1>
                <p className="text-sm text-palette-accent/85">
                    The rail without the interaction. Determinate and
                    indeterminate; the indeterminate animation respects{" "}
                    <code>prefers-reduced-motion</code>. Fills from the inline
                    start and inverts under RTL. Tone arrives as a palette class
                    from outside, not a prop.
                </p>
            </div>

            <InstallCommand name="progress" />

            <ComponentPreviewServer name="progress-demo">
                <ProgressDemo />
            </ComponentPreviewServer>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    The track family
                </h2>
                <p className="text-sm text-palette-accent/85">
                    <code>Progress</code> and <code>Slider</code> share the{" "}
                    <code>track</code> family: <code>track.rail</code> (the
                    rail) and <code>track.fill</code> (the filled portion). The
                    indeterminate animation is a real animation and is disabled
                    under <code>prefers-reduced-motion</code> via the{" "}
                    <code>motion-reduce:</code> variant.
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
                                Base UI <code>Progress.Root</code>
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
                                <code>track.fill()</code> + indeterminate
                                animation
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Value</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                Base UI <code>Progress.Value</code>
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
                    </tbody>
                </table>
            </section>
        </div>
    );
}

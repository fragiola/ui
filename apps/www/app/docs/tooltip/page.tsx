import { InstallCommand } from "@/components/install-command";
import { ComponentPreview } from "@/components/preview";

export default function TooltipPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Tooltip
                </h1>
                <p className="text-sm text-palette-accent/85">
                    A transient text label that appears on hover or focus.
                    Composes the <code>popup.tooltip</code> member — a new
                    member of the <code>popup</code> family, not a variant of
                    <code>popup.content</code>.
                </p>
            </div>

            <InstallCommand name="tooltip" />

            <ComponentPreview name="tooltip-demo" />

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Two members, not two variants
                </h2>
                <p className="text-sm text-palette-accent/85">
                    <code>popup.content</code> is the menu/popover floating box:
                    raised surface, border, shadow, zoom animation.{" "}
                    <code>popup.tooltip</code> is a transient text label:
                    inverted palette, no border, no shadow, fade-only animation.
                    These are genuinely different things — a menu list and a
                    text label — so they are named members, not variants. The
                    zero-variant rule is preserved.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Inverted palette
                </h2>
                <p className="text-sm text-palette-accent/85">
                    The tooltip uses{" "}
                    <code>bg-palette-accent text-palette-base</code> — the
                    accent role (normally the foreground) becomes the
                    background, and the base role (normally the background)
                    becomes the text. This is a natural inversion that follows
                    the 6-role contract: no new role, no new palette. In a light
                    theme the tooltip is dark with light text; in a dark theme
                    it inverts automatically.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Provider and delay
                </h2>
                <p className="text-sm text-palette-accent/85">
                    <code>Tooltip.Provider</code> wraps a group of tooltips and
                    coordinates their delay: when you move from one trigger to
                    another, the first tooltip closes and the second opens
                    without waiting for the delay again. This is behaviour from
                    the primitive, not a style concern.
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
                                <code>Provider</code> / <code>Root</code> /{" "}
                                <code>Trigger</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                Base UI <code>Tooltip</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Content</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>popup.tooltip()</code> + Portal +
                                Positioner
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

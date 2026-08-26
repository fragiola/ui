import PopoverDemo from "#/examples/popover-demo";
import { ComponentPreviewServer } from "@/components/component-preview-server";
import { InstallCommand } from "@/components/install-command";

export default function PopoverPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Popover
                </h1>
                <p className="text-sm text-palette-accent/85">
                    A floating surface positioned against a trigger. Composes
                    <code>popup.content</code> — the same floating box
                    dropdown-menu uses — and adds Title, Description and Close
                    through <code>render</code>.
                </p>
            </div>

            <InstallCommand name="popover" />

            <ComponentPreviewServer name="popover-demo">
                <PopoverDemo />
            </ComponentPreviewServer>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    <code>popup.content</code>, not <code>layer.panel</code>
                </h2>
                <p className="text-sm text-palette-accent/85">
                    A popover is positioned by a floating-ui positioner and
                    sized by <code>--available-height</code>; a dialog panel is
                    not. The overlap (raised surface, border, radius, shadow) is
                    checked, not assumed — and it is small enough that unifying
                    them would couple a positioned surface to a centring
                    transform it does not use. They stay separate:
                    <code>layer.panel</code> for modal surfaces,
                    <code>popup.content</code> for positioned surfaces.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Title and description point at Text
                </h2>
                <p className="text-sm text-palette-accent/85">
                    <code>Popover.Title</code> is{" "}
                    <code>Text.Heading as=&quot;h2&quot;</code> wearing the
                    primitive's a11y wiring, stitched with <code>render</code>.{" "}
                    <code>Popover.Description</code> is{" "}
                    <code>Text.Paragraph</code>. The close affordance is{" "}
                    <code>Clickable.Button variant=&quot;icon&quot;</code>,
                    positioned with logical properties.
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
                                <code>Root</code> / <code>Trigger</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                Base UI <code>Popover</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Content</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>popup.content()</code> + Portal +
                                Positioner
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Title</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Text.Heading as=&quot;h2&quot;</code> via
                                <code>render</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Description</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Text.Paragraph</code> via{" "}
                                <code>render</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Close</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Clickable.Button</code> via{" "}
                                <code>render</code>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

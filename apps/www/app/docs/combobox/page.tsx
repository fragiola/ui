import ComboboxDemo from "#/examples/combobox-demo";
import { ComponentPreviewServer } from "@/components/component-preview-server";
import { InstallCommand } from "@/components/install-command";

export default function ComboboxPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Combobox
                </h1>
                <p className="text-sm text-palette-accent/85">
                    The second recombination test. This component is{" "}
                    <code>field</code> + <code>popup</code> + <code>menu</code>,
                    and it declares no new style. Every class comes from a
                    family. If this file contained a class that did not come
                    from a family, the recombination claim would be wrong. It
                    does not.
                </p>
            </div>

            <InstallCommand name="combobox" />

            <ComponentPreviewServer name="combobox-demo">
                <ComboboxDemo />
            </ComponentPreviewServer>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Recombination
                </h2>
                <p className="text-sm text-palette-accent/85">
                    The input is a field control — <code>field.row</code>{" "}
                    provides the box (border, background, focus ring); the input
                    carries the <code>field-control</code> marker so the row's
                    outline fires on focus. The trigger and clear buttons are{" "}
                    <code>Clickable.Button</code>. The content is{" "}
                    <code>popup.content</code>. Items are{" "}
                    <code>menu.selectableItem</code>. The item indicator is{" "}
                    <code>menu.itemIndicator</code>. Group labels are{" "}
                    <code>menu.label</code>. Separators are{" "}
                    <code>menu.separator</code>.
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
                                Base UI <code>Combobox.Root</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>InputGroup</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>field.row()</code> + layout
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Input</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>field-control</code> marker + layout
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Trigger</code> / <code>Clear</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Clickable.Button</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Content</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>popup.content()</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Item</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>menu.selectableItem()</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>ItemIndicator</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>menu.itemIndicator()</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>GroupLabel</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>menu.label()</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Separator</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>menu.separator()</code>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

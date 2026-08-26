import SelectDemo from "#/examples/select-demo";
import { ComponentPreviewServer } from "@/components/component-preview-server";
import { InstallCommand } from "@/components/install-command";

export default function SelectPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Select
                </h1>
                <p className="text-sm text-palette-accent/85">
                    The recombination test. <code>Select</code> is{" "}
                    <code>field</code> + <code>popup</code> + <code>menu</code>{" "}
                    — and it declares no new style. Every class comes from a
                    family.
                </p>
            </div>

            <InstallCommand name="select" />

            <ComponentPreviewServer name="select-demo">
                <SelectDemo />
            </ComponentPreviewServer>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Recombination
                </h2>
                <p className="text-sm text-palette-accent/85">
                    The trigger is a <code>field.row</code> (the box) with a{" "}
                    <code>field.control</code> (the bare middle). The content is
                    a <code>popup.content</code> (the floating box). The items
                    are <code>menu.selectableItem</code> (the option with
                    indicator space). The indicator is a{" "}
                    <code>menu.itemIndicator</code>. The separator is a{" "}
                    <code>menu.separator</code>. The label is a{" "}
                    <code>menu.label</code>.
                </p>
                <p className="text-sm text-palette-accent/85">
                    If this file contained a class that did not come from a
                    family, the recombination claim would be wrong. It does not.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Distribution proof
                </h2>
                <p className="text-sm text-palette-accent/85">
                    Installing <code>select</code> after{" "}
                    <code>dropdown-menu</code> and <code>field</code> writes
                    exactly one file — <code>select.tsx</code> itself. The three
                    families it depends on are already on disk.
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
                                Base UI <code>Select.Root</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Trigger</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>field.row()</code> + layout
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Value</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                Base UI <code>Select.Value</code>
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
                                <code>Label</code>
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

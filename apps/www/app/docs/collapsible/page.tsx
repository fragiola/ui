import CollapsibleDemo from "#/examples/collapsible-demo";
import { ComponentPreviewServer } from "@/components/component-preview-server";
import { InstallCommand } from "@/components/install-command";

export default function CollapsiblePage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Collapsible
                </h1>
                <p className="text-sm text-palette-accent/85">
                    A single expand/collapse section. Composes the{" "}
                    <code>disclosure</code> family (trigger, panel, content). An
                    accordion is a group of collapsibles with coordination; a
                    collapsible is one section on its own.
                </p>
            </div>

            <InstallCommand name="collapsible" />

            <ComponentPreviewServer name="collapsible-demo">
                <CollapsibleDemo />
            </ComponentPreviewServer>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Style families
                </h2>
                <p className="text-sm text-palette-accent/85">
                    <code>collapsible</code> and <code>accordion</code> render
                    from the same <code>disclosure</code> source. The only
                    difference is coordination — behaviour from the primitive,
                    not a style variant. The zero-variant rule is preserved.
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
                                Base UI <code>Collapsible</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Trigger</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>disclosure.trigger()</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Panel</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>disclosure.panel()</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Content</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>disclosure.content()</code>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

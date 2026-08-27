import { InstallCommand } from "@/components/install-command";
import { ComponentPreview } from "@/components/preview";

export default function AccordionPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Accordion
                </h1>
                <p className="text-sm text-palette-accent/85">
                    A group of expand/collapse items with coordination. Composes
                    the <code>disclosure</code> family (trigger, panel,
                    content). The only things this component declares for itself
                    are Root, Item and Header — the coordination points.
                </p>
            </div>

            <InstallCommand name="accordion" />

            <ComponentPreview name="accordion-demo" />

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Style families
                </h2>
                <p className="text-sm text-palette-accent/85">
                    <code>accordion</code> and <code>collapsible</code> render
                    from the same <code>disclosure</code> source —
                    <code>trigger</code>, <code>panel</code>,{" "}
                    <code>content</code>. The only difference is coordination:
                    an accordion coordinates multiple items (one open at a time,
                    or many); a collapsible is a single section. That is
                    behaviour from the primitive, not a style variant.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    The chevron
                </h2>
                <p className="text-sm text-palette-accent/85">
                    The trigger is a <code>group</code>. Put a chevron inside
                    with{" "}
                    <code>
                        transition-transform duration-200
                        group-data-[panel-open]:rotate-180
                    </code>{" "}
                    and it rotates when the panel opens. The rotation is driven
                    by <code>data-panel-open</code>, which the primitive emits
                    on the trigger.
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
                                <code>Root</code> / <code>Item</code> /{" "}
                                <code>Header</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                Base UI <code>Accordion</code>
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

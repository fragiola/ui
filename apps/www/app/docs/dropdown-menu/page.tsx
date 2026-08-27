import { InstallCommand } from "@/components/install-command";
import { ComponentPreview } from "@/components/preview";

export default function DropdownMenuPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Dropdown Menu
                </h1>
                <p className="text-sm text-palette-accent/85">
                    A menu of actions triggered by a button. Shares the{" "}
                    <code>popup</code> and <code>menu</code> style families with
                    context-menu, select and combobox — the only things this
                    component declares for itself are <code>Root</code>,{" "}
                    <code>Trigger</code> and its positioning defaults.
                </p>
            </div>

            <InstallCommand name="dropdown-menu" />

            <ComponentPreview name="dropdown-menu-demo" />

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Style families
                </h2>
                <p className="text-sm text-palette-accent/85">
                    <code>dropdown-menu</code> and <code>context-menu</code>{" "}
                    render from the same <code>menu</code> source. The parts
                    factory (<code>createMenuParts</code>) takes a Base UI
                    namespace and returns the styled wrappers — twelve of them,
                    written once. Each component file declares only{" "}
                    <code>Root</code>, <code>Trigger</code>,{" "}
                    <code>Content</code> and <code>SubContent</code> with its
                    own positioning defaults.
                </p>
                <p className="text-sm text-palette-accent/85">
                    The namespace is <strong>injected, not imported</strong>.
                    <code>ContextMenu.Item === Menu.Item</code> at runtime
                    today, but if Base UI ever diverges, injection means each
                    component inherits its own divergence instead of being
                    silently pinned to the wrong primitive.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Destructive tone
                </h2>
                <p className="text-sm text-palette-accent/85">
                    There is no <code>tone</code>, <code>variant</code> or{" "}
                    <code>destructive</code> prop. Tone arrives as a palette
                    class applied from outside:{" "}
                    <code>className=&quot;palette-danger&quot;</code>. The{" "}
                    <code>highlighted:bg-palette-soft</code> and{" "}
                    <code>text-palette-accent</code> rules resolve against
                    whichever palette is active — inheritance does the work.
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
                                Base UI <code>Menu.Root</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Trigger</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                Base UI <code>Menu.Trigger</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Content</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>popup.content()</code> + positioning
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Item</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>menu.item()</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>CheckboxItem</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>menu.selectableItem()</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>RadioGroup</code> / <code>RadioItem</code>
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
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Shortcut</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>menu.shortcut()</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Sub</code> / <code>SubTrigger</code> /{" "}
                                <code>SubContent</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>menu.subTrigger()</code> +{" "}
                                <code>popup.content()</code>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

import NavigationMenuDemo from "#/examples/navigation-menu-demo";
import { ComponentPreviewServer } from "@/components/component-preview-server";
import { InstallCommand } from "@/components/install-command";

export default function NavigationMenuPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Navigation Menu
                </h1>
                <p className="text-sm text-palette-accent/85">
                    A strip of triggers where each opens a morphing popup with a
                    viewport that resizes between items. The popup is{" "}
                    <code>popup.content</code> — the same floating box
                    dropdown-menu and popover use. The viewport morphs via the
                    primitive's CSS variables, not a new popup member.
                </p>
            </div>

            <InstallCommand name="navigation-menu" />

            <ComponentPreviewServer name="navigation-menu-demo">
                <NavigationMenuDemo />
            </ComponentPreviewServer>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    popup.content, no new member
                </h2>
                <p className="text-sm text-palette-accent/85">
                    The popup is <code>popup.content</code> — the second
                    consumer of that family outside menus (after popover). The
                    viewport's size transition uses the primitive's{" "}
                    <code>--popup-width</code> / <code>--popup-height</code> CSS
                    variables; no new popup member was needed, and no{" "}
                    <code>!important</code>.
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
                                Base UI <code>NavigationMenu.Root</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Trigger</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>highlighted</code> +{" "}
                                <code>palette-ring</code> + layout
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Popup</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>popup.content()</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Link</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Text.Link</code> via render
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Viewport</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                primitive CSS variables + transition
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

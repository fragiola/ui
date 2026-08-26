import DrawerDemo from "#/examples/drawer-demo";
import { ComponentPreviewServer } from "@/components/component-preview-server";
import { InstallCommand } from "@/components/install-command";

export default function DrawerPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Drawer
                </h1>
                <p className="text-sm text-palette-accent/85">
                    An edge-anchored layer with real swipe and snap-point
                    support. Built on Base UI's <code>Drawer</code> primitive,
                    which is why this component exists and why{" "}
                    <code>sheet</code> does not.
                </p>
            </div>

            <InstallCommand name="drawer" />

            <ComponentPreviewServer name="drawer-demo">
                <DrawerDemo />
            </ComponentPreviewServer>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Why no <code>sheet</code>
                </h2>
                <p className="text-sm text-palette-accent/85">
                    An edge-anchored dialog and a drawer are the same component
                    with different gesture support, and the behaviour library
                    ships a real <code>Drawer</code> primitive that anchors to
                    any edge. Two items would be exactly the duplication this
                    project removes. <code>drawer</code> covers the case; do not
                    add <code>sheet</code> back by reflex.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    RTL and the inline edges
                </h2>
                <p className="text-sm text-palette-accent/85">
                    The inline edges (<code>left</code> / <code>right</code>)
                    invert under RTL: the viewport's flex direction flips so the
                    drawer opens from the correct side. A drawer that opens from
                    the wrong side in Arabic is the classic silent failure — it
                    renders perfectly while pointing the wrong way.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Style families
                </h2>
                <p className="text-sm text-palette-accent/85">
                    The drawer consumes the <code>layer</code> family directly (
                    <code>panel</code>, <code>header</code>, <code>body</code>,
                    <code>footer</code>, <code>title</code>,{" "}
                    <code>description</code>) but is not built from{" "}
                    <code>createLayerParts</code>: it has its own{" "}
                    <code>Viewport</code>, <code>Handle</code> and a
                    transform-based positioning model that the dialog does not
                    share. A factory for one component would be padding.
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
                                <code>Root</code> / <code>Trigger</code> /{" "}
                                <code>Portal</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                Base UI <code>Drawer</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Backdrop</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>layer.backdrop()</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Viewport</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                drawer-specific positioning (flex justify,
                                RTL-aware)
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Popup</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>layer.panel()</code> + edge transform
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Handle</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                drawer-specific (<code>bg-palette-line</code>)
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Header</code> / <code>Body</code> /{" "}
                                <code>Footer</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>layer.header/body/footer()</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Title</code> / <code>Description</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Text</code> via <code>render</code>
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

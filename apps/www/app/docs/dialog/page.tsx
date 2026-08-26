import DialogDemo from "#/examples/dialog-demo";
import { ComponentPreviewServer } from "@/components/component-preview-server";
import { InstallCommand } from "@/components/install-command";

export default function DialogPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Dialog
                </h1>
                <p className="text-sm text-palette-accent/85">
                    A modal layer — a centred panel over a scrim. Shares the{" "}
                    <code>layer</code> family with alert-dialog and drawer; the
                    only things this component declares for itself are{" "}
                    <code>Root</code>, <code>Trigger</code>, <code>Portal</code>{" "}
                    and the centring transform.
                </p>
            </div>

            <InstallCommand name="dialog" />

            <ComponentPreviewServer name="dialog-demo">
                <DialogDemo />
            </ComponentPreviewServer>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Style families
                </h2>
                <p className="text-sm text-palette-accent/85">
                    <code>dialog</code>, <code>alert-dialog</code> and{" "}
                    <code>drawer</code> render from the same <code>layer</code>{" "}
                    source — <code>backdrop</code>, <code>panel</code>,{" "}
                    <code>header</code>, <code>body</code>,<code>footer</code>,{" "}
                    <code>title</code>, <code>description</code>. The parts
                    factory (<code>createLayerParts</code>) takes a Base UI
                    namespace and returns the styled wrappers. Installing{" "}
                    <code>alert-dialog</code> after <code>dialog</code> writes
                    exactly one file.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Title and description point at Text
                </h2>
                <p className="text-sm text-palette-accent/85">
                    <code>Dialog.Title</code> is{" "}
                    <code>Text.Heading as=&quot;h2&quot;</code> wearing the
                    primitive's a11y wiring, stitched with <code>render</code>.{" "}
                    <code>Dialog.Description</code> is{" "}
                    <code>Text.Paragraph</code>. Neither declares its own
                    typography — this is the rule that keeps seventeen title
                    classes from coming back.
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
                                Base UI <code>Dialog</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Backdrop</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>layer.backdrop()</code> (bg-scrim)
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Content</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>layer.panel()</code> + centring transform
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
                                <code>Title</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Text.Heading as=&quot;h2&quot;</code> via{" "}
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

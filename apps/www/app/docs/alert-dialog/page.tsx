import AlertDialogDemo from "#/examples/alert-dialog-demo";
import { ComponentPreviewServer } from "@/components/component-preview-server";
import { InstallCommand } from "@/components/install-command";

export default function AlertDialogPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Alert Dialog
                </h1>
                <p className="text-sm text-palette-accent/85">
                    A modal layer that requires an explicit action to dismiss —
                    no backdrop click, no close button. This file is the proof
                    that <code>layer</code> is a family: it declares only what
                    genuinely differs from <code>dialog</code>.
                </p>
            </div>

            <InstallCommand name="alert-dialog" />

            <ComponentPreviewServer name="alert-dialog-demo">
                <AlertDialogDemo />
            </ComponentPreviewServer>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    One file
                </h2>
                <p className="text-sm text-palette-accent/85">
                    Installing <code>alert-dialog</code> after{" "}
                    <code>dialog</code> writes exactly one file — this one. The{" "}
                    <code>layer</code> family and the{" "}
                    <code>createLayerParts</code> factory are already on disk.
                    AlertDialog reuses Dialog's <code>Backdrop</code>,{" "}
                    <code>Popup</code>, <code>Title</code>,{" "}
                    <code>Description</code>, <code>Close</code> and{" "}
                    <code>Portal</code> at runtime; the factory injects the
                    namespace so each component inherits its own divergence if
                    Base UI ever splits them.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    What differs
                </h2>
                <p className="text-sm text-palette-accent/85">
                    Only three things: the primitive namespace, the absence of a
                    close button (<code>showClose=&#123;false&#125;</code>), and
                    the action/cancel pair (which is just{" "}
                    <code>Clickable.Button</code> composed in the footer, not a
                    new part). A destructive confirmation is{" "}
                    <code>className=&quot;palette-danger&quot;</code> on the
                    action button — no{" "}
                    <code>variant=&quot;destructive&quot;</code>, no{" "}
                    <code>tone</code> prop.
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
                                Base UI <code>AlertDialog</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Backdrop</code> / <code>Content</code> /{" "}
                                <code>Header</code> / <code>Body</code> /{" "}
                                <code>Footer</code> / <code>Title</code> /{" "}
                                <code>Description</code> / <code>Close</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>layer</code> via{" "}
                                <code>createLayerParts</code>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

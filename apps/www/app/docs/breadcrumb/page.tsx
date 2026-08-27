import { InstallCommand } from "@/components/install-command";
import { ComponentPreview } from "@/components/preview";

export default function BreadcrumbPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Breadcrumb
                </h1>
                <p className="text-sm text-palette-accent/85">
                    A navigation trail. Uses a semantic <code>&lt;nav&gt;</code>{" "}
                    with an ordered list. The last item is the current page
                    (aria-current), not a link. Separators are chevrons on the
                    inline axis, RTL-aware.
                </p>
            </div>

            <InstallCommand name="breadcrumb" />

            <ComponentPreview name="breadcrumb-demo" />

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Composition, not variation
                </h2>
                <p className="text-sm text-palette-accent/85">
                    The breadcrumb has no variants — visual differences
                    (separator type, truncation) are composition. Pass any
                    element as the separator's child (a chevron, a slash, a
                    dot). Use <code>Breadcrumb.Ellipsis</code> for collapsed
                    items. Use <code>render</code> on{" "}
                    <code>Breadcrumb.Link</code> to stitch a router link.
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
                                Renders
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-palette-line">
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Root</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>&lt;nav aria-label&gt;</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>List</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>&lt;ol&gt;</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Item</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>&lt;li&gt;</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Link</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>&lt;a&gt;</code> — stitch a router link
                                through <code>render</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Page</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>&lt;span aria-current&gt;</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Separator</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>&lt;li aria-hidden&gt;</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Ellipsis</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>&lt;span aria-hidden&gt;</code> +
                                MoreHorizontalIcon
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

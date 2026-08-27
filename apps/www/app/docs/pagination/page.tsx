import { InstallCommand } from "@/components/install-command";
import { ComponentPreview } from "@/components/preview";

export default function PaginationPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Pagination
                </h1>
                <p className="text-sm text-palette-accent/85">
                    A strip of links where one is the current page. Every
                    clickable part is <code>Clickable</code> — there is no
                    button style in this file. The current page carries{" "}
                    <code>aria-current="page"</code> and is distinguished by a
                    fill strategy, never by a colour.
                </p>
            </div>

            <InstallCommand name="pagination" />

            <ComponentPreview name="pagination-demo" />

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    All Clickable, no button style
                </h2>
                <p className="text-sm text-palette-accent/85">
                    <code>Link</code> is <code>Clickable.Link</code>,{" "}
                    <code>Previous</code> and <code>Next</code> are{" "}
                    <code>Clickable.Link</code> with an icon. The current page
                    uses <code>variant="outline"</code> (a fill strategy), not a
                    colour. The previous/next chevrons invert under RTL via{" "}
                    <code>rtl:rotate-180</code> — there is no logical utility
                    for icon direction.
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
                                <code>&lt;nav aria-label&gt;</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Link</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Clickable.Link</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Previous</code> / <code>Next</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Clickable.Link</code> + icon
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Ellipsis</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                decorative <code>&lt;span&gt;</code> + sr-only
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

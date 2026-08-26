import BadgeDemo from "#/examples/badge-demo";
import { ComponentPreviewServer } from "@/components/component-preview-server";
import { InstallCommand } from "@/components/install-command";

export default function BadgePage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Badge
                </h1>
                <p className="text-sm text-palette-accent/85">
                    A small status indicator. One axis (variant: soft / solid /
                    outline), none of which is colour. Tone arrives as a palette
                    class — the same discipline as Clickable.
                </p>
            </div>

            <InstallCommand name="badge" />

            <ComponentPreviewServer name="badge-demo">
                <BadgeDemo />
            </ComponentPreviewServer>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    No colour variant
                </h2>
                <p className="text-sm text-palette-accent/85">
                    A destructive badge is{" "}
                    <code>
                        &lt;Badge className=&quot;palette-danger&quot;&gt;
                    </code>{" "}
                    — there is no <code>variant=&quot;destructive&quot;</code>{" "}
                    and no <code>tone</code> prop. The palette class overrides
                    the six roles, so <code>bg-palette-soft</code> becomes the
                    danger soft tint and <code>text-palette-contrast</code>{" "}
                    becomes the danger contrast. This is what stops{" "}
                    <code>destructive</code> from coming back as a hundred
                    copies.
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
                                <code>Badge</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>&lt;span&gt;</code> with{" "}
                                <code>badge()</code> variants
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

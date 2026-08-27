import { InstallCommand } from "@/components/install-command";
import { ComponentPreview } from "@/components/preview";

export default function ClickablePage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Clickable
                </h1>
                <p className="text-sm text-palette-accent/85">
                    The button surface — one component, three exports:{" "}
                    <code>Button</code>, <code>Link</code> and{" "}
                    <code>ExternalLink</code>. Every clickable affordance in the
                    project composes against it: a dialog's close, an
                    alert-dialog's action pair, a badge's dismiss, a field
                    addon's button.
                </p>
            </div>

            <InstallCommand name="clickable" />

            <ComponentPreview name="clickable-demo" />

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Three axes, none of them colour
                </h2>
                <p className="text-sm text-palette-accent/85">
                    <code>variant</code> (solid / ghost / outline / icon) is a
                    fill strategy, <code>size</code> (sm / md) is a measure —{" "}
                    <code>md</code> is <code>h-control</code>, so a button lines
                    up with a field — and <code>shape</code> (auto / square) is
                    a form. They are orthogonal:{" "}
                    <code>size=&quot;sm&quot; shape=&quot;square&quot;</code>{" "}
                    produces a small square button, which is what an addon
                    needs. Folding form into measure is what produces a{" "}
                    <code>size=&quot;icon&quot;</code> that cannot also be
                    small.
                </p>
                <p className="text-sm text-palette-accent/85">
                    No axis names a colour. A destructive button is{" "}
                    <code>
                        &lt;Clickable.Button
                        className=&quot;palette-danger&quot; /&gt;
                    </code>{" "}
                    — there is no <code>variant=&quot;destructive&quot;</code>{" "}
                    and no <code>tone</code> prop. This is what keeps{" "}
                    <code>destructive</code> from coming back as a hundred
                    copies.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Links and <code>render</code>
                </h2>
                <p className="text-sm text-palette-accent/85">
                    <code>Clickable.Link</code> is a plain{" "}
                    <code>&lt;a&gt;</code> — it has no dependency on any router.
                    Consumers stitch Next's or TanStack's link through{" "}
                    <code>render</code>, the project's single polymorphism
                    mechanism. <code>ExternalLink</code> is a separate export
                    (not a prop) because it differs in defaults and semantics (
                    <code>target</code>, <code>rel</code>), not in appearance.
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
                                <code>Button</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                Base UI <code>Button</code> +{" "}
                                <code>clickable()</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Link</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>useRender</code> (<code>&lt;a&gt;</code>)
                                + <code>clickable()</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>ExternalLink</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>useRender</code> (<code>&lt;a&gt;</code>)
                                + outbound defaults + <code>clickable()</code>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

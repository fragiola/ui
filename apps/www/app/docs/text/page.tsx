import { InstallCommand } from "@/components/install-command";
import { ComponentPreview } from "@/components/preview";

export default function TextPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Text
                </h1>
                <p className="text-sm text-palette-accent/85">
                    The primitive every other component points at through{" "}
                    <code>render</code>. It is what stops a dialog title, a
                    field label and a menu label from each growing their own
                    typography class — seventeen title classes is exactly the
                    duplication this project exists to remove.
                </p>
            </div>

            <InstallCommand name="text" />

            <ComponentPreview name="text-demo" />

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    What <code>Text</code> is for
                </h2>
                <p className="text-sm text-palette-accent/85">
                    A component part that needs a heading does not declare one —
                    it wears <code>Text.Heading</code> through{" "}
                    <code>render</code>, keeping the behaviour library's a11y
                    wiring (the ids for <code>aria-labelledby</code> /{" "}
                    <code>aria-describedby</code>) while taking Text's
                    typography:
                </p>
                <pre className="rounded-md border border-palette-line bg-palette-soft p-3 text-xs overflow-auto">
                    <code>{`<DialogPrimitive.Title render={<Text.Heading as="h2" />} {...props} />`}</code>
                </pre>
                <p className="text-sm text-palette-accent/85">
                    <code>Dialog.Title</code>, <code>Field.Label</code> and{" "}
                    <code>Menu.Label</code> all resolve to a <code>Text</code>{" "}
                    member this way. If any of them grows its own typography
                    class, the composition rule has been broken.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Secondary text
                </h2>
                <p className="text-sm text-palette-accent/85">
                    The most-used token in the shadcn baseline (
                    <code>muted-foreground</code>, 44 occurrences) maps to a
                    role Fragiola deliberately lacks. The settled value is{" "}
                    <code>text-palette-accent/85</code>. The architecture
                    initially proposed <code>accent/70</code>, but OKLCH→WCAG
                    measurement showed 70% fails AA (4.5:1) even on neutral
                    surfaces. At 85%, <code>accent</code> clears AA on every
                    neutral surface (surface + raised, base + soft) in both
                    themes — worst case 4.71:1. Secondary text realistically
                    appears only on neutral backgrounds; chromatic palettes use{" "}
                    <code>contrast</code> for their text, not a muted variant.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    <code>Text.Clickable</code> vs <code>Clickable.Button</code>
                </h2>
                <p className="text-sm text-palette-accent/85">
                    <code>Text.Clickable</code> is a <em>textual</em> link
                    rendered as a button — inline, underlined on hover, no fill.
                    <code>Clickable.Button</code> is a filled affordance with a
                    fill strategy, a measure and a form. They are different
                    jobs; do not merge them.
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
                                <code>Heading</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>&lt;h1|h2|h3&gt;</code>,{" "}
                                <code>text-palette-contrast</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Paragraph</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>&lt;p&gt;</code>,{" "}
                                <code>text-palette-contrast</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Link</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                plain <code>&lt;a&gt;</code> — stitch a router
                                link through <code>render</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Label</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>&lt;label&gt;</code>, block, semibold
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Error</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>&lt;span&gt;</code> +{" "}
                                <code>palette-danger</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Strong</code> / <code>Small</code> /{" "}
                                <code>Highlight</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>&lt;strong&gt;</code> /{" "}
                                <code>&lt;small&gt;</code> /{" "}
                                <code>&lt;span&gt;</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Clickable</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>&lt;button&gt;</code>, inline textual link
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

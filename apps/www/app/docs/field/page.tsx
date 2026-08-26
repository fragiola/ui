import FieldDemo from "#/examples/field-demo";
import { ComponentPreviewServer } from "@/components/component-preview-server";
import { InstallCommand } from "@/components/install-command";

export default function FieldPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Field
                </h1>
                <p className="text-sm text-palette-accent/85">
                    One way to write a field, and one input. The box lives on
                    the row; the control is only its middle. The{" "}
                    <code>field</code> family has ten members and zero variants.
                </p>
            </div>

            <InstallCommand name="field" />

            <ComponentPreviewServer name="field-demo">
                <FieldDemo />
            </ComponentPreviewServer>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Anatomy
                </h2>
                <table className="w-full text-sm border border-palette-line rounded-md overflow-hidden">
                    <thead className="bg-palette-soft">
                        <tr>
                            <th className="text-start px-3 py-2 text-palette-contrast font-semibold">
                                Member
                            </th>
                            <th className="text-start px-3 py-2 text-palette-contrast font-semibold">
                                Is
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-palette-line">
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>row</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <strong>the box</strong> — border, background,
                                height, radius, focus ring
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>body</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                the control&apos;s area inside the box: flex, no
                                padding, no border
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>control</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                the bare middle — transparent in every sense
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>addon</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                sibling of body inside row: no border of its
                                own, only a divider
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>inset</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                child of body: inside the padding, no divider,
                                no border
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    The box is the row, not the body
                </h2>
                <p className="text-sm text-palette-accent/85">
                    An earlier version put the border on the body and gave the
                    addon its own border. Joining two bordered boxes then
                    required zeroing border and radius on the seam — that is
                    where both of the project&apos;s <code>!important</code>s
                    came from. With the border on the row,{" "}
                    <code>overflow-hidden</code> clips the corners, no child
                    declares a radius, and focusing the control highlights the
                    whole field, addon included.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Invalid state by inheritance
                </h2>
                <p className="text-sm text-palette-accent/85">
                    <code>data-invalid</code> on the field root turns the whole
                    subtree danger with no extra class on any child. Base UI
                    emits <code>data-invalid</code> on <code>Field.Root</code>,
                    and the themes register <code>[data-invalid]</code> as a{" "}
                    <code>palette-danger</code> applier.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Addon sides
                </h2>
                <p className="text-sm text-palette-accent/85">
                    Four sides through <code>data-side</code>, in logical
                    vocabulary: <code>inline-start</code> /{" "}
                    <code>inline-end</code> use <code>border-s</code> /{" "}
                    <code>border-e</code> and invert in RTL;{" "}
                    <code>block-start</code> / <code>block-end</code> use{" "}
                    <code>basis-full</code> + <code>order-first</code>/
                    <code>order-last</code> and do not. Side is a data
                    attribute, not a variant.
                </p>
            </section>
        </div>
    );
}

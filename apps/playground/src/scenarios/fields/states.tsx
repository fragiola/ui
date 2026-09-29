import { Input } from "#/components/atoms/fields";
import { Field } from "#/components/ui/field";

// The field frame in every state, on the neutral surface and on each
// surface-ring palette: the frame must read neutral everywhere, and only
// the focus ring may carry colour. Focus a field to see its ring.

const PALETTES = [
    "surface",
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

export default function FieldStates() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            {PALETTES.map((palette) => (
                <div key={palette} className="flex flex-col gap-2">
                    <span className="font-mono text-xs text-palette-accent/85">
                        palette-{palette}
                    </span>
                    <div className="flex flex-wrap items-start gap-4">
                        <Field.Root className={`palette-${palette} w-44`}>
                            <Field.Label>Default</Field.Label>
                            <Field.Row>
                                <Field.Body>
                                    <Input placeholder="Placeholder" />
                                </Field.Body>
                            </Field.Row>
                            <Field.Description>Helper text.</Field.Description>
                        </Field.Root>

                        <Field.Root
                            invalid
                            className={`palette-${palette} w-44`}
                        >
                            <Field.Label>Invalid</Field.Label>
                            <Field.Row>
                                <Field.Body>
                                    <Input defaultValue="admin" />
                                </Field.Body>
                            </Field.Row>
                            <Field.Error>This username is taken.</Field.Error>
                        </Field.Root>

                        <Field.Root
                            disabled
                            className={`palette-${palette} w-44`}
                        >
                            <Field.Label>Disabled</Field.Label>
                            <Field.Row>
                                <Field.Body>
                                    <Input defaultValue="Cannot edit" />
                                </Field.Body>
                            </Field.Row>
                        </Field.Root>

                        <Field.Root className={`palette-${palette} w-44`}>
                            <Field.Label>Read-only</Field.Label>
                            <Field.Row>
                                <Field.Body>
                                    <Input
                                        readOnly
                                        defaultValue="Fixed value"
                                    />
                                </Field.Body>
                            </Field.Row>
                        </Field.Root>
                    </div>
                </div>
            ))}
        </div>
    );
}

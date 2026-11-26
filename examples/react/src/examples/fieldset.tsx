"use client";

import { Input } from "#/components/atoms/fields";
import { Field } from "#/components/ui/field";
import { Fieldset } from "#/components/ui/fieldset";

// A shipping address in the default look: one Fieldset names the group (its
// Legend, at a label's size and weight) and the fields inside are ordinary
// Fields. Then the same group disabled: `disabled` on the Root disables
// every field in it.
export default function FieldsetDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-8 bg-palette-base text-palette-contrast">
            <Fieldset.Root className="max-w-sm">
                <Fieldset.Legend>Shipping address</Fieldset.Legend>
                <Field.Root>
                    <Field.Label>Street</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input defaultValue="12 Rue de la Paix" />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>
                <div className="flex gap-3">
                    <Field.Root>
                        <Field.Label>City</Field.Label>
                        <Field.Row>
                            <Field.Body>
                                <Input defaultValue="Paris" />
                            </Field.Body>
                        </Field.Row>
                    </Field.Root>
                    <Field.Root className="w-32">
                        <Field.Label>Postcode</Field.Label>
                        <Field.Row>
                            <Field.Body>
                                <Input defaultValue="75002" />
                            </Field.Body>
                        </Field.Row>
                    </Field.Root>
                </div>
            </Fieldset.Root>

            <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-palette-accent/85">
                    states
                </span>
                <Fieldset.Root className="max-w-sm" disabled>
                    <Fieldset.Legend>Billing address</Fieldset.Legend>
                    <Field.Root>
                        <Field.Label>Street</Field.Label>
                        <Field.Row>
                            <Field.Body>
                                <Input defaultValue="Same as shipping" />
                            </Field.Body>
                        </Field.Row>
                    </Field.Root>
                </Fieldset.Root>
            </div>
        </div>
    );
}

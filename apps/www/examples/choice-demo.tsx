"use client";

import { Checkbox } from "#/ui/checkbox";
import { Field } from "#/ui/field";
import { Radio, RadioGroup } from "#/ui/radio";
import { Switch } from "#/ui/switch";
import { PaletteGrid } from "@/components/preview/palette-grid";
import { SURFACES } from "@/lib/palette-sets";

// Each cell is a tinted surface palette. The choice controls — checkbox,
// radio, switch — read roles from the cell. The disabled radio in one cell
// does not affect its siblings.
function DemoContent() {
    return (
        <div className="flex flex-col gap-6">
            {/* Checkbox with Field.ChoiceRoot */}
            <Field.ChoiceRoot>
                <Checkbox.Root id="terms">
                    <Checkbox.Indicator />
                </Checkbox.Root>
                <Field.Label htmlFor="terms">
                    Accept terms and conditions
                </Field.Label>
            </Field.ChoiceRoot>

            {/* Checkbox with description */}
            <Field.ChoiceRoot>
                <Checkbox.Root id="newsletter">
                    <Checkbox.Indicator />
                </Checkbox.Root>
                <div className="flex flex-col gap-1">
                    <Field.Label htmlFor="newsletter">
                        Subscribe to newsletter
                    </Field.Label>
                    <Field.Description>
                        Get notified about new releases.
                    </Field.Description>
                </div>
            </Field.ChoiceRoot>

            {/* Radio group */}
            <Field.Root>
                <Field.Label>Notification preference</Field.Label>
                <RadioGroup defaultValue="email">
                    <Field.ChoiceRoot>
                        <Radio.Root value="email">
                            <Radio.Indicator />
                        </Radio.Root>
                        <Field.Label>Email</Field.Label>
                    </Field.ChoiceRoot>
                    <Field.ChoiceRoot>
                        <Radio.Root value="sms">
                            <Radio.Indicator />
                        </Radio.Root>
                        <Field.Label>SMS</Field.Label>
                    </Field.ChoiceRoot>
                    <Field.ChoiceRoot>
                        <Radio.Root value="push" disabled>
                            <Radio.Indicator />
                        </Radio.Root>
                        <Field.Label>Push (disabled)</Field.Label>
                    </Field.ChoiceRoot>
                </RadioGroup>
            </Field.Root>

            {/* Switch */}
            <Field.ChoiceRoot>
                <Switch.Root id="airplane">
                    <Switch.Thumb />
                </Switch.Root>
                <Field.Label htmlFor="airplane">Airplane mode</Field.Label>
            </Field.ChoiceRoot>

            {/* Switch with description */}
            <Field.ChoiceRoot>
                <Switch.Root id="autosave">
                    <Switch.Thumb />
                </Switch.Root>
                <div className="flex flex-col gap-1">
                    <Field.Label htmlFor="autosave">Autosave</Field.Label>
                    <Field.Description>
                        Automatically save changes as you type.
                    </Field.Description>
                </div>
            </Field.ChoiceRoot>
        </div>
    );
}

export default function ChoiceDemo() {
    return (
        <PaletteGrid palettes={SURFACES}>
            <DemoContent />
        </PaletteGrid>
    );
}

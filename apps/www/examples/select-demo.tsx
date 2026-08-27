"use client";

import { Field } from "#/ui/field";
import { Select } from "#/ui/select";

export default function SelectDemo() {
    return (
        <div className="flex flex-col gap-6">
            {/* Basic select */}
            <Field.Root>
                <Field.Label>Fruit</Field.Label>
                <Select.Root defaultValue="apple">
                    <Select.Trigger>
                        <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Item value="apple">Apple</Select.Item>
                        <Select.Item value="banana">Banana</Select.Item>
                        <Select.Item value="cherry">Cherry</Select.Item>
                        <Select.Item value="durian">Durian</Select.Item>
                    </Select.Content>
                </Select.Root>
            </Field.Root>

            {/* Select with groups and labels */}
            <Field.Root>
                <Field.Label>Timezone</Field.Label>
                <Select.Root>
                    <Select.Trigger>
                        <Select.Value placeholder="Select a timezone" />
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Group>
                            <Select.Label>Americas</Select.Label>
                            <Select.Item value="pst">Pacific (PST)</Select.Item>
                            <Select.Item value="est">Eastern (EST)</Select.Item>
                            <Select.Item value="brt">
                                Brasília (BRT)
                            </Select.Item>
                        </Select.Group>
                        <Select.Separator />
                        <Select.Group>
                            <Select.Label>Europe</Select.Label>
                            <Select.Item value="gmt">
                                Greenwich (GMT)
                            </Select.Item>
                            <Select.Item value="cet">Central (CET)</Select.Item>
                            <Select.Item value="eet">Eastern (EET)</Select.Item>
                        </Select.Group>
                    </Select.Content>
                </Select.Root>
            </Field.Root>

            {/* Disabled select */}
            <Field.Root disabled>
                <Field.Label>Disabled</Field.Label>
                <Select.Root>
                    <Select.Trigger>
                        <Select.Value placeholder="Cannot select" />
                    </Select.Trigger>
                </Select.Root>
            </Field.Root>
        </div>
    );
}

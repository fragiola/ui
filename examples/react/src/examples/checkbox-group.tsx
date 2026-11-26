"use client";

import { useState } from "react";
import { Checkbox } from "#/components/ui/checkbox";
import { CheckboxGroup } from "#/components/ui/checkbox-group";
import { Field } from "#/components/ui/field";

const PERMISSIONS = [
    { value: "read", label: "Read issues" },
    { value: "write", label: "Write issues" },
    { value: "admin", label: "Manage the project" },
];

// A role's permissions in the default look: a CheckboxGroup whose value is
// the list of checked permissions, and a parent checkbox (`parent`, with
// the group's `allValues`) that checks or clears them all and shows the
// mixed dash while only some are checked. Then the disabled group.
export default function CheckboxGroupDemo() {
    const [value, setValue] = useState<string[]>(["read"]);
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <CheckboxGroup
                aria-labelledby="permissions-label"
                value={value}
                onValueChange={setValue}
                allValues={PERMISSIONS.map((permission) => permission.value)}
                className="max-w-sm"
            >
                <Field.ChoiceRoot>
                    <Checkbox.Root id="permissions-all" parent>
                        <Checkbox.Indicator />
                    </Checkbox.Root>
                    <Field.Label
                        id="permissions-label"
                        htmlFor="permissions-all"
                    >
                        Editor permissions
                    </Field.Label>
                </Field.ChoiceRoot>
                <div className="flex flex-col gap-2 ps-7">
                    {PERMISSIONS.map((permission) => (
                        <Field.ChoiceRoot key={permission.value}>
                            <Checkbox.Root
                                id={`permission-${permission.value}`}
                                value={permission.value}
                            >
                                <Checkbox.Indicator />
                            </Checkbox.Root>
                            <Field.Label
                                htmlFor={`permission-${permission.value}`}
                            >
                                {permission.label}
                            </Field.Label>
                        </Field.ChoiceRoot>
                    ))}
                </div>
            </CheckboxGroup>
            <p className="text-sm text-palette-accent/85">
                Granted: {value.length ? value.join(", ") : "nothing"}
            </p>

            <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-palette-accent/85">
                    states
                </span>
                <CheckboxGroup
                    aria-label="Notifications, disabled"
                    defaultValue={["email"]}
                    disabled
                >
                    <Field.ChoiceRoot>
                        <Checkbox.Root id="notify-email" value="email">
                            <Checkbox.Indicator />
                        </Checkbox.Root>
                        <Field.Label htmlFor="notify-email">Email</Field.Label>
                    </Field.ChoiceRoot>
                    <Field.ChoiceRoot>
                        <Checkbox.Root id="notify-sms" value="sms">
                            <Checkbox.Indicator />
                        </Checkbox.Root>
                        <Field.Label htmlFor="notify-sms">SMS</Field.Label>
                    </Field.ChoiceRoot>
                </CheckboxGroup>
            </div>
        </div>
    );
}

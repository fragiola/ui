"use client";

import { Clickable } from "#/components/atoms/clickable";
import { Input } from "#/components/atoms/fields";
import { Field } from "#/components/ui/field";
import { PasswordInput } from "#/components/ui/password-input";

// A sign-in form in the default look. The password's trigger shows and
// hides it; its name, "Show password", is the example's (a toggle button
// keeps one name, its pressed state says the rest). The control is only
// its middle: PasswordInput.Root sits in the field's row. The label points
// at the input's `id`, which works on every base. Then the disabled state.
export default function PasswordInputDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <form
                className="flex max-w-sm flex-col gap-4"
                onSubmit={(event) => event.preventDefault()}
            >
                <Field.Root>
                    <Field.Label>Email</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input
                                type="email"
                                defaultValue="ada@example.com"
                            />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>
                <Field.Root>
                    <Field.Label htmlFor="sign-in-password">
                        Password
                    </Field.Label>
                    <Field.Row>
                        <PasswordInput.Root
                            id="sign-in-password"
                            name="password"
                            defaultValue="correct horse"
                        >
                            <PasswordInput.Input autoComplete="current-password" />
                            <PasswordInput.VisibilityTrigger aria-label="Show password" />
                        </PasswordInput.Root>
                    </Field.Row>
                    <Field.Description>
                        At least 12 characters.
                    </Field.Description>
                </Field.Root>
                <Clickable.Button
                    type="submit"
                    className="palette-neutral self-start"
                >
                    Sign in
                </Clickable.Button>
            </form>

            <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-palette-accent/85">
                    states
                </span>
                <Field.Row className="max-w-sm opacity-50">
                    <PasswordInput.Root
                        defaultValue="locked"
                        disabled
                        aria-label="Password, disabled"
                    >
                        <PasswordInput.Input aria-label="Password, disabled" />
                        <PasswordInput.VisibilityTrigger aria-label="Show password" />
                    </PasswordInput.Root>
                </Field.Row>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { Clickable } from "#/components/atoms/clickable";
import { Input } from "#/components/atoms/fields";
import { Field } from "#/components/ui/field";
import { Form } from "#/components/ui/form";

type Errors = Record<string, string | string[]>;

// Pretend server: the username is taken, whatever is typed.
async function createAccount(data: FormData): Promise<Errors> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return data.get("username") ? { username: "This username is taken." } : {};
}

// A sign-up form in the default look. The browser checks the email
// (`required`, `type="email"`) and the Field shows its own error; the
// server's answer goes to the Form's `errors`, keyed by each Field's
// `name`, and the Field shows it until its value changes. An invalid Field
// turns red by inheritance (`palette-danger`), nothing else: the box, the
// text and Field.Error.
export default function FormDemo() {
    const [errors, setErrors] = useState<Errors>({});
    const [pending, setPending] = useState(false);
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Form
                className="max-w-sm"
                errors={errors}
                onSubmit={async (event) => {
                    event.preventDefault();
                    setPending(true);
                    setErrors(
                        await createAccount(new FormData(event.currentTarget)),
                    );
                    setPending(false);
                }}
            >
                <Field.Root name="email">
                    <Field.Label>Email</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input
                                type="email"
                                required
                                defaultValue="ada@example.com"
                            />
                        </Field.Body>
                    </Field.Row>
                    <Field.Error />
                </Field.Root>
                <Field.Root name="username">
                    <Field.Label>Username</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input required defaultValue="ada" />
                        </Field.Body>
                    </Field.Row>
                    <Field.Description>
                        Shown on your profile.
                    </Field.Description>
                    <Field.Error />
                </Field.Root>
                <Clickable.Button
                    type="submit"
                    className="palette-neutral self-start"
                    disabled={pending}
                >
                    {pending ? "Creating…" : "Create account"}
                </Clickable.Button>
            </Form>
        </div>
    );
}

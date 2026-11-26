"use client";

import { useState } from "react";
import { Field } from "#/components/ui/field";
import { OTPField } from "#/components/ui/otp-field";

const SLOTS = [0, 1, 2, 3, 4, 5];

// A sign-in's second step in the default look: six digit slots in two
// groups of three. Typing moves to the next slot, Backspace back, and a
// pasted code fills them all; letters are refused (`validationType`
// numeric, the default). Each slot is named by its position. When the code
// is whole, `onValueComplete` checks it. Then the disabled state.
export default function OTPFieldDemo() {
    const [status, setStatus] = useState("Enter the 6-digit code we sent.");
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Field.Root className="w-fit">
                <Field.Label>Verification code</Field.Label>
                <OTPField.Root
                    length={6}
                    name="code"
                    onValueChange={() =>
                        setStatus("Enter the 6-digit code we sent.")
                    }
                    onValueComplete={(code) => setStatus(`Checking ${code}…`)}
                >
                    {SLOTS.slice(0, 3).map((slot) => (
                        <OTPField.Input
                            key={slot}
                            aria-label={`Digit ${slot + 1} of 6`}
                        />
                    ))}
                    <OTPField.Separator />
                    {SLOTS.slice(3).map((slot) => (
                        <OTPField.Input
                            key={slot}
                            aria-label={`Digit ${slot + 1} of 6`}
                        />
                    ))}
                </OTPField.Root>
                <Field.Description>{status}</Field.Description>
            </Field.Root>

            <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-palette-accent/85">
                    states
                </span>
                <OTPField.Root length={4} defaultValue="2048" disabled>
                    {SLOTS.slice(0, 4).map((slot) => (
                        <OTPField.Input
                            key={slot}
                            aria-label={`PIN digit ${slot + 1} of 4`}
                        />
                    ))}
                </OTPField.Root>
            </div>
        </div>
    );
}

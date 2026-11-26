"use client";

import { Field } from "#/components/ui/field";
import { NumberField } from "#/components/ui/number-field";

// An order form in the default look. Seats: a number with its steppers,
// bounded by `min` and `max` (arrows, Page Up/Down, the buttons held to
// repeat). Discount: a percentage formatted for the locale, with a scrub
// area on its label (drag sideways) and the wheel (`allowWheelScrub`). The
// box is the field's: the steppers are its addons, the input only its
// middle. Then the disabled state.
export default function NumberFieldDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <form
                className="flex max-w-sm flex-col gap-4"
                onSubmit={(event) => event.preventDefault()}
            >
                <Field.Root>
                    <Field.Label>Seats</Field.Label>
                    <NumberField.Root
                        name="seats"
                        defaultValue={5}
                        min={1}
                        max={50}
                    >
                        <NumberField.Group>
                            <NumberField.Decrement />
                            <Field.Body>
                                <NumberField.Input />
                            </Field.Body>
                            <NumberField.Increment />
                        </NumberField.Group>
                    </NumberField.Root>
                    <Field.Description>
                        One per person who signs in, up to 50.
                    </Field.Description>
                </Field.Root>

                <Field.Root>
                    <NumberField.Root
                        name="discount"
                        defaultValue={0.15}
                        min={0}
                        max={1}
                        step={0.01}
                        format={{ style: "percent" }}
                        allowWheelScrub
                    >
                        <NumberField.ScrubArea>
                            <Field.Label>Discount</Field.Label>
                            <NumberField.ScrubAreaCursor />
                        </NumberField.ScrubArea>
                        <NumberField.Group>
                            <Field.Body>
                                <NumberField.Input />
                            </Field.Body>
                            <NumberField.Decrement side="inline-end" />
                            <NumberField.Increment />
                        </NumberField.Group>
                    </NumberField.Root>
                </Field.Root>
            </form>

            <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-palette-accent/85">
                    states
                </span>
                <Field.Root className="max-w-sm" disabled>
                    <Field.Label>Licences</Field.Label>
                    <NumberField.Root defaultValue={12} disabled>
                        <NumberField.Group>
                            <NumberField.Decrement />
                            <Field.Body>
                                <NumberField.Input />
                            </Field.Body>
                            <NumberField.Increment />
                        </NumberField.Group>
                    </NumberField.Root>
                </Field.Root>
            </div>
        </div>
    );
}

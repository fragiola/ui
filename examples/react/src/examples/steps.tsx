"use client";

import { useState } from "react";
import { Input } from "#/components/atoms/fields";
import { Field } from "#/components/ui/field";
import { Steps } from "#/components/ui/steps";

// A workspace setup in three steps, linear: the next step opens only once
// the current one is valid (a workspace name). The list shows each step
// complete, current or to come; Back and Next move, and the steps already
// reached can be pressed. Then the same steps vertical.
export default function StepsDemo() {
    const [name, setName] = useState("");
    const steps = [
        {
            title: "Workspace",
            description: "Name it",
            content: (
                <Field.Root className="max-w-xs">
                    <Field.Label>Workspace name</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                placeholder="Acme"
                            />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>
            ),
        },
        {
            title: "Team",
            description: "Invite people",
            content: (
                <p className="text-sm text-palette-accent/85">
                    Invite your team by email, or skip and do it later.
                </p>
            ),
        },
        {
            title: "Plan",
            description: "Choose a plan",
            content: (
                <p className="text-sm text-palette-accent/85">
                    Start on the free plan; upgrade at any time.
                </p>
            ),
        },
    ];
    return (
        <div className="palette-surface flex w-full flex-col gap-10 bg-palette-base text-palette-contrast">
            <Steps.Template.Simple
                aria-label="Workspace setup"
                steps={steps}
                linear
                isStepValid={(index: number) =>
                    index !== 0 || name.trim() !== ""
                }
                completed={
                    <p className="text-sm">
                        All set: {name || "your workspace"} is ready.
                    </p>
                }
            />

            <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-palette-accent/85">
                    vertical
                </span>
                <Steps.Root count={3} defaultStep={1} orientation="vertical">
                    <Steps.List aria-label="Order">
                        {["Ordered", "Shipped", "Delivered"].map(
                            (title, index) => (
                                <Steps.Item key={title} index={index}>
                                    <Steps.Trigger>
                                        <Steps.Indicator />
                                        <Steps.Text>
                                            <Steps.Title>{title}</Steps.Title>
                                        </Steps.Text>
                                    </Steps.Trigger>
                                    {index < 2 ? <Steps.Separator /> : null}
                                </Steps.Item>
                            ),
                        )}
                    </Steps.List>
                </Steps.Root>
            </div>
        </div>
    );
}

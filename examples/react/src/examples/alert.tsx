import { CircleAlertIcon, InfoIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Clickable } from "#/components/atoms/clickable";
import { Alert } from "#/components/ui/alert";

// The chromatic palettes. Literal here because examples are published source
// (the code panel shows this file verbatim, with a copy button).
const CHROMATIC = [
    "blue",
    "purple",
    "green",
    "orange",
    "rose",
    "danger",
] as const;

// A workspace's settings page, in the default look: a notice that the trial
// is ending, with its actions, and a plain one-line note without an icon.
// An alert is the control box: a line stroke on the floor, its text in
// accent. Last, the same alert in each chromatic palette: the colour is the
// palette class on Alert.Root (a red stroke with red text under
// palette-danger, never a red block), there is no colour variant.
export default function AlertDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex max-w-xl flex-col gap-4">
                <Alert.Root>
                    <Alert.Icon>
                        <InfoIcon />
                    </Alert.Icon>
                    <Alert.Title>Your trial ends in 3 days</Alert.Title>
                    <Alert.Description>
                        Add a payment method to keep your projects, members and
                        history after December 1.
                    </Alert.Description>
                    <Alert.Actions>
                        <Clickable.Button size="sm" className="palette-neutral">
                            Add payment method
                        </Clickable.Button>
                        <Clickable.Button size="sm" variant="ghost">
                            Compare plans
                        </Clickable.Button>
                    </Alert.Actions>
                </Alert.Root>

                <Alert.Root>
                    <Alert.Description>
                        Changes to these settings apply to every member of the
                        workspace.
                    </Alert.Description>
                </Alert.Root>
            </div>

            {/* the same alert, only its palette-* class changed */}
            <Row label="palettes">
                {CHROMATIC.map((palette) => (
                    <Alert.Root key={palette} className={`palette-${palette}`}>
                        <Alert.Icon>
                            <CircleAlertIcon />
                        </Alert.Icon>
                        <Alert.Title>{palette}</Alert.Title>
                    </Alert.Root>
                ))}
            </Row>
        </div>
    );
}

// Row — a captioned row. The caption is a <span>, not a heading.
function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-palette-accent/85">
                {label}
            </span>
            <div className="grid max-w-xl gap-2 sm:grid-cols-2">{children}</div>
        </div>
    );
}

import { LockIcon, MailIcon, TriangleAlertIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Clickable } from "#/components/atoms/clickable";
import { Input, Textarea } from "#/components/atoms/fields";
import { Checkbox } from "#/components/ui/checkbox";
import { Combobox } from "#/components/ui/combobox";
import { Field } from "#/components/ui/field";
import { Radio, RadioGroup } from "#/components/ui/radio";
import { Select } from "#/components/ui/select";
import { Slider } from "#/components/ui/slider";
import { Switch } from "#/components/ui/switch";
import { Card, Line, useTone } from "../card";

// Forms: fields, selects, choices and sliders as an app lays them out. The
// controls carry the design's surface twin (`control`), the primary action
// its solid palette (`action`).

function Close() {
    return (
        <Clickable.Button
            variant="icon"
            shape="square"
            size="sm"
            aria-label="Close"
        >
            <XIcon />
        </Clickable.Button>
    );
}

function Choose({
    label,
    items,
    value,
}: {
    label: string;
    items: string[];
    value: string;
}) {
    return (
        <Field.Root>
            <Field.Label>{label}</Field.Label>
            <Select.Root defaultValue={value}>
                <Select.Trigger>
                    <Select.Value />
                </Select.Trigger>
                <Select.Content>
                    {items.map((item) => (
                        <Select.Item key={item} value={item}>
                            {item}
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Root>
        </Field.Root>
    );
}

function Text({
    label,
    value,
    placeholder,
    type,
}: {
    label: string;
    value?: string;
    placeholder?: string;
    type?: string;
}) {
    return (
        <Field.Root>
            <Field.Label>{label}</Field.Label>
            <Field.Row>
                <Field.Body>
                    <Input
                        type={type}
                        defaultValue={value}
                        placeholder={placeholder}
                    />
                </Field.Body>
            </Field.Row>
        </Field.Root>
    );
}

export function PayoutThreshold() {
    const { action, control } = useTone();
    const [amount, setAmount] = useState(2500);
    return (
        <Card
            title="Payout threshold"
            description="The minimum balance before a payout is triggered."
            action={<Close />}
            footer={
                <Clickable.Button className={`${action} w-full`} size="sm">
                    Save threshold
                </Clickable.Button>
            }
        >
            <div className={`${control} flex flex-col gap-4`}>
                <Choose
                    label="Preferred currency"
                    value="USD — United States Dollar"
                    items={[
                        "USD — United States Dollar",
                        "EUR — Euro",
                        "BRL — Brazilian Real",
                    ]}
                />
                <Slider.Root
                    min={50}
                    max={10000}
                    step={50}
                    value={amount}
                    onValueChange={(v) =>
                        setAmount(Array.isArray(v) ? (v[0] ?? 0) : v)
                    }
                    aria-label="Minimum payout amount"
                >
                    <div className="flex items-end justify-between">
                        <span className="text-sm font-medium">
                            Minimum payout
                        </span>
                        <span className="text-xl font-semibold tabular-nums">
                            ${amount.toLocaleString("en-US")}.00
                        </span>
                    </div>
                    <Slider.Control>
                        <Slider.Track>
                            <Slider.Indicator />
                            <Slider.Thumb />
                        </Slider.Track>
                    </Slider.Control>
                    <div className="flex justify-between text-xs text-palette-accent/85">
                        <span>$50 (min)</span>
                        <span>$10,000 (max)</span>
                    </div>
                </Slider.Root>
                <Field.Root>
                    <Field.Label>Notes</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Textarea
                                rows={3}
                                placeholder="Add any notes for this payout configuration…"
                            />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>
            </div>
        </Card>
    );
}

export function BuyInvestment() {
    const { action, control } = useTone();
    return (
        <Card
            title="Buy investment"
            footer={
                <Clickable.Button className={`${action} w-full`} size="sm">
                    Review order
                </Clickable.Button>
            }
        >
            <div className={`${control} flex flex-col gap-4`}>
                <Field.Root>
                    <Field.Label>Amount to invest</Field.Label>
                    <Field.Row>
                        <Field.Addon side="inline-start">$</Field.Addon>
                        <Field.Body>
                            <Input
                                defaultValue="1,000.00"
                                inputMode="decimal"
                            />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>
                <Choose
                    label="Order type"
                    value="Market order"
                    items={["Market order", "Limit order", "Stop order"]}
                />
                <p className="text-xs text-palette-accent/85">
                    Market orders execute at the current price.
                </p>
                <Line label="Estimated shares" value="1.95" />
                <Line label="Buying power" value="$12,450.00" />
            </div>
        </Card>
    );
}

export function AccountAccess() {
    const { action, control } = useTone();
    return (
        <Card
            title="Account access"
            description="Update your credentials or re-authenticate."
        >
            <div className={`${control} flex flex-col gap-4`}>
                <Text
                    label="Email address"
                    value="artist@studio.inc"
                    type="email"
                />
                <Text
                    label="Current password"
                    value="correct-horse"
                    type="password"
                />
                <Clickable.Button className={action} size="sm">
                    <LockIcon />
                    Update security
                </Clickable.Button>
                <div className="palette-danger flex items-center gap-3 rounded-md border border-palette-line p-3">
                    <TriangleAlertIcon className="size-icon shrink-0 text-palette-accent" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-palette-accent">
                            Danger zone
                        </span>
                        <span className="text-xs text-palette-accent/85">
                            Archive account and remove catalog
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export function ReceivingMethod() {
    const { action, control } = useTone();
    const methods = [
        ["bank", "Bank transfer", "SWIFT / IBAN"],
        ["paypal", "PayPal", "Instant payout"],
    ] as const;
    return (
        <Card
            title="Receiving method"
            description="Payout preferences"
            footer={
                <Clickable.Button className={`${action} w-full`} size="sm">
                    Save payout settings
                </Clickable.Button>
            }
        >
            <div className={`${control} flex flex-col gap-4`}>
                <Text
                    label="Account holder name"
                    value="Synthetic Horizons Music LLC"
                />
                <RadioGroup
                    defaultValue="bank"
                    className="grid grid-cols-2 gap-2"
                >
                    {methods.map(([value, label, hint]) => (
                        <label
                            key={value}
                            htmlFor={`method-${value}`}
                            className="flex cursor-pointer items-start gap-2 rounded-md border border-palette-line p-3 has-data-checked:bg-palette-soft"
                        >
                            <Radio.Root value={value} id={`method-${value}`}>
                                <Radio.Indicator />
                            </Radio.Root>
                            <span className="flex flex-col">
                                <span className="text-sm font-medium">
                                    {label}
                                </span>
                                <span className="text-xs text-palette-accent/85">
                                    {hint}
                                </span>
                            </span>
                        </label>
                    ))}
                </RadioGroup>
                <Text
                    label="IBAN / account number"
                    value="DE89 3704 0044 0532 0130 00"
                />
            </div>
        </Card>
    );
}

export function TransferFunds() {
    const { action, control } = useTone();
    return (
        <Card
            title="Transfer funds"
            description="Move money between your connected accounts."
            action={<Close />}
            footer={
                <Clickable.Button className={`${action} w-full`} size="sm">
                    Confirm transfer
                </Clickable.Button>
            }
        >
            <div className={`${control} flex flex-col gap-4`}>
                <Field.Root>
                    <Field.Label>Amount to transfer</Field.Label>
                    <Field.Row>
                        <Field.Addon side="inline-start">$</Field.Addon>
                        <Field.Body>
                            <Input defaultValue="1,200.00" />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>
                <Choose
                    label="From account"
                    value="Main checking (··8402)"
                    items={["Main checking (··8402)", "Joint account (··1120)"]}
                />
                <Choose
                    label="To account"
                    value="High-yield savings (··1192)"
                    items={[
                        "High-yield savings (··1192)",
                        "Brokerage (··5521)",
                    ]}
                />
                <div className="flex flex-col gap-2 rounded-md bg-palette-soft p-3">
                    <Line label="Estimated arrival" value="Today" />
                    <Line label="Transaction fee" value="$0.00" />
                    <Line label="Total" value="$1,200.00" />
                </div>
            </div>
        </Card>
    );
}

export function Preferences() {
    const { action, control } = useTone();
    const toggles = [
        [
            "stats",
            "Public statistics",
            "Let others see your total stream count.",
            true,
        ],
        [
            "email",
            "Email notifications",
            "Monthly royalty reports and updates.",
            true,
        ],
        ["beta", "Beta features", "Try new tools before everyone else.", false],
    ] as const;
    return (
        <Card
            title="Preferences"
            description="Manage your account settings and notifications."
            action={<Close />}
            footer={
                <>
                    <Clickable.Button variant="outline" size="sm">
                        Reset
                    </Clickable.Button>
                    <Clickable.Button className={`${action} ms-auto`} size="sm">
                        Save preferences
                    </Clickable.Button>
                </>
            }
        >
            <div className={`${control} flex flex-col gap-4`}>
                <Choose
                    label="Default currency"
                    value="USD — United States Dollar"
                    items={["USD — United States Dollar", "EUR — Euro"]}
                />
                {toggles.map(([id, label, hint, on]) => (
                    <div
                        key={id}
                        className="flex items-start justify-between gap-4"
                    >
                        <div className="flex flex-col">
                            <label
                                htmlFor={`pref-${id}`}
                                className="text-sm font-medium"
                            >
                                {label}
                            </label>
                            <span className="text-xs text-palette-accent/85">
                                {hint}
                            </span>
                        </div>
                        <Switch.Root id={`pref-${id}`} defaultChecked={on}>
                            <Switch.Thumb />
                        </Switch.Root>
                    </div>
                ))}
            </div>
        </Card>
    );
}

export function SignUp() {
    const { action, control } = useTone();
    return (
        <Card
            title="Create an account"
            description="Start your 14-day trial. No card needed."
        >
            <div className={`${control} flex flex-col gap-4`}>
                <div className="grid grid-cols-2 gap-3">
                    <Text label="First name" placeholder="Ada" />
                    <Text label="Last name" placeholder="Lovelace" />
                </div>
                <Text
                    label="Email"
                    placeholder="ada@example.com"
                    type="email"
                />
                <Field.Root>
                    <Field.Label>Password</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input
                                type="password"
                                placeholder="At least 8 characters"
                            />
                        </Field.Body>
                    </Field.Row>
                    <Field.Description>
                        Use a mix of letters and numbers.
                    </Field.Description>
                </Field.Root>
                <Field.ChoiceRoot>
                    <Checkbox.Root id="signup-terms" defaultChecked>
                        <Checkbox.Indicator />
                    </Checkbox.Root>
                    <Field.Label htmlFor="signup-terms">
                        I agree to the terms
                    </Field.Label>
                </Field.ChoiceRoot>
                <Clickable.Button className={action}>
                    Create account
                </Clickable.Button>
                <Clickable.Button variant="outline">
                    <MailIcon />
                    Continue with email link
                </Clickable.Button>
            </div>
        </Card>
    );
}

const PEOPLE = [
    "Ada Lovelace",
    "Alan Turing",
    "Grace Hopper",
    "Katherine Johnson",
    "Linus Torvalds",
];

export function InviteTeam() {
    const { action, control } = useTone();
    return (
        <Card
            title="Invite your team"
            description="Members get access to every project."
        >
            <div className={`${control} flex flex-col gap-4`}>
                <Field.Root>
                    <Field.Label>People</Field.Label>
                    <Combobox.Root items={PEOPLE}>
                        <Combobox.InputGroup>
                            <Combobox.Input placeholder="Search people…" />
                            <Combobox.Trigger />
                        </Combobox.InputGroup>
                        <Combobox.Content>
                            <Combobox.List>
                                {(item: string) => (
                                    <Combobox.Item key={item} value={item}>
                                        {item}
                                    </Combobox.Item>
                                )}
                            </Combobox.List>
                            <Combobox.Empty>No one found.</Combobox.Empty>
                        </Combobox.Content>
                    </Combobox.Root>
                </Field.Root>
                <Choose
                    label="Role"
                    value="Editor"
                    items={["Viewer", "Editor", "Admin"]}
                />
                <Clickable.Button className={action}>
                    Send invites
                </Clickable.Button>
            </div>
        </Card>
    );
}

export function ContactForm() {
    const { action, control } = useTone();
    return (
        <Card
            title="Contact sales"
            description="We reply within one business day."
        >
            <div className={`${control} flex flex-col gap-4`}>
                <Text
                    label="Work email"
                    placeholder="you@company.com"
                    type="email"
                />
                <Choose
                    label="Company size"
                    value="11–50"
                    items={["1–10", "11–50", "51–200", "200+"]}
                />
                <Field.Root>
                    <Field.Label>How can we help?</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Textarea
                                rows={3}
                                placeholder="Tell us about your project"
                            />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>
                <Clickable.Button className={action}>
                    Send message
                </Clickable.Button>
            </div>
        </Card>
    );
}

export function FeedbackForm() {
    const { action, control } = useTone();
    return (
        <Card
            title="Send feedback"
            description="How was your experience today?"
        >
            <div className={`${control} flex flex-col gap-4`}>
                <RadioGroup
                    defaultValue="good"
                    className="flex-row flex-wrap gap-4"
                >
                    {["Great", "Good", "Okay", "Bad"].map((label) => (
                        <Field.ChoiceRoot key={label} className="w-auto">
                            <Radio.Root
                                value={label.toLowerCase()}
                                id={`feedback-${label}`}
                            >
                                <Radio.Indicator />
                            </Radio.Root>
                            <Field.Label htmlFor={`feedback-${label}`}>
                                {label}
                            </Field.Label>
                        </Field.ChoiceRoot>
                    ))}
                </RadioGroup>
                <Field.Root>
                    <Field.Label>Anything else?</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Textarea rows={3} placeholder="Optional" />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>
                <Clickable.Button className={action} size="sm">
                    Submit
                </Clickable.Button>
            </div>
        </Card>
    );
}

export function ReportBug() {
    const { action, control } = useTone();
    return (
        <Card title="Report a bug" description="What went wrong?">
            <div className={`${control} flex flex-col gap-4`}>
                <Text label="Title" placeholder="Short summary" />
                <div className="grid grid-cols-2 gap-3">
                    <Choose
                        label="Area"
                        value="Billing"
                        items={["Billing", "Editor", "Exports"]}
                    />
                    <Choose
                        label="Severity"
                        value="Major"
                        items={["Minor", "Major", "Critical"]}
                    />
                </div>
                <Field.Root invalid>
                    <Field.Label>Steps to reproduce</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Textarea rows={2} defaultValue="It crashed" />
                        </Field.Body>
                    </Field.Row>
                    <Field.Error match>Add at least three steps.</Field.Error>
                </Field.Root>
                <div className="flex justify-end gap-2">
                    <Clickable.Button variant="ghost" size="sm">
                        Cancel
                    </Clickable.Button>
                    <Clickable.Button className={action} size="sm">
                        Submit report
                    </Clickable.Button>
                </div>
            </div>
        </Card>
    );
}

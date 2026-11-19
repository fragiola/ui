import {
    CopyIcon,
    KeyRoundIcon,
    LaptopIcon,
    ShieldCheckIcon,
    SmartphoneIcon,
    StarIcon,
    TriangleAlertIcon,
    UploadIcon,
    Volume2Icon,
} from "lucide-react";
import { Badge } from "#/components/atoms/badge";
import { Clickable } from "#/components/atoms/clickable";
import { Input } from "#/components/atoms/fields";
import { Avatar } from "#/components/ui/avatar";
import { Checkbox } from "#/components/ui/checkbox";
import { Field } from "#/components/ui/field";
import { Progress } from "#/components/ui/progress";
import { Select } from "#/components/ui/select";
import { Separator } from "#/components/ui/separator";
import { Slider } from "#/components/ui/slider";
import { Switch } from "#/components/ui/switch";
import { Card, Line, PreviewChart, useTone } from "../card";

// Settings and everyday app surfaces: security, keys, sessions, region,
// orders, checklists, mixers, uploads, ratings, activity.

function Choose({
    label,
    value,
    items,
}: {
    label: string;
    value: string;
    items: string[];
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

export function TwoFactor() {
    const { action, control } = useTone();
    return (
        <Card
            title="Two-factor authentication"
            description="Enter the 6-digit code from your authenticator app."
            action={
                <ShieldCheckIcon className="size-icon text-palette-accent/85" />
            }
        >
            <div className={`${control} flex flex-col gap-4`}>
                <div className="flex gap-2">
                    {(["d1", "d2", "d3", "d4", "d5", "d6"] as const).map(
                        (slot, i) => (
                            <Field.Root key={slot} className="w-10">
                                <Field.Row>
                                    <Field.Body>
                                        <Input
                                            aria-label={`Digit ${i + 1}`}
                                            defaultValue={
                                                ["4", "8", "1"][i] ?? ""
                                            }
                                            maxLength={1}
                                            className="px-0 text-center font-mono"
                                        />
                                    </Field.Body>
                                </Field.Row>
                            </Field.Root>
                        ),
                    )}
                </div>
                <Field.ChoiceRoot>
                    <Checkbox.Root id="2fa-trust">
                        <Checkbox.Indicator />
                    </Checkbox.Root>
                    <Field.Label htmlFor="2fa-trust">
                        Trust this device for 30 days
                    </Field.Label>
                </Field.ChoiceRoot>
                <Clickable.Button className={action}>Verify</Clickable.Button>
            </div>
        </Card>
    );
}

export function ApiKeys() {
    const { action, control } = useTone();
    return (
        <Card
            title="API keys"
            description="Use these keys to authenticate requests."
            action={
                <Clickable.Button className={action} size="sm">
                    New key
                </Clickable.Button>
            }
        >
            {[
                ["Production", "sk_live_••••••••4f2a", "Last used 2h ago"],
                ["Staging", "sk_test_••••••••91cd", "Never used"],
            ].map(([name, key, used]) => (
                <div key={name} className={`${control} flex flex-col gap-1.5`}>
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium">
                            <KeyRoundIcon className="size-icon-sm" />
                            {name}
                        </span>
                        <span className="text-xs text-palette-accent/85">
                            {used}
                        </span>
                    </div>
                    <Field.Root>
                        <Field.Row>
                            <Field.Body>
                                <Input
                                    readOnly
                                    defaultValue={key}
                                    className="font-mono text-xs"
                                />
                            </Field.Body>
                            <Field.Addon side="inline-end">
                                <Clickable.Button
                                    variant="icon"
                                    shape="square"
                                    size="sm"
                                    aria-label="Copy key"
                                >
                                    <CopyIcon />
                                </Clickable.Button>
                            </Field.Addon>
                        </Field.Row>
                    </Field.Root>
                </div>
            ))}
        </Card>
    );
}

export function Sessions() {
    const sessions = [
        [LaptopIcon, "MacBook Pro · Lisbon", "This device", true],
        [SmartphoneIcon, "iPhone 16 · Lisbon", "2 hours ago", false],
        [LaptopIcon, "Windows · São Paulo", "3 days ago", false],
    ] as const;
    return (
        <Card
            title="Active sessions"
            description="Sign out of devices you do not recognise."
        >
            {sessions.map(([Icon, device, when, current]) => (
                <div key={device} className="flex items-center gap-3">
                    <Icon className="size-icon shrink-0" />
                    <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium">
                            {device}
                        </span>
                        <span className="text-xs text-palette-accent/85">
                            {when}
                        </span>
                    </span>
                    {current ? (
                        <Badge variant="soft" className="palette-green">
                            Current
                        </Badge>
                    ) : (
                        <Clickable.Button variant="ghost" size="sm">
                            Revoke
                        </Clickable.Button>
                    )}
                </div>
            ))}
        </Card>
    );
}

export function LanguageRegion() {
    const { action, control } = useTone();
    return (
        <Card
            title="Language & region"
            description="How dates, numbers and currency appear."
            footer={
                <Clickable.Button className={`${action} ms-auto`} size="sm">
                    Save
                </Clickable.Button>
            }
        >
            <div className={`${control} grid grid-cols-2 gap-3`}>
                <Choose
                    label="Language"
                    value="English"
                    items={["English", "Português", "Español"]}
                />
                <Choose
                    label="Region"
                    value="Portugal"
                    items={["Portugal", "Brasil", "United States"]}
                />
                <Choose
                    label="Time zone"
                    value="Lisbon (UTC+0)"
                    items={["Lisbon (UTC+0)", "São Paulo (UTC−3)"]}
                />
                <Choose
                    label="First day"
                    value="Monday"
                    items={["Monday", "Sunday"]}
                />
            </div>
        </Card>
    );
}

export function OrderSummary() {
    const { action } = useTone();
    return (
        <Card
            title="Order summary"
            footer={
                <Clickable.Button className={`${action} w-full`}>
                    Place order
                </Clickable.Button>
            }
        >
            {[
                ["Wireless headphones", "1 × $249.00"],
                ["USB-C cable", "2 × $19.00"],
            ].map(([item, price]) => (
                <Line key={item} label={item} value={price} />
            ))}
            <Separator />
            <Line label="Subtotal" value="$287.00" />
            <Line label="Shipping" value="Free" />
            <Line label="Tax" value="$22.96" />
            <Separator />
            <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span className="tabular-nums">$309.96</span>
            </div>
        </Card>
    );
}

export function ShippingAddress() {
    const { control } = useTone();
    const field = (label: string, value: string) => (
        <Field.Root>
            <Field.Label>{label}</Field.Label>
            <Field.Row>
                <Field.Body>
                    <Input defaultValue={value} />
                </Field.Body>
            </Field.Row>
        </Field.Root>
    );
    return (
        <Card title="Shipping address">
            <div className={`${control} flex flex-col gap-3`}>
                {field("Street", "Rua Augusta, 120")}
                <div className="grid grid-cols-2 gap-3">
                    {field("City", "Lisbon")}
                    {field("Postal code", "1100-053")}
                </div>
                <Choose
                    label="Country"
                    value="Portugal"
                    items={["Portugal", "Spain", "France"]}
                />
                <Field.ChoiceRoot>
                    <Checkbox.Root id="ship-billing" defaultChecked>
                        <Checkbox.Indicator />
                    </Checkbox.Root>
                    <Field.Label htmlFor="ship-billing">
                        Use as billing address
                    </Field.Label>
                </Field.ChoiceRoot>
            </div>
        </Card>
    );
}

export function DangerZone() {
    return (
        <Card
            title="Delete project"
            description="Removes every deployment and its data."
        >
            <div className="palette-danger flex items-start gap-3 rounded-md bg-palette-soft p-3">
                <TriangleAlertIcon className="mt-0.5 size-icon shrink-0 text-palette-accent" />
                <p className="text-xs text-palette-accent">
                    This cannot be undone. Export your data first.
                </p>
            </div>
            <Clickable.Button className="palette-danger">
                Delete project
            </Clickable.Button>
        </Card>
    );
}

export function Checklist() {
    const { control } = useTone();
    const steps = [
        ["profile", "Complete your profile", true],
        ["invite", "Invite a teammate", true],
        ["domain", "Connect a domain", false],
        ["deploy", "Ship your first deploy", false],
    ] as const;
    return (
        <Card title="Getting started" description="2 of 4 done">
            <div className={`${control} flex flex-col gap-3`}>
                {steps.map(([id, label, done]) => (
                    <Field.ChoiceRoot key={id}>
                        <Checkbox.Root id={`step-${id}`} defaultChecked={done}>
                            <Checkbox.Indicator />
                        </Checkbox.Root>
                        <Field.Label
                            htmlFor={`step-${id}`}
                            className={
                                done
                                    ? "text-palette-accent/85 line-through"
                                    : undefined
                            }
                        >
                            {label}
                        </Field.Label>
                    </Field.ChoiceRoot>
                ))}
            </div>
        </Card>
    );
}

export function Mixer() {
    const { control } = useTone();
    return (
        <Card
            title="Sound"
            action={
                <Volume2Icon className="size-icon text-palette-accent/85" />
            }
        >
            <div className={`${control} flex flex-col gap-4`}>
                {[
                    ["Master", 80],
                    ["Music", 62],
                    ["Voice", 90],
                    ["Effects", 35],
                ].map(([label, value]) => (
                    <Slider.Root
                        key={label as string}
                        defaultValue={value as number}
                        aria-label={label as string}
                    >
                        <div className="flex justify-between text-xs">
                            <span>{label}</span>
                            <span className="tabular-nums text-palette-accent/85">
                                {value}%
                            </span>
                        </div>
                        <Slider.Control>
                            <Slider.Track>
                                <Slider.Indicator />
                                <Slider.Thumb />
                            </Slider.Track>
                        </Slider.Control>
                    </Slider.Root>
                ))}
                <div className="flex items-center justify-between">
                    <label htmlFor="mixer-spatial" className="text-sm">
                        Spatial audio
                    </label>
                    <Switch.Root id="mixer-spatial">
                        <Switch.Thumb />
                    </Switch.Root>
                </div>
            </div>
        </Card>
    );
}

export function Uploads() {
    const { action } = useTone();
    const files = [
        ["master-final.wav", 100],
        ["cover-art.png", 72],
        ["lyrics.txt", 18],
    ] as const;
    return (
        <Card
            title="Uploads"
            action={<UploadIcon className="size-icon text-palette-accent/85" />}
        >
            {files.map(([name, percent]) => (
                <div key={name} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                        <span className="font-medium">{name}</span>
                        <span className="tabular-nums text-palette-accent/85">
                            {percent === 100 ? "Done" : `${percent}%`}
                        </span>
                    </div>
                    <Progress.Root
                        value={percent}
                        aria-label={name}
                        className={action}
                    >
                        <Progress.Track>
                            <Progress.Indicator />
                        </Progress.Track>
                    </Progress.Root>
                </div>
            ))}
        </Card>
    );
}

export function Ratings() {
    const { action } = useTone();
    const rows = [
        [5, 68],
        [4, 21],
        [3, 7],
        [2, 3],
        [1, 1],
    ] as const;
    return (
        <Card title="Reviews" description="4.6 out of 5 · 1,284 ratings">
            {rows.map(([stars, percent]) => (
                <div key={stars} className="flex items-center gap-3 text-xs">
                    <span className="flex w-8 items-center gap-1 tabular-nums">
                        {stars}
                        <StarIcon className="size-icon-xs" />
                    </span>
                    <Progress.Root
                        value={percent}
                        aria-label={`${stars} stars`}
                        className={`${action} flex-1`}
                    >
                        <Progress.Track>
                            <Progress.Indicator />
                        </Progress.Track>
                    </Progress.Root>
                    <span className="w-8 text-end tabular-nums text-palette-accent/85">
                        {percent}%
                    </span>
                </div>
            ))}
        </Card>
    );
}

export function ActivityFeed() {
    const items = [
        ["AL", "Ada", "deployed", "main → production", "2m"],
        ["GH", "Grace", "merged", "#412 Faster search", "18m"],
        ["AT", "Alan", "opened", "#415 Dark mode tweaks", "1h"],
        ["KJ", "Katherine", "commented on", "#409", "3h"],
    ] as const;
    return (
        <Card title="Activity" description="What your team did today.">
            <ol className="flex flex-col gap-4 border-s border-palette-line ps-4">
                {items.map(([initials, who, verb, what, when]) => (
                    <li key={what} className="relative flex items-start gap-3">
                        <span className="absolute -start-[21px] top-2 size-2 rounded-full bg-palette-line" />
                        <Avatar.Root className="size-7">
                            <Avatar.Fallback>{initials}</Avatar.Fallback>
                        </Avatar.Root>
                        <p className="flex-1 text-sm">
                            <span className="font-medium">{who}</span>{" "}
                            <span className="text-palette-accent/85">
                                {verb}
                            </span>{" "}
                            <span className="font-medium">{what}</span>
                        </p>
                        <span className="text-xs text-palette-accent/85">
                            {when}
                        </span>
                    </li>
                ))}
            </ol>
        </Card>
    );
}

export function WeeklyGoal() {
    const { action } = useTone();
    return (
        <Card
            title="Weekly goal"
            description="Active minutes"
            action={
                <Badge variant="soft" className={action}>
                    On track
                </Badge>
            }
        >
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-semibold tabular-nums">214</span>
                <span className="text-sm text-palette-accent/85">
                    / 300 min
                </span>
            </div>
            <PreviewChart
                className={`${action} h-28`}
                categories={["M", "T", "W", "T", "F", "S", "S"]}
                option={{
                    grid: { left: 0, right: 0, top: 4, bottom: 20 },
                    yAxis: { show: false },
                    series: [
                        {
                            type: "line",
                            smooth: true,
                            areaStyle: { opacity: 0.2 },
                            data: [30, 42, 18, 55, 40, 29, 0],
                        },
                    ],
                }}
            />
        </Card>
    );
}

export function Webhooks() {
    const hooks = [
        ["invoice.paid", "Delivered", "palette-green"],
        ["customer.created", "Delivered", "palette-green"],
        ["payout.failed", "Retrying", "palette-orange"],
        ["dispute.opened", "Failed", "palette-danger"],
    ] as const;
    return (
        <Card title="Webhooks" description="Last delivery of each event.">
            {hooks.map(([event, status, palette]) => (
                <div
                    key={event}
                    className="flex items-center justify-between gap-3"
                >
                    <code className="truncate font-mono text-xs">{event}</code>
                    <Badge variant="soft" className={palette}>
                        {status}
                    </Badge>
                </div>
            ))}
        </Card>
    );
}

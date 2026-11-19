import {
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PauseIcon,
    SkipBackIcon,
    SkipForwardIcon,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "#/components/atoms/badge";
import { Clickable } from "#/components/atoms/clickable";
import { Text } from "#/components/atoms/text";
import { foundation } from "#/components/families/foundation";
import { Avatar } from "#/components/ui/avatar";
import { Separator } from "#/components/ui/separator";
import { Slider } from "#/components/ui/slider";
import { Switch } from "#/components/ui/switch";
import { Card, Line, useTone } from "../card";

// The rest of an app: a calendar composed from buttons (the registry has no
// Calendar), notifications, pricing, shortcuts, type, code, badges, people.

export function UpcomingPayments() {
    const { action } = useTone();
    const [day, setDay] = useState(19);
    const days = Array.from({ length: 35 }, (_, i) => i - 5);
    return (
        <Card
            title="Upcoming payments"
            description="Select a date to view scheduled payments."
        >
            <div className="flex items-center justify-between">
                <Clickable.Button
                    variant="icon"
                    shape="square"
                    size="sm"
                    aria-label="Previous month"
                >
                    <ChevronLeftIcon className="rtl:-scale-x-100" />
                </Clickable.Button>
                <span className="text-sm font-medium">November 2026</span>
                <Clickable.Button
                    variant="icon"
                    shape="square"
                    size="sm"
                    aria-label="Next month"
                >
                    <ChevronRightIcon className="rtl:-scale-x-100" />
                </Clickable.Button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <span key={d} className="py-1 text-palette-accent/85">
                        {d}
                    </span>
                ))}
                {days.map((d) =>
                    d < 1 || d > 30 ? (
                        <span key={d} />
                    ) : (
                        <button
                            key={d}
                            type="button"
                            aria-pressed={d === day}
                            onClick={() => setDay(d)}
                            className={`${foundation.hover()} ${foundation.focus()} aspect-square rounded-md tabular-nums ${d === day ? `${action} bg-palette-base text-palette-contrast hover:bg-palette-base` : ""}`}
                        >
                            {d}
                        </button>
                    ),
                )}
            </div>
            <div className="flex items-center justify-between rounded-md bg-palette-soft px-3 py-2">
                <span className="flex flex-col">
                    <span className="text-sm font-medium">
                        Netflix subscription
                    </span>
                    <span className="text-xs text-palette-accent/85">
                        Nov {day}, 2026
                    </span>
                </span>
                <span className="text-sm font-semibold tabular-nums">
                    $19.99
                </span>
            </div>
        </Card>
    );
}

export function Notifications() {
    const { control } = useTone();
    const items = [
        ["GH", "Grace Hopper", "commented on Invoice INV-1043", "2m"],
        ["AT", "Alan Turing", "approved your expense report", "1h"],
        ["KJ", "Katherine Johnson", "invited you to Q3 planning", "3h"],
    ] as const;
    return (
        <Card
            title="Notifications"
            description="You have 3 unread messages."
            action={
                <Clickable.Button variant="ghost" size="sm">
                    Mark all read
                </Clickable.Button>
            }
        >
            {items.map(([initials, name, what, when]) => (
                <div key={name} className="flex items-start gap-3">
                    <Avatar.Root className="size-8">
                        <Avatar.Fallback>{initials}</Avatar.Fallback>
                    </Avatar.Root>
                    <p className="flex-1 text-sm">
                        <span className="font-medium">{name}</span>{" "}
                        <span className="text-palette-accent/85">{what}</span>
                    </p>
                    <span className="text-xs text-palette-accent/85">
                        {when}
                    </span>
                </div>
            ))}
            <Separator />
            <div className={`${control} flex items-center justify-between`}>
                <label htmlFor="notify-push" className="text-sm">
                    Push notifications
                </label>
                <Switch.Root id="notify-push" defaultChecked>
                    <Switch.Thumb />
                </Switch.Root>
            </div>
        </Card>
    );
}

export function Pricing() {
    const { action } = useTone();
    return (
        <Card
            title="Pro"
            description="For growing teams"
            action={
                <Badge variant="solid" className={action}>
                    Popular
                </Badge>
            }
            footer={
                <Clickable.Button className={`${action} w-full`}>
                    Upgrade to Pro
                </Clickable.Button>
            }
        >
            <div className="flex items-baseline gap-1">
                <span className="text-4xl font-semibold tabular-nums">$24</span>
                <span className="text-sm text-palette-accent/85">
                    / seat / month
                </span>
            </div>
            <ul className="flex flex-col gap-2 text-sm">
                {[
                    "Unlimited projects",
                    "Advanced analytics",
                    "Priority support",
                    "SSO and audit log",
                ].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                        <CheckIcon className="size-icon-sm" />
                        {f}
                    </li>
                ))}
            </ul>
        </Card>
    );
}

export function Shortcuts() {
    const keys = [
        ["Search", ["⌘", "K"]],
        ["New invoice", ["⌘", "N"]],
        ["Toggle sidebar", ["⌘", "B"]],
        ["Randomize theme", ["R"]],
    ] as const;
    return (
        <Card title="Keyboard shortcuts">
            {keys.map(([label, combo]) => (
                <div
                    key={label}
                    className="flex items-center justify-between text-sm"
                >
                    <span>{label}</span>
                    <span className="flex gap-1">
                        {combo.map((k) => (
                            <kbd
                                key={k}
                                className="min-w-6 rounded-sm border border-palette-line bg-palette-soft px-1.5 py-0.5 text-center font-mono text-xs"
                            >
                                {k}
                            </kbd>
                        ))}
                    </span>
                </div>
            ))}
        </Card>
    );
}

export function TypeSpecimen() {
    return (
        <Card title="Typography">
            <Text.Heading as="h1">Heading one</Text.Heading>
            <Text.Heading as="h2">Heading two</Text.Heading>
            <Text.Heading as="h3">Heading three</Text.Heading>
            <Text.Paragraph>
                Body text reads at the typography axis' scale. A{" "}
                <Text.Link href="#">link</Text.Link> is underlined, and{" "}
                <Text.Strong>strong text</Text.Strong> stands out.
            </Text.Paragraph>
            <p className="text-sm text-palette-accent/85">
                Secondary text, for what supports it.
            </p>
        </Card>
    );
}

export function CodeSnippet() {
    return (
        <Card title="Install" description="One command per component.">
            <pre className="overflow-x-auto rounded-md bg-palette-soft p-3 font-mono text-xs leading-relaxed text-palette-accent">
                <code>{`npx shadcn@latest add @fragiola/dialog

import { Dialog } from "@/components/ui/dialog";`}</code>
            </pre>
        </Card>
    );
}

export function BadgeShelf() {
    const { action } = useTone();
    return (
        <Card title="Badges" description="Soft, solid, outline — any palette.">
            <div className="flex flex-wrap gap-2">
                <Badge className={action}>Brand</Badge>
                <Badge variant="solid" className={action}>
                    Brand
                </Badge>
                <Badge variant="outline" className={action}>
                    Brand
                </Badge>
                <Badge>Neutral</Badge>
                <Badge className="palette-green">Active</Badge>
                <Badge className="palette-orange">Pending</Badge>
                <Badge className="palette-danger">Failed</Badge>
                <Badge variant="outline">Draft</Badge>
            </div>
        </Card>
    );
}

export function AvatarStack() {
    const { action } = useTone();
    return (
        <Card title="Design review" description="Thursday, 2:00 PM · 6 people">
            <div className="flex -space-x-2 rtl:space-x-reverse">
                {["AL", "GH", "AT", "KJ", "LT"].map((i) => (
                    <Avatar.Root key={i} className="ring-2 ring-palette-base">
                        <Avatar.Fallback>{i}</Avatar.Fallback>
                    </Avatar.Root>
                ))}
                <Avatar.Root className="ring-2 ring-palette-base">
                    <Avatar.Fallback>+1</Avatar.Fallback>
                </Avatar.Root>
            </div>
            <div className="flex gap-2">
                <Clickable.Button className={action} size="sm">
                    Join
                </Clickable.Button>
                <Clickable.Button variant="outline" size="sm">
                    Decline
                </Clickable.Button>
            </div>
        </Card>
    );
}

export function CookieConsent() {
    const { action, control } = useTone();
    return (
        <Card
            title="Cookies"
            description="We use cookies to improve your experience."
        >
            <div className={`${control} flex flex-col gap-3`}>
                {[
                    ["necessary", "Strictly necessary", true],
                    ["analytics", "Analytics", false],
                ].map(([id, label, on]) => (
                    <div
                        key={id as string}
                        className="flex items-center justify-between"
                    >
                        <label htmlFor={`cookie-${id}`} className="text-sm">
                            {label}
                        </label>
                        <Switch.Root
                            id={`cookie-${id}`}
                            defaultChecked={on as boolean}
                            disabled={id === "necessary"}
                        >
                            <Switch.Thumb />
                        </Switch.Root>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <Clickable.Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                >
                    Reject all
                </Clickable.Button>
                <Clickable.Button className={`${action} flex-1`} size="sm">
                    Accept all
                </Clickable.Button>
            </div>
        </Card>
    );
}

export function NowPlaying() {
    const { action } = useTone();
    return (
        <Card>
            <div className="flex items-center gap-3">
                <div
                    className={`${action} size-14 shrink-0 rounded-md bg-palette-base`}
                />
                <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-semibold">
                        Synthetic Horizons
                    </span>
                    <span className="text-xs text-palette-accent/85">
                        Night Drive · 2026
                    </span>
                </div>
            </div>
            <Slider.Root
                defaultValue={38}
                aria-label="Position"
                className={action}
            >
                <Slider.Control>
                    <Slider.Track>
                        <Slider.Indicator />
                        <Slider.Thumb />
                    </Slider.Track>
                </Slider.Control>
            </Slider.Root>
            <div className="flex items-center justify-center gap-2">
                <Clickable.Button
                    variant="icon"
                    shape="square"
                    aria-label="Previous"
                >
                    <SkipBackIcon className="rtl:-scale-x-100" />
                </Clickable.Button>
                <Clickable.Button
                    className={action}
                    shape="square"
                    aria-label="Pause"
                >
                    <PauseIcon />
                </Clickable.Button>
                <Clickable.Button
                    variant="icon"
                    shape="square"
                    aria-label="Next"
                >
                    <SkipForwardIcon className="rtl:-scale-x-100" />
                </Clickable.Button>
            </div>
            <Line label="Up next" value="Neon Rain" />
        </Card>
    );
}

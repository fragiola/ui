"use client";

import { MailIcon, TrendingUpIcon, UserPlusIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "#/components/atoms/badge";
import { Clickable } from "#/components/atoms/clickable";
import { Input } from "#/components/atoms/fields";
import { Text } from "#/components/atoms/text";
import { foundation } from "#/components/families/foundation";
import { Avatar } from "#/components/ui/avatar";
import { Chart } from "#/components/ui/chart";
import { Checkbox } from "#/components/ui/checkbox";
import { Dialog } from "#/components/ui/dialog";
import { Field } from "#/components/ui/field";
import { Progress } from "#/components/ui/progress";
import { Select } from "#/components/ui/select";
import { Slider } from "#/components/ui/slider";
import { Switch } from "#/components/ui/switch";
import { Tabs } from "#/components/ui/tabs";

// The registry at a glance: an app's cards drawn with real components, the
// way the Create page's preview composes them, in its first design. Two
// classes do all the colouring — `palette-blue` on the solid things (the
// primary button, the chart, the badge, the progress bar) and its surface
// twin `palette-surface-blue` on the controls (their focus ring and "on"
// state). Everything else takes the neutral floor.
//
// The cards fill three columns on a wide frame and stack on a narrow one.
// "Invite" opens a Dialog, which covers the page on fragiola.com.

const ACTION = "palette-blue";
const CONTROL = "palette-surface-blue";

const PLANS = ["Starter", "Team", "Enterprise"];
const MONTHS = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];
const TEAM = [
    { initials: "AL", name: "Ada Lovelace", role: "Owner" },
    { initials: "GH", name: "Grace Hopper", role: "Editor" },
    { initials: "AT", name: "Alan Turing", role: "Viewer" },
];

export default function ComponentShowcase() {
    return (
        <div className="palette-surface grid w-full gap-4 bg-palette-base text-palette-contrast sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-4">
                <SignUp />
                <Notifications />
            </div>
            <div className="flex flex-col gap-4">
                <Revenue />
                <Storage />
            </div>
            <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
                <Team />
                <Budget />
            </div>
        </div>
    );
}

function Card({
    title,
    description,
    action,
    footer,
    children,
}: {
    title: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
    footer?: ReactNode;
    children: ReactNode;
}) {
    return (
        <section
            className={`${foundation.panel()} flex flex-col overflow-hidden shadow-sm`}
        >
            <header className="flex items-start justify-between gap-3 px-5 pt-5">
                <div className="flex min-w-0 flex-col gap-1">
                    <Text.Heading as="h3" className="text-sm">
                        {title}
                    </Text.Heading>
                    {description && (
                        <p className="text-xs text-palette-accent/85">
                            {description}
                        </p>
                    )}
                </div>
                {action}
            </header>
            <div className="flex flex-col gap-4 px-5 py-4">{children}</div>
            {footer && (
                <footer className="flex items-center gap-2 border-t border-palette-line px-5 py-3">
                    {footer}
                </footer>
            )}
        </section>
    );
}

function SignUp() {
    return (
        <Card
            title="Create an account"
            description="Start your 14-day trial."
            footer={
                <>
                    <Clickable.Button variant="outline" size="sm">
                        Sign in
                    </Clickable.Button>
                    <Clickable.Button size="sm" className={`${ACTION} ms-auto`}>
                        Get started
                    </Clickable.Button>
                </>
            }
        >
            <div className={`${CONTROL} flex flex-col gap-4`}>
                <Field.Root>
                    <Field.Label>Email</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Field.Inset>
                                <MailIcon className="size-4" />
                            </Field.Inset>
                            <Input type="email" placeholder="ada@example.com" />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>
                <Field.Root>
                    <Field.Label>Plan</Field.Label>
                    <Select.Root defaultValue="Team">
                        <Select.Trigger>
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                            {PLANS.map((plan) => (
                                <Select.Item key={plan} value={plan}>
                                    {plan}
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Root>
                </Field.Root>
                <Field.ChoiceRoot>
                    <Checkbox.Root id="showcase-terms" defaultChecked>
                        <Checkbox.Indicator />
                    </Checkbox.Root>
                    <Field.Label htmlFor="showcase-terms">
                        I agree to the terms
                    </Field.Label>
                </Field.ChoiceRoot>
            </div>
        </Card>
    );
}

function Notifications() {
    return (
        <Card title="Notifications">
            <div className={`${CONTROL} flex flex-col gap-3`}>
                {[
                    ["showcase-mentions", "Mentions", true],
                    ["showcase-digest", "Weekly digest", false],
                ].map(([id, label, on]) => (
                    <Field.ChoiceRoot
                        key={String(id)}
                        className="justify-between"
                    >
                        <Field.Label htmlFor={String(id)}>{label}</Field.Label>
                        <Switch.Root id={String(id)} defaultChecked={!!on}>
                            <Switch.Thumb />
                        </Switch.Root>
                    </Field.ChoiceRoot>
                ))}
            </div>
        </Card>
    );
}

function Revenue() {
    return (
        <Card
            title="Revenue"
            description="Net revenue, last 6 months"
            action={
                <Badge variant="soft" className={ACTION}>
                    <TrendingUpIcon />
                    18.2%
                </Badge>
            }
        >
            <Tabs.Root defaultValue="month" className={CONTROL}>
                <Tabs.List>
                    <Tabs.Tab value="month">Month</Tabs.Tab>
                    <Tabs.Tab value="quarter">Quarter</Tabs.Tab>
                    <Tabs.Tab value="year">Year</Tabs.Tab>
                    <Tabs.Indicator />
                </Tabs.List>
            </Tabs.Root>
            <div className="flex flex-col gap-0.5">
                <span className="text-xs text-palette-accent/85">
                    This month
                </span>
                <span className="text-2xl font-semibold tabular-nums">
                    $48,290
                </span>
            </div>
            <Chart
                className={`${ACTION} h-36`}
                categories={MONTHS}
                option={{
                    grid: { left: 0, right: 0, top: 8, bottom: 20 },
                    yAxis: { show: false },
                    series: [
                        {
                            type: "bar",
                            barWidth: "60%",
                            itemStyle: { borderRadius: 4 },
                            data: [31, 36, 34, 41, 40, 48],
                        },
                    ],
                }}
            />
        </Card>
    );
}

function Storage() {
    return (
        <Card title="Storage" description="6.4 of 10 GB used">
            <Progress.Root
                value={64}
                aria-label="Storage used"
                className={ACTION}
            >
                <Progress.Track>
                    <Progress.Indicator />
                </Progress.Track>
            </Progress.Root>
        </Card>
    );
}

function Budget() {
    return (
        <Card title="Monthly budget">
            <Slider.Root
                defaultValue={2400}
                min={0}
                max={5000}
                step={100}
                locale="en-US"
                format={{
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                }}
                className={CONTROL}
            >
                <div className="flex items-center justify-between">
                    <Slider.Label>Spend limit</Slider.Label>
                    <Slider.Value />
                </div>
                <Slider.Control>
                    <Slider.Track>
                        <Slider.Indicator />
                        <Slider.Thumb />
                    </Slider.Track>
                </Slider.Control>
            </Slider.Root>
        </Card>
    );
}

function Team() {
    return (
        <Card
            title="Team"
            description="Who can see this workspace."
            footer={<Invite />}
        >
            <ul className="flex flex-col gap-3">
                {TEAM.map((member) => (
                    <li key={member.name} className="flex items-center gap-3">
                        <Avatar.Root className="size-8">
                            <Avatar.Fallback>{member.initials}</Avatar.Fallback>
                        </Avatar.Root>
                        <span className="min-w-0 flex-1 truncate text-sm font-medium">
                            {member.name}
                        </span>
                        <Badge
                            variant={
                                member.role === "Owner" ? "solid" : "outline"
                            }
                            className={
                                member.role === "Owner" ? ACTION : undefined
                            }
                        >
                            {member.role}
                        </Badge>
                    </li>
                ))}
            </ul>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs text-palette-accent/85">
                    <span id="showcase-seats">Seats</span>
                    <span>3 of 5</span>
                </div>
                <Progress.Root
                    value={60}
                    aria-labelledby="showcase-seats"
                    className={ACTION}
                >
                    <Progress.Track>
                        <Progress.Indicator />
                    </Progress.Track>
                </Progress.Root>
            </div>
            <div className="flex flex-wrap gap-1.5">
                <Badge variant="soft">Design</Badge>
                <Badge variant="soft">Engineering</Badge>
                <Badge variant="soft" className="palette-green">
                    Active
                </Badge>
            </div>
        </Card>
    );
}

function Invite() {
    return (
        <Dialog.Root>
            <Dialog.Trigger
                render={
                    <Clickable.Button
                        size="sm"
                        className={`${ACTION} w-full`}
                    />
                }
            >
                <UserPlusIcon />
                Invite member
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>Invite a member</Dialog.Title>
                        <Dialog.Description>
                            They get an email with a link to join the workspace.
                        </Dialog.Description>
                    </Dialog.Header>
                    <Dialog.Body className={CONTROL}>
                        <Field.Root>
                            <Field.Label>Email</Field.Label>
                            <Field.Row>
                                <Field.Body>
                                    <Input
                                        type="email"
                                        placeholder="grace@example.com"
                                    />
                                </Field.Body>
                            </Field.Row>
                        </Field.Root>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.Close
                            render={<Clickable.Button variant="outline" />}
                        >
                            Cancel
                        </Dialog.Close>
                        <Dialog.Close
                            render={<Clickable.Button className={ACTION} />}
                        >
                            Send invite
                        </Dialog.Close>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

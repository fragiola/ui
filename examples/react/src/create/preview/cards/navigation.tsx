import {
    ArrowLeftRightIcon,
    BellIcon,
    CalendarClockIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    CreditCardIcon,
    FileTextIcon,
    GaugeIcon,
    LayoutDashboardIcon,
    LifeBuoyIcon,
    PaletteIcon,
    PieChartIcon,
    RepeatIcon,
    ShieldIcon,
    TargetIcon,
    TrendingUpIcon,
    UserIcon,
    WalletIcon,
} from "lucide-react";
import { Clickable } from "#/components/atoms/clickable";
import { foundation } from "#/components/families/foundation";
import { Accordion } from "#/components/ui/accordion";
import { Breadcrumb } from "#/components/ui/breadcrumb";
import { NavigationMenu } from "#/components/ui/navigation-menu";
import { Tabs } from "#/components/ui/tabs";
import { Card, useTone } from "../card";

// Navigation: menus drawn like a sidebar, a breadcrumb over a list, tabs
// over an accordion, a navigation menu — the `current` and `hover` states.

function MenuList({
    groups,
}: {
    groups: [string, [typeof UserIcon, string, boolean?][]][];
}) {
    return (
        <Card>
            {groups.map(([label, items]) => (
                <nav key={label} className="flex flex-col gap-0.5">
                    <span className="px-2 pb-1 text-xs text-palette-accent/85">
                        {label}
                    </span>
                    {items.map(([Icon, name, current]) => (
                        <a
                            key={name}
                            href={`/${name.toLowerCase().replaceAll(" ", "-")}`}
                            aria-current={current ? "page" : undefined}
                            className={`${foundation.hover()} ${foundation.current()} ${foundation.focusInset()} flex h-8 items-center gap-2 rounded-md px-2 text-sm text-palette-accent/85 hover:text-palette-contrast`}
                        >
                            <Icon className="size-icon" />
                            {name}
                        </a>
                    ))}
                </nav>
            ))}
        </Card>
    );
}

export function OverviewMenu() {
    return (
        <MenuList
            groups={[
                [
                    "Overview",
                    [
                        [LayoutDashboardIcon, "Dashboard", true],
                        [ArrowLeftRightIcon, "Transactions"],
                        [TrendingUpIcon, "Investments"],
                        [WalletIcon, "Accounts"],
                        [PieChartIcon, "Spending"],
                    ],
                ],
                [
                    "Planning",
                    [
                        [TargetIcon, "Goals"],
                        [GaugeIcon, "Budget"],
                        [FileTextIcon, "Reports"],
                    ],
                ],
            ]}
        />
    );
}

export function AccountMenu() {
    return (
        <MenuList
            groups={[
                [
                    "Account",
                    [
                        [UserIcon, "Profile"],
                        [CreditCardIcon, "Billing", true],
                        [BellIcon, "Notifications"],
                        [ShieldIcon, "Security"],
                        [PaletteIcon, "Appearance"],
                    ],
                ],
                ["Support", [[LifeBuoyIcon, "Help center"]]],
            ]}
        />
    );
}

export function PaymentsList() {
    const items = [
        [
            GaugeIcon,
            "Change transfer limit",
            "Adjust how much you can send from your balance.",
        ],
        [
            CalendarClockIcon,
            "Scheduled transfers",
            "Set up a transfer to send at a later date.",
        ],
        [
            ArrowLeftRightIcon,
            "Direct debits",
            "Set up and manage regular payments.",
        ],
        [
            RepeatIcon,
            "Recurring card payments",
            "Manage your repeated card transactions.",
        ],
    ] as const;
    return (
        <Card>
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="#">Account</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.Page>Payments</Breadcrumb.Page>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
            {items.map(([Icon, title, text]) => (
                <a
                    key={title}
                    href={`/payments/${title.toLowerCase().replaceAll(" ", "-")}`}
                    className={`${foundation.hover()} ${foundation.focus()} flex items-start gap-3 rounded-md border border-palette-line p-3`}
                >
                    <Icon className="mt-0.5 size-icon shrink-0" />
                    <span className="flex min-w-0 flex-1 flex-col">
                        <span className="text-sm font-medium">{title}</span>
                        <span className="text-xs text-palette-accent/85">
                            {text}
                        </span>
                    </span>
                    <ChevronRightIcon className="size-icon shrink-0 text-palette-accent/85 rtl:-scale-x-100" />
                </a>
            ))}
        </Card>
    );
}

const FAQ = [
    [
        "secure",
        "How secure is my data?",
        "Encrypted at rest and in transit, with read-only access tokens.",
    ],
    [
        "connect",
        "How do I connect my bank?",
        "Open Accounts, choose your bank and sign in once.",
    ],
    [
        "export",
        "Can I export my data?",
        "Yes — CSV and PDF, any time, from Reports.",
    ],
] as const;

export function HelpTabs() {
    const { action } = useTone();
    return (
        <Card
            footer={
                <Clickable.Button className={`${action} w-full`} size="sm">
                    Contact support
                </Clickable.Button>
            }
        >
            <Tabs.Root defaultValue="general">
                <Tabs.List>
                    <Tabs.Tab value="general">General</Tabs.Tab>
                    <Tabs.Tab value="billing">Billing</Tabs.Tab>
                    <Tabs.Tab value="goals">Goals</Tabs.Tab>
                    <Tabs.Indicator />
                </Tabs.List>
            </Tabs.Root>
            <Accordion.Root defaultValue={["secure"]}>
                {FAQ.map(([value, question, answer]) => (
                    <Accordion.Item key={value} value={value}>
                        <Accordion.Header>
                            <Accordion.Trigger>
                                {question}
                                <ChevronDownIcon className="size-icon shrink-0 transition-transform duration-200 group-data-panel-open:rotate-180" />
                            </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Panel>
                            <Accordion.Content className="text-palette-accent/85">
                                {answer}
                            </Accordion.Content>
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion.Root>
        </Card>
    );
}

export function ProductNav() {
    return (
        <Card title="Navigation menu" description="Hover or open a section.">
            <NavigationMenu.Root>
                <NavigationMenu.List>
                    {[
                        ["Product", ["Overview", "Pricing", "Changelog"]],
                        ["Company", ["About", "Careers", "Press"]],
                    ].map(([label, links]) => (
                        <NavigationMenu.Item key={label as string}>
                            <NavigationMenu.Trigger>
                                {label}
                            </NavigationMenu.Trigger>
                            <NavigationMenu.Content>
                                <ul className="flex w-48 flex-col gap-1 p-1">
                                    {(links as string[]).map((link) => (
                                        <li key={link}>
                                            <NavigationMenu.Link href="#">
                                                {link}
                                            </NavigationMenu.Link>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenu.Content>
                        </NavigationMenu.Item>
                    ))}
                </NavigationMenu.List>
                <NavigationMenu.Portal>
                    <NavigationMenu.Positioner side="bottom" align="start">
                        <NavigationMenu.Popup>
                            <NavigationMenu.Viewport />
                        </NavigationMenu.Popup>
                    </NavigationMenu.Positioner>
                </NavigationMenu.Portal>
            </NavigationMenu.Root>
        </Card>
    );
}

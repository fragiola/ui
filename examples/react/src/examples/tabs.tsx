"use client";

import type { ReactNode } from "react";
import { Tabs } from "#/components/ui/tabs";

// The surface-tier palettes: the neutral surface with one chromatic ring, so
// only the "on" marks (the tab's underline, its focus ring) take colour.
// Literal here because examples are published source (the code panel shows
// this file verbatim, with a copy button).
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

// A settings page's sections, in the default look: the tabs carry no palette
// class and take the floor's. The current tab is `soft` with contrast text,
// and the underline under it (Tabs.Indicator, which slides between tabs) is
// `ring`, the colour of every "on" mark. Then
// the states a reader needs (a disabled tab, the vertical orientation), and
// last the same tabs in each surface-ring palette: only the underline and
// the focus ring change.
export default function TabsDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Tabs.Root defaultValue="account">
                <Tabs.List>
                    <Tabs.Tab value="account">Account</Tabs.Tab>
                    <Tabs.Tab value="password">Password</Tabs.Tab>
                    <Tabs.Tab value="team">Team</Tabs.Tab>
                    <Tabs.Tab value="sso" disabled>
                        SSO
                    </Tabs.Tab>
                    <Tabs.Indicator />
                </Tabs.List>

                <Tabs.Panel value="account">
                    <p className="text-sm text-palette-accent/85">
                        Your name, email and avatar, as your team sees them.
                    </p>
                </Tabs.Panel>
                <Tabs.Panel value="password">
                    <p className="text-sm text-palette-accent/85">
                        Change your password, or sign out of other devices.
                    </p>
                </Tabs.Panel>
                <Tabs.Panel value="team">
                    <p className="text-sm text-palette-accent/85">
                        Invite people and choose what each one can edit.
                    </p>
                </Tabs.Panel>
            </Tabs.Root>

            <Row label="vertical">
                <Tabs.Root defaultValue="general" orientation="vertical">
                    <Tabs.List>
                        <Tabs.Tab value="general">General</Tabs.Tab>
                        <Tabs.Tab value="billing">Billing</Tabs.Tab>
                        <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
                        <Tabs.Indicator />
                    </Tabs.List>

                    <Tabs.Panel value="general">
                        <p className="text-sm text-palette-accent/85">
                            Workspace name, language and time zone.
                        </p>
                    </Tabs.Panel>
                    <Tabs.Panel value="billing">
                        <p className="text-sm text-palette-accent/85">
                            Plan, invoices and payment method.
                        </p>
                    </Tabs.Panel>
                    <Tabs.Panel value="notifications">
                        <p className="text-sm text-palette-accent/85">
                            What we email you about, and how often.
                        </p>
                    </Tabs.Panel>
                </Tabs.Root>
            </Row>

            {/* the same tabs, only their palette-* class changed */}
            <Row label="palettes">
                <div className="flex flex-wrap gap-6">
                    {SURFACE_RING.map((palette) => (
                        <Tabs.Root
                            key={palette}
                            defaultValue="on"
                            className={`palette-${palette}`}
                        >
                            <Tabs.List aria-label={palette}>
                                <Tabs.Tab value="on">On</Tabs.Tab>
                                <Tabs.Tab value="off">Off</Tabs.Tab>
                                <Tabs.Indicator />
                            </Tabs.List>
                        </Tabs.Root>
                    ))}
                </div>
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
            {children}
        </div>
    );
}

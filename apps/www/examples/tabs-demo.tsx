"use client";

import type { ReactNode } from "react";
import { Tabs } from "#/ui/tabs";

// The floor is palette-surface. The tabs — list, triggers and panels — read
// roles from the floor. The active tab uses contrast, inactive tabs use
// accent, panel text uses accent/85. Shows: horizontal with indicator,
// disabled tab, and vertical.
export default function TabsDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            <Row label="horizontal">
                <Tabs.Root defaultValue="account">
                    <Tabs.List>
                        <Tabs.Tab value="account">Account</Tabs.Tab>
                        <Tabs.Tab value="password">Password</Tabs.Tab>
                        <Tabs.Tab value="team">Team</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="account">
                        <p className="text-sm text-palette-accent/85">
                            Account settings — make changes to your profile.
                        </p>
                    </Tabs.Panel>
                    <Tabs.Panel value="password">
                        <p className="text-sm text-palette-accent/85">
                            Password settings — update your password.
                        </p>
                    </Tabs.Panel>
                    <Tabs.Panel value="team">
                        <p className="text-sm text-palette-accent/85">
                            Team settings — manage your team members.
                        </p>
                    </Tabs.Panel>
                </Tabs.Root>
            </Row>

            <Row label="disabled tab">
                <Tabs.Root defaultValue="a">
                    <Tabs.List>
                        <Tabs.Tab value="a">Tab A</Tabs.Tab>
                        <Tabs.Tab value="b">Tab B</Tabs.Tab>
                        <Tabs.Tab value="c" disabled>
                            Tab C (disabled)
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="a">
                        <p className="text-sm text-palette-accent/85">
                            Content A.
                        </p>
                    </Tabs.Panel>
                    <Tabs.Panel value="b">
                        <p className="text-sm text-palette-accent/85">
                            Content B.
                        </p>
                    </Tabs.Panel>
                </Tabs.Root>
            </Row>

            <Row label="vertical">
                <Tabs.Root defaultValue="general" orientation="vertical">
                    <Tabs.List>
                        <Tabs.Tab value="general">General</Tabs.Tab>
                        <Tabs.Tab value="billing">Billing</Tabs.Tab>
                        <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="general">
                        <p className="text-sm text-palette-accent/85">
                            General settings.
                        </p>
                    </Tabs.Panel>
                    <Tabs.Panel value="billing">
                        <p className="text-sm text-palette-accent/85">
                            Billing settings.
                        </p>
                    </Tabs.Panel>
                    <Tabs.Panel value="notifications">
                        <p className="text-sm text-palette-accent/85">
                            Notification preferences.
                        </p>
                    </Tabs.Panel>
                </Tabs.Root>
            </Row>
        </div>
    );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-palette-accent/85">
                {label}
            </span>
            {children}
        </div>
    );
}

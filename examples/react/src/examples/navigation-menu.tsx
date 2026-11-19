"use client";

import { NavigationMenu } from "#/components/ui/navigation-menu";

// A product site's top navigation in the default look: the menu carries no
// palette class, so its triggers, links and popup read their roles from the
// floor. The popup morphs, its viewport resizing between the items; the last
// item is a plain link.
export default function NavigationMenuDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 bg-palette-base text-palette-contrast">
            <NavigationMenu.Root>
                <NavigationMenu.List>
                    <NavigationMenu.Item>
                        <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                        <NavigationMenu.Content>
                            <ul className="grid grid-cols-2 gap-2 p-1">
                                <li>
                                    <NavigationMenu.Link href="#">
                                        Analytics
                                    </NavigationMenu.Link>
                                    <p className="text-xs text-palette-accent/85">
                                        Dashboards for every team.
                                    </p>
                                </li>
                                <li>
                                    <NavigationMenu.Link href="#">
                                        Automations
                                    </NavigationMenu.Link>
                                    <p className="text-xs text-palette-accent/85">
                                        Run workflows on a schedule.
                                    </p>
                                </li>
                                <li>
                                    <NavigationMenu.Link href="#">
                                        Integrations
                                    </NavigationMenu.Link>
                                    <p className="text-xs text-palette-accent/85">
                                        Connect the tools you use.
                                    </p>
                                </li>
                                <li>
                                    <NavigationMenu.Link href="#">
                                        Security
                                    </NavigationMenu.Link>
                                    <p className="text-xs text-palette-accent/85">
                                        SSO, audit logs and roles.
                                    </p>
                                </li>
                            </ul>
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>

                    <NavigationMenu.Item>
                        <NavigationMenu.Trigger>
                            Resources
                        </NavigationMenu.Trigger>
                        <NavigationMenu.Content>
                            <ul className="grid grid-cols-1 gap-2 p-1">
                                <li>
                                    <NavigationMenu.Link href="#">
                                        Documentation
                                    </NavigationMenu.Link>
                                    <p className="text-xs text-palette-accent/85">
                                        Guides and API reference.
                                    </p>
                                </li>
                                <li>
                                    <NavigationMenu.Link href="#">
                                        Changelog
                                    </NavigationMenu.Link>
                                    <p className="text-xs text-palette-accent/85">
                                        What shipped this month.
                                    </p>
                                </li>
                            </ul>
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>

                    <NavigationMenu.Item>
                        <NavigationMenu.Link href="#">
                            Pricing
                        </NavigationMenu.Link>
                    </NavigationMenu.Item>
                </NavigationMenu.List>

                <NavigationMenu.Portal>
                    <NavigationMenu.Positioner side="bottom" align="start">
                        <NavigationMenu.Popup>
                            <NavigationMenu.Viewport />
                            <NavigationMenu.Arrow />
                        </NavigationMenu.Popup>
                    </NavigationMenu.Positioner>
                </NavigationMenu.Portal>
            </NavigationMenu.Root>
        </div>
    );
}

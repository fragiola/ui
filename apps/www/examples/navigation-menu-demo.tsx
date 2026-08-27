"use client";

import { NavigationMenu } from "#/ui/navigation-menu";

// The floor is palette-surface. The navigation menu — triggers, links and
// portal content — reads roles from the floor. Shows the morphing popup with
// a viewport that resizes between items, plus a plain link item.
export default function NavigationMenuDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            <NavigationMenu.Root>
                <NavigationMenu.List>
                    <NavigationMenu.Item>
                        <NavigationMenu.Trigger>
                            Components
                        </NavigationMenu.Trigger>
                        <NavigationMenu.Content>
                            <ul className="grid grid-cols-2 gap-2 p-1">
                                <li>
                                    <NavigationMenu.Link href="/docs/field">
                                        Field
                                    </NavigationMenu.Link>
                                    <p className="text-xs text-palette-accent/85">
                                        The input control family.
                                    </p>
                                </li>
                                <li>
                                    <NavigationMenu.Link href="/docs/select">
                                        Select
                                    </NavigationMenu.Link>
                                    <p className="text-xs text-palette-accent/85">
                                        The recombination test.
                                    </p>
                                </li>
                                <li>
                                    <NavigationMenu.Link href="/docs/tabs">
                                        Tabs
                                    </NavigationMenu.Link>
                                    <p className="text-xs text-palette-accent/85">
                                        A strip of triggers.
                                    </p>
                                </li>
                                <li>
                                    <NavigationMenu.Link href="/docs/slider">
                                        Slider
                                    </NavigationMenu.Link>
                                    <p className="text-xs text-palette-accent/85">
                                        A field control.
                                    </p>
                                </li>
                            </ul>
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>

                    <NavigationMenu.Item>
                        <NavigationMenu.Trigger>
                            Patterns
                        </NavigationMenu.Trigger>
                        <NavigationMenu.Content>
                            <ul className="grid grid-cols-1 gap-2 p-1">
                                <li>
                                    <NavigationMenu.Link href="/docs/composition">
                                        Composition
                                    </NavigationMenu.Link>
                                    <p className="text-xs text-palette-accent/85">
                                        Primitives, render, factories.
                                    </p>
                                </li>
                                <li>
                                    <NavigationMenu.Link href="/docs/style-families">
                                        Style families
                                    </NavigationMenu.Link>
                                    <p className="text-xs text-palette-accent/85">
                                        Shared skeletons, zero variants.
                                    </p>
                                </li>
                            </ul>
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>

                    <NavigationMenu.Item>
                        <NavigationMenu.Link href="/docs/installation">
                            Get started
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

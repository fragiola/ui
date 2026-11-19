"use client";

import { ChevronDownIcon, MoreHorizontalIcon } from "lucide-react";
import { Clickable } from "#/components/atoms/clickable";
import { DropdownMenu } from "#/components/ui/dropdown-menu";

// Two menus an app would have, in the default look: an account menu (groups,
// shortcuts, a checkbox item, a submenu of radio items) and a row's actions
// menu. The triggers are Clickable.Button, the same button surface as the
// rest of the library, rendered through `render`. The menu travels through a
// portal and inherits the floor's palette from the owning subtree; the only
// colour is the destructive item's palette-danger, a class and not a prop.
export default function DropdownMenuDemo() {
    return (
        <div className="palette-surface flex flex-wrap items-start gap-4 bg-palette-base text-palette-contrast">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger
                    render={<Clickable.Button variant="outline" />}
                >
                    Ada Lovelace
                    <ChevronDownIcon className="size-4" />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    {/* A Label must sit inside a Group: Base UI's GroupLabel
                        reads the group's context. */}
                    <DropdownMenu.Group>
                        <DropdownMenu.Label>My account</DropdownMenu.Label>
                        <DropdownMenu.Item>
                            <span>Profile</span>
                            <DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item>
                            <span>Billing</span>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item>
                            <span>Settings</span>
                            <DropdownMenu.Shortcut>⌘,</DropdownMenu.Shortcut>
                        </DropdownMenu.Item>
                    </DropdownMenu.Group>
                    <DropdownMenu.Separator />
                    <DropdownMenu.CheckboxItem defaultChecked>
                        <span>Email notifications</span>
                    </DropdownMenu.CheckboxItem>
                    <DropdownMenu.Sub>
                        <DropdownMenu.SubTrigger>
                            <span>Theme</span>
                        </DropdownMenu.SubTrigger>
                        <DropdownMenu.SubContent>
                            <DropdownMenu.RadioGroup defaultValue="system">
                                <DropdownMenu.RadioItem value="light">
                                    <span>Light</span>
                                </DropdownMenu.RadioItem>
                                <DropdownMenu.RadioItem value="dark">
                                    <span>Dark</span>
                                </DropdownMenu.RadioItem>
                                <DropdownMenu.RadioItem value="system">
                                    <span>System</span>
                                </DropdownMenu.RadioItem>
                            </DropdownMenu.RadioGroup>
                        </DropdownMenu.SubContent>
                    </DropdownMenu.Sub>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item disabled>
                        <span>Switch workspace</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                        <span>Sign out</span>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>

            <DropdownMenu.Root>
                <DropdownMenu.Trigger
                    render={
                        <Clickable.Button
                            variant="icon"
                            shape="square"
                            aria-label="Invoice actions"
                        />
                    }
                >
                    <MoreHorizontalIcon />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Item>
                        <span>Edit</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                        <span>Duplicate</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    {/* palette-danger applied from outside — no tone prop */}
                    <DropdownMenu.Item className="palette-danger">
                        <span>Delete</span>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
    );
}

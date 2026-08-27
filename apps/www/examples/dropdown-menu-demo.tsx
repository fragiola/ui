"use client";

import { ChevronDownIcon } from "lucide-react";
import { DropdownMenu } from "#/ui/dropdown-menu";

export default function DropdownMenuDemo() {
    return (
        <div className="flex flex-wrap gap-4">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger
                    render={
                        <button
                            type="button"
                            className="inline-flex h-control items-center gap-1 rounded-md border border-palette-line bg-palette-base px-3 text-sm text-palette-contrast field-focus:outline-2 field-focus:outline-palette-ring"
                        />
                    }
                >
                    Open menu
                    <ChevronDownIcon className="size-4" />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Item>
                        <span>Profile</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item inset>
                        <span>Billing</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item inset>
                        <span>Settings</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Label>Account</DropdownMenu.Label>
                    <DropdownMenu.Item disabled>
                        <span>Logout</span>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>

            {/* Destructive item — a palette class, not a prop */}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger
                    render={
                        <button
                            type="button"
                            className="inline-flex h-control items-center gap-1 rounded-md border border-palette-line bg-palette-base px-3 text-sm text-palette-contrast field-focus:outline-2 field-focus:outline-palette-ring"
                        />
                    }
                >
                    Destructive
                    <ChevronDownIcon className="size-4" />
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

            {/* Submenus, checkbox items, radio groups, shortcuts */}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger
                    render={
                        <button
                            type="button"
                            className="inline-flex h-control items-center gap-1 rounded-md border border-palette-line bg-palette-base px-3 text-sm text-palette-contrast field-focus:outline-2 field-focus:outline-palette-ring"
                        />
                    }
                >
                    Advanced
                    <ChevronDownIcon className="size-4" />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Sub>
                        <DropdownMenu.SubTrigger>
                            <span>Open in…</span>
                        </DropdownMenu.SubTrigger>
                        <DropdownMenu.SubContent>
                            <DropdownMenu.Item>
                                <span>New tab</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item>
                                <span>New window</span>
                            </DropdownMenu.Item>
                        </DropdownMenu.SubContent>
                    </DropdownMenu.Sub>
                    <DropdownMenu.Separator />
                    <DropdownMenu.CheckboxItem checked>
                        <span>Show toolbar</span>
                    </DropdownMenu.CheckboxItem>
                    <DropdownMenu.CheckboxItem>
                        <span>Show status bar</span>
                    </DropdownMenu.CheckboxItem>
                    <DropdownMenu.Separator />
                    <DropdownMenu.RadioGroup defaultValue="light">
                        <DropdownMenu.Label>Theme</DropdownMenu.Label>
                        <DropdownMenu.RadioItem value="light">
                            <span>Light</span>
                        </DropdownMenu.RadioItem>
                        <DropdownMenu.RadioItem value="dark">
                            <span>Dark</span>
                        </DropdownMenu.RadioItem>
                    </DropdownMenu.RadioGroup>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item>
                        <span>Save</span>
                        <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
    );
}

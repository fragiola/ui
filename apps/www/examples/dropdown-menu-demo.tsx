"use client";

import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Clickable } from "#/atoms/clickable";
import { DropdownMenu } from "#/ui/dropdown-menu";

// The floor is palette-surface. The trigger button and the menu content read
// roles from the floor — the portal inherits the palette from the owning
// subtree. The destructive item carries palette-danger explicitly — the one
// chromatic exception for destructive menu items.
//
// The trigger uses Clickable.Button (the button surface) instead of a
// hand-rolled <button> — the same component the rest of the library uses.
export default function DropdownMenuDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            <Row label="basic + grouped label">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                        render={<Clickable.Button variant="outline" />}
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
                        {/* Label MUST be inside a Group — GroupLabel requires
                            MenuGroupContext from Base UI. */}
                        <DropdownMenu.Group>
                            <DropdownMenu.Label>Account</DropdownMenu.Label>
                            <DropdownMenu.Item disabled>
                                <span>Logout</span>
                            </DropdownMenu.Item>
                        </DropdownMenu.Group>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </Row>

            <Row label="destructive item">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                        render={<Clickable.Button variant="outline" />}
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
            </Row>

            <Row label="submenus, checkbox, radio, shortcut">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                        render={<Clickable.Button variant="outline" />}
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
                        </DropdownMenu.Item>
                        <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
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
            <div className="flex flex-wrap items-center gap-4">{children}</div>
        </div>
    );
}

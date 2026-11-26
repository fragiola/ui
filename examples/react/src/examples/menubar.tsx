"use client";

import { Menubar } from "#/components/ui/menubar";

// A document editor's bar: one tab stop, the arrows move along it, and once
// a menu is open the arrows and the pointer move from one menu to the next.
// Each menu is the same list as a dropdown menu — shortcuts, a submenu,
// checkbox and radio items — from the shared menu factory. The bar names
// itself for assistive technology (`aria-label`).
export default function MenubarDemo() {
    return (
        <div className="palette-surface flex flex-col items-start gap-4 bg-palette-base text-palette-contrast">
            <Menubar.Root aria-label="Document">
                <Menubar.Menu>
                    <Menubar.Trigger>File</Menubar.Trigger>
                    <Menubar.Content>
                        <Menubar.Item>
                            <span>New document</span>
                            <Menubar.Shortcut>⌘N</Menubar.Shortcut>
                        </Menubar.Item>
                        <Menubar.Item>
                            <span>Open…</span>
                            <Menubar.Shortcut>⌘O</Menubar.Shortcut>
                        </Menubar.Item>
                        <Menubar.Sub>
                            <Menubar.SubTrigger>
                                <span>Share</span>
                            </Menubar.SubTrigger>
                            <Menubar.SubContent>
                                <Menubar.Item>
                                    <span>Copy link</span>
                                </Menubar.Item>
                                <Menubar.Item>
                                    <span>Email</span>
                                </Menubar.Item>
                            </Menubar.SubContent>
                        </Menubar.Sub>
                        <Menubar.Separator />
                        <Menubar.Item disabled>
                            <span>Print…</span>
                            <Menubar.Shortcut>⌘P</Menubar.Shortcut>
                        </Menubar.Item>
                    </Menubar.Content>
                </Menubar.Menu>
                <Menubar.Menu>
                    <Menubar.Trigger>Edit</Menubar.Trigger>
                    <Menubar.Content>
                        <Menubar.Item>
                            <span>Undo</span>
                            <Menubar.Shortcut>⌘Z</Menubar.Shortcut>
                        </Menubar.Item>
                        <Menubar.Item>
                            <span>Redo</span>
                            <Menubar.Shortcut>⇧⌘Z</Menubar.Shortcut>
                        </Menubar.Item>
                        <Menubar.Separator />
                        <Menubar.Item>
                            <span>Find</span>
                            <Menubar.Shortcut>⌘F</Menubar.Shortcut>
                        </Menubar.Item>
                    </Menubar.Content>
                </Menubar.Menu>
                <Menubar.Menu>
                    <Menubar.Trigger>View</Menubar.Trigger>
                    <Menubar.Content>
                        <Menubar.CheckboxItem defaultChecked>
                            <span>Show ruler</span>
                        </Menubar.CheckboxItem>
                        <Menubar.CheckboxItem>
                            <span>Show word count</span>
                        </Menubar.CheckboxItem>
                        <Menubar.Separator />
                        <Menubar.Group>
                            <Menubar.Label>Zoom</Menubar.Label>
                            <Menubar.RadioGroup defaultValue="100">
                                <Menubar.RadioItem value="75">
                                    <span>75%</span>
                                </Menubar.RadioItem>
                                <Menubar.RadioItem value="100">
                                    <span>100%</span>
                                </Menubar.RadioItem>
                                <Menubar.RadioItem value="150">
                                    <span>150%</span>
                                </Menubar.RadioItem>
                            </Menubar.RadioGroup>
                        </Menubar.Group>
                    </Menubar.Content>
                </Menubar.Menu>
                <Menubar.Menu>
                    <Menubar.Trigger>Help</Menubar.Trigger>
                    <Menubar.Content>
                        <Menubar.Item>
                            <span>Keyboard shortcuts</span>
                        </Menubar.Item>
                        <Menubar.Item>
                            <span>About</span>
                        </Menubar.Item>
                    </Menubar.Content>
                </Menubar.Menu>
            </Menubar.Root>
        </div>
    );
}

"use client";

import { ContextMenu } from "#/ui/context-menu";

export default function ContextMenuDemo() {
    return (
        <div className="flex flex-wrap gap-4">
            <ContextMenu.Root>
                <ContextMenu.Trigger
                    render={
                        <div className="flex h-32 w-64 items-center justify-center rounded-md border border-dashed border-palette-line bg-palette-soft text-sm text-palette-accent/85" />
                    }
                >
                    Right-click here
                </ContextMenu.Trigger>
                <ContextMenu.Content>
                    <ContextMenu.Item>
                        <span>Back</span>
                    </ContextMenu.Item>
                    <ContextMenu.Item inset disabled>
                        <span>Forward</span>
                    </ContextMenu.Item>
                    <ContextMenu.Item inset>
                        <span>Reload</span>
                    </ContextMenu.Item>
                    <ContextMenu.Separator />
                    <ContextMenu.Sub>
                        <ContextMenu.SubTrigger>
                            <span>More tools</span>
                        </ContextMenu.SubTrigger>
                        <ContextMenu.SubContent>
                            <ContextMenu.Item>
                                <span>Save page as…</span>
                            </ContextMenu.Item>
                            <ContextMenu.Item>
                                <span>Print…</span>
                            </ContextMenu.Item>
                        </ContextMenu.SubContent>
                    </ContextMenu.Sub>
                    <ContextMenu.Separator />
                    <ContextMenu.CheckboxItem checked>
                        <span>Show bookmarks bar</span>
                    </ContextMenu.CheckboxItem>
                    <ContextMenu.Separator />
                    {/* Destructive item — a palette class, not a prop */}
                    <ContextMenu.Item className="palette-danger">
                        <span>Delete</span>
                    </ContextMenu.Item>
                </ContextMenu.Content>
            </ContextMenu.Root>
        </div>
    );
}

"use client";

import type { ReactNode } from "react";
import { ContextMenu } from "#/ui/context-menu";

// The floor is palette-surface. The context menu trigger is a dashed surface
// that reads roles from the floor; the menu content travels through a portal
// and inherits the palette from the owning subtree. The destructive item
// carries palette-danger explicitly — the one chromatic exception for
// destructive menu items.
export default function ContextMenuDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            <Row label="basic + submenu">
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

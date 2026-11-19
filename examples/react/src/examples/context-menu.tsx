"use client";

import { FileTextIcon } from "lucide-react";
import { ContextMenu } from "#/components/ui/context-menu";

// A file card with a right-click menu, in the default look. The trigger is
// any element (here a card, through `render`); the menu travels through a
// portal and inherits the floor's palette from the owning subtree. The only
// colour is the destructive item's palette-danger, a class and not a prop.
export default function ContextMenuDemo() {
    return (
        <div className="palette-surface flex flex-col gap-2 bg-palette-base text-palette-contrast">
            <ContextMenu.Root>
                <ContextMenu.Trigger
                    render={
                        <div className="flex w-72 items-center gap-3 rounded-lg border border-palette-line p-4" />
                    }
                >
                    <FileTextIcon className="size-icon-lg text-palette-accent/85" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">
                            Q3 report.pdf
                        </span>
                        <span className="text-xs text-palette-accent/85">
                            2.4 MB · edited yesterday
                        </span>
                    </div>
                </ContextMenu.Trigger>
                <ContextMenu.Content>
                    <ContextMenu.Item>
                        <span>Open</span>
                    </ContextMenu.Item>
                    <ContextMenu.Item>
                        <span>Rename</span>
                    </ContextMenu.Item>
                    <ContextMenu.Item disabled>
                        <span>Make a copy</span>
                    </ContextMenu.Item>
                    <ContextMenu.Separator />
                    <ContextMenu.Sub>
                        <ContextMenu.SubTrigger>
                            <span>Share</span>
                        </ContextMenu.SubTrigger>
                        <ContextMenu.SubContent>
                            <ContextMenu.Item>
                                <span>Copy link</span>
                            </ContextMenu.Item>
                            <ContextMenu.Item>
                                <span>Invite people…</span>
                            </ContextMenu.Item>
                        </ContextMenu.SubContent>
                    </ContextMenu.Sub>
                    <ContextMenu.CheckboxItem defaultChecked>
                        <span>Available offline</span>
                    </ContextMenu.CheckboxItem>
                    <ContextMenu.Separator />
                    {/* Destructive item — a palette class, not a prop */}
                    <ContextMenu.Item className="palette-danger">
                        <span>Move to trash</span>
                    </ContextMenu.Item>
                </ContextMenu.Content>
            </ContextMenu.Root>
            <span className="text-xs text-palette-accent/85">
                Right-click the file, or long-press it on touch.
            </span>
        </div>
    );
}

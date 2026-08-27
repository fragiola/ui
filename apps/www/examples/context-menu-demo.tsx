"use client";

import { ContextMenu } from "#/ui/context-menu";
import { PaletteGrid } from "@/components/preview/palette-grid";
import { SURFACES } from "@/lib/palette-sets";

// Each cell is a tinted surface palette. The context menu trigger is a dashed
// surface that reads roles from the cell; the menu content travels through a
// portal and inherits the palette from the owning cell. The destructive item
// carries palette-danger explicitly.
function DemoContent() {
    return (
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
    );
}

export default function ContextMenuDemo() {
    return (
        <PaletteGrid palettes={SURFACES}>
            <DemoContent />
        </PaletteGrid>
    );
}

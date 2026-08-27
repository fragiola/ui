"use client";

import { Clickable } from "#/atoms/clickable";
import { Drawer } from "#/ui/drawer";
import { PaletteGrid } from "@/components/preview/palette-grid";
import { SURFACES } from "@/lib/palette-sets";

// Each cell is a tinted surface palette. The drawer shares the layer family
// with the dialog — the panel, header, body and footer read roles from the
// cell that owns the root, even through the portal.
function DemoContent() {
    return (
        <div className="flex flex-wrap gap-4">
            {/* Right-anchored drawer with a handle, header, body, footer */}
            <Drawer.Root swipeDirection="right">
                <Drawer.Trigger render={<Clickable.Button variant="outline" />}>
                    Open drawer (right)
                </Drawer.Trigger>
                <Drawer.Portal>
                    <Drawer.Backdrop />
                    <Drawer.Viewport side="right">
                        <Drawer.Popup side="right">
                            <Drawer.Handle />
                            <Drawer.Content>
                                <Drawer.Header>
                                    <Drawer.Title>Drawer</Drawer.Title>
                                    <Drawer.Description>
                                        A drawer that slides in from the
                                        inline-end edge. Swipe to dismiss it.
                                    </Drawer.Description>
                                </Drawer.Header>
                                <Drawer.Body>
                                    <p className="text-sm text-palette-accent/85">
                                        The drawer consumes the same{" "}
                                        <code>layer</code> family as the dialog
                                        — the panel, header, body and footer are
                                        shared. Only the positioning and the
                                        swipe handle are drawer-specific.
                                    </p>
                                </Drawer.Body>
                                <Drawer.Footer>
                                    <Drawer.Close
                                        render={
                                            <Clickable.Button variant="outline" />
                                        }
                                    >
                                        Close
                                    </Drawer.Close>
                                </Drawer.Footer>
                            </Drawer.Content>
                        </Drawer.Popup>
                    </Drawer.Viewport>
                </Drawer.Portal>
            </Drawer.Root>

            {/* Left-anchored drawer — inverts under RTL via the viewport */}
            <Drawer.Root swipeDirection="left">
                <Drawer.Trigger render={<Clickable.Button variant="outline" />}>
                    Open drawer (left)
                </Drawer.Trigger>
                <Drawer.Portal>
                    <Drawer.Backdrop />
                    <Drawer.Viewport side="left">
                        <Drawer.Popup side="left">
                            <Drawer.Handle />
                            <Drawer.Content>
                                <Drawer.Header>
                                    <Drawer.Title>Left drawer</Drawer.Title>
                                    <Drawer.Description>
                                        Anchored to the inline-start edge. Under
                                        RTL the viewport flips so it opens from
                                        the correct side.
                                    </Drawer.Description>
                                </Drawer.Header>
                                <Drawer.Body>
                                    <p className="text-sm text-palette-accent/85">
                                        The inline edges use logical vocabulary
                                        and invert under RTL — a drawer that
                                        opens from the wrong side in Arabic is
                                        the classic silent failure.
                                    </p>
                                </Drawer.Body>
                            </Drawer.Content>
                        </Drawer.Popup>
                    </Drawer.Viewport>
                </Drawer.Portal>
            </Drawer.Root>

            {/* Bottom-anchored drawer with snap points */}
            <Drawer.Root swipeDirection="down" snapPoints={[0.4, 0.8]}>
                <Drawer.Trigger render={<Clickable.Button variant="outline" />}>
                    Open drawer (bottom)
                </Drawer.Trigger>
                <Drawer.Portal>
                    <Drawer.Backdrop />
                    <Drawer.Viewport side="down">
                        <Drawer.Popup side="down">
                            <Drawer.Handle />
                            <Drawer.Content>
                                <Drawer.Header>
                                    <Drawer.Title>Bottom drawer</Drawer.Title>
                                    <Drawer.Description>
                                        Anchored to the block-end edge with snap
                                        points at 40% and 80% of the viewport.
                                    </Drawer.Description>
                                </Drawer.Header>
                                <Drawer.Body>
                                    <p className="text-sm text-palette-accent/85">
                                        Snap points and modality are behaviour,
                                        exposed as props by the primitive — not
                                        as style variants.
                                    </p>
                                </Drawer.Body>
                            </Drawer.Content>
                        </Drawer.Popup>
                    </Drawer.Viewport>
                </Drawer.Portal>
            </Drawer.Root>
        </div>
    );
}

export default function DrawerDemo() {
    return (
        <PaletteGrid palettes={SURFACES}>
            <DemoContent />
        </PaletteGrid>
    );
}

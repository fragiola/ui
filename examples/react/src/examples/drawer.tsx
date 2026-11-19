"use client";

import { Clickable } from "#/components/atoms/clickable";
import { Drawer } from "#/components/ui/drawer";

// Three drawers an app would have, one per side, in the default look:
// notification settings from the inline-end edge, the navigation from the
// inline-start edge (under RTL both flip), and filters from the block-end
// edge with snap points. The drawer shares the layer family with the
// dialog: the panel, header, body and footer read the floor's palette, even
// through the portal.
export default function DrawerDemo() {
    return (
        <div className="palette-surface flex flex-wrap items-center gap-4 bg-palette-base text-palette-contrast">
            <Drawer.Root swipeDirection="right">
                <Drawer.Trigger render={<Clickable.Button variant="outline" />}>
                    Notifications
                </Drawer.Trigger>
                <Drawer.Portal>
                    <Drawer.Backdrop />
                    <Drawer.Viewport side="right">
                        <Drawer.Popup side="right">
                            <Drawer.Handle />
                            <Drawer.Content>
                                <Drawer.Header>
                                    <Drawer.Title>Notifications</Drawer.Title>
                                    <Drawer.Description>
                                        Choose what we email you about. Swipe to
                                        dismiss.
                                    </Drawer.Description>
                                </Drawer.Header>
                                <Drawer.Body>
                                    <p className="text-sm text-palette-accent/85">
                                        Mentions and replies arrive at once;
                                        everything else comes as a daily digest.
                                    </p>
                                </Drawer.Body>
                                <Drawer.Footer>
                                    <Drawer.Close
                                        render={
                                            <Clickable.Button variant="outline" />
                                        }
                                    >
                                        Cancel
                                    </Drawer.Close>
                                    <Clickable.Button className="palette-neutral">
                                        Save
                                    </Clickable.Button>
                                </Drawer.Footer>
                            </Drawer.Content>
                        </Drawer.Popup>
                    </Drawer.Viewport>
                </Drawer.Portal>
            </Drawer.Root>

            <Drawer.Root swipeDirection="left">
                <Drawer.Trigger render={<Clickable.Button variant="outline" />}>
                    Menu
                </Drawer.Trigger>
                <Drawer.Portal>
                    <Drawer.Backdrop />
                    <Drawer.Viewport side="left">
                        <Drawer.Popup side="left">
                            <Drawer.Handle />
                            <Drawer.Content>
                                <Drawer.Header>
                                    <Drawer.Title>Acme Inc.</Drawer.Title>
                                    <Drawer.Description>
                                        Your workspace.
                                    </Drawer.Description>
                                </Drawer.Header>
                                <Drawer.Body>
                                    <p className="text-sm text-palette-accent/85">
                                        Projects, members and billing live here
                                        on small screens.
                                    </p>
                                </Drawer.Body>
                            </Drawer.Content>
                        </Drawer.Popup>
                    </Drawer.Viewport>
                </Drawer.Portal>
            </Drawer.Root>

            <Drawer.Root swipeDirection="down" snapPoints={[0.4, 0.8]}>
                <Drawer.Trigger render={<Clickable.Button variant="outline" />}>
                    Filters
                </Drawer.Trigger>
                <Drawer.Portal>
                    <Drawer.Backdrop />
                    <Drawer.Viewport side="down">
                        <Drawer.Popup side="down">
                            <Drawer.Handle />
                            <Drawer.Content>
                                <Drawer.Header>
                                    <Drawer.Title>Filters</Drawer.Title>
                                    <Drawer.Description>
                                        Drag up to see every filter; it snaps at
                                        40% and 80% of the screen.
                                    </Drawer.Description>
                                </Drawer.Header>
                                <Drawer.Body>
                                    <p className="text-sm text-palette-accent/85">
                                        Status, owner and due date narrow the
                                        list of tasks.
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

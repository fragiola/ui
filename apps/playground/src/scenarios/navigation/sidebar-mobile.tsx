import { HomeIcon, InboxIcon, SettingsIcon } from "lucide-react";
import { Sidebar } from "#/components/ui/sidebar";

// The mobile path without resizing the window: the Provider sits in a frame
// narrower than 42rem, so its wrapper — not the viewport — says mobile. The
// desktop column is not rendered; the Trigger opens the Drawer, from the
// inline-start edge (the right one under RTL). Inside the Drawer nothing is
// in icon mode and actions need no hover.

export default function SidebarMobile() {
    return (
        <div className="palette-surface h-[32rem] w-96 overflow-hidden rounded-lg border border-palette-line">
            <Sidebar.Provider className="h-full min-h-0">
                <Sidebar.Root>
                    <Sidebar.Content>
                        <Sidebar.Group>
                            <Sidebar.GroupLabel>Mobile</Sidebar.GroupLabel>
                            <Sidebar.Menu>
                                <Sidebar.MenuItem>
                                    <Sidebar.MenuButton isActive>
                                        <HomeIcon />
                                        <span>Home</span>
                                    </Sidebar.MenuButton>
                                </Sidebar.MenuItem>
                                <Sidebar.MenuItem>
                                    <Sidebar.MenuButton>
                                        <InboxIcon />
                                        <span>Inbox</span>
                                    </Sidebar.MenuButton>
                                    <Sidebar.MenuBadge>7</Sidebar.MenuBadge>
                                </Sidebar.MenuItem>
                                <Sidebar.MenuItem>
                                    <Sidebar.MenuButton>
                                        <SettingsIcon />
                                        <span>Settings</span>
                                    </Sidebar.MenuButton>
                                </Sidebar.MenuItem>
                            </Sidebar.Menu>
                        </Sidebar.Group>
                    </Sidebar.Content>
                </Sidebar.Root>
                <Sidebar.Inset>
                    <header className="flex h-12 items-center gap-2 border-b border-palette-line px-3">
                        <Sidebar.Trigger />
                        <span className="text-sm font-medium">
                            A 24rem-wide app
                        </span>
                    </header>
                </Sidebar.Inset>
            </Sidebar.Provider>
        </div>
    );
}

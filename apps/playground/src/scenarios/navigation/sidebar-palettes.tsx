import { HomeIcon, InboxIcon, SettingsIcon } from "lucide-react";
import { Sidebar } from "#/components/ui/sidebar";

// The sidebar is palette-raised by default; a surface-tier palette class on
// Root swaps it, and every part follows — the items, the badge, the hover,
// the active page and the focus ring (Tab into one) read roles, never
// colours. Chromatic palettes are not shown on purpose: the items' resting
// text is the menu family's secondary text, readable on neutral surfaces
// only, as in a dropdown menu.

const PALETTES = [
    undefined,
    "palette-surface",
    "palette-surface-blue",
    "palette-surface-rose",
] as const;

export default function SidebarPalettes() {
    return (
        <div className="palette-surface grid grid-cols-2 gap-4 rounded-lg border border-palette-line bg-palette-base p-6">
            {PALETTES.map((palette) => (
                <div
                    key={palette ?? "default"}
                    className="h-72 w-[26rem] overflow-hidden rounded-lg border border-palette-line"
                >
                    <Sidebar.Provider className="h-full min-h-0">
                        <Sidebar.Root collapsible="none" className={palette}>
                            <Sidebar.Content>
                                <Sidebar.Group>
                                    <Sidebar.GroupLabel>
                                        {palette ?? "palette-raised (default)"}
                                    </Sidebar.GroupLabel>
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
                                            <Sidebar.MenuBadge>
                                                4
                                            </Sidebar.MenuBadge>
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
                        <Sidebar.Inset />
                    </Sidebar.Provider>
                </div>
            ))}
        </div>
    );
}

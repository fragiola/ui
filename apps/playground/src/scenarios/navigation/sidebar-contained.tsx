import { HomeIcon, InboxIcon, SettingsIcon } from "lucide-react";
import { Sidebar } from "#/components/ui/sidebar";

// The two hosts the sticky layout has to survive.
//
// Top: a fixed-height box that is not the viewport. The Provider takes the
// box's height, and the sidebar (h-svh, max-h-full) stops at the box instead
// of running to the viewport's height.
//
// Bottom: a page that scrolls inside its box. The sidebar stays put while the
// Inset scrolls past it — `sticky` against the box's scrollport, no `fixed`.
// This works because nothing between the Provider and the scroller clips
// with `overflow: hidden`; the sidebar's own clipping is `overflow-x: clip`,
// which makes no scroll container. The sidebar is `h-svh` — the viewport's
// scrollport, the usual one; a box that scrolls on its own tells the Root its
// height through `className`, the same hatch an app uses for a sidebar under
// a fixed header (`top-12 h-[calc(100svh-3rem)]`).

export default function SidebarContained() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            <div className="h-72 w-[44rem] overflow-hidden rounded-lg border border-palette-line">
                <Sidebar.Provider className="h-full min-h-0">
                    <Nav />
                    <Sidebar.Inset>
                        <p className="p-4 text-sm text-palette-accent/85">
                            A fixed-height host.
                        </p>
                    </Sidebar.Inset>
                </Sidebar.Provider>
            </div>
            <div className="h-72 w-[44rem] overflow-auto rounded-lg border border-palette-line">
                <Sidebar.Provider className="min-h-0">
                    <Nav className="h-72" />
                    <Sidebar.Inset>
                        {Array.from({ length: 30 }, (_, line) => (
                            <p
                                // biome-ignore lint/suspicious/noArrayIndexKey: static filler lines
                                key={line}
                                className="px-4 py-1 text-sm text-palette-accent/85"
                            >
                                Line {line + 1} of a page that scrolls.
                            </p>
                        ))}
                    </Sidebar.Inset>
                </Sidebar.Provider>
            </div>
        </div>
    );
}

function Nav({ className }: { className?: string }) {
    return (
        <Sidebar.Root className={className}>
            <Sidebar.Content>
                <Sidebar.Group>
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
                        </Sidebar.MenuItem>
                    </Sidebar.Menu>
                </Sidebar.Group>
            </Sidebar.Content>
            <Sidebar.Footer>
                <Sidebar.Menu>
                    <Sidebar.MenuItem>
                        <Sidebar.MenuButton>
                            <SettingsIcon />
                            <span>Settings</span>
                        </Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                </Sidebar.Menu>
            </Sidebar.Footer>
        </Sidebar.Root>
    );
}

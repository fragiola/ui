import { HomeIcon, InboxIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Clickable } from "#/components/atoms/clickable";
import { Sidebar } from "#/components/ui/sidebar";

// Controlled state and the persistence recipe the docs describe. The sidebar
// writes nothing itself — no cookie, no storage. The app owns `open`, so it
// persists wherever its stack reads it: here localStorage (a cookie would do
// the same for a server that renders the first paint). Collapse it, reload
// the page: it comes back collapsed. The button outside the Provider drives
// the same state.

const KEY = "playground:sidebar-open";

function readOpen() {
    try {
        return localStorage.getItem(KEY) !== "false";
    } catch {
        return true;
    }
}

export default function SidebarControlled() {
    const [open, setOpen] = useState(readOpen);

    useEffect(() => {
        try {
            localStorage.setItem(KEY, String(open));
        } catch {
            // Storage can be unavailable (private mode); the state still works.
        }
    }, [open]);

    return (
        <div className="palette-surface flex flex-col gap-4 rounded-lg border border-palette-line bg-palette-base p-6">
            <div className="flex items-center gap-3 text-sm">
                <Clickable.Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpen((value) => !value)}
                >
                    {open ? "Collapse" : "Expand"} from outside
                </Clickable.Button>
                <span className="text-palette-accent/85">
                    open = {String(open)} (stored in localStorage)
                </span>
            </div>
            <div className="h-80 w-[48rem] overflow-hidden rounded-lg border border-palette-line">
                <Sidebar.Provider
                    open={open}
                    onOpenChange={setOpen}
                    className="h-full min-h-0"
                >
                    <Sidebar.Root collapsible="icon">
                        <Sidebar.Content>
                            <Sidebar.Group>
                                <Sidebar.Menu>
                                    <Sidebar.MenuItem>
                                        <Sidebar.MenuButton
                                            isActive
                                            tooltip="Home"
                                        >
                                            <HomeIcon />
                                            <span>Home</span>
                                        </Sidebar.MenuButton>
                                    </Sidebar.MenuItem>
                                    <Sidebar.MenuItem>
                                        <Sidebar.MenuButton tooltip="Inbox">
                                            <InboxIcon />
                                            <span>Inbox</span>
                                        </Sidebar.MenuButton>
                                    </Sidebar.MenuItem>
                                </Sidebar.Menu>
                            </Sidebar.Group>
                        </Sidebar.Content>
                    </Sidebar.Root>
                    <Sidebar.Inset>
                        <header className="flex h-12 items-center gap-2 border-b border-palette-line px-3">
                            <Sidebar.Trigger />
                        </header>
                    </Sidebar.Inset>
                </Sidebar.Provider>
            </div>
        </div>
    );
}

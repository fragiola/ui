import { Sidebar } from "#/components/ui/sidebar";

// MenuSkeleton rows, with and without an icon — the Skeleton component, laid
// out as a menu item. The text widths vary between rows (50–90%) and are the
// same on every render: they come from useId, not Math.random.

export default function SidebarLoading() {
    return (
        <div className="palette-surface h-96 w-[40rem] overflow-hidden rounded-lg border border-palette-line">
            <Sidebar.Provider className="h-full min-h-0">
                <Sidebar.Root collapsible="none">
                    <Sidebar.Content>
                        <Sidebar.Group>
                            <Sidebar.GroupLabel>With icon</Sidebar.GroupLabel>
                            <Sidebar.Menu>
                                {[1, 2, 3, 4].map((row) => (
                                    <Sidebar.MenuItem key={row}>
                                        <Sidebar.MenuSkeleton showIcon />
                                    </Sidebar.MenuItem>
                                ))}
                            </Sidebar.Menu>
                        </Sidebar.Group>
                        <Sidebar.Group>
                            <Sidebar.GroupLabel>Text only</Sidebar.GroupLabel>
                            <Sidebar.Menu>
                                {[1, 2, 3].map((row) => (
                                    <Sidebar.MenuItem key={row}>
                                        <Sidebar.MenuSkeleton />
                                    </Sidebar.MenuItem>
                                ))}
                            </Sidebar.Menu>
                        </Sidebar.Group>
                    </Sidebar.Content>
                </Sidebar.Root>
                <Sidebar.Inset />
            </Sidebar.Provider>
        </div>
    );
}

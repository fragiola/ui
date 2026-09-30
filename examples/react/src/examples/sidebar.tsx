"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import {
    BookOpenIcon,
    ChevronRightIcon,
    ChevronsUpDownIcon,
    FolderIcon,
    HomeIcon,
    InboxIcon,
    MoreHorizontalIcon,
    PlusIcon,
    SettingsIcon,
} from "lucide-react";
import { Avatar } from "#/components/ui/avatar";
import { Breadcrumb } from "#/components/ui/breadcrumb";
import { Collapsible } from "#/components/ui/collapsible";
import { DropdownMenu } from "#/components/ui/dropdown-menu";
import { Separator } from "#/components/ui/separator";
import { Sidebar } from "#/components/ui/sidebar";

// An app shell. The sidebar is palette-raised; the page beside it (the Inset)
// is palette-surface. Everything in the column is a component the library
// already has, put in place by the sidebar's parts:
//
// - the team switcher and the user menu are DropdownMenus whose trigger is a
//   Sidebar.MenuButton (through `render`);
// - the "…" on a project is a DropdownMenu triggered by a Sidebar.MenuAction;
// - Documentation is a collapsible sub-menu: Base UI's Collapsible gives the
//   behaviour, the MenuButton is its trigger (through `render`) and
//   Collapsible.Panel brings the height animation. The styled
//   Collapsible.Root and .Trigger are not used — they draw a bordered
//   disclosure row, and the MenuButton already is the row.
//
// The sidebar collapses to icons (Ctrl/⌘+B, the trigger, or the rail); the
// icons then show their label in a tooltip. Narrower than 42rem, it becomes
// a Drawer.

const PROJECTS = ["Design system", "Marketing site", "Mobile app"];

export default function SidebarDemo() {
    return (
        <Sidebar.Provider>
            <Sidebar.Root collapsible="icon">
                <Sidebar.Header>
                    <Sidebar.Menu>
                        <Sidebar.MenuItem>
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger
                                    render={<Sidebar.MenuButton size="lg" />}
                                >
                                    <span className="palette-blue flex size-8 shrink-0 items-center justify-center rounded-md bg-palette-base text-palette-contrast">
                                        F
                                    </span>
                                    <span className="flex min-w-0 flex-col leading-tight">
                                        <span className="truncate font-medium text-palette-contrast">
                                            Fragiola
                                        </span>
                                        <span className="truncate text-xs">
                                            Team plan
                                        </span>
                                    </span>
                                    <ChevronsUpDownIcon className="ms-auto" />
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content
                                    side="inline-end"
                                    align="start"
                                >
                                    <DropdownMenu.Group>
                                        <DropdownMenu.Label>
                                            Teams
                                        </DropdownMenu.Label>
                                        <DropdownMenu.Item>
                                            Fragiola
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item>
                                            Acme
                                        </DropdownMenu.Item>
                                    </DropdownMenu.Group>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        </Sidebar.MenuItem>
                    </Sidebar.Menu>
                    <Sidebar.Input placeholder="Search" aria-label="Search" />
                </Sidebar.Header>

                <Sidebar.Content>
                    <Sidebar.Group>
                        <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
                        <Sidebar.GroupContent>
                            <Sidebar.Menu>
                                <Sidebar.MenuItem>
                                    <Sidebar.MenuButton
                                        isActive
                                        tooltip="Home"
                                        render={<a href="#home" />}
                                    >
                                        <HomeIcon />
                                        <span>Home</span>
                                    </Sidebar.MenuButton>
                                </Sidebar.MenuItem>
                                <Sidebar.MenuItem>
                                    <Sidebar.MenuButton
                                        tooltip="Inbox"
                                        render={<a href="#inbox" />}
                                    >
                                        <InboxIcon />
                                        <span>Inbox</span>
                                    </Sidebar.MenuButton>
                                    <Sidebar.MenuBadge>12</Sidebar.MenuBadge>
                                </Sidebar.MenuItem>
                                <CollapsiblePrimitive.Root
                                    defaultOpen
                                    render={<Sidebar.MenuItem />}
                                >
                                    <CollapsiblePrimitive.Trigger
                                        render={
                                            <Sidebar.MenuButton tooltip="Documentation" />
                                        }
                                    >
                                        <BookOpenIcon />
                                        <span>Documentation</span>
                                        <ChevronRightIcon className="ms-auto transition-transform rtl:-scale-x-100 in-data-panel-open:rotate-90 rtl:in-data-panel-open:-rotate-90" />
                                    </CollapsiblePrimitive.Trigger>
                                    <Collapsible.Panel>
                                        <Sidebar.MenuSub>
                                            {[
                                                "Introduction",
                                                "Get started",
                                                "Tutorials",
                                            ].map((page) => (
                                                <Sidebar.MenuSubItem key={page}>
                                                    <Sidebar.MenuSubButton href="#docs">
                                                        <span>{page}</span>
                                                    </Sidebar.MenuSubButton>
                                                </Sidebar.MenuSubItem>
                                            ))}
                                        </Sidebar.MenuSub>
                                    </Collapsible.Panel>
                                </CollapsiblePrimitive.Root>
                            </Sidebar.Menu>
                        </Sidebar.GroupContent>
                    </Sidebar.Group>

                    <Sidebar.Group>
                        <Sidebar.GroupLabel>Projects</Sidebar.GroupLabel>
                        <Sidebar.GroupAction aria-label="New project">
                            <PlusIcon />
                        </Sidebar.GroupAction>
                        <Sidebar.GroupContent>
                            <Sidebar.Menu>
                                {PROJECTS.map((project) => (
                                    <Sidebar.MenuItem key={project}>
                                        <Sidebar.MenuButton
                                            tooltip={project}
                                            render={<a href="#project" />}
                                        >
                                            <FolderIcon />
                                            <span>{project}</span>
                                        </Sidebar.MenuButton>
                                        <DropdownMenu.Root>
                                            <DropdownMenu.Trigger
                                                render={
                                                    <Sidebar.MenuAction
                                                        showOnHover
                                                        aria-label={`${project} actions`}
                                                    />
                                                }
                                            >
                                                <MoreHorizontalIcon />
                                            </DropdownMenu.Trigger>
                                            <DropdownMenu.Content
                                                side="inline-end"
                                                align="start"
                                            >
                                                <DropdownMenu.Item>
                                                    Open
                                                </DropdownMenu.Item>
                                                <DropdownMenu.Item>
                                                    Share
                                                </DropdownMenu.Item>
                                                <DropdownMenu.Separator />
                                                <DropdownMenu.Item className="palette-danger">
                                                    Delete
                                                </DropdownMenu.Item>
                                            </DropdownMenu.Content>
                                        </DropdownMenu.Root>
                                    </Sidebar.MenuItem>
                                ))}
                            </Sidebar.Menu>
                        </Sidebar.GroupContent>
                    </Sidebar.Group>
                </Sidebar.Content>

                <Sidebar.Footer>
                    <Sidebar.Menu>
                        <Sidebar.MenuItem>
                            <Sidebar.MenuButton
                                tooltip="Settings"
                                render={<a href="#settings" />}
                            >
                                <SettingsIcon />
                                <span>Settings</span>
                            </Sidebar.MenuButton>
                        </Sidebar.MenuItem>
                        <Sidebar.MenuItem>
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger
                                    render={<Sidebar.MenuButton size="lg" />}
                                >
                                    <Avatar.Root className="size-8 rounded-md">
                                        <Avatar.Fallback className="rounded-md">
                                            AL
                                        </Avatar.Fallback>
                                    </Avatar.Root>
                                    <span className="flex min-w-0 flex-col leading-tight">
                                        <span className="truncate font-medium text-palette-contrast">
                                            Ada Lovelace
                                        </span>
                                        <span className="truncate text-xs">
                                            ada@example.com
                                        </span>
                                    </span>
                                    <ChevronsUpDownIcon className="ms-auto" />
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content
                                    side="inline-end"
                                    align="end"
                                >
                                    <DropdownMenu.Item>
                                        Account
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Item>
                                        Billing
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Separator />
                                    <DropdownMenu.Item>
                                        Log out
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        </Sidebar.MenuItem>
                    </Sidebar.Menu>
                </Sidebar.Footer>
                <Sidebar.Rail />
            </Sidebar.Root>

            <Sidebar.Inset>
                <header className="flex h-14 shrink-0 items-center gap-2 border-b border-palette-line px-3">
                    <Sidebar.Trigger />
                    <Separator orientation="vertical" className="h-4" />
                    <Breadcrumb.Root>
                        <Breadcrumb.List>
                            <Breadcrumb.Item>
                                <Breadcrumb.Link href="#platform">
                                    Platform
                                </Breadcrumb.Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Separator>
                                <ChevronRightIcon className="rtl:-scale-x-100" />
                            </Breadcrumb.Separator>
                            <Breadcrumb.Item>
                                <Breadcrumb.Page>Home</Breadcrumb.Page>
                            </Breadcrumb.Item>
                        </Breadcrumb.List>
                    </Breadcrumb.Root>
                </header>
                <div className="grid flex-1 auto-rows-min grid-cols-3 gap-4 p-4">
                    <div className="aspect-video rounded-lg bg-palette-soft" />
                    <div className="aspect-video rounded-lg bg-palette-soft" />
                    <div className="aspect-video rounded-lg bg-palette-soft" />
                    <div className="col-span-3 min-h-48 rounded-lg bg-palette-soft" />
                </div>
            </Sidebar.Inset>
        </Sidebar.Provider>
    );
}

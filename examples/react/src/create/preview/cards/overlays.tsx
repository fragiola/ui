import {
    BoldIcon,
    FileTextIcon,
    ItalicIcon,
    LockIcon,
    SettingsIcon,
    UnderlineIcon,
} from "lucide-react";
import { Badge } from "#/components/atoms/badge";
import { Clickable } from "#/components/atoms/clickable";
import { Input } from "#/components/atoms/fields";
import { AlertDialog } from "#/components/ui/alert-dialog";
import { ContextMenu } from "#/components/ui/context-menu";
import { Dialog } from "#/components/ui/dialog";
import { Drawer } from "#/components/ui/drawer";
import { DropdownMenu } from "#/components/ui/dropdown-menu";
import { Field } from "#/components/ui/field";
import { Popover } from "#/components/ui/popover";
import { Tooltip } from "#/components/ui/tooltip";
import { Card, useTone } from "../card";

// Overlays: every floating surface, opened from a card — the overlay's edge,
// shadow and motion follow the elevation and motion axes.

export function EditProfile() {
    const { action, control } = useTone();
    return (
        <Card
            title="Profile"
            description="Edit opens a dialog; delete asks first."
        >
            <div className="flex flex-wrap gap-2">
                <Dialog.Root>
                    <Dialog.Trigger
                        render={
                            <Clickable.Button variant="outline" size="sm" />
                        }
                    >
                        Edit profile
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <Dialog.Backdrop />
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Edit profile</Dialog.Title>
                                <Dialog.Description>
                                    Make changes to your profile, then save.
                                </Dialog.Description>
                            </Dialog.Header>
                            <Dialog.Body className={control}>
                                <Field.Root>
                                    <Field.Label>Name</Field.Label>
                                    <Field.Row>
                                        <Field.Body>
                                            <Input defaultValue="Ada Lovelace" />
                                        </Field.Body>
                                    </Field.Row>
                                </Field.Root>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Dialog.Close
                                    render={
                                        <Clickable.Button variant="outline" />
                                    }
                                >
                                    Cancel
                                </Dialog.Close>
                                <Dialog.Close
                                    render={
                                        <Clickable.Button className={action} />
                                    }
                                >
                                    Save
                                </Dialog.Close>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
                <AlertDialog.Root>
                    <AlertDialog.Trigger
                        render={
                            <Clickable.Button
                                variant="outline"
                                size="sm"
                                className="palette-danger"
                            />
                        }
                    >
                        Delete account
                    </AlertDialog.Trigger>
                    <AlertDialog.Portal>
                        <AlertDialog.Backdrop />
                        <AlertDialog.Content>
                            <AlertDialog.Header>
                                <AlertDialog.Title>
                                    Delete your account?
                                </AlertDialog.Title>
                                <AlertDialog.Description>
                                    This removes every project. It cannot be
                                    undone.
                                </AlertDialog.Description>
                            </AlertDialog.Header>
                            <AlertDialog.Footer>
                                <AlertDialog.Close
                                    render={
                                        <Clickable.Button variant="outline" />
                                    }
                                >
                                    Cancel
                                </AlertDialog.Close>
                                <AlertDialog.Close
                                    render={
                                        <Clickable.Button className="palette-danger" />
                                    }
                                >
                                    Delete
                                </AlertDialog.Close>
                            </AlertDialog.Footer>
                        </AlertDialog.Content>
                    </AlertDialog.Portal>
                </AlertDialog.Root>
            </div>
        </Card>
    );
}

export function SettingsDrawer() {
    const { action } = useTone();
    return (
        <Card title="Workspace" description="Settings slide in from the side.">
            <Drawer.Root swipeDirection="right">
                <Drawer.Trigger
                    render={<Clickable.Button variant="outline" size="sm" />}
                >
                    <SettingsIcon />
                    Open settings
                </Drawer.Trigger>
                <Drawer.Portal>
                    <Drawer.Backdrop />
                    <Drawer.Popup side="right">
                        <Drawer.Content>
                            <Drawer.Header>
                                <Drawer.Title>Workspace settings</Drawer.Title>
                                <Drawer.Description>
                                    Name, region and billing.
                                </Drawer.Description>
                            </Drawer.Header>
                            <Drawer.Footer>
                                <Drawer.Close
                                    render={
                                        <Clickable.Button className={action} />
                                    }
                                >
                                    Done
                                </Drawer.Close>
                            </Drawer.Footer>
                        </Drawer.Content>
                    </Drawer.Popup>
                </Drawer.Portal>
            </Drawer.Root>
        </Card>
    );
}

export function ShareMenu() {
    const { action, control } = useTone();
    return (
        <Card title="Share" description="A popover and a dropdown.">
            <div className="flex flex-wrap gap-2">
                <Popover.Root>
                    <Popover.Trigger
                        render={
                            <Clickable.Button variant="outline" size="sm" />
                        }
                    >
                        Share link
                    </Popover.Trigger>
                    <Popover.Content align="start" sideOffset={4}>
                        <div
                            className={`${control} flex w-64 flex-col gap-3 p-4`}
                        >
                            <Popover.Title>Anyone with the link</Popover.Title>
                            <Field.Root>
                                <Field.Row>
                                    <Field.Body>
                                        <Input
                                            readOnly
                                            defaultValue="https://fragiola.com/s/a1b2"
                                        />
                                    </Field.Body>
                                </Field.Row>
                            </Field.Root>
                            <Clickable.Button className={action} size="sm">
                                Copy link
                            </Clickable.Button>
                        </div>
                    </Popover.Content>
                </Popover.Root>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                        render={
                            <Clickable.Button variant="outline" size="sm" />
                        }
                    >
                        Export
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item>PDF</DropdownMenu.Item>
                        <DropdownMenu.Item>CSV</DropdownMenu.Item>
                        <DropdownMenu.Item disabled>Excel</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </div>
        </Card>
    );
}

export function Toolbar() {
    const tools = [
        [BoldIcon, "Bold", "⌘B"],
        [ItalicIcon, "Italic", "⌘I"],
        [UnderlineIcon, "Underline", "⌘U"],
    ] as const;
    return (
        <Card title="Toolbar" description="Hover a tool for its tooltip.">
            <div className="flex items-center gap-1">
                {tools.map(([Icon, label, keys]) => (
                    <Tooltip.Root key={label}>
                        <Tooltip.Trigger
                            render={
                                <Clickable.Button
                                    variant="icon"
                                    shape="square"
                                    aria-label={label}
                                />
                            }
                        >
                            <Icon />
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                            {label} {keys}
                        </Tooltip.Content>
                    </Tooltip.Root>
                ))}
            </div>
        </Card>
    );
}

export function FileContext() {
    return (
        <Card title="Context menu" description="Right-click the file.">
            <ContextMenu.Root>
                <ContextMenu.Trigger className="flex items-center gap-3 rounded-md border border-dashed border-palette-line p-4">
                    <FileTextIcon className="size-icon" />
                    <span className="text-sm">Quarterly report.pdf</span>
                </ContextMenu.Trigger>
                <ContextMenu.Content>
                    <ContextMenu.Item>Open</ContextMenu.Item>
                    <ContextMenu.Item>Rename</ContextMenu.Item>
                    <ContextMenu.Separator />
                    <ContextMenu.Item className="palette-danger">
                        Delete
                    </ContextMenu.Item>
                </ContextMenu.Content>
            </ContextMenu.Root>
        </Card>
    );
}

export function SmartLock() {
    return (
        <Card
            title="Front door"
            description="Smart Lock Pro"
            action={
                <span className="flex items-center gap-1 text-xs text-palette-accent/85">
                    Locked
                    <LockIcon className="size-icon-xs" />
                </span>
            }
        >
            <div className="relative flex aspect-video items-center justify-center rounded-md bg-palette-soft bg-[repeating-linear-gradient(135deg,transparent_0_10px,var(--color-palette-line)_10px_11px)]">
                <Badge
                    variant="soft"
                    className="palette-danger absolute end-2 top-2"
                >
                    Live
                </Badge>
                <LockIcon className="size-icon-lg text-palette-accent/85" />
            </div>
        </Card>
    );
}

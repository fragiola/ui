"use client";

import type { ReactNode } from "react";
import { Clickable } from "#/atoms/clickable";
import { AlertDialog } from "#/ui/alert-dialog";

// The floor is palette-surface. The dialog content travels through a portal
// but inherits the palette from the owning subtree. The destructive button
// carries palette-danger explicitly — the one chromatic exception for a
// destructive confirm action.
export default function AlertDialogDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            <Row label="destructive confirm">
                <AlertDialog.Root>
                    <AlertDialog.Trigger
                        render={
                            <Clickable.Button
                                variant="outline"
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
                                    Are you absolutely sure?
                                </AlertDialog.Title>
                                <AlertDialog.Description>
                                    This action cannot be undone. This will
                                    permanently delete your account and remove
                                    your data from our servers.
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
                                <Clickable.Button className="palette-danger">
                                    Delete
                                </Clickable.Button>
                            </AlertDialog.Footer>
                        </AlertDialog.Content>
                    </AlertDialog.Portal>
                </AlertDialog.Root>
            </Row>

            <Row label="non-destructive">
                <AlertDialog.Root>
                    <AlertDialog.Trigger
                        render={<Clickable.Button variant="outline" />}
                    >
                        Publish
                    </AlertDialog.Trigger>
                    <AlertDialog.Portal>
                        <AlertDialog.Backdrop />
                        <AlertDialog.Content>
                            <AlertDialog.Header>
                                <AlertDialog.Title>
                                    Publish now?
                                </AlertDialog.Title>
                                <AlertDialog.Description>
                                    Once published, this post will be visible to
                                    everyone.
                                </AlertDialog.Description>
                            </AlertDialog.Header>
                            <AlertDialog.Footer>
                                <AlertDialog.Close
                                    render={
                                        <Clickable.Button variant="outline" />
                                    }
                                >
                                    Not now
                                </AlertDialog.Close>
                                <Clickable.Button variant="solid">
                                    Publish
                                </Clickable.Button>
                            </AlertDialog.Footer>
                        </AlertDialog.Content>
                    </AlertDialog.Portal>
                </AlertDialog.Root>
            </Row>
        </div>
    );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-palette-accent/85">
                {label}
            </span>
            <div className="flex flex-wrap items-center gap-4">{children}</div>
        </div>
    );
}

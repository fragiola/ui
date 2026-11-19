"use client";

import { Clickable } from "#/components/atoms/clickable";
import { AlertDialog } from "#/components/ui/alert-dialog";

// Two confirmations an app would ask for, in the default look: deleting an
// account, whose confirm action carries palette-danger (a class, not a
// prop), and publishing a post, whose confirm action is the primary
// palette-neutral. The content travels through a portal and inherits the
// floor's palette from the owning subtree.
export default function AlertDialogDemo() {
    return (
        <div className="palette-surface flex flex-wrap items-center gap-4 bg-palette-base text-palette-contrast">
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
                                permanently delete your account and remove your
                                data from our servers.
                            </AlertDialog.Description>
                        </AlertDialog.Header>
                        <AlertDialog.Footer>
                            <AlertDialog.Close
                                render={<Clickable.Button variant="outline" />}
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
                            <AlertDialog.Title>Publish now?</AlertDialog.Title>
                            <AlertDialog.Description>
                                Once published, this post will be visible to
                                everyone.
                            </AlertDialog.Description>
                        </AlertDialog.Header>
                        <AlertDialog.Footer>
                            <AlertDialog.Close
                                render={<Clickable.Button variant="outline" />}
                            >
                                Not now
                            </AlertDialog.Close>
                            <Clickable.Button className="palette-neutral">
                                Publish
                            </Clickable.Button>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
        </div>
    );
}

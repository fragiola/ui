"use client";

import { Clickable } from "#/atoms/clickable";
import { AlertDialog } from "#/ui/alert-dialog";

export default function AlertDialogDemo() {
    return (
        <div className="flex flex-wrap gap-4">
            {/* A destructive confirmation — done the Fragiola way:
                palette-danger on the action button, no variant="destructive". */}
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
                            {/* palette-danger applied from outside — no tone prop */}
                            <Clickable.Button className="palette-danger">
                                Delete
                            </Clickable.Button>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>

            {/* A non-destructive alert — no palette class, no tone prop */}
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
                            <Clickable.Button variant="solid">
                                Publish
                            </Clickable.Button>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
        </div>
    );
}

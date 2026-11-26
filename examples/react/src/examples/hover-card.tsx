"use client";

import { CalendarDaysIcon } from "lucide-react";
import { Text } from "#/components/atoms/text";
import { Avatar } from "#/components/ui/avatar";
import { HoverCard } from "#/components/ui/hover-card";

// A byline whose author is a link: hovering it, or reaching it with Tab,
// shows a preview of the profile after a short delay. The card stays open
// while the pointer is over it, so its own link can be followed; it never
// takes the focus. The link wears Text.Link through `render`.
export default function HoverCardDemo() {
    return (
        <div className="palette-surface flex flex-col gap-2 bg-palette-base text-palette-contrast">
            <Text.Paragraph>
                Notes on the Analytical Engine, translated and annotated by{" "}
                <HoverCard.Root>
                    <HoverCard.Trigger href="#ada" render={<Text.Link />}>
                        @ada
                    </HoverCard.Trigger>
                    <HoverCard.Content align="start">
                        <div className="flex gap-3">
                            <Avatar.Root>
                                <Avatar.Fallback>AL</Avatar.Fallback>
                            </Avatar.Root>
                            <div className="flex flex-col gap-1">
                                <Text.Strong>Ada Lovelace</Text.Strong>
                                <p className="text-sm text-palette-accent/85">
                                    Mathematician and writer. The first to
                                    publish an algorithm for a machine.
                                </p>
                                <span className="mt-1 flex items-center gap-1.5 text-xs text-palette-accent/85">
                                    <CalendarDaysIcon className="size-icon-sm" />
                                    Joined December 1842
                                </span>
                                <Text.Link
                                    href="#ada-profile"
                                    className="mt-1 w-fit text-xs"
                                >
                                    View profile
                                </Text.Link>
                            </div>
                        </div>
                    </HoverCard.Content>
                </HoverCard.Root>
                .
            </Text.Paragraph>
        </div>
    );
}

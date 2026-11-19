"use client";

import type { ReactNode } from "react";
import { Avatar } from "#/components/ui/avatar";

const MEMBERS = [
    { name: "Ada Lovelace", role: "Owner", src: 1, initials: "AL" },
    { name: "Grace Hopper", role: "Admin", src: 2, initials: "GH" },
    { name: "Alan Turing", role: "Member", src: null, initials: "AT" },
] as const;

// A workspace's member list in the default look: an avatar with an image,
// and one without, which shows its initials. Then the sizes, set with a
// size-* class, and a broken image falling back to the initials. No palette
// row: an avatar is not "a blue avatar".
export default function AvatarDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <ul className="flex max-w-sm flex-col gap-3">
                {MEMBERS.map((member) => (
                    <li key={member.name} className="flex items-center gap-3">
                        <Avatar.Root>
                            {member.src && (
                                <Avatar.Image
                                    src={`https://avatars.githubusercontent.com/u/${member.src}?v=4`}
                                    alt={member.name}
                                />
                            )}
                            <Avatar.Fallback>{member.initials}</Avatar.Fallback>
                        </Avatar.Root>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">
                                {member.name}
                            </span>
                            <span className="text-xs text-palette-accent/85">
                                {member.role}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>

            <Row label="size">
                <Avatar.Root>
                    <Avatar.Fallback>AL</Avatar.Fallback>
                </Avatar.Root>
                <Avatar.Root className="size-12">
                    <Avatar.Fallback>AL</Avatar.Fallback>
                </Avatar.Root>
                <Avatar.Root className="size-16">
                    <Avatar.Fallback>AL</Avatar.Fallback>
                </Avatar.Root>
            </Row>

            {/* the image fails to load: the fallback takes its place */}
            <Row label="broken image">
                <Avatar.Root>
                    <Avatar.Image src="/broken.jpg" alt="Broken" />
                    <Avatar.Fallback>??</Avatar.Fallback>
                </Avatar.Root>
            </Row>
        </div>
    );
}

// Row — a captioned row. The caption is a <span>, not a heading.
function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-palette-accent/85">
                {label}
            </span>
            <div className="flex items-center gap-4">{children}</div>
        </div>
    );
}

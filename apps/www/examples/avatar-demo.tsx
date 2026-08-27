"use client";

import type { ReactNode } from "react";
import { Avatar } from "#/ui/avatar";

// The floor is palette-surface. The avatar shows its real axes: image,
// fallback, broken image → fallback, and sizes. No palette showcasing — an
// avatar is not "a blue avatar".
export default function AvatarDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            <Row label="with image">
                <div className="flex items-center gap-4">
                    <Avatar.Root>
                        <Avatar.Image
                            src="https://avatars.githubusercontent.com/u/1?v=4"
                            alt="User"
                        />
                        <Avatar.Fallback>U</Avatar.Fallback>
                    </Avatar.Root>
                    <Avatar.Root className="size-12">
                        <Avatar.Image
                            src="https://avatars.githubusercontent.com/u/2?v=4"
                            alt="User"
                        />
                        <Avatar.Fallback>U</Avatar.Fallback>
                    </Avatar.Root>
                    <Avatar.Root className="size-16">
                        <Avatar.Image
                            src="https://avatars.githubusercontent.com/u/3?v=4"
                            alt="User"
                        />
                        <Avatar.Fallback>U</Avatar.Fallback>
                    </Avatar.Root>
                </div>
            </Row>

            <Row label="fallback (no image)">
                <div className="flex items-center gap-4">
                    <Avatar.Root>
                        <Avatar.Fallback>JS</Avatar.Fallback>
                    </Avatar.Root>
                    <Avatar.Root className="size-12">
                        <Avatar.Fallback>AB</Avatar.Fallback>
                    </Avatar.Root>
                    <Avatar.Root className="size-16">
                        <Avatar.Fallback>CN</Avatar.Fallback>
                    </Avatar.Root>
                </div>
            </Row>

            <Row label="broken image → fallback">
                <div className="flex items-center gap-4">
                    <Avatar.Root>
                        <Avatar.Image src="/broken.jpg" alt="Broken" />
                        <Avatar.Fallback>??</Avatar.Fallback>
                    </Avatar.Root>
                </div>
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
            {children}
        </div>
    );
}

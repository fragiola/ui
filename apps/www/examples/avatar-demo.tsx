"use client";

import { Avatar } from "#/ui/avatar";

export default function AvatarDemo() {
    return (
        <div className="flex flex-col gap-8">
            {/* With image */}
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

            {/* Fallback (no image) */}
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

            {/* Broken image → fallback */}
            <div className="flex items-center gap-4">
                <Avatar.Root>
                    <Avatar.Image src="/broken.jpg" alt="Broken" />
                    <Avatar.Fallback>??</Avatar.Fallback>
                </Avatar.Root>
            </div>
        </div>
    );
}

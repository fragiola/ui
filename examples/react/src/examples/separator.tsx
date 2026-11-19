"use client";

import { Separator } from "#/components/ui/separator";

// An account summary in the default look: the separator reads the floor's
// line role, the same colour as every border. Horizontal between sections,
// vertical between the inline links of a footer.
export default function SeparatorDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex w-full max-w-sm flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Ada Lovelace</span>
                    <span className="text-sm text-palette-accent/85">
                        ada@example.com
                    </span>
                </div>
                <Separator />
                <dl className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                        <dt className="text-palette-accent/85">Plan</dt>
                        <dd>Team</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-palette-accent/85">Seats</dt>
                        <dd>8 of 10</dd>
                    </div>
                </dl>
                <Separator />
                <div className="flex h-5 items-center gap-3 text-sm">
                    <a href="#billing" className="hover:underline">
                        Billing
                    </a>
                    <Separator orientation="vertical" />
                    <a href="#security" className="hover:underline">
                        Security
                    </a>
                    <Separator orientation="vertical" />
                    <a href="#sign-out" className="hover:underline">
                        Sign out
                    </a>
                </div>
            </div>
        </div>
    );
}

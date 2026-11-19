"use client";

import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";
import { Clickable } from "#/components/atoms/clickable";
import { Tooltip } from "#/components/ui/tooltip";

const ACTIONS = [
    { label: "Bold", shortcut: "⌘B", icon: BoldIcon },
    { label: "Italic", shortcut: "⌘I", icon: ItalicIcon },
    { label: "Underline", shortcut: "⌘U", icon: UnderlineIcon },
] as const;

// An editor toolbar, in the default look: icon buttons whose names live in
// tooltips. The tooltip travels through a portal and inherits the floor's
// palette from the owning subtree. The provider shares the delay between
// triggers: once one tooltip is open, moving to the next button opens its
// tooltip without waiting again.
export default function TooltipDemo() {
    return (
        <div className="palette-surface flex items-center gap-1 bg-palette-base text-palette-contrast">
            <Tooltip.Provider>
                {ACTIONS.map(({ label, shortcut, icon: Icon }) => (
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
                            {label} {shortcut}
                        </Tooltip.Content>
                    </Tooltip.Root>
                ))}
            </Tooltip.Provider>
        </div>
    );
}

"use client";

import type { ReactNode } from "react";
import { Text } from "#/components/atoms/text";
import { Clipboard } from "#/components/ui/clipboard";

// The surface-tier palettes: the neutral surface with one chromatic ring, so
// only the focus ring and the copied check take colour. Literal here because
// examples are published source (the code panel shows this file verbatim,
// with a copy button).
const SURFACE_RING = [
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

// An API key and an install command in the default look:
// Clipboard.Template.Simple shows the value read-only beside a copy button;
// a press copies it, the button's icon becomes a `ring` check for a while,
// and "Copied to clipboard" is announced to a screen reader without the
// focus moving. Then a share button composed from the parts: its children
// are a function of the state, so its visible text, "Copy link" and then
// "Copied", is also its accessible name (no `aria-label`; the Indicator's
// icon is hidden from assistive technology), and last the same clipboard
// in each surface-ring palette.
export default function ClipboardDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex max-w-md flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Text.Label htmlFor="api-key">API key</Text.Label>
                    <Clipboard.Template.Simple
                        value="sk_live_51HxFragiolaExampleKey"
                        id="api-key"
                        aria-label="API key"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Install</span>
                    <Clipboard.Template.Simple
                        value="npx shadcn@latest add @fragiola/clipboard"
                        aria-label="Install command"
                    />
                </div>
                <Clipboard.Root
                    value="https://fragiola.com/ui"
                    announcement="Link copied"
                >
                    <Clipboard.Trigger className="aspect-auto px-3">
                        {({ copied }) => (
                            <>
                                <Clipboard.Indicator />
                                {copied ? "Copied" : "Copy link"}
                            </>
                        )}
                    </Clipboard.Trigger>
                </Clipboard.Root>
            </div>

            {/* the same clipboard, only its palette-* class changed */}
            <Row label="palettes">
                {SURFACE_RING.map((palette) => (
                    <Clipboard.Template.Simple
                        key={palette}
                        value={palette}
                        aria-label={`Palette name, ${palette}`}
                        className={`palette-${palette} w-48`}
                    />
                ))}
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
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {children}
            </div>
        </div>
    );
}

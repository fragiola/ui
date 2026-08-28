"use client";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Clickable } from "#/atoms/clickable";
import { Reveal } from "@/components/landing/reveal";

// Hero — the first screen. Says what Fragiola is and where the documentation
// is, and nothing else.
//
// The decorative layer is absolutely positioned behind the content rather than
// escaping the container width: a 100vw trick disagrees with the scrollbar and
// has to be mirrored under RTL, while an inset-0 layer inside a normal
// container does neither.
//
// Both calls to action are Clickable.Link with `render={<Link />}` — links
// that look like buttons. `render` is the project's single polymorphism
// mechanism (rule 5), and Clickable.Link is the export whose stated purpose is
// stitching a router's link through it, so navigation keeps anchor semantics
// (middle-click, open in new tab) instead of borrowing a button's.
//
// The primary call to action carries `palette-blue` itself: the floor stays
// neutral and the palette goes on the element (Epic #39).

export function Hero() {
    return (
        <section className="relative isolate overflow-hidden">
            <HeroBackdrop />

            <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6 px-6 py-24 sm:min-h-[34rem] sm:justify-center sm:py-32">
                <Reveal className="flex flex-col items-start gap-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-palette-accent/85">
                        Base UI · Tailwind v4 · copy &amp; paste
                    </p>

                    <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-palette-contrast sm:text-5xl lg:text-6xl">
                        Components that take the colour you give them.
                    </h1>

                    <p className="max-w-2xl text-pretty text-base text-palette-accent/85 sm:text-lg">
                        A copy-paste component library built on Base UI and
                        Tailwind v4. Six colour roles, any number of palettes —
                        scope one to a page, a card, or a single button.
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-3">
                        <Clickable.Link
                            className="palette-blue"
                            render={<Link href="/docs" />}
                            size="md"
                            variant="solid"
                        >
                            Read the documentation
                            <ArrowRightIcon className="rtl:rotate-180" />
                        </Clickable.Link>

                        <Clickable.Link
                            render={<Link href="/docs/architecture/theming" />}
                            size="md"
                            variant="outline"
                        >
                            How theming works
                        </Clickable.Link>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

// The decorative layer. Three stacked absolute layers, all painted from roles:
// a grid drawn with var(--palette-line) (see .landing-grid in globals.css), a
// glow from `soft`, and a gradient that fades both into `base` so the hero
// meets the next section without a seam.
function HeroBackdrop() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
            <div className="landing-grid absolute inset-0 opacity-50" />
            <div className="absolute inset-x-0 -top-40 mx-auto h-96 w-full max-w-4xl rounded-full bg-radial from-palette-soft to-transparent blur-3xl" />
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-palette-base" />
        </div>
    );
}

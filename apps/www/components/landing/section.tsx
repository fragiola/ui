import type { ReactNode } from "react";
import { cn } from "#/lib/cn";
import { Reveal } from "@/components/landing/reveal";

// Section — the landing page's section shell: eyebrow, title, lead, body.
//
// Every scrolled section on the page is one of these, so the rhythm (measure,
// vertical spacing, the rule between sections) is decided once. The header
// block is wrapped in Reveal; a section that wants its body revealed too
// wraps its own children, since a body's entrance usually wants a different
// grain (per card, per row) than the heading.

type SectionProps = {
    id?: string;
    eyebrow: string;
    title: string;
    lead?: ReactNode;
    className?: string;
    children?: ReactNode;
};

export function Section({
    id,
    eyebrow,
    title,
    lead,
    className,
    children,
}: SectionProps) {
    return (
        <section
            className={cn(
                "border-t border-palette-line py-20 sm:py-28",
                className,
            )}
            id={id}
        >
            <div className="mx-auto w-full max-w-5xl px-6">
                <Reveal className="flex max-w-2xl flex-col gap-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-palette-accent/85">
                        {eyebrow}
                    </p>
                    <h2 className="text-balance text-2xl font-semibold tracking-tight text-palette-contrast sm:text-3xl">
                        {title}
                    </h2>
                    {lead ? (
                        <p className="text-pretty text-base text-palette-accent/85">
                            {lead}
                        </p>
                    ) : null}
                </Reveal>

                {children ? <div className="mt-12">{children}</div> : null}
            </div>
        </section>
    );
}

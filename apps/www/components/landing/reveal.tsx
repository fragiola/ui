import type { ReactNode } from "react";
import { cn } from "#/lib/cn";

// Reveal — the landing page's single entrance mechanism.
//
// It adds one class. Everything else lives in app/globals.css: a scroll-driven
// keyframe applied only inside `@supports (animation-timeline: view())` and
// only when motion is not reduced. There is no JS, no observer and no
// animation runtime — and, crucially, no hidden default state. Where the
// timeline is unsupported the element simply renders as it is.
//
// One mechanism on purpose: a second one (an observer, a library) would mean
// two answers to the same question, which is the duplication this project
// exists to avoid.

type RevealProps = {
    className?: string;
    children: ReactNode;
};

export function Reveal({ className, children }: RevealProps) {
    return <div className={cn("landing-reveal", className)}>{children}</div>;
}

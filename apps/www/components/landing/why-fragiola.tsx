import { Reveal } from "@/components/landing/reveal";
import { Section } from "@/components/landing/section";

// "Why Fragiola exists" — the three problems, in prose.
//
// Deliberately without the measured figures: they live in
// docs/architecture.md, where they can be revised with their reasoning
// attached. A landing page that quotes counts starts lying the moment the
// port continues. shadcn/ui is named once, as the baseline whose registry
// format and CLI Fragiola reuses — it is the thing this project builds on,
// not something to argue with.

const PROBLEMS = [
    {
        title: "Colour you can scope",
        body: "A single global token set makes one decision for the whole application: switching a theme redefines every surface at once, and there is no way to tint one region while the rest of the page stays neutral. Fragiola applies colour with a class, so a page, a card or one button can carry its own palette — and no component needs a colour variant to make it happen.",
    },
    {
        title: "Styles shared, not pasted",
        body: "Components that share a visual skeleton should share the CSS that draws it. When each one keeps a private copy, the copies drift: one sibling loses its close animation, another gains a padding nobody chose, and a fix has to be applied as many times as it was pasted. Fragiola gives each skeleton one home — a style family — and every component that looks like it consumes that.",
    },
    {
        title: "One component per idea",
        body: "The same wrapper written twice for two menus, several ways to write an input, a button re-wrapped for each context: every duplicate is another place the next change has to reach. Fragiola builds those families from one factory, so there is a single component per idea and a single place to change it.",
    },
] as const;

export function WhyFragiola() {
    return (
        <Section
            eyebrow="Why it exists"
            id="why"
            lead="Fragiola starts from shadcn/ui — it reuses its registry format and its CLI, so installing a component is the command you already know. Three things about that baseline stopped scaling, and each one shaped a decision here."
            title="Three problems, three decisions"
        >
            <ul className="grid gap-4 sm:grid-cols-3">
                {PROBLEMS.map((problem, index) => (
                    <li className="flex" key={problem.title}>
                        <Reveal className="palette-raised flex flex-1 flex-col gap-3 rounded-lg border border-palette-line bg-palette-base p-6 transition-colors hover:border-palette-ring">
                            <span className="text-xs font-semibold text-palette-accent/85">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <h3 className="text-base font-semibold text-palette-contrast">
                                {problem.title}
                            </h3>
                            <p className="text-sm text-palette-accent/85">
                                {problem.body}
                            </p>
                        </Reveal>
                    </li>
                ))}
            </ul>
        </Section>
    );
}

import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc";
import { Reveal } from "@/components/landing/reveal";
import { Section } from "@/components/landing/section";

// "The token system" — the one idea everything else follows from.
//
// The role names and their meanings are copied from docs/architecture.md §1,
// which is the authority. If this section and that table ever disagree, the
// table wins and this file is wrong.
//
// The snippet is illustrative copy, not a live preview: it is a string, read
// by nobody at runtime, highlighted server-side by Fumadocs' ServerCodeBlock —
// the same one the docs use, so there is one code-block treatment on the site.

const ROLES = [
    {
        name: "base",
        body: "The colour of this palette — a background, or a fill.",
    },
    {
        name: "soft",
        body: "A subtle background: an alert, a badge, a hover, a field's surface.",
    },
    { name: "line", body: "Stroke." },
    {
        name: "contrast",
        body: "Content on base — the text on what you painted.",
    },
    {
        name: "accent",
        body: "Content on a foreign background, or on soft.",
    },
    {
        name: "ring",
        body: "The interaction highlight: focus, active. The only role drawn outside the element.",
    },
] as const;

// Kept narrow on purpose: the block sits in one column of a two-column grid,
// and a longer line would only be reachable by scrolling it sideways.
const SNIPPET = `// The floor is neutral.
<div className="palette-surface bg-palette-base">
    {/* The palette goes on the element. */}
    <Clickable.Button className="palette-danger">
        Delete
    </Clickable.Button>
</div>`;

export function TokenSystem() {
    return (
        <Section
            eyebrow="The token system"
            id="tokens"
            lead="A palette is six roles applied by class. Components read roles, never colours — so the same button is at home in any palette, and none of them needs a colour variant."
            title="Six roles, any number of palettes"
        >
            <div className="flex flex-col gap-12">
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {ROLES.map((role) => (
                        <li className="flex" key={role.name}>
                            <Reveal className="palette-raised flex flex-1 flex-col gap-2 rounded-lg border border-palette-line bg-palette-base p-5">
                                <code className="w-fit rounded-sm bg-palette-soft px-2 py-0.5 font-mono text-xs text-palette-contrast">
                                    {role.name}
                                </code>
                                <p className="text-sm text-palette-accent/85">
                                    {role.body}
                                </p>
                            </Reveal>
                        </li>
                    ))}
                </ul>

                <Reveal className="grid gap-8 lg:grid-cols-2 lg:items-center">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-palette-contrast">
                            The number of palettes is free. The number of roles
                            is not.
                        </h3>
                        <p className="text-sm text-palette-accent/85">
                            Six roles, every palette declaring all six. When
                            something does not fit, the answer is another
                            palette — never a seventh role. That is what keeps
                            the contract closed while the colours keep coming.
                        </p>
                        <p className="text-sm text-palette-accent/85">
                            And a palette is applied by class, so it is scoped
                            to whatever subtree carries it: a page, a card, or
                            one button on an otherwise neutral floor.
                        </p>
                    </div>

                    {/* No frame of our own: ServerCodeBlock renders its own
                        <figure>, painted through the fd → role bridge, so a
                        second border would only double it. min-w-0 stops a
                        long line from widening the grid column. */}
                    <div className="min-w-0">
                        <ServerCodeBlock
                            code={SNIPPET}
                            codeblock={{ allowCopy: false }}
                            lang="tsx"
                        />
                    </div>
                </Reveal>
            </div>
        </Section>
    );
}

import type { ReactNode } from "react";
import { Text } from "#/components/atoms/text";

// The floor is palette-surface. Text is the target every other component
// points at through `render` — the snippet below is the whole idea in one
// place: a heading that another component's part wears, keeping its a11y
// wiring while taking Text's typography. This is where secondary text
// (text-palette-accent/85) lives.
function WornHeading() {
    return <Text.Heading as="h3">Delete this project?</Text.Heading>;
}

// A release note in the default look: headings, a secondary byline, body
// text with inline emphasis, a link and a clickable phrase. Then a field's
// label and error, and a heading worn by another part. Text has no colour
// of its own: it reads the roles of the palette it sits in.
export default function TextDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <article className="flex max-w-prose flex-col gap-3">
                <Text.Heading as="h1">Release 2.4</Text.Heading>
                <p className="text-sm text-palette-accent/85">
                    Published March 12 · 4 min read
                </p>
                <Text.Heading as="h2">Faster exports</Text.Heading>
                <Text.Paragraph>
                    Exports now run in the background, so you can keep working
                    while a large report builds. <Text.Strong>CSV</Text.Strong>{" "}
                    and <Text.Strong>PDF</Text.Strong> both stream as they go.
                </Text.Paragraph>
                <Text.Paragraph>
                    Read the <Text.Link href="#">migration guide</Text.Link>, or{" "}
                    <Text.Clickable type="button">
                        try the new export
                    </Text.Clickable>
                    . <Text.Small>Available on every plan.</Text.Small>
                </Text.Paragraph>
            </article>

            <Row label="label + error">
                <Text.Label>Project name</Text.Label>
                <Text.Error>
                    A project with this name already exists.
                </Text.Error>
            </Row>

            <Row label="worn by another part">
                <WornHeading />
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
            {children}
        </div>
    );
}

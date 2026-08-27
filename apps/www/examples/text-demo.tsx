import type { ReactNode } from "react";
import { Text } from "#/atoms/text";

// The floor is palette-surface. Text is the target every other component
// points at through `render` — the snippet below is the whole idea in one
// place: a heading that another component's part wears, keeping its a11y
// wiring while taking Text's typography. This is where secondary text
// (text-palette-accent/85) lives.
function WornHeading() {
    return <Text.Heading as="h2">A heading worn by another part</Text.Heading>;
}

export default function TextDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            <Row label="headings">
                <div className="flex flex-col gap-3">
                    <Text.Heading as="h1">Heading level 1</Text.Heading>
                    <Text.Heading as="h2">Heading level 2</Text.Heading>
                    <Text.Heading as="h3">Heading level 3</Text.Heading>
                </div>
            </Row>

            <Row label="paragraph + inline">
                <div className="flex flex-col gap-3">
                    <Text.Paragraph>
                        This is a paragraph. The body uses the surface palette.
                    </Text.Paragraph>
                    <Text.Paragraph>
                        <Text.Strong>Bold text</Text.Strong> and{" "}
                        <Text.Small>small italic text</Text.Small> in the same
                        line.
                    </Text.Paragraph>
                </div>
            </Row>

            <Row label="label + error + link">
                <div className="flex flex-col gap-3">
                    <Text.Label>Field label</Text.Label>
                    <Text.Error>This is an error message.</Text.Error>
                    <Text.Link href="#">A plain link</Text.Link>
                </div>
            </Row>

            <Row label="worn by another part">
                <WornHeading />
            </Row>

            <Row label="secondary text">
                <p className="text-sm text-palette-accent/85">
                    Secondary text uses <code>text-palette-accent/85</code> —
                    the measured point at which <code>accent</code> clears AA on
                    every neutral surface in both themes.
                </p>
            </Row>

            <Row label="Text.Clickable">
                <p className="text-sm text-palette-contrast">
                    Read the docs and{" "}
                    <Text.Clickable type="button">try it now</Text.Clickable>.
                </p>
            </Row>
        </div>
    );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-palette-accent/85">
                {label}
            </span>
            {children}
        </div>
    );
}

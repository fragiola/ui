import { Text } from "#/atoms/text";

// Text is the target every other component points at through `render`. The
// snippet below is the whole idea in one place: a heading that another
// component's part wears, keeping its a11y wiring while taking Text's
// typography. (Shown statically here; the dialog/field docs show it wired to
// a behaviour primitive through `render`.)
function WornHeading() {
    return <Text.Heading as="h2">A heading worn by another part</Text.Heading>;
}

export default function TextDemo() {
    return (
        <div className="flex flex-col gap-3">
            <Text.Heading as="h1">Heading level 1</Text.Heading>
            <Text.Heading as="h2">Heading level 2</Text.Heading>
            <Text.Heading as="h3">Heading level 3</Text.Heading>
            <Text.Paragraph>
                This is a paragraph. The body uses the surface palette — switch
                the palette above to see the same content under different roles.
            </Text.Paragraph>
            <Text.Paragraph>
                <Text.Strong>Bold text</Text.Strong> and{" "}
                <Text.Small>small italic text</Text.Small> in the same line.
            </Text.Paragraph>
            <Text.Label>Field label</Text.Label>
            <Text.Error>This is an error message.</Text.Error>
            <Text.Link href="#">A plain link</Text.Link>

            {/* A heading worn by another component's part — the composition
                idea in one snippet. */}
            <WornHeading />

            {/* Secondary text — text-palette-accent/85, the settled value. */}
            <p className="text-sm text-palette-accent/85">
                Secondary text uses <code>text-palette-accent/85</code> — the
                measured point at which <code>accent</code> clears AA on every
                neutral surface in both themes.
            </p>

            {/* Text.Clickable — a textual link rendered as a button. A
                different job from Clickable.Button, which is a filled
                affordance. */}
            <p className="text-sm text-palette-contrast">
                Read the docs and{" "}
                <Text.Clickable type="button">try it now</Text.Clickable>.
            </p>
        </div>
    );
}

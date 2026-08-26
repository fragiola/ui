import { Text } from "#/atoms/text";

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
        </div>
    );
}

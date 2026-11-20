import { CheckIcon, CodeIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { Clickable } from "#/components/atoms/clickable";
import { Text } from "#/components/atoms/text";
import { Dialog } from "#/components/ui/dialog";
import { Tabs } from "#/components/ui/tabs";
import { htmlAttributes, type Resolved } from "../design/design";

// Get code: what reproduces the preview in a project — the palettes' CSS, the
// <html> attributes and the classes to carry — plus the runtime path.

export function GetCode({ resolved }: { resolved: Resolved }) {
    const { css, design, action, control, checks } = resolved;
    const attributes = htmlAttributes(design.axes);
    const html = `<html data-theme="${design.scheme}"${design.dir === "rtl" ? ' dir="rtl"' : ""}${attributes ? ` ${attributes}` : ""}>`;
    const usage = `<body className="palette-surface">

<Clickable.Button className="${action}">Save</Clickable.Button>
<Badge className="${action}">New</Badge>

<Field.Root className="${control}">…</Field.Root>
<Switch.Root className="${control}">…</Switch.Root>`;
    const runtime = `npx shadcn@latest add @fragiola/colour

import { generatePalette, serializePalette } from "@/lib/colour/palette";

const css = serializePalette(
    generatePalette({ name: "brand", hue: ${design.hue ?? 250}, chroma: "${design.chroma}", tint: "${design.tint}" }),
);`;
    const failing = checks.filter((c) => !c.pass);

    return (
        <Dialog.Root>
            <Dialog.Trigger
                render={
                    <Clickable.Button
                        size="sm"
                        className="palette-neutral w-full"
                    />
                }
            >
                <CodeIcon />
                Get code
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Content className="w-[min(44rem,calc(100vw-2rem))] max-w-none">
                    <Dialog.Header>
                        <Dialog.Title>Get code</Dialog.Title>
                        <Dialog.Description>
                            Paste the CSS next to your palettes and add both
                            names to the palette group in lib/cn.ts. Put the
                            attributes on &lt;html&gt;, then carry the classes.
                        </Dialog.Description>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Tabs.Root defaultValue={css ? "css" : "html"}>
                            <Tabs.List>
                                <Tabs.Tab value="css">CSS</Tabs.Tab>
                                <Tabs.Tab value="html">HTML</Tabs.Tab>
                                <Tabs.Tab value="usage">Usage</Tabs.Tab>
                                <Tabs.Tab value="runtime">Runtime</Tabs.Tab>
                                <Tabs.Indicator />
                            </Tabs.List>
                            <Tabs.Panel value="css">
                                {css ? (
                                    <Code text={css} />
                                ) : (
                                    <Text.Paragraph className="py-3 text-palette-accent/85">
                                        The neutral palette ships with the
                                        registry: nothing to add.
                                    </Text.Paragraph>
                                )}
                            </Tabs.Panel>
                            <Tabs.Panel value="html">
                                <Code text={html} />
                            </Tabs.Panel>
                            <Tabs.Panel value="usage">
                                <Code text={usage} />
                            </Tabs.Panel>
                            <Tabs.Panel value="runtime">
                                <Code text={runtime} />
                            </Tabs.Panel>
                        </Tabs.Root>
                        {checks.length > 0 && (
                            <p className="text-xs text-palette-accent/85">
                                {failing.length === 0 ? (
                                    <>
                                        <CheckIcon className="me-1 inline size-icon-xs" />
                                        Every pair clears WCAG AA (
                                        {checks.length} checks).
                                    </>
                                ) : (
                                    `${failing.length} of ${checks.length} pairs miss AA.`
                                )}
                            </p>
                        )}
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.Close
                            render={<Clickable.Button variant="outline" />}
                        >
                            Done
                        </Dialog.Close>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

function Code({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <div className="relative mt-3">
            <pre className="max-h-80 overflow-auto rounded-md bg-palette-soft p-3 pe-10 font-mono text-xs leading-relaxed text-palette-accent">
                <code>{text}</code>
            </pre>
            <Clickable.Button
                variant="icon"
                shape="square"
                size="sm"
                aria-label={copied ? "Copied" : "Copy"}
                className="absolute end-1 top-1"
                onClick={async () => {
                    await navigator.clipboard.writeText(text);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                }}
            >
                {copied ? <CheckIcon /> : <CopyIcon />}
            </Clickable.Button>
        </div>
    );
}

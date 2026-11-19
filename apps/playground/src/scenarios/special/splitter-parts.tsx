import { Splitter } from "#/components/ui/splitter";

// The parts assembled by hand: a horizontal group whose second panel holds
// a vertical group (nesting; a group's size is the consumer's, so the
// nested one takes `h-full`), a grip in each separator, and a third group
// that is disabled (its rule stays, its cursor and hover go). Drag a
// separator, or Tab onto one and use the arrows, Home, End and Enter;
// double click resets. The grip shows on hover, drag and focus; focus adds
// the 3px ring bar. Theme, direction and the design axes come from the
// toolbar.
export default function SplitterParts() {
    return (
        <div className="flex w-[48rem] max-w-full flex-col gap-6">
            <Splitter.Group className="h-72 overflow-hidden rounded-lg border border-palette-line">
                <Splitter.Panel id="files" defaultSize="30%" minSize="15%">
                    <Pane title="Files" text="Drag the rule beside me." />
                </Splitter.Panel>
                <Splitter.Separator aria-label="Resize files">
                    <Splitter.Grip />
                </Splitter.Separator>
                <Splitter.Panel id="work">
                    <Splitter.Group orientation="vertical" className="h-full">
                        <Splitter.Panel id="editor" minSize="20%">
                            <Pane
                                title="Editor"
                                text="A vertical group, nested in a panel."
                            />
                        </Splitter.Panel>
                        <Splitter.Separator aria-label="Resize editor">
                            <Splitter.Grip />
                        </Splitter.Separator>
                        <Splitter.Panel
                            id="terminal"
                            defaultSize="35%"
                            minSize="15%"
                        >
                            <Pane
                                title="Terminal"
                                text="Its separator is horizontal."
                            />
                        </Splitter.Panel>
                    </Splitter.Group>
                </Splitter.Panel>
            </Splitter.Group>

            <Splitter.Group
                disabled
                className="h-32 overflow-hidden rounded-lg border border-palette-line"
            >
                <Splitter.Panel id="locked-a">
                    <Pane title="Disabled" text="This group cannot resize." />
                </Splitter.Panel>
                <Splitter.Separator aria-label="Resize locked">
                    <Splitter.Grip />
                </Splitter.Separator>
                <Splitter.Panel id="locked-b">
                    <Pane title="No cursor" text="And no hover." />
                </Splitter.Panel>
            </Splitter.Group>
        </div>
    );
}

function Pane({ title, text }: { title: string; text: string }) {
    return (
        <section aria-label={title} className="flex h-full flex-col gap-1 p-4">
            <h2 className="font-medium">{title}</h2>
            <p className="text-palette-accent/85">{text}</p>
        </section>
    );
}

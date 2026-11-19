"use client";

import { Splitter } from "#/components/ui/splitter";

// A split view in one line: Splitter.Template.Simple puts a separator, with
// its grip, between the panels it is given. A panel that holds another
// Template.Simple nests it (a group's size is yours: the nested one takes
// `h-full`). Drag a rule, or Tab onto one and use the arrows, Home, End and
// Enter (collapse); double click resets a panel. Sizes, limits and
// collapsing are the panels' own props: "Inbox" collapses past its minimum,
// "Reply" collapses to nothing.
export default function SplitterExample() {
    return (
        <Splitter.Template.Simple className="h-full">
            <Splitter.Panel
                id="inbox"
                defaultSize="30%"
                minSize="20%"
                collapsible
            >
                <Pane
                    title="Inbox"
                    text="12 unread. Drag the rule beside me."
                />
            </Splitter.Panel>
            <Splitter.Panel id="reading">
                <Splitter.Template.Simple
                    orientation="vertical"
                    className="h-full"
                >
                    <Splitter.Panel id="message" minSize="30%">
                        <Pane
                            title="Quarterly review"
                            text="The numbers are in. A nested group, stacked."
                        />
                    </Splitter.Panel>
                    <Splitter.Panel
                        id="reply"
                        defaultSize="35%"
                        minSize="20%"
                        collapsible
                    >
                        <Pane
                            title="Reply"
                            text="Focus the rule above me and press Enter."
                        />
                    </Splitter.Panel>
                </Splitter.Template.Simple>
            </Splitter.Panel>
        </Splitter.Template.Simple>
    );
}

function Pane({ title, text }: { title: string; text: string }) {
    return (
        <section aria-label={title} className="flex flex-col gap-1 p-4">
            <h2 className="truncate font-medium">{title}</h2>
            <p className="text-palette-accent/85">{text}</p>
        </section>
    );
}

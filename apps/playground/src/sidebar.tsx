import { Clickable } from "#/components/atoms/clickable";
import { Text } from "#/components/atoms/text";
import type { Section } from "./catalog";
import type { ItemRef } from "./view";

type SidebarProps = {
    sections: Section[];
    current: ItemRef | null;
    hrefFor: (item: ItemRef) => string;
    onSelect: (item: ItemRef) => void;
};

// Every section (examples, scenarios) grouped by the docs' levels. Entries
// are real links — the URL is the state — whose clicks the shell handles.
export function Sidebar({
    sections,
    current,
    hrefFor,
    onSelect,
}: SidebarProps) {
    return (
        <nav
            aria-label="Playground"
            className="flex min-h-0 flex-col gap-6 overflow-y-auto border-e border-palette-line p-4"
        >
            <Text.Heading as="h1" className="px-3 text-base">
                Fragiola UI
            </Text.Heading>
            {sections.map((section) => (
                <section key={section.kind} className="flex flex-col gap-4">
                    <Text.Heading
                        as="h2"
                        className="px-3 text-xs uppercase tracking-wider"
                    >
                        {section.title}
                    </Text.Heading>
                    {section.groups.map((group) => (
                        <div key={group.level} className="flex flex-col gap-1">
                            <h3 className="px-3 text-xs text-palette-accent/85">
                                {group.title}
                            </h3>
                            <ul className="flex flex-col">
                                {group.entries.map((entry) => {
                                    const item = {
                                        kind: entry.kind,
                                        id: entry.id,
                                    };
                                    const active =
                                        current?.kind === entry.kind &&
                                        current.id === entry.id;
                                    return (
                                        <li key={entry.id}>
                                            <Clickable.Link
                                                href={hrefFor(item)}
                                                aria-current={
                                                    active ? "page" : undefined
                                                }
                                                variant="ghost"
                                                size="sm"
                                                className="w-full justify-start aria-[current=page]:bg-palette-soft aria-[current=page]:text-palette-contrast"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    onSelect(item);
                                                }}
                                            >
                                                {entry.title}
                                            </Clickable.Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </section>
            ))}
        </nav>
    );
}

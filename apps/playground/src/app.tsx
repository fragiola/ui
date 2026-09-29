import { DirectionProvider } from "@base-ui/react/direction-provider";
import { useEffect, useLayoutEffect, useState } from "react";
import { Text } from "#/components/atoms/text";
import { findEntry, sections } from "./catalog";
import { Sidebar } from "./sidebar";
import { SourcePanel } from "./source-panel";
import { Stage } from "./stage";
import { Toolbar } from "./toolbar";
import { applyView, parseView, toSearch, type View } from "./view";

// The shell: sidebar, toolbar, stage and source panel. It is built from the
// registry and painted through palette roles only, like any Fragiola
// surface — an unpainted part of the shell is itself a bug worth seeing.
//
// Direction is set twice on purpose: `dir` on <html> flips the CSS, and
// DirectionProvider tells Base UI, which reads direction from context for
// keyboard navigation, slider direction and submenu sides.
export function App() {
    const [view, setView] = useState(() => parseView(window.location.search));
    const entry = findEntry(view.item);

    useLayoutEffect(() => applyView(view), [view]);

    useEffect(() => {
        document.title = entry
            ? `${entry.title} — Fragiola UI playground`
            : "Fragiola UI — playground";
    }, [entry]);

    // Choosing an item is a navigation: back returns to the previous item.
    // Theme, direction, density and the panel are settings: they stay as
    // they are through back and forward, and only rewrite the current URL.
    useEffect(() => {
        const search = toSearch(view);
        if ((window.location.search || "?") !== search) {
            window.history.replaceState(null, "", search);
        }
    }, [view]);

    useEffect(() => {
        const restore = () => {
            const { item } = parseView(window.location.search);
            setView((current) => ({ ...current, item }));
        };
        window.addEventListener("popstate", restore);
        return () => window.removeEventListener("popstate", restore);
    }, []);

    // Choosing the item already shown adds no history entry.
    function navigate(next: View) {
        const same =
            next.item?.kind === view.item?.kind &&
            next.item?.id === view.item?.id;
        if (!same) window.history.pushState(null, "", toSearch(next));
        setView(next);
    }

    return (
        <DirectionProvider direction={view.dir}>
            <div className="grid h-dvh grid-cols-[15rem_minmax(0,1fr)]">
                <Sidebar
                    sections={sections}
                    current={view.item}
                    hrefFor={(item) => toSearch({ ...view, item })}
                    onSelect={(item) => navigate({ ...view, item })}
                />
                <div className="flex min-h-0 flex-col">
                    <Toolbar view={view} entry={entry} onChange={setView} />
                    <div className="flex min-h-0 flex-1">
                        <main className="min-w-0 flex-1 overflow-auto">
                            {entry ? (
                                <Stage
                                    key={`${entry.kind}:${entry.id}`}
                                    entry={entry}
                                />
                            ) : (
                                <Text.Paragraph className="p-8 text-palette-accent/85">
                                    {view.item
                                        ? `No ${view.item.kind} with id “${view.item.id}”.`
                                        : "Pick an example or a scenario."}
                                </Text.Paragraph>
                            )}
                        </main>
                        {view.code && entry && (
                            <SourcePanel
                                key={`${entry.kind}:${entry.id}`}
                                entry={entry}
                            />
                        )}
                    </div>
                </div>
            </div>
        </DirectionProvider>
    );
}

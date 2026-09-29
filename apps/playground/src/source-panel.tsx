import { useEffect, useState } from "react";
import type { Entry } from "./catalog";

// The file behind what the stage shows, verbatim — the code a reader copies
// for an example. Plain text: highlighting would be a dependency. Code
// reads left to right whatever the page's direction. The App keys the
// panel by entry, so switching starts from empty.
export function SourcePanel({ entry }: { entry: Entry }) {
    const [source, setSource] = useState<string | null>(null);

    useEffect(() => {
        let live = true;
        entry.source().then(
            (text) => live && setSource(text),
            (error: unknown) => live && setSource(String(error)),
        );
        return () => {
            live = false;
        };
    }, [entry]);

    return (
        <aside
            aria-label="Source"
            className="flex w-[min(40rem,45%)] min-w-0 flex-col border-s border-palette-line"
        >
            <p
                dir="ltr"
                className="truncate border-b border-palette-line px-4 py-2 text-start font-mono text-xs text-palette-accent/85"
            >
                {entry.file}
            </p>
            <pre
                dir="ltr"
                className="min-h-0 flex-1 overflow-auto p-4 text-start font-mono text-xs leading-relaxed"
            >
                <code>{source}</code>
            </pre>
        </aside>
    );
}

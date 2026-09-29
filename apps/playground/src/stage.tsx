import {
    type ComponentType,
    type LazyExoticComponent,
    lazy,
    Suspense,
} from "react";
import type { Entry } from "./catalog";
import { ErrorBoundary } from "./error-boundary";

// `lazy` must return the same component across renders or the entry
// remounts: one per entry, made on first show.
const components = new Map<string, LazyExoticComponent<ComponentType>>();

// Entries whose module failed to load. The browser keeps a failed module
// import for good — a new `lazy` would fetch the same URL and fail again —
// so recovering from one is a page reload.
const failedLoads = new Set<string>();

function key(entry: Entry) {
    return `${entry.kind}:${entry.id}`;
}

function component(entry: Entry) {
    let Component = components.get(key(entry));
    if (!Component) {
        Component = lazy(() =>
            entry.load().catch((error: unknown) => {
                failedLoads.add(key(entry));
                throw error;
            }),
        );
        components.set(key(entry), Component);
    }
    return Component;
}

function recover(entry: Entry) {
    if (failedLoads.has(key(entry))) window.location.reload();
}

// The embed app's stage (examples/react/src/main.tsx): padded, centred on
// the inline axis, at the top on the block axis — popups open below their
// trigger, so the spare height belongs there. What renders here renders as
// the docs show it. The App keys the stage by entry, so switching remounts.
export function Stage({ entry }: { entry: Entry }) {
    const Demo = component(entry);
    return (
        <div className="p-8">
            <div className="flex justify-center">
                <ErrorBoundary
                    name={entry.title}
                    onReset={() => recover(entry)}
                >
                    <Suspense>
                        <Demo />
                    </Suspense>
                </ErrorBoundary>
            </div>
        </div>
    );
}

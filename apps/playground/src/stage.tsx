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

function component(entry: Entry) {
    const key = `${entry.kind}:${entry.id}`;
    let Component = components.get(key);
    if (!Component) {
        Component = lazy(entry.load);
        components.set(key, Component);
    }
    return Component;
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
                <ErrorBoundary name={entry.title}>
                    <Suspense>
                        <Demo />
                    </Suspense>
                </ErrorBoundary>
            </div>
        </div>
    );
}

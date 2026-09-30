import { lazy, StrictMode, Suspense, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { type Example, examples } from "./examples";
import { announceReady } from "./messages";
import { keepNavigationInPlace } from "./navigation";
import { syncTheme } from "./theme";
import "./styles.css";

// `index.html?id=<id>&theme=<name>` renders that example alone, filling the
// viewport, with no chrome (contract §5.1). The frame, the code panel and
// the theme switcher belong to the host.
//
// Without an id, a plain list of the ids: a convenience for local work,
// never linked by the host.
syncTheme();

const id = new URLSearchParams(window.location.search).get("id");
const example = examples.find((e) => e.id === id);
// The index keeps its own links.
if (example) keepNavigationInPlace();

const root = document.getElementById("root");
if (!root) throw new Error("#root is missing from index.html");

createRoot(root).render(
    <StrictMode>
        {example ? <Stage example={example} /> : <Index />}
    </StrictMode>,
);

// The stage pads a `flow` example and centres it on the inline axis, as the
// docs preview did. On the block axis it sits at the top: a frame taller than
// the example is one whose floor makes room for a popup, and popups open
// below their trigger — the spare height belongs there, not split above and
// below. The content box is what `resize` measures.
//
// A `fill` example (an app shell) fills the frame edge to edge: the frame's
// height is fixed (contract §5.3), and the whole frame is the example's —
// padding would only take width from it.
function Stage({ example }: { example: Example }) {
    const Demo = lazyExamples.get(example.id);
    const stage = useRef<HTMLElement>(null);
    const content = useRef<HTMLDivElement>(null);
    if (!Demo) return null;
    const fill = example.layout === "fill";
    return (
        <main ref={stage} className={fill ? "h-svh" : "p-8"}>
            <div
                ref={content}
                className={fill ? "h-full" : "flex justify-center"}
            >
                <Suspense>
                    <Demo />
                    <Ready
                        onReady={() => {
                            if (stage.current && content.current) {
                                announceReady(
                                    example.id,
                                    example.layout,
                                    stage.current,
                                    content.current,
                                );
                            }
                        }}
                    />
                </Suspense>
            </div>
        </main>
    );
}

// A sibling of the example inside the same Suspense boundary: its effect
// runs only once the boundary commits, i.e. once the lazy example has loaded
// and mounted — and after the example's own effects (ECharts' init), which
// run first. No animation frame is awaited: a host may keep the frame hidden
// until `ready`, and a hidden frame need not get frames at all. The effect
// may run again (StrictMode, a re-render); announceReady sends once.
function Ready({ onReady }: { onReady: () => void }) {
    useEffect(() => onReady(), [onReady]);
    return null;
}

function Index() {
    return (
        <main className="flex flex-col gap-2 p-8">
            {id && (
                <p className="text-palette-accent/85">
                    No example with id <code>{id}</code>.
                </p>
            )}
            <ul className="flex flex-col gap-1">
                {examples.map((e) => (
                    <li key={e.id}>
                        <a
                            className="text-palette-contrast underline"
                            href={`?id=${encodeURIComponent(e.id)}`}
                        >
                            {e.id}
                        </a>
                    </li>
                ))}
            </ul>
        </main>
    );
}

// Built once, outside render — `lazy` must return the same component across
// renders or the example remounts.
const lazyExamples = new Map(examples.map((e) => [e.id, lazy(e.load)]));

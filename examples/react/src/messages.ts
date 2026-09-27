// Messages to the host (contract §5.2). Same origin, always posted to
// `location.origin`; nothing is sent when the page is not in a frame.
//
//   ready    once, after the example's first render with its lazy parts
//            mounted — the host keeps the iframe hidden until then
//   resize   after ready, whenever the content height changes; never for
//            `layout: "fill"`, whose height is fixed by the manifest
//
// The height is the content's own box plus the stage padding — never the
// document's. The document is at least as tall as the frame, so measuring it
// would feed the frame's height back into the next report and the frame
// could grow but never shrink. Popups are portalled out of the content and
// are not measured either: the manifest's `height` floor is what gives them
// room (see src/examples/index.ts).

type Message =
    | { type: "fragiola:example:ready"; id: string }
    | { type: "fragiola:example:resize"; id: string; height: number };

function post(message: Message) {
    if (window.parent === window) return;
    window.parent.postMessage(message, window.location.origin);
}

let announced = false;

export function announceReady(
    id: string,
    layout: "fill" | "flow",
    stage: HTMLElement,
    content: HTMLElement,
) {
    // StrictMode runs effects twice in development; the contract says once.
    if (announced) return;
    announced = true;

    post({ type: "fragiola:example:ready", id });
    if (layout === "fill") return;

    let last = 0;
    const report = () => {
        const style = getComputedStyle(stage);
        const height = Math.ceil(
            content.getBoundingClientRect().height +
                Number.parseFloat(style.paddingTop) +
                Number.parseFloat(style.paddingBottom),
        );
        if (height === last) return;
        last = height;
        post({ type: "fragiola:example:resize", id, height });
    };
    new ResizeObserver(report).observe(content);
    report();
}

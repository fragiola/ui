// Messages to the host (contract §5.2). Same origin, always posted to
// `location.origin`; nothing is sent when the page is not in a frame.
//
//   ready    once, after the example's first render with its lazy parts
//            mounted — the host keeps the iframe hidden until then
//   resize   after ready, whenever the content height changes; never for
//            `layout: "fill"`, whose height is fixed by the manifest; held
//            back while the frame is promoted, sent once it is back
//   overlay  a modal overlay is about to open / has finished closing, and
//   armed    the stage is pinned for the promoted viewport: overlay
//            promotion (v1.3 §5.4), driven by src/host/overlay-promotion.ts
//
// The height is the content's own box plus the stage padding — never the
// document's. The document is at least as tall as the frame, so measuring it
// would feed the frame's height back into the next report and the frame
// could grow but never shrink. Popups are portalled out of the content and
// are not measured either. A modal overlay is promoted over the site's page
// (§5.4); the other popups have the manifest's `height` floor to give them
// room (see src/examples/index.ts).

type Message =
    | { type: "fragiola:example:ready"; id: string }
    | { type: "fragiola:example:resize"; id: string; height: number }
    | { type: "fragiola:example:overlay"; id: string; open: boolean }
    | { type: "fragiola:example:armed"; id: string };

export function post(message: Message) {
    if (window.parent === window) return;
    window.parent.postMessage(message, window.location.origin);
}

let announced = false;
// While the frame is promoted the site does not size it; the last height
// waits and goes out once the frame is back in place.
let held = false;
let flush: (() => void) | undefined;

export function holdResize(hold: boolean) {
    held = hold;
    if (!hold) flush?.();
}

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
        if (held) return;
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
    flush = report;
    new ResizeObserver(report).observe(content);
    report();
}

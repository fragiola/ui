import { type RefObject, useEffect, useState } from "react";

// Overlay promotion, the host's half (contract §5.4), for the preview's
// iframe. fragiola.com plays this part for an example frame
// (www components/example-frame.tsx); on the Create page, the page itself
// hosts the preview, and the page already fills the viewport — so promoting
// the preview's frame over this page covers the whole site.
//
//   load      tell the preview it is hosted (`host`), so it holds a modal
//             trigger's click and asks first
//   overlay   open: send `promote` with the frame's rect and the viewport it
//             will fill; the preview pins its stage to that rect
//   armed     cover the viewport with the frame, then `promoted` once the
//             frame has its new size: the held click is played there
//   resize    while promoted, `promoted` again with the new viewport
//   overlay   closed (after the exit animation): back in the inset

type Geometry = {
    rect: { x: number; y: number; width: number; height: number };
    viewport: { width: number; height: number };
};

type PreviewMessage = { type: string; open?: boolean };

export function usePreviewPromotion(
    frame: RefObject<HTMLIFrameElement | null>,
): boolean {
    const [promoted, setPromoted] = useState(false);

    useEffect(() => {
        let geometry: Geometry | null = null;
        const send = (message: object) =>
            frame.current?.contentWindow?.postMessage(
                message,
                window.location.origin,
            );
        const measure = (): Geometry | null => {
            const box = frame.current?.getBoundingClientRect();
            if (!box) return null;
            return {
                rect: {
                    x: box.x,
                    y: box.y,
                    width: box.width,
                    height: box.height,
                },
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                },
            };
        };
        // Once the frame has the viewport's size, two frames later: the
        // preview's media query matches in the same update.
        const afterResize = (then: () => void) =>
            requestAnimationFrame(() => requestAnimationFrame(then));

        const onMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            if (event.source !== frame.current?.contentWindow) return;
            const data = event.data as PreviewMessage | null;
            if (!data || typeof data.type !== "string") return;
            if (data.type === "fragiola:create:preview-ready") {
                send({ type: "fragiola:example:host", overlay: true });
            } else if (data.type === "fragiola:example:overlay") {
                if (data.open) {
                    geometry = measure();
                    if (geometry) {
                        send({ type: "fragiola:example:promote", ...geometry });
                    }
                } else {
                    geometry = null;
                    setPromoted(false);
                }
            } else if (data.type === "fragiola:example:armed" && geometry) {
                setPromoted(true);
                const armed = geometry;
                afterResize(() =>
                    send({ type: "fragiola:example:promoted", ...armed }),
                );
            }
        };
        const onResize = () => {
            if (!geometry) return;
            // the stage stays pinned where the inset was: re-measure the
            // inset (the frame's parent), then re-arm for the new viewport
            const inset = frame.current?.parentElement?.getBoundingClientRect();
            if (!inset) return;
            geometry = {
                rect: {
                    x: inset.x + 1,
                    y: inset.y + 1,
                    width: inset.width - 2,
                    height: inset.height - 2,
                },
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                },
            };
            send({ type: "fragiola:example:promoted", ...geometry });
        };
        window.addEventListener("message", onMessage);
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("message", onMessage);
            window.removeEventListener("resize", onResize);
        };
    }, [frame]);

    return promoted;
}

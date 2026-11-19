import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { promoteOverlays } from "../host/overlay-promotion";
import { keepNavigationInPlace } from "../navigation";
import { applyDesign } from "./design/apply-design";
import {
    INITIAL,
    isDesignMessage,
    type Resolved,
    resolve,
} from "./design/design";
import { SpecialBand } from "./preview/band/special";
import { Canvas } from "./preview/canvas";
import "../styles.css";

// create-preview.html — the sample, in its own document inside the Create
// page's inset panel. Every design arrives by message from the page and is
// applied to THIS document's <html>, so portalled popups follow it and the
// page around never changes. It scrolls on both axes, inside the inset.

// The cards link like an app does; followed here, a link would replace the
// preview with a page that does not exist.
keepNavigationInPlace();
// A modal (dialog, alert dialog, drawer) covers the whole Create page, not
// the inset: the embed half of overlay promotion (contract §5.4), with the
// Create shell as its host (shell/preview-promotion.ts).
promoteOverlays("create-preview");

const root = document.getElementById("root");
if (!root) throw new Error("#root is missing from create-preview.html");

createRoot(root).render(
    <StrictMode>
        <Preview />
    </StrictMode>,
);

function Preview() {
    const [resolved, setResolved] = useState<Resolved>(() => resolve(INITIAL));

    useEffect(() => {
        const onMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            if (event.source !== window.parent) return;
            if (isDesignMessage(event.data)) setResolved(event.data.resolved);
        };
        window.addEventListener("message", onMessage);
        window.parent.postMessage(
            { type: "fragiola:create:preview-ready" },
            window.location.origin,
        );
        return () => window.removeEventListener("message", onMessage);
    }, []);

    useEffect(() => applyDesign(resolved), [resolved]);

    // Charts read the palette when they mount: a new palette or scheme is a
    // new version, which remounts them (see PreviewChart).
    const version = `${resolved.css.length}:${resolved.design.hue}:${resolved.design.chroma}:${resolved.design.tint}:${resolved.design.scheme}`;
    return (
        <Canvas
            action={resolved.action}
            control={resolved.control}
            version={version}
            scheme={resolved.design.scheme}
            band={<SpecialBand />}
        />
    );
}

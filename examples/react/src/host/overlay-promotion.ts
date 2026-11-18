import { holdResize, post } from "../messages";

// Overlay promotion, the embed's half (contract v1.3 §5.4). A modal overlay
// — a dialog, an alert dialog, a drawer, the sidebar's mobile drawer —
// belongs over the site's whole page, so the site promotes the frame over its
// viewport while one is open, and the stage is pinned where it was: the
// reader sees nothing move but the overlay.
//
//   host      the site can promote. Nothing is intercepted before it: a site
//             older than v1.3 never answers, and overlays open in place.
//   click     a modal trigger is pressed (mouse, touch or keyboard — a
//             button's activation is a click). The click is stopped before
//             React sees it, `overlay` open is sent, and the click is played
//             again on the same trigger once the frame is `promoted`: the
//             overlay mounts in the viewport it ends in, so its opening
//             animation is never cut nor moved. No `promoted` in time → the
//             click is played anyway, in place.
//   promote   arm: a stylesheet under a media query of the promoted viewport
//             pins the stage to `rect` and clears the root's background. It
//             matches in the same rendering update as the frame's new size,
//             never a message later, and stops matching by itself once the
//             frame is back in place. Then `armed`.
//   promoted  release the held click. Sent again on a resize: re-arm.
//   closed    the last modal portal has left the DOM. Base UI unmounts a
//             portal only once its exit animation has ended, so the frame
//             goes back only after the overlay has fully closed.
//
// An overlay opened from code, with no trigger (none in these examples
// today), is caught when its portal mounts and asks then: its first frames
// may play in place.
//
// Everything here keys off the registry's `data-slot` names; the examples
// readers copy stay untouched.

const MODAL_TRIGGERS = [
    "dialog-trigger",
    "alert-dialog-trigger",
    "drawer-trigger",
    "sidebar-trigger",
]
    .map((slot) => `[data-slot="${slot}"]`)
    .join(", ");
const MODAL_PORTALS = ["dialog-portal", "alert-dialog-portal", "drawer-portal"]
    .map((slot) => `[data-slot="${slot}"]`)
    .join(", ");
/** How long a held click waits for `promoted` before it opens in place. */
const HOLD_TIMEOUT_MS = 300;
/** How long a played click may take to mount a modal portal. */
const MOUNT_TIMEOUT_MS = 300;

export interface PromotionGeometry {
    rect: { x: number; y: number; width: number; height: number };
    viewport: { width: number; height: number };
}

/**
 * The armed rule: only in the promoted viewport, the stage sits where the
 * inline frame was, painting the page's base under the example, and nothing
 * else of the document paints but the overlays.
 */
export function armedRule({ rect, viewport }: PromotionGeometry): string {
    return `@media (width: ${viewport.width}px) and (height: ${viewport.height}px) {
    html, body { background: transparent; }
    [data-stage] {
        position: fixed;
        left: ${rect.x}px;
        top: ${rect.y}px;
        width: ${rect.width}px;
        height: ${rect.height}px;
        margin: 0;
        overflow: hidden;
        background-color: var(--palette-base);
    }
}`;
}

type HostMessage =
    | { type: "fragiola:example:host"; overlay: true }
    | ({
          type: "fragiola:example:promote" | "fragiola:example:promoted";
      } & PromotionGeometry);

const finite = (value: unknown) =>
    typeof value === "number" && Number.isFinite(value);

export function isHostMessage(data: unknown): data is HostMessage {
    if (typeof data !== "object" || data === null) return false;
    const message = data as Record<string, unknown>;
    if (message.type === "fragiola:example:host") {
        return message.overlay === true;
    }
    if (
        message.type !== "fragiola:example:promote" &&
        message.type !== "fragiola:example:promoted"
    ) {
        return false;
    }
    const rect = message.rect as Record<string, unknown> | undefined;
    const viewport = message.viewport as Record<string, unknown> | undefined;
    return (
        !!rect &&
        !!viewport &&
        [rect.x, rect.y, rect.width, rect.height].every(finite) &&
        [viewport.width, viewport.height].every(finite)
    );
}

/**
 * The sidebar's trigger opens a drawer only in the narrow mode; wide, it
 * collapses the column, which stays in place. Wide, the column is rendered
 * inside the wrapper; narrow, it lives only in the drawer's portal.
 */
function opensModal(trigger: Element): boolean {
    if (trigger.getAttribute("data-slot") !== "sidebar-trigger") return true;
    const wrapper = trigger.closest('[data-slot="sidebar-wrapper"]');
    return !!wrapper && !wrapper.querySelector('[data-slot="sidebar"]');
}

const modalOpen = () => document.querySelector(MODAL_PORTALS) !== null;

/** Starts overlay promotion for the example `id`; a no-op outside a frame. */
export function promoteOverlays(id: string) {
    if (window.parent === window) return;

    let hosted = false;
    /** `overlay` open was sent and `overlay` closed not yet */
    let asked = false;
    /** the click waiting for `promoted` */
    let held: (() => void) | null = null;
    let replaying = false;
    /** a played click whose portal may not have mounted yet */
    let settling = false;
    let armed: HTMLStyleElement | undefined;

    /** the viewport the rule was armed for */
    let armedFor: PromotionGeometry["viewport"] | undefined;

    const arm = (geometry: PromotionGeometry) => {
        armed ??= document.head.appendChild(document.createElement("style"));
        armed.dataset.armed = "";
        armed.textContent = armedRule(geometry);
        armedFor = geometry.viewport;
    };

    // Back in place, the rule no longer matches; it is dropped as soon as
    // the frame leaves the promoted size, so an inline frame that later
    // happens to have that very size (a fullscreen stage) is never pinned
    // to a stale `rect`. The resize event runs in the same rendering update
    // as the new size, after the media query stopped matching: invisible.
    window.addEventListener("resize", () => {
        if (!armed || !armedFor || asked) return;
        if (
            window.innerWidth === armedFor.width &&
            window.innerHeight === armedFor.height
        ) {
            return;
        }
        armed.textContent = "";
        armedFor = undefined;
    });

    const close = () => {
        if (!asked) return;
        asked = false;
        held = null;
        post({ type: "fragiola:example:overlay", id, open: false });
        holdResize(false);
    };

    const ask = (release: () => void) => {
        asked = true;
        held = release;
        holdResize(true);
        post({ type: "fragiola:example:overlay", id, open: true });
        setTimeout(() => {
            if (held !== release) return;
            held = null;
            release();
        }, HOLD_TIMEOUT_MS);
    };

    const replay = (trigger: HTMLElement) => {
        replaying = true;
        settling = true;
        try {
            trigger.click();
        } finally {
            replaying = false;
        }
        // a trigger that opened nothing (disabled meanwhile, or not modal
        // after all) must not leave the frame promoted
        setTimeout(() => {
            settling = false;
            if (!modalOpen()) close();
        }, MOUNT_TIMEOUT_MS);
    };

    window.addEventListener("message", (event) => {
        if (event.origin !== window.location.origin) return;
        if (event.source !== window.parent) return;
        if (!isHostMessage(event.data)) return;
        const data = event.data;
        if (data.type === "fragiola:example:host") {
            hosted = true;
        } else if (data.type === "fragiola:example:promote") {
            arm(data);
            post({ type: "fragiola:example:armed", id });
        } else {
            arm(data);
            const release = held;
            held = null;
            release?.();
        }
    });

    // Capture on the window: before React's root listener, so Base UI never
    // sees the first click.
    window.addEventListener(
        "click",
        (event) => {
            if (!hosted || replaying) return;
            const trigger =
                event.target instanceof Element
                    ? event.target.closest<HTMLElement>(MODAL_TRIGGERS)
                    : null;
            if (!trigger || !opensModal(trigger)) return;
            const stop = () => {
                event.stopImmediatePropagation();
                event.preventDefault();
            };
            // a second click while the first waits (a double click) would
            // open the overlay in place: the held click opens it
            if (held) return stop();
            // already promoted (an overlay opening another), or one is
            // still closing: it opens where it is
            if (asked || modalOpen()) return;
            stop();
            ask(() => replay(trigger));
        },
        { capture: true },
    );

    // Base UI appends each portal to <body>.
    new MutationObserver(() => {
        if (!hosted) return;
        const open = modalOpen();
        if (open) settling = false;
        if (open && !asked) ask(() => {});
        else if (!open && asked && !held && !settling) close();
    }).observe(document.body, { childList: true });
}

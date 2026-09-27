import { resolveTheme, type Theme } from "../../gallery.ts";

// The example theme, as the host passes it (contract §5.1–5.2). The host
// resolves the site theme — `system` included — and always hands over an
// explicit example theme, first as `?theme=`, then as a message when the
// user switches. Nothing here reads localStorage.
//
// How a theme lands on this app's DOM: the palette files key off
// `data-theme` on <html> (`:root[data-theme="dark"] .palette-surface`), so
// that attribute carries the scheme; `.dark` and `color-scheme` agree with
// it; `data-example-theme` names the example theme itself.
//
// index.html applies the same mapping inline, before first paint.

export function applyTheme(theme: Theme) {
    const root = document.documentElement;
    root.dataset.theme = theme.scheme;
    root.dataset.exampleTheme = theme.name;
    root.classList.toggle("dark", theme.scheme === "dark");
    root.style.colorScheme = theme.scheme;
}

type ThemeMessage = { type: "fragiola:example:theme"; theme: string };

function isThemeMessage(data: unknown): data is ThemeMessage {
    return (
        typeof data === "object" &&
        data !== null &&
        (data as ThemeMessage).type === "fragiola:example:theme" &&
        typeof (data as ThemeMessage).theme === "string"
    );
}

/** Applies `?theme=` and every later `fragiola:example:theme` from the host. */
export function syncTheme() {
    applyTheme(
        resolveTheme(new URLSearchParams(window.location.search).get("theme")),
    );
    window.addEventListener("message", (event) => {
        if (event.origin !== window.location.origin) return;
        if (event.source !== window.parent) return;
        if (isThemeMessage(event.data)) {
            applyTheme(resolveTheme(event.data.theme));
        }
    });
}

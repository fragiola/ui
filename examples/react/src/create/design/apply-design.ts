import { AXIS_NAMES, type Resolved } from "./design";

// Applies a design to THIS document: the axes, the scheme and the direction
// on <html>, the generated palettes in one <style>. Only the preview document
// calls it, so the customizer's document is never touched.
export function applyDesign({ design, css }: Resolved) {
    const root = document.documentElement;
    for (const axis of AXIS_NAMES) {
        const level = design.axes[axis];
        if (level === "default") delete root.dataset[axis];
        else root.dataset[axis] = level;
    }
    root.dataset.theme = design.scheme;
    root.classList.toggle("dark", design.scheme === "dark");
    root.style.colorScheme = design.scheme;
    root.dir = design.dir;

    let style = document.querySelector<HTMLStyleElement>("style[data-create]");
    if (!style) {
        style = document.createElement("style");
        style.dataset.create = "";
        document.head.append(style);
    }
    style.textContent = css;
}

// The design a reader builds on the Create page — what the customizer edits
// and what the preview applies. Plain data, shared by both documents: the
// customizer (create.html) posts it, the preview (create-preview.html)
// applies it to its own <html>, so nothing the reader picks ever reaches the
// customizer (an axis is a `data-*` on <html>, and the preview is another
// document).

import {
    type Chroma,
    generatePalette,
    serializePalette,
    type Tint,
} from "#/components/lib/colour/palette";

// The axes and their levels (architecture.md §4). The default level is no
// attribute: `default` for five of them, `line` for the handle, the one axis
// whose default has a name.
export const AXES = {
    density: ["compact", "snug", "default", "comfortable", "spacious"],
    radius: ["flat", "subtle", "default", "rounded", "full"],
    text: ["small", "default", "large"],
    elevation: ["flat", "subtle", "default", "raised"],
    motion: ["none", "fast", "default", "expressive"],
    handle: ["line", "grip", "dots", "ide"],
} as const;
export type Axis = keyof typeof AXES;
export type Axes = { [A in Axis]: (typeof AXES)[A][number] };
export const AXIS_NAMES = Object.keys(AXES) as Axis[];

/** Each axis' default level: the one written as no attribute. */
export const AXIS_DEFAULTS: Axes = {
    density: "default",
    radius: "default",
    text: "default",
    elevation: "default",
    motion: "default",
    handle: "line",
};

export const AXIS_LABELS: Record<Axis, string> = {
    density: "Spacing",
    radius: "Radius",
    text: "Typography",
    elevation: "Elevation",
    motion: "Motion",
    handle: "Handle",
};

export const PRESETS = [
    { name: "neutral", hue: null },
    { name: "blue", hue: 250 },
    { name: "purple", hue: 300 },
    { name: "green", hue: 150 },
    { name: "orange", hue: 55 },
    { name: "rose", hue: 345 },
] as const;
export const CHROMAS: Chroma[] = ["muted", "default", "vivid"];
export const TINTS: Tint[] = ["none", "subtle", "tinted"];
export const SCHEMES = ["light", "dark"] as const;
export const DIRECTIONS = ["ltr", "rtl"] as const;

export type Design = {
    /** null: the neutral palette, nothing generated. */
    hue: number | null;
    chroma: Chroma;
    tint: Tint;
    axes: Axes;
    scheme: (typeof SCHEMES)[number];
    dir: (typeof DIRECTIONS)[number];
};

export const INITIAL: Design = {
    hue: 250,
    chroma: "default",
    tint: "subtle",
    axes: AXIS_DEFAULTS,
    scheme: "light",
    dir: "ltr",
};

/** The palettes' class suffix: `palette-brand`, `palette-surface-brand`. */
export const NAME = "brand";

const pick = <T>(values: readonly T[]): T =>
    values[Math.floor(Math.random() * values.length)] as T;

/** Any hue and any level, keeping the preview's scheme and direction. */
export function randomize(design: Design): Design {
    return {
        ...design,
        hue: Math.random() < 0.1 ? null : Math.floor(Math.random() * 360),
        chroma: pick(CHROMAS),
        tint: pick(TINTS),
        axes: Object.fromEntries(
            AXIS_NAMES.map((axis) => [axis, pick(AXES[axis])]),
        ) as Axes,
    };
}

/** What the preview needs to apply a design, and what the reader copies. */
export type Resolved = {
    design: Design;
    /** The generated palettes' CSS, or "" for the neutral palette. */
    css: string;
    /** The class a solid thing carries: a button, a badge, a progress bar. */
    action: string;
    /** The class a control on the floor carries: a field, a switch. */
    control: string;
    /** Every contrast pair, and whether it clears AA. */
    checks: ReturnType<typeof generatePalette>["checks"];
};

export function resolve(design: Design): Resolved {
    if (design.hue === null) {
        return {
            design,
            css: "",
            action: "palette-neutral",
            control: "palette-surface",
            checks: [],
        };
    }
    const palette = generatePalette({
        name: NAME,
        hue: design.hue,
        chroma: design.chroma,
        tint: design.tint,
    });
    return {
        design,
        css: serializePalette(palette),
        action: `palette-${NAME}`,
        control: `palette-surface-${NAME}`,
        checks: palette.checks,
    };
}

/** The `<html>` attributes that reproduce the axes, defaults left out. */
export function htmlAttributes(axes: Axes): string {
    return AXIS_NAMES.filter((axis) => axes[axis] !== AXIS_DEFAULTS[axis])
        .map((axis) => `data-${axis}="${axes[axis]}"`)
        .join(" ");
}

// ─── The bridge between the two documents ───────────────────────────────────
// Same origin, both ways. The preview says it is ready (and asks for the
// design); the customizer answers with the design, and again on every change.

export type DesignMessage = {
    type: "fragiola:create:design";
    resolved: Resolved;
};
export type PreviewReadyMessage = { type: "fragiola:create:preview-ready" };

export function isDesignMessage(data: unknown): data is DesignMessage {
    return (
        typeof data === "object" &&
        data !== null &&
        (data as DesignMessage).type === "fragiola:create:design"
    );
}

export function isPreviewReady(data: unknown): data is PreviewReadyMessage {
    return (
        typeof data === "object" &&
        data !== null &&
        (data as PreviewReadyMessage).type === "fragiola:create:preview-ready"
    );
}

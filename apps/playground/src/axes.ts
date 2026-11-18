// The design axes (registry global.css, architecture.md §4): one `data-*`
// attribute each, set on <html>. `default` is the absence of the attribute.
// Plain data with no imports: vite.config.ts injects it into index.html,
// which applies the axes before first paint.

export const AXES = {
    density: {
        label: "Density",
        levels: ["compact", "snug", "default", "comfortable", "spacious"],
    },
    radius: {
        label: "Radius",
        levels: ["flat", "subtle", "default", "rounded", "full"],
    },
    text: { label: "Text", levels: ["small", "default", "large"] },
    elevation: {
        label: "Elevation",
        levels: ["flat", "subtle", "default", "raised"],
    },
    motion: {
        label: "Motion",
        levels: ["none", "fast", "default", "expressive"],
    },
} as const;

export type AxisName = keyof typeof AXES;
export type Axes = { [K in AxisName]: (typeof AXES)[K]["levels"][number] };

export const AXIS_NAMES = Object.keys(AXES) as AxisName[];

export const DEFAULT_AXES = Object.fromEntries(
    AXIS_NAMES.map((name) => [name, "default"]),
) as Axes;

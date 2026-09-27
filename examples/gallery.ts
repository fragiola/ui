// The gallery configuration every framework app shares: the levels an
// example belongs to and the themes it can be shown in. Pure data — the
// React app imports it for its runtime and its manifest, and site:export
// writes it out as examples.json (contract §4).
//
// Levels are the component categories of the docs sidebar, in the same
// order. The registry's own groups (atoms / families / ui) do not partition
// the examples: no example shows a family on its own, and ui would hold
// 23 of the 28.
//
// Themes: this project has no example themes of its own, only the two
// schemes every palette declares, so it declares one `light` and one `dark`
// (contract §4). The swatches are read from the palette files by the export.

export type Scheme = "light" | "dark";

export type Level = { id: string; title: string };

export type Theme = {
    name: string;
    title: string;
    description: string;
    scheme: Scheme;
};

export const LEVELS = [
    { id: "atoms", title: "Atoms" },
    { id: "fields", title: "Fields" },
    { id: "menus", title: "Menus" },
    { id: "overlays", title: "Overlays" },
    { id: "disclosure", title: "Disclosure" },
    { id: "navigation", title: "Navigation" },
    { id: "display", title: "Display" },
] as const satisfies readonly Level[];

export type LevelId = (typeof LEVELS)[number]["id"];

export const THEMES: readonly Theme[] = [
    {
        name: "light",
        title: "Light",
        description:
            "Every palette in its light theme, on the neutral surface floor.",
        scheme: "light",
    },
    {
        name: "dark",
        title: "Dark",
        description:
            "The same palettes in their dark theme — every palette declares both.",
        scheme: "dark",
    },
];

/** `?theme=` → a theme. Missing or unknown → the first light theme (§5.1). */
export function resolveTheme(name: string | null | undefined): Theme {
    const theme =
        THEMES.find((t) => t.name === name) ??
        THEMES.find((t) => t.scheme === "light");
    if (!theme) throw new Error("gallery.ts declares no light theme");
    return theme;
}

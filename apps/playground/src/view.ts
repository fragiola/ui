import { resolveTheme } from "../../../examples/gallery.ts";
import { applyTheme } from "../../../examples/react/src/theme.ts";

// What the playground shows, entirely in the URL: a reload restores it and
// a link reproduces it. Defaults are left out of the query.
//
//   ?example=<id>              an example from examples/react
//   ?scenario=<level>/<id>     a scenario from src/scenarios
//   &theme=<name>              an entry of THEMES (examples/gallery.ts)
//   &dir=rtl                   direction; ltr when absent
//   &density=compact|spacious  data-density (global.css §4); none when absent
//   &code=1                    the source panel
//
// index.html applies theme, direction and density the same way before first
// paint; `applyView` owns them afterwards.

export const KINDS = ["example", "scenario"] as const;
export type Kind = (typeof KINDS)[number];

export const DIRECTIONS = ["ltr", "rtl"] as const;
export type Direction = (typeof DIRECTIONS)[number];

export const DENSITIES = ["default", "compact", "spacious"] as const;
export type Density = (typeof DENSITIES)[number];

export type ItemRef = { kind: Kind; id: string };

export type View = {
    item: ItemRef | null;
    theme: string;
    dir: Direction;
    density: Density;
    code: boolean;
};

function oneOf<T extends string>(
    values: readonly T[],
    value: string | null,
    fallback: T,
): T {
    return values.find((v) => v === value) ?? fallback;
}

export function parseView(search: string): View {
    const params = new URLSearchParams(search);
    const kind = KINDS.find((k) => params.has(k));
    return {
        item: kind ? { kind, id: params.get(kind) ?? "" } : null,
        theme: resolveTheme(params.get("theme")).name,
        dir: oneOf(DIRECTIONS, params.get("dir"), "ltr"),
        density: oneOf(DENSITIES, params.get("density"), "default"),
        code: params.get("code") === "1",
    };
}

export function toSearch(view: View): string {
    const params = new URLSearchParams();
    if (view.item) params.set(view.item.kind, view.item.id);
    if (view.theme !== resolveTheme(null).name) {
        params.set("theme", view.theme);
    }
    if (view.dir !== "ltr") params.set("dir", view.dir);
    if (view.density !== "default") params.set("density", view.density);
    if (view.code) params.set("code", "1");
    const query = params.toString();
    return query ? `?${query}` : "?";
}

/**
 * On <html>, not on the stage: popups are portalled out of the stage's
 * subtree, and must be themed, flipped and sized like what opened them.
 */
export function applyView(view: View) {
    const root = document.documentElement;
    applyTheme(resolveTheme(view.theme));
    root.dir = view.dir;
    if (view.density === "default") delete root.dataset.density;
    else root.dataset.density = view.density;
}

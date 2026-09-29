import { describe, expect, it } from "vitest";
import { THEMES } from "../../../examples/gallery.ts";
import { parseView, toSearch, type View } from "../src/view.ts";

const DEFAULTS: View = {
    item: null,
    theme: "light",
    dir: "ltr",
    density: "default",
    code: false,
};

describe("the view in the URL", () => {
    it("defaults to nothing chosen, light, ltr, default density, no panel", () => {
        expect(parseView("")).toEqual(DEFAULTS);
    });

    it("leaves defaults out of the query", () => {
        expect(toSearch(DEFAULTS)).toBe("?");
    });

    it("round-trips every setting", () => {
        const views: View[] = [
            { ...DEFAULTS, item: { kind: "example", id: "dialog" } },
            {
                item: { kind: "scenario", id: "atoms/clickable-matrix" },
                theme: "dark",
                dir: "rtl",
                density: "compact",
                code: true,
            },
            ...THEMES.map((t) => ({ ...DEFAULTS, theme: t.name })),
            { ...DEFAULTS, density: "spacious" as const },
        ];
        for (const view of views) {
            expect(parseView(toSearch(view))).toEqual(view);
        }
    });

    it("falls back on unknown values instead of applying them", () => {
        expect(parseView("?theme=sepia&dir=up&density=huge&code=yes")).toEqual(
            DEFAULTS,
        );
    });
});

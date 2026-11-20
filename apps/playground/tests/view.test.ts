import { describe, expect, it } from "vitest";
import { THEMES } from "../../../examples/gallery.ts";
import { AXES, AXIS_NAMES, DEFAULT_AXES } from "../src/axes.ts";
import { parseView, toSearch, type View } from "../src/view.ts";

const DEFAULTS: View = {
    item: null,
    theme: "light",
    dir: "ltr",
    axes: DEFAULT_AXES,
    code: false,
};

describe("the view in the URL", () => {
    it("defaults to nothing chosen, light, ltr, default axes, no panel", () => {
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
                axes: {
                    density: "compact",
                    radius: "flat",
                    text: "large",
                    elevation: "raised",
                    motion: "none",
                    handle: "dots",
                },
                code: true,
            },
            ...THEMES.map((t) => ({ ...DEFAULTS, theme: t.name })),
            // Every level of every axis, one at a time.
            ...AXIS_NAMES.flatMap((name) =>
                AXES[name].levels.map((level) => ({
                    ...DEFAULTS,
                    axes: { ...DEFAULT_AXES, [name]: level },
                })),
            ),
        ];
        for (const view of views) {
            expect(parseView(toSearch(view))).toEqual(view);
        }
    });

    it("falls back on unknown values instead of applying them", () => {
        expect(
            parseView(
                "?theme=sepia&dir=up&density=huge&radius=round&text=tiny&elevation=0&motion=slow&handle=wavy&code=yes",
            ),
        ).toEqual(DEFAULTS);
    });

    it("leaves the handle's default level, line, out of the query", () => {
        expect(DEFAULT_AXES.handle).toBe("line");
        expect(
            toSearch({
                ...DEFAULTS,
                axes: { ...DEFAULT_AXES, handle: "line" },
            }),
        ).toBe("?");
        expect(
            toSearch({
                ...DEFAULTS,
                axes: { ...DEFAULT_AXES, handle: "grip" },
            }),
        ).toBe("?handle=grip");
    });

    it("writes each axis under its own name, and only when not default", () => {
        expect(
            toSearch({
                ...DEFAULTS,
                axes: { ...DEFAULT_AXES, radius: "flat", motion: "none" },
            }),
        ).toBe("?radius=flat&motion=none");
    });
});

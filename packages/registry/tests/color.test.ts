import { describe, expect, it } from "vitest";
import { color } from "../registry/families/color";
import { foundation } from "../registry/families/foundation";

// ─── The color family ───────────────────────────────────────────────────────
// The colour controls (Epic #169). Zero variants. A colour ground is the
// colour being picked: it comes from the CSS variable its Fragiola
// Primitives part sets, never from a palette role. Every thumb is the
// foundation's knob, ringed so it reads over white, black and saturated
// colours; the area's focus is nested (its hidden inputs), the slider's and
// the wheel's thumb is the focusable itself. A swatch option speaks the
// foundation's `checked`, `hover` and `focus`.

const classes = (member: () => string) => member().split(/\s+/).filter(Boolean);

const contains = (member: () => string, of: () => string) => {
    const own = classes(member);
    return classes(of).every((c) => own.includes(c));
};

describe("color family", () => {
    it("has zero variants", () => {
        for (const [name, member] of Object.entries(color)) {
            const variants = (member as { variants?: object }).variants ?? {};
            expect(Object.keys(variants), name).toEqual([]);
        }
    });

    it("draws every ground from the primitive's variable, never a palette role", () => {
        const grounds = {
            area: "--color-area-background",
            wheelTrack: "--color-wheel-track-background",
            sliderTrack: "--color-slider-track-background",
            swatch: "--color-swatch-color",
        } as const;
        for (const [name, variable] of Object.entries(grounds)) {
            const member = color[name as keyof typeof grounds];
            expect(member(), name).toContain(`var(${variable})`);
            expect(
                classes(member).filter((c) => /^bg-palette-/.test(c)),
                name,
            ).toEqual([]);
        }
        expect(color.area()).toContain(
            "var(--color-area-background-blend-mode)",
        );
    });

    it("makes every thumb the knob, with its primitive's colour inside", () => {
        const thumbs = {
            areaThumb: "--color-area-thumb-color",
            wheelThumb: "--color-wheel-thumb-color",
            sliderThumb: "--color-slider-thumb-color",
        } as const;
        for (const [name, variable] of Object.entries(thumbs)) {
            const member = color[name as keyof typeof thumbs];
            expect(contains(member, foundation.knob), name).toBe(true);
            expect(member(), name).toContain(`var(${variable})`);
            expect(member(), name).toContain("after:bg-(--thumb-color)");
            // the hairline that keeps a light knob readable over white
            expect(classes(member), name).toContain("ring-palette-contrast/50");
        }
    });

    it("rings the area's thumb for its nested inputs, the others for themselves", () => {
        expect(contains(color.areaThumb, foundation.focusNested)).toBe(true);
        expect(contains(color.wheelThumb, foundation.focus)).toBe(true);
        expect(contains(color.sliderThumb, foundation.focus)).toBe(true);
    });

    it("shows transparency over the checkerboard", () => {
        for (const name of ["sliderTrack", "swatch"] as const) {
            expect(color[name](), name).toContain("var(--checkerboard)");
        }
    });

    it("lights a chosen swatch with `checked`, the others with `hover`", () => {
        for (const member of [
            foundation.checked,
            foundation.hover,
            foundation.focus,
            foundation.disabled,
        ]) {
            expect(contains(color.swatchItem, member)).toBe(true);
        }
    });

    it("disables every root the foundation's way", () => {
        for (const name of [
            "area",
            "wheel",
            "slider",
            "swatchPicker",
        ] as const) {
            expect(contains(color[name], foundation.disabled), name).toBe(true);
        }
    });
});

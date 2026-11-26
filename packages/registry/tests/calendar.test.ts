import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { calendar } from "../registry/families/calendar";
import { foundation } from "../registry/families/foundation";

// ─── The calendar family ────────────────────────────────────────────────────
// Every calendar and picker of the Dates section dresses its cells with
// `calendar`. Each state of a cell is a foundation member (chosen = checked,
// today = current, unavailable = disabled, focus = focusInset), so a cell
// looks like every other "on", "current" and "disabled" in the registry. What
// is caught here: a variant, a state written in the family's own words, a
// band that stops being logical (RTL) or stops joining the range's ends.

const classes = (member: () => string) => member().split(/\s+/).filter(Boolean);

const REGISTRY = path.resolve(import.meta.dirname, "../registry");

describe("calendar family", () => {
    it("has zero variants — variation is a named member", () => {
        for (const [name, member] of Object.entries(calendar)) {
            const variants = (member as { variants?: object }).variants ?? {};
            expect(Object.keys(variants), name).toEqual([]);
        }
    });

    it("styles every state of a date's box through a foundation member", () => {
        const item = classes(calendar.item);
        for (const member of [
            foundation.checked,
            foundation.current,
            foundation.disabled,
        ]) {
            for (const c of classes(member)) expect(item).toContain(c);
        }
    });

    it("draws the focus inside the cell (a grid packs its cells)", () => {
        for (const name of ["cell", "monthCell"] as const) {
            const own = classes(calendar[name]);
            for (const c of classes(foundation.focusInset)) {
                expect(own, name).toContain(c);
            }
            expect(own, name).toContain("rounded-control");
        }
    });

    it("lights the preset of the calendar's value as `selected`", () => {
        const own = classes(calendar.preset);
        for (const c of classes(foundation.selected)) expect(own).toContain(c);
    });

    it("joins a range's band to its ends with logical insets", () => {
        const band = classes(calendar.band);
        expect(band).toContain("data-[edge=start]:start-1/2");
        expect(band).toContain("data-[edge=end]:end-1/2");
        expect(band).toContain("group-first/cell:rounded-s-control");
        expect(band).toContain("group-last/cell:rounded-e-control");
        // the committed band gives way to the range being chosen
        expect(band).toContain("group-has-data-range-preview/calendar:hidden");
        expect(classes(calendar.root)).toContain("group/calendar");
        const physical = /(?:^|:)(?:left|right|ml|mr|pl|pr|rounded-[lr])-/;
        for (const [name, member] of Object.entries(calendar)) {
            expect(
                classes(member).filter((c) => physical.test(c)),
                name,
            ).toEqual([]);
        }
    });

    it("gives the cell's box the foundation's attributes from the cell's state", async () => {
        // The wrapper maps the primitive's state onto the attributes the
        // members key on: a chosen date or a range end `data-checked`, today
        // `data-active`, an inert date `data-disabled`. The hover is the
        // foundation's, never spelled in the cell.
        const source = await readFile(
            path.join(REGISTRY, "ui/calendar.tsx"),
            "utf-8",
        );
        for (const attribute of [
            "data-checked=",
            "data-active=",
            "data-disabled=",
            "data-edge=",
        ]) {
            expect(source, attribute).toContain(attribute);
        }
        expect(source).toContain("foundation.hover()");
        expect(source).not.toMatch(/hover:bg-palette-soft/);
    });
});

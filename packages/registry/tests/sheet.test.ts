import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { sheet } from "../registry/families/sheet";
import { split } from "../registry/families/split";
import { tree } from "../registry/families/tree";

// ─── The sheet family ───────────────────────────────────────────────────────
// ui/data-grid dresses Data Grid's headless parts with `sheet`. A class that
// does not exist is caught by the compile guard; what is caught here is a
// class that exists and is wrong for a virtualized grid — geometry the
// engine owns, a palette that would swallow a swap, an `outline-none` that
// kills the active cell's ring, two variants fighting over one property, a
// value that drifts from the table or the family it was taken from, and a
// feature piece that renders without its feature.

const classes = (member: () => string) => member().split(/\s+/).filter(Boolean);

const REGISTRY = path.resolve(import.meta.dirname, "../registry");

const read = (file: string) =>
    readFile(path.join(REGISTRY, file), "utf-8").then((source) =>
        // comments say what the code does not: test the code
        source.replace(/^\s*\/\/.*$/gm, ""),
    );

describe("sheet family", () => {
    it("has zero variants — variation is a named member", () => {
        for (const [name, member] of Object.entries(sheet)) {
            const variants = (member as { variants?: object }).variants ?? {};
            expect(Object.keys(variants), name).toEqual([]);
        }
    });

    it("declares no palette — the grid paints from the one in scope", () => {
        const declared = (c: string) =>
            /^palette-/.test(c.split(":").pop() ?? "");
        for (const [name, member] of Object.entries(sheet)) {
            expect(classes(member).filter(declared), name).toEqual([]);
        }
    });

    it("styles every state attribute of the core and the seven features", () => {
        // ../data-grid/site/docs/concepts/state-attributes.mdx. Not a look:
        // `data-filtered` (the filter shows it), `data-resizable` (the
        // resizer renders only then), the indexes. The advanced features'
        // states (ranges, fill, reordering, groups, details) are a later
        // Epic's.
        const written = Object.values(sheet)
            .flatMap((member) => classes(member))
            .join(" ");
        for (const state of [
            "active",
            "interacting",
            "editing",
            "loading",
            "group",
            "selected",
            "pinned",
            "pinned-edge",
            "sortable",
            "sort",
            "resizing",
            "edge",
            "overflow-start",
            "overflow-end",
        ]) {
            expect(
                new RegExp(`data-${state}(?![\\w-])|data-\\[${state}[=*]`).test(
                    written,
                ),
                state,
            ).toBe(true);
        }
        // The empty grid has its own part: a member, not a state.
        expect(classes(sheet.empty)).toContain("text-palette-accent/85");
    });

    it("sets no geometry on the parts the engine places", () => {
        // A cell's, a row's and a header row's position and size are the
        // engine's inline style; pinned cells are its sticky ones (S5). The
        // one exception the package leaves to the app is stacking: a
        // pinned cell above the cells that scroll under it.
        const structural =
            /^(?:[\w-]+:)*(?:absolute|relative|fixed|sticky|inset-|top-|bottom-|start-|end-|left-|right-|w-|h-|size-|min-[wh]-|max-[wh]-|translate-|transform|z-|box-)/;
        for (const name of [
            "root",
            "grid",
            "header",
            "headerRow",
            "headerCell",
            "row",
            "cell",
        ] as const) {
            expect(
                classes(sheet[name]).filter(
                    (c) =>
                        structural.test(c) &&
                        !/(?:after|before):/.test(c) &&
                        c !== "data-pinned:z-1",
                ),
                name,
            ).toEqual([]);
        }
        // The rows' overflow stays visible, or pinned cells would hold to
        // the row instead of the frame (pinned-columns.mdx).
        for (const name of ["header", "headerRow", "row"] as const) {
            expect(
                classes(sheet[name]).filter((c) => /overflow-/.test(c)),
                name,
            ).toEqual([]);
        }
    });

    it("keeps the active cell's ring: no outline-none on a cell", () => {
        // `outline-none` sets the outline style to none, which the ring's
        // width alone never brings back (Tailwind 4).
        for (const name of ["headerCell", "cell", "row"] as const) {
            const own = classes(sheet[name]);
            expect(own, name).not.toContain("outline-none");
        }
        for (const name of ["headerCell", "cell"] as const) {
            const own = classes(sheet[name]);
            expect(own, name).toContain(
                "not-data-editing:data-active:focus-within:outline-2",
            );
            expect(own, name).toContain(
                "not-data-editing:data-active:focus-within:outline-palette-ring",
            );
            expect(own, name).toContain("data-interacting:outline-dashed");
        }
        // The grid element is as large as the dataset: its ring is drawn on
        // the frame.
        expect(classes(sheet.root)).toContain(
            "has-[>[data-grid-part=grid]:focus-visible]:outline-2",
        );
    });

    it("reads as ui/table.tsx made interactive (S4)", async () => {
        const table = await read("ui/table.tsx");
        // the cell padding, the row rule, the header's type and fill, the
        // body text
        for (const shared of ["px-3", "border-palette-line"]) {
            expect(table).toContain(shared);
        }
        expect(classes(sheet.cell)).toContain("px-3");
        expect(classes(sheet.headerCell)).toContain("px-3");
        expect(table).toContain("border-b border-palette-line");
        expect(classes(sheet.row)).toContain("border-b");
        expect(classes(sheet.row)).toContain("border-palette-line");
        expect(classes(sheet.headerCell)).toContain("border-b");
        expect(table).toContain("font-medium text-palette-contrast");
        expect(classes(sheet.headerCell)).toContain("font-medium");
        expect(classes(sheet.headerCell)).toContain("text-palette-contrast");
        expect(table).toContain("bg-palette-soft");
        expect(classes(sheet.header)).toContain("bg-palette-soft");
        expect(table).toContain("text-palette-accent/85");
        expect(classes(sheet.cell)).toContain("text-palette-accent/85");
        // A loading row shows Skeleton's bar.
        const skeleton = await read("ui/skeleton.tsx");
        for (const shared of [
            "animate-pulse",
            "rounded-md",
            "bg-palette-soft",
        ]) {
            expect(skeleton).toContain(shared);
            expect(classes(sheet.cell)).toContain(
                `data-loading:after:${shared}`,
            );
        }
    });

    it("selects rows as tree.row does, and never lets a hover fight it", () => {
        const own = classes(sheet.row);
        const row = classes(tree.row);
        expect(row).toContain("data-selected:bg-palette-soft");
        expect(own).toContain("data-selected:bg-palette-soft");
        expect(classes(sheet.cell)).toContain(
            "group-data-selected/sheet-row:text-palette-contrast",
        );
        // the fills: one rest, one selected, hover and active only off a
        // selected row — and opaque, so a pinned cell inheriting it is too
        const fills = own.filter((c) => /(?:^|:)bg-/.test(c));
        expect(fills).toEqual([
            "bg-palette-base",
            "not-data-selected:hover:bg-[color-mix(in_oklab,var(--color-palette-soft)_50%,var(--color-palette-base))]",
            "not-data-selected:data-active:bg-[color-mix(in_oklab,var(--color-palette-soft)_50%,var(--color-palette-base))]",
            "data-selected:bg-palette-soft",
        ]);
        expect(classes(sheet.cell)).toContain("data-pinned:bg-inherit");
        expect(classes(sheet.headerCell)).toContain("data-pinned:bg-inherit");
    });

    it("draws pinned edges on logical sides, with an elevation shadow", () => {
        const own = classes(sheet.cell);
        expect(own).toContain("data-pinned-edge:data-[pinned=start]:border-e");
        expect(own).toContain("data-pinned-edge:data-[pinned=end]:border-s");
        expect(own.filter((c) => /(?:^|:)border-[lr]\b/.test(c))).toEqual([]);
        // the shadow is the elevation axis's (`shadow-*` reads
        // `--elevation-*`), only while content is hidden past that edge
        const shadows = own.filter((c) => c.includes("shadow"));
        expect(shadows).toEqual([
            "data-pinned-edge:data-[pinned=start]:group-data-overflow-start/sheet:shadow-lg",
            "data-pinned-edge:data-[pinned=end]:group-data-overflow-end/sheet:shadow-lg",
        ]);
        // the clip that keeps it to the outer side names both directions
        for (const side of ["start", "end"]) {
            const clips = own.filter(
                (c) =>
                    c.startsWith(`data-pinned-edge:data-[pinned=${side}]:`) &&
                    c.includes("clip-path"),
            );
            expect(clips.map((c) => c.split(":")[2]).sort(), side).toEqual([
                "ltr",
                "rtl",
            ]);
        }
    });

    it("draws the column resizer with split.separator's values (S4)", () => {
        const own = classes(sheet.columnResizer);
        const separator = classes(split.separator);
        for (const shared of [
            "w-px",
            "before:-inset-x-1.5",
            "after:-inset-x-px",
            "hover:bg-palette-ring",
            "focus-visible:bg-palette-ring",
            "focus-visible:after:bg-palette-ring",
            "cursor-ew-resize",
            "select-none",
        ]) {
            expect(
                own.some((c) => c === shared),
                shared,
            ).toBe(true);
            expect(
                separator.some((c) =>
                    c.endsWith(shared.split(":").pop() ?? ""),
                ),
                shared,
            ).toBe(true);
        }
        expect(own).toContain("data-resizing:bg-palette-ring");
        // logical sides only: the boundary with the columns that scroll
        expect(own).toContain("data-[edge=end]:end-0");
        expect(own).toContain("data-[edge=start]:start-0");
        expect(own.filter((c) => /(?:^|:)(?:left|right)-/.test(c))).toEqual([]);
    });

    it("paints select-all's mixed box with tree.checkbox's values (S4)", () => {
        const own = classes(sheet.checkbox);
        for (const shared of classes(tree.checkbox)) {
            expect(own, shared).toContain(shared);
        }
        expect(classes(sheet.checkboxDash)).toEqual(classes(tree.checkboxDash));
    });

    it("composes the registry's controls unchanged", async () => {
        const selection = await read("ui/data-grid/features/row-selection.tsx");
        expect(selection).toMatch(/from "#\/ui\/checkbox"/);
        const filter = await read("ui/data-grid/features/header-filter.tsx");
        expect(filter).toMatch(/from "#\/ui\/field"/);
        expect(filter).toMatch(/from "#\/ui\/select"/);
        expect(filter).toMatch(/from "#\/atoms\/fields"/);
        const editor = await read("ui/data-grid/features/cell-editor.tsx");
        expect(editor).toMatch(/from "#\/ui\/field"/);
        expect(editor).toMatch(/from "#\/atoms\/fields"/);
        expect(editor).toContain("{...editorProps}");
        const pagination = await read("ui/data-grid/features/pagination.tsx");
        expect(pagination).toMatch(/from "#\/ui\/pagination"/);
    });

    it("renders each feature piece only with its feature installed", async () => {
        const pieces: Record<string, string[]> = {
            "sort-indicator.tsx": ["sorting"],
            "column-resizer.tsx": ["columnResize"],
            "row-selection.tsx": ["rowSelection", "rowSelection"],
            "header-filter.tsx": ["filtering"],
            "pagination.tsx": ["pagination"],
        };
        for (const [file, features] of Object.entries(pieces)) {
            const source = await read(`ui/data-grid/features/${file}`);
            const gates = [
                ...source.matchAll(/installed\([^,]+, "(\w+)"\)/g),
            ].map((match) => match[1]);
            expect(gates, file).toEqual(features);
        }
        // The cell editor is a column's renderEditCell: the package renders
        // it only with editing() installed.
    });

    it("tells the engine the rows' heights from the spacing scale", async () => {
        const parts = await read("ui/data-grid/parts.tsx");
        expect(parts).toContain("rowHeight: rowHeight ?? step * 9");
        expect(parts).toContain(
            "headerRowHeight: headerRowHeight ?? step * (filtering ? 17 : 10)",
        );
        // the probe is ten steps square
        expect(classes(sheet.probe)).toContain("size-10");
        expect(parts).toContain("size / 10");
    });

    it("leaves Template.Simple with no style of its own", async () => {
        // The template rules: nothing beyond the parts — no tv(), no class
        // literal, no family member. The one className goes to Root.
        const code = await read("ui/data-grid/templates/simple.tsx");
        expect(code).not.toMatch(/\btv\(/);
        expect(code).not.toMatch(/className="/);
        expect(code).not.toMatch(/#\/families\//);
        expect(code.match(/className=\{/g)).toEqual(["className={"]);
        // Its own props stay under the ceiling of 7: the rest is Root's.
        const own = code.match(/> & \{([\s\S]*?)\n\};/)?.[1] ?? "";
        const props = own.match(/^\s+"?[\w-]+"?\??:/gm) ?? [];
        expect(props.length).toBe(5);
        expect(props.length).toBeLessThanOrEqual(7);
    });
});

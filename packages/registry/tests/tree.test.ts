import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { dock } from "../registry/families/dock";
import { menu } from "../registry/families/menu";
import { tree } from "../registry/families/tree";

// ─── The tree family ────────────────────────────────────────────────────────
// ui/tree dresses the tree's headless parts with `tree`. A class that does
// not exist is caught by the compile guard; what is caught here is a class
// that exists and is wrong for a tree — a palette that would swallow a swap
// on an outer element, an indentation that stops following the spacing
// scale or the writing direction, two variants fighting over one property,
// a status row that reads an ancestor's state, a row that drifts from the
// Sidebar's menu button.

const classes = (member: () => string) => member().split(/\s+/).filter(Boolean);

const REGISTRY = path.resolve(import.meta.dirname, "../registry");

describe("tree family", () => {
    it("has zero variants — variation is a named member", () => {
        for (const [name, member] of Object.entries(tree)) {
            const variants = (member as { variants?: object }).variants ?? {};
            expect(Object.keys(variants), name).toEqual([]);
        }
    });

    it("declares no surface palette: a palette class around it re-tints it", () => {
        // Items nest: a default palette on a part would be redeclared at each
        // level and swallow a swap on an outer element. The one palette is
        // semantic — a load error is danger, as Text.Error is.
        for (const [name, member] of Object.entries(tree)) {
            const palettes = classes(member).filter((c) =>
                /(?:^|:)palette-/.test(c),
            );
            expect(palettes, name).toEqual(
                name === "loadError" ? ["palette-danger"] : [],
            );
        }
    });

    it("styles every state attribute the package documents", async () => {
        // ../tree/site/docs/concepts/state-attributes.mdx. `data-checked` is
        // painted by the registry's Checkbox, which the tree's Checkbox
        // controls with the item's check; `data-depth` is the same number as
        // `--tree-depth`, the property the indentation multiplies.
        const source = await readFile(
            path.join(REGISTRY, "families/tree.tsx"),
            "utf-8",
        );
        const written = Object.values(tree)
            .flatMap((member) => classes(member))
            .join(" ");
        for (const state of [
            "expanded",
            "selected",
            "focused",
            "indeterminate",
            "renaming",
            "loading",
            "load-error",
            "disabled",
            "leaf",
            "dragging",
            "drop-target",
            "drop-position",
            "keyboard-dragging",
            "dragging-from-other-tree",
            "empty",
        ]) {
            expect(
                new RegExp(`data-${state}(?![\\w-])|data-\\[${state}=`).test(
                    written,
                ),
                state,
            ).toBe(true);
        }
        expect(written).toContain("var(--tree-depth)");
        const checkbox = await readFile(
            path.join(REGISTRY, "ui/checkbox.tsx"),
            "utf-8",
        );
        expect(checkbox).toContain("data-checked:bg-palette-ring");
        expect(classes(tree.checkbox)).toContain(
            "data-indeterminate:bg-palette-ring",
        );
        expect(source).toContain("data-indeterminate");
    });

    it("shares the Sidebar menu button's row values (S4)", () => {
        // menu.navItem is Sidebar.MenuButton's member. The differences
        // (padding, hover strength, focus on the item's row, no
        // pointer-events-none when disabled) are recorded in the header.
        const own = classes(tree.row);
        const nav = classes(menu.navItem);
        for (const shared of [
            "h-8",
            "rounded-md",
            "gap-2",
            "text-sm",
            "select-none",
            "text-palette-accent/85",
            "[&_svg:not([class*='size-'])]:size-icon",
            "data-selected:bg-palette-soft",
        ]) {
            const navShared = shared.replace("data-selected:", "data-active:");
            expect(own, shared).toContain(shared);
            expect(nav, navShared).toContain(navShared);
        }
        // The focus ring: navItem on its own focus, the row on its item's.
        for (const ring of ["outline-2", "outline-palette-ring"]) {
            expect(nav).toContain(`focus-visible:${ring}`);
            expect(own).toContain(`[:focus-visible>&]:${ring}`);
        }
        expect(nav).toContain("disabled:opacity-50");
        expect(own).toContain("data-disabled:opacity-50");
    });

    it("never lets two variants fight over a row's fill", () => {
        // A hover never lights a selected or a disabled row: composed with
        // not-data-*, so the order of the CSS rules never decides.
        const own = classes(tree.row);
        const fills = own.filter((c) => /(?:^|:)bg-/.test(c));
        expect(fills.sort()).toEqual(
            [
                "data-selected:bg-palette-soft",
                "not-data-selected:not-data-disabled:hover:bg-palette-soft/50",
            ].sort(),
        );
        expect(own.filter((c) => /^hover:/.test(c))).toEqual([]);
    });

    it("indents by depth on the spacing scale, on the logical start", () => {
        // Density scales it (var(--spacing)); RTL mirrors it (ps). Four steps
        // a level: the toggle's width, and the package's default indentation
        // (16px) at the default density.
        const indent = classes(tree.row).filter((c) => /^p[sxl]-/.test(c));
        expect(indent).toEqual([
            "ps-[calc(var(--tree-depth)*var(--spacing)*4+var(--spacing)*2)]",
        ]);
        expect(classes(tree.toggle)).toContain("size-4");
        // Status rows sit one level below their item.
        for (const member of [tree.loading, tree.loadError]) {
            expect(classes(member)).toContain(
                "ps-[calc((var(--tree-depth)+1)*var(--spacing)*4+var(--spacing)*2)]",
            );
        }
        // No physical inline property anywhere (rule 6).
        const physical = Object.values(tree)
            .flatMap((member) => classes(member))
            .filter((c) => /(?:^|:)-?(?:pl|pr|ml|mr|left|right)-/.test(c));
        expect(physical).toEqual([]);
    });

    it("turns the chevron by direction, never by rule order", () => {
        const own = classes(tree.toggle);
        expect(own).toContain("ltr:data-expanded:rotate-90");
        expect(own).toContain("rtl:data-expanded:-rotate-90");
        expect(own).toContain("rtl:-scale-x-100");
        expect(own).toContain("data-leaf:invisible");
        expect(own.filter((c) => /^data-expanded:rotate/.test(c))).toEqual([]);
    });

    it("shows a status row for its own item only", () => {
        // `[[data-loading]>&]`: the item is the row's parent. An ancestor
        // that loads again must not show its descendants' rows.
        expect(classes(tree.loading)).toContain("[[data-loading]>&]:flex");
        expect(classes(tree.loadError)).toContain("[[data-load-error]>&]:flex");
        for (const member of [tree.loading, tree.loadError, tree.empty]) {
            expect(classes(member)).toContain("hidden");
            expect(classes(member).filter((c) => /^in-data-/.test(c))).toEqual(
                [],
            );
        }
        expect(classes(tree.loading)).toContain("text-palette-accent/85");
        expect(classes(tree.empty)).toContain("text-palette-accent/85");
        expect(classes(tree.empty)).toContain("group-data-empty/tree:flex");
        expect(classes(tree.root)).toContain("group/tree");
    });

    it("hides the label through its own row's named group", () => {
        expect(classes(tree.label)).toContain(
            "group-data-renaming/tree-row:hidden",
        );
        expect(classes(tree.row)).toContain("group/tree-row");
    });

    it("draws the drop indicator without geometry the engine owns", () => {
        // S5: the engine sets its inline insets, top and height; margins
        // compose with them, sizes and insets would be overridden.
        const own = classes(tree.dropIndicator);
        const geometry = own.filter((c) =>
            /(?:^|:)(?:absolute|relative|inset-|top-|bottom-|start-|end-|w-|h-|size-)/.test(
                c,
            ),
        );
        expect(geometry).toEqual([]);
        expect(own).toContain("border-palette-ring");
        expect(own).toContain("not-data-[drop-position=inside]:border-t-2");
        expect(own).toContain("data-[drop-position=inside]:border-2");
        expect(own).toContain("pointer-events-none");
        // The inside box is dock.dropIndicator's frame (S4).
        const docked = classes(dock.dropIndicator);
        for (const shared of [
            "rounded-md",
            "border-2",
            "border-palette-ring",
        ]) {
            expect(docked, shared).toContain(shared);
        }
        expect(own).toContain("data-[drop-position=inside]:rounded-md");
    });

    it("keeps the rename field's frame on Field.Row (rule 3)", async () => {
        const parts = await readFile(
            path.join(REGISTRY, "ui/tree/parts.tsx"),
            "utf-8",
        );
        expect(parts).toMatch(
            /<Field\.Row className=\{tree\.renameFrame\(\)\}>\s*<Input/,
        );
        // The control only changes its padding: no border, fill or ring.
        expect(
            classes(tree.renameInput).filter((c) =>
                /(?:^|:)(?:border|bg-|outline|ring|rounded)/.test(c),
            ),
        ).toEqual([]);
    });

    it("keeps the check box out of focus, names and drags", async () => {
        // ../tree/site/docs/guides/checkboxes.mdx: the item says
        // aria-checked and takes the press; the box never does.
        const parts = await readFile(
            path.join(REGISTRY, "ui/tree/parts.tsx"),
            "utf-8",
        );
        const box = parts.slice(
            parts.indexOf("function Checkbox"),
            parts.indexOf("type RenameProps"),
        );
        expect(box).toContain('data-tree-no-drag=""');
        expect(box).toContain("aria-hidden");
        expect(box).toContain("tabIndex: _tabIndex");
        expect(box).toContain("<CheckboxBox.Root");
    });

    it("leaves Template.Simple with no style of its own", async () => {
        // The template rules: nothing beyond the parts — no tv(), no class
        // literal, no family member. The one className goes to Root.
        const source = await readFile(
            path.join(REGISTRY, "ui/tree/templates/simple.tsx"),
            "utf-8",
        );
        const code = source.replace(/^\s*\/\/.*$/gm, "");
        expect(code).not.toMatch(/\btv\(/);
        expect(code).not.toMatch(/className="/);
        expect(code).not.toMatch(/#\/families\//);
        expect(code.match(/className=\{/g)).toEqual(["className={"]);
        // Its own props stay under the ceiling of 7: the rest is Root's.
        const own = code.match(/> & \{([\s\S]*?)\n\};/)?.[1] ?? "";
        const props = own.match(/^\s+\w+\??:/gm) ?? [];
        expect(props.length).toBe(4);
        expect(props.length).toBeLessThanOrEqual(7);
        // The features come from the model, never from a prop.
        expect(code).toContain('model.get("features")');
    });
});

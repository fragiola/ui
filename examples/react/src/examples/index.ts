import type { ComponentType } from "react";
import type { LevelId } from "../../../gallery.ts";

// Every example this app renders, by `?id=`. One file per example, next to
// this list; the file is what the code panel shows, verbatim, so everything
// the gallery needs to know about it lives here instead.
//
// `load` stays lazy: scripts/build-manifest.ts imports this list under Node
// to write manifest.json and must not evaluate a single example.
//
// `registry` and `packages` are not listed: the manifest derives them from
// the file's imports and palette classes, so they cannot drift from it.
//
// `height` is a floor (contract §5.3). For the examples with popups (the
// OVERLAYS list in scripts/check-embeds.ts, which opens every one of them)
// it is sized so each popup opens exactly as it would with unlimited room:
// Base UI fits a popup into the space the frame leaves — it flips, shifts,
// or shrinks it to `--available-height` — so a frame that only fits the
// triggers gets a moved or squeezed popup. Those floors are the lowest
// height at which every popup passes in a 720px frame (the docs column;
// wider frames only add room), plus a margin: `check:embeds --floors`
// measures them. The rest are the content's own height in a 1024px frame,
// so the frame neither jumps when the first `resize` arrives nor keeps
// blank space in a wide one.
export type Example = {
    id: string;
    title: string;
    description: string;
    level: LevelId;
    order: number;
    features: string[];
    docs: string;
    layout: "fill" | "flow";
    height: number;
    load: () => Promise<{ default: ComponentType }>;
};

export const examples: Example[] = [
    // ─── Atoms ──────────────────────────────────────────────────────────────
    {
        id: "text",
        title: "Text",
        description:
            "Headings, paragraphs, labels and links from one primitive, a heading worn by a dialog title through `render`, and the settled secondary text.",
        level: "atoms",
        order: 1,
        features: [
            "Text.Heading",
            "Text.Paragraph",
            "Text.Clickable",
            "render",
            "text-palette-accent/85",
        ],
        docs: "/docs/atoms/text",
        layout: "flow",
        height: 690,
        load: () => import("./text.tsx"),
    },
    {
        id: "clickable",
        title: "Clickable",
        description:
            "Every variant, size and shape of the button surface, one palette class per button — there is no tone prop.",
        level: "atoms",
        order: 2,
        features: [
            "Clickable.Button",
            "variant",
            "size",
            "shape",
            "palette-danger",
        ],
        docs: "/docs/atoms/clickable",
        layout: "flow",
        height: 590,
        load: () => import("./clickable.tsx"),
    },

    // ─── Fields ─────────────────────────────────────────────────────────────
    {
        id: "field",
        title: "Field",
        description:
            "One field per surface-ring palette, then the default, invalid, disabled and required states. The box lives on the row; focus shows the palette's ring.",
        level: "fields",
        order: 1,
        features: [
            "Field.Root",
            "Field.Row",
            "Field.Error",
            "palette-surface-blue",
            "data-invalid",
        ],
        docs: "/docs/fields/field",
        layout: "flow",
        height: 410,
        load: () => import("./field.tsx"),
    },
    {
        id: "input",
        title: "Input",
        description:
            "The same input bare, with addons on either side, with an inset icon and as a template — the frame carries the box, the input carries none of it.",
        level: "fields",
        order: 2,
        features: [
            "Input",
            "Field.Addon",
            "Field.Inset",
            "Input.Template.Simple",
        ],
        docs: "/docs/fields/input",
        layout: "flow",
        height: 580,
        load: () => import("./input.tsx"),
    },
    {
        id: "choice",
        title: "Choice controls",
        description:
            "Checkbox, radio and switch side by side: one per surface-ring palette, every state, and with a label and description. One `choice` family for all three.",
        level: "fields",
        order: 3,
        features: [
            "Checkbox",
            "RadioGroup",
            "Switch",
            "Field.ChoiceRoot",
            "indeterminate",
        ],
        docs: "/docs/fields/choice",
        layout: "flow",
        height: 650,
        load: () => import("./choice.tsx"),
    },
    {
        id: "select",
        title: "Select",
        description:
            "Selects on each surface-ring palette, grouped items with labels and a separator, and the disabled and invalid states — `field` + `popup` + `menu`, no style of its own.",
        level: "fields",
        order: 4,
        features: [
            "Select.Root",
            "Select.Group",
            "Select.Separator",
            "Field.Error",
        ],
        docs: "/docs/fields/select",
        layout: "flow",
        height: 560,
        load: () => import("./select.tsx"),
    },
    {
        id: "combobox",
        title: "Combobox",
        description:
            "Filtering comboboxes on each surface-ring palette, grouped options, multiple selection with chips, and the disabled state.",
        level: "fields",
        order: 5,
        features: [
            "Combobox.Input",
            "Combobox.Chips",
            "Combobox.Group",
            "multiple",
        ],
        docs: "/docs/fields/combobox",
        layout: "flow",
        height: 820,
        load: () => import("./combobox.tsx"),
    },

    // ─── Menus ──────────────────────────────────────────────────────────────
    {
        id: "dropdown-menu",
        title: "Dropdown menu",
        description:
            "A grouped label, a destructive item painted by a palette class, submenus, checkbox and radio items with shortcuts.",
        level: "menus",
        order: 1,
        features: [
            "DropdownMenu.Sub",
            "DropdownMenu.CheckboxItem",
            "DropdownMenu.RadioGroup",
            "palette-danger",
        ],
        docs: "/docs/menus/dropdown-menu",
        layout: "flow",
        height: 620,
        load: () => import("./dropdown-menu.tsx"),
    },
    {
        id: "context-menu",
        title: "Context menu",
        description:
            "Right-click the area to open a menu with a submenu, a checkbox item and a destructive item — the same factory and members as the dropdown menu.",
        level: "menus",
        order: 2,
        features: [
            "ContextMenu.Trigger",
            "ContextMenu.Sub",
            "ContextMenu.CheckboxItem",
            "palette-danger",
        ],
        docs: "/docs/menus/context-menu",
        layout: "flow",
        height: 460,
        load: () => import("./context-menu.tsx"),
    },

    // ─── Overlays ───────────────────────────────────────────────────────────
    {
        id: "dialog",
        title: "Dialog",
        description:
            "A form dialog and one with a scrolling body. Header, body, footer and fields read their roles from the floor, through the portal.",
        level: "overlays",
        order: 1,
        features: ["Dialog.Content", "Dialog.Body", "Dialog.Footer", "layer"],
        docs: "/docs/overlays/dialog",
        layout: "flow",
        height: 500,
        load: () => import("./dialog.tsx"),
    },
    {
        id: "alert-dialog",
        title: "Alert dialog",
        description:
            "A destructive confirmation and a neutral one. No backdrop dismiss, no close button: an explicit action closes it.",
        level: "overlays",
        order: 2,
        features: [
            "AlertDialog.Content",
            "AlertDialog.Close",
            "palette-danger",
            "layer",
        ],
        docs: "/docs/overlays/alert-dialog",
        layout: "flow",
        height: 300,
        load: () => import("./alert-dialog.tsx"),
    },
    {
        id: "drawer",
        title: "Drawer",
        description:
            "Drawers from the inline end, the inline start and the bottom, the last with snap points and a swipe handle.",
        level: "overlays",
        order: 3,
        features: [
            "Drawer.Popup",
            "Drawer.Handle",
            "snapPoints",
            "swipeDirection",
        ],
        docs: "/docs/overlays/drawer",
        layout: "flow",
        height: 380,
        load: () => import("./drawer.tsx"),
    },
    {
        id: "popover",
        title: "Popover",
        description:
            "A popover holding a small form, and one without a close button. Title, description and close arrive through `render`.",
        level: "overlays",
        order: 4,
        features: [
            "Popover.Content",
            "Popover.Title",
            "Popover.Close",
            "render",
        ],
        docs: "/docs/overlays/popover",
        layout: "flow",
        height: 300,
        load: () => import("./popover.tsx"),
    },
    {
        id: "tooltip",
        title: "Tooltip",
        description:
            "Two triggers under one provider: moving from the first to the second opens its tooltip without waiting for the delay again.",
        level: "overlays",
        order: 5,
        features: ["Tooltip.Provider", "Tooltip.Content", "popup.tooltip"],
        docs: "/docs/overlays/tooltip",
        layout: "flow",
        height: 200,
        load: () => import("./tooltip.tsx"),
    },

    // ─── Disclosure ─────────────────────────────────────────────────────────
    {
        id: "accordion",
        title: "Accordion",
        description:
            "Several items open at once, a single-open group and a disabled item — the disclosure family's trigger, panel and content.",
        level: "disclosure",
        order: 1,
        features: [
            "Accordion.Item",
            "Accordion.Trigger",
            "multiple",
            "disabled",
        ],
        docs: "/docs/disclosure/accordion",
        layout: "flow",
        height: 470,
        load: () => import("./accordion.tsx"),
    },
    {
        id: "collapsible",
        title: "Collapsible",
        description:
            "One section on its own: closed by default, open by default, and disabled.",
        level: "disclosure",
        order: 2,
        features: [
            "Collapsible.Trigger",
            "Collapsible.Panel",
            "defaultOpen",
            "disabled",
        ],
        docs: "/docs/disclosure/collapsible",
        layout: "flow",
        height: 420,
        load: () => import("./collapsible.tsx"),
    },

    // ─── Navigation ─────────────────────────────────────────────────────────
    {
        id: "tabs",
        title: "Tabs",
        description:
            "Horizontal tabs with the animated indicator, a disabled tab, and a vertical list. The indicator follows the primitive's CSS variables, RTL included.",
        level: "navigation",
        order: 1,
        features: ["Tabs.List", "Tabs.Tab", "Tabs.Panel", "orientation"],
        docs: "/docs/navigation/tabs",
        layout: "flow",
        height: 480,
        load: () => import("./tabs.tsx"),
    },
    {
        id: "navigation-menu",
        title: "Navigation menu",
        description:
            "Triggers that open one morphing popup whose viewport resizes between items, next to a plain link.",
        level: "navigation",
        order: 2,
        features: [
            "NavigationMenu.Trigger",
            "NavigationMenu.Viewport",
            "popup.content",
        ],
        docs: "/docs/navigation/navigation-menu",
        layout: "flow",
        height: 280,
        load: () => import("./navigation-menu.tsx"),
    },
    {
        id: "pagination",
        title: "Pagination",
        description:
            "Basic pagination, collapsed ranges with an ellipsis, and previous disabled on the first page. The current page is a fill strategy, never a colour.",
        level: "navigation",
        order: 3,
        features: [
            "Pagination.Link",
            "Pagination.Ellipsis",
            "aria-current",
            "Clickable",
        ],
        docs: "/docs/navigation/pagination",
        layout: "flow",
        height: 330,
        load: () => import("./pagination.tsx"),
    },
    {
        id: "breadcrumb",
        title: "Breadcrumb",
        description:
            "A basic trail, collapsed items behind an ellipsis, and a custom separator. The current page is text, not a link.",
        level: "navigation",
        order: 4,
        features: [
            "Breadcrumb.Link",
            "Breadcrumb.Page",
            "Breadcrumb.Ellipsis",
            "Breadcrumb.Separator",
        ],
        docs: "/docs/navigation/breadcrumb",
        layout: "flow",
        height: 300,
        load: () => import("./breadcrumb.tsx"),
    },

    // ─── Display ────────────────────────────────────────────────────────────
    {
        id: "badge",
        title: "Badge",
        description:
            "Soft, solid and outline badges, with and without an icon, across six palettes on one floor — each badge carries its own palette class.",
        level: "display",
        order: 1,
        features: ["Badge", "variant", "palette-blue", "palette-danger"],
        docs: "/docs/display/badge",
        layout: "flow",
        height: 370,
        load: () => import("./badge.tsx"),
    },
    {
        id: "table",
        title: "Table",
        description:
            "A table painted by the floor's roles with hover and a selected row, then a column, a row and a cell tinted by a palette class on that element.",
        level: "display",
        order: 2,
        features: [
            "Table.Root",
            "Table.Row",
            "Table.Caption",
            "palette-danger",
            "Badge",
        ],
        docs: "/docs/display/table",
        layout: "flow",
        height: 860,
        load: () => import("./table.tsx"),
    },
    {
        id: "avatar",
        title: "Avatar",
        description:
            "Images, the fallback when there is none, a broken image falling back, and sizes set from outside.",
        level: "display",
        order: 3,
        features: ["Avatar.Image", "Avatar.Fallback", "size-*"],
        docs: "/docs/display/avatar",
        layout: "flow",
        height: 400,
        load: () => import("./avatar.tsx"),
    },
    {
        id: "skeleton",
        title: "Skeleton",
        description:
            "Loading placeholders composed into a card, an avatar with text, and table rows.",
        level: "display",
        order: 4,
        features: ["Skeleton", "bg-palette-soft", "animate-pulse"],
        docs: "/docs/display/skeleton",
        layout: "flow",
        height: 580,
        load: () => import("./skeleton.tsx"),
    },
    {
        id: "separator",
        title: "Separator",
        description:
            "Horizontal, between two pieces of content, and vertical — the floor's line role.",
        level: "display",
        order: 5,
        features: ["Separator", "orientation", "bg-palette-line"],
        docs: "/docs/display/separator",
        layout: "flow",
        height: 350,
        load: () => import("./separator.tsx"),
    },
    {
        id: "progress",
        title: "Progress",
        description:
            "One bar per chromatic palette, the value axis from empty to full, and the indeterminate state.",
        level: "display",
        order: 6,
        features: [
            "Progress.Root",
            "Progress.Indicator",
            "indeterminate",
            "palette-blue",
        ],
        docs: "/docs/display/progress",
        layout: "flow",
        height: 320,
        load: () => import("./progress.tsx"),
    },
    {
        id: "slider",
        title: "Slider",
        description:
            "One slider per chromatic palette, a range, steps, disabled, vertical, and one inside a field row — every box style comes from the row.",
        level: "display",
        order: 7,
        features: [
            "Slider.Thumb",
            "range",
            "orientation",
            "Field.Row",
            "palette-blue",
        ],
        docs: "/docs/display/slider",
        layout: "flow",
        height: 770,
        load: () => import("./slider.tsx"),
    },
    {
        id: "chart",
        title: "Chart",
        description:
            "A line, a bar and a donut chart: the same wrapper re-coloured by the palette class on each chart.",
        level: "display",
        order: 8,
        features: [
            "Chart",
            "useThemeTokens",
            "--chart-1",
            "palette-green",
            "ECharts",
        ],
        docs: "/docs/display/chart",
        layout: "flow",
        height: 1090,
        load: () => import("./chart.tsx"),
    },
];

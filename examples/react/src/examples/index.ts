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
// blank space in a wide one. The modal examples (dialog, alert dialog,
// drawer) are among the rest: on fragiola.com their popups cover the page,
// the frame promoted over it (contract v1.3 §5.4, src/host/), so the frame
// keeps no room for them.
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
            "A release note from one primitive: headings, a byline in the settled secondary text, a paragraph with a link, then a label and an error, and a heading worn by another part through `render`.",
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
        height: 420,
        load: () => import("./text.tsx"),
    },
    {
        id: "clickable",
        title: "Clickable",
        description:
            "A settings card's actions — a solid primary in palette-neutral, an outline, a ghost and icon buttons — then the size, the disabled state and one row of palettes. There is no tone prop.",
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
        height: 420,
        load: () => import("./clickable.tsx"),
    },
    {
        id: "palettes",
        title: "Palettes",
        description:
            "One class, and the colour changes: pick a colour and the same card re-colours, while the only code that changes is each element's palette-* class.",
        level: "atoms",
        order: 3,
        features: [
            "palette-neutral",
            "palette-surface-blue",
            "palette-blue",
            "Clickable.Button",
            "Field",
            "Switch",
        ],
        docs: "/docs/architecture/palettes",
        layout: "flow",
        height: 472,
        load: () => import("./palettes.tsx"),
    },
    {
        id: "theme-builder",
        title: "Theme Builder",
        description:
            "See a design before building it: pick a colour and a level of each design axis, watch the registry's components follow, and copy the CSS and attributes that reproduce it.",
        level: "atoms",
        order: 4,
        features: [
            "generatePalette",
            "serializePalette",
            "data-density",
            "data-radius",
            "data-text",
            "data-elevation",
            "data-motion",
        ],
        docs: "/docs/getting-started/theme-builder",
        layout: "fill",
        height: 900,
        load: () => import("./theme-builder.tsx"),
    },

    // ─── Fields ─────────────────────────────────────────────────────────────
    {
        id: "field",
        title: "Field",
        description:
            "A profile form in the default look, then the invalid and disabled states, then the same field on each surface-ring palette. The box lives on the row; focus shows the palette's ring.",
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
        height: 498,
        load: () => import("./field.tsx"),
    },
    {
        id: "input",
        title: "Input",
        description:
            "A store settings form: the same input with an inset icon, as a template with an addon, and with addons on both sides — the frame carries the box, the input carries none of it.",
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
        height: 500,
        load: () => import("./input.tsx"),
    },
    {
        id: "choice",
        title: "Choice controls",
        description:
            "Notification settings with a switch, a radio group and a checkbox, then the indeterminate and disabled states, and one row of surface-ring palettes. One `choice` family for all three.",
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
        height: 402,
        load: () => import("./choice.tsx"),
    },
    {
        id: "select",
        title: "Select",
        description:
            "Regional settings with grouped items, labels and a separator, then the disabled and invalid states and one row of surface-ring palettes — `field` + `popup` + `menu`, no style of its own.",
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
        height: 480,
        load: () => import("./select.tsx"),
    },
    {
        id: "combobox",
        title: "Combobox",
        description:
            "A filtering combobox with grouped options and a multiple one with chips, then the disabled and invalid states and one row of surface-ring palettes.",
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
        height: 620,
        load: () => import("./combobox.tsx"),
    },

    // ─── Menus ──────────────────────────────────────────────────────────────
    {
        id: "dropdown-menu",
        title: "Dropdown menu",
        description:
            "An account menu with a group label, shortcuts, a checkbox item and a submenu of radio items, and a row's actions menu with a destructive item painted by a palette class.",
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
        height: 400,
        load: () => import("./dropdown-menu.tsx"),
    },
    {
        id: "context-menu",
        title: "Context menu",
        description:
            "Right-click a file to open a menu with a submenu, a checkbox item and a destructive item — the same factory and members as the dropdown menu.",
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
        height: 340,
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
        height: 100,
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
        height: 100,
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
        height: 100,
        load: () => import("./drawer.tsx"),
    },
    {
        id: "popover",
        title: "Popover",
        description:
            "A popover holding a small form, and a note without a close button. Title, description and close arrive through `render`.",
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
        height: 380,
        load: () => import("./popover.tsx"),
    },
    {
        id: "tooltip",
        title: "Tooltip",
        description:
            "An editor toolbar under one provider: moving from one button to the next opens its tooltip without waiting for the delay again.",
        level: "overlays",
        order: 5,
        features: ["Tooltip.Provider", "Tooltip.Content", "popup.tooltip"],
        docs: "/docs/overlays/tooltip",
        layout: "flow",
        height: 140,
        load: () => import("./tooltip.tsx"),
    },

    // ─── Disclosure ─────────────────────────────────────────────────────────
    {
        id: "accordion",
        title: "Accordion",
        description:
            "A pricing FAQ with several items open at once, and a disabled item — the disclosure family's trigger, panel and content.",
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
        height: 294,
        load: () => import("./accordion.tsx"),
    },
    {
        id: "collapsible",
        title: "Collapsible",
        description:
            "An order summary that starts open, and a disabled section.",
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
        height: 260,
        load: () => import("./collapsible.tsx"),
    },

    // ─── Navigation ─────────────────────────────────────────────────────────
    {
        id: "tabs",
        title: "Tabs",
        description:
            "Account settings tabs with the animated indicator and a disabled tab, a vertical list, and one row of palettes. The indicator follows the primitive's CSS variables, RTL included.",
        level: "navigation",
        order: 1,
        features: ["Tabs.List", "Tabs.Tab", "Tabs.Panel", "orientation"],
        docs: "/docs/navigation/tabs",
        layout: "flow",
        height: 384,
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
        height: 220,
        load: () => import("./navigation-menu.tsx"),
    },
    {
        id: "pagination",
        title: "Pagination",
        description:
            "An invoice list's footer with collapsed ranges, and previous disabled on the first page. The current page is a state, never a colour.",
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
        height: 176,
        load: () => import("./pagination.tsx"),
    },
    {
        id: "breadcrumb",
        title: "Breadcrumb",
        description:
            "A page header's trail, collapsed items behind an ellipsis, and a custom separator. The current page is text, not a link.",
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
        height: 268,
        load: () => import("./breadcrumb.tsx"),
    },
    {
        id: "sidebar",
        title: "Sidebar",
        description:
            "An app shell: a team switcher and a user menu, search, groups with actions and badges, a collapsible sub-menu, and the page beside it. It collapses to icons with tooltips.",
        level: "navigation",
        order: 5,
        features: [
            "Sidebar.MenuButton",
            "Sidebar.MenuAction",
            "Sidebar.MenuBadge",
            "Sidebar.MenuSub",
            "Sidebar.Input",
            "Sidebar.Trigger",
            "Sidebar.Rail",
            "collapsible icon",
        ],
        docs: "/docs/navigation/sidebar",
        layout: "fill",
        height: 640,
        load: () => import("./sidebar.tsx"),
    },

    // ─── Display ────────────────────────────────────────────────────────────
    {
        id: "badge",
        title: "Badge",
        description:
            "An invoice list's statuses in soft, solid and outline badges, badges with an icon, and one row of palettes — each badge carries its own palette class.",
        level: "display",
        order: 1,
        features: ["Badge", "variant", "palette-blue", "palette-danger"],
        docs: "/docs/display/badge",
        layout: "flow",
        height: 344,
        load: () => import("./badge.tsx"),
    },
    {
        id: "table",
        title: "Table",
        description:
            "An invoice table painted by the floor's roles, with hover, a selected row, status badges and a footer, then the empty state.",
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
        height: 597,
        load: () => import("./table.tsx"),
    },
    {
        id: "avatar",
        title: "Avatar",
        description:
            "A member list with images and a fallback, sizes set from outside, and a broken image falling back.",
        level: "display",
        order: 3,
        features: ["Avatar.Image", "Avatar.Fallback", "size-*"],
        docs: "/docs/display/avatar",
        layout: "flow",
        height: 408,
        load: () => import("./avatar.tsx"),
    },
    {
        id: "skeleton",
        title: "Skeleton",
        description: "A post card while it loads, composed from placeholders.",
        level: "display",
        order: 4,
        features: ["Skeleton", "bg-palette-soft", "animate-pulse"],
        docs: "/docs/display/skeleton",
        layout: "flow",
        height: 360,
        load: () => import("./skeleton.tsx"),
    },
    {
        id: "separator",
        title: "Separator",
        description:
            "An account summary divided horizontally and vertically — the floor's line role.",
        level: "display",
        order: 5,
        features: ["Separator", "orientation", "bg-palette-line"],
        docs: "/docs/display/separator",
        layout: "flow",
        height: 242,
        load: () => import("./separator.tsx"),
    },
    {
        id: "progress",
        title: "Progress",
        description:
            "An upload list, the indeterminate state, and one row of palettes.",
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
        height: 328,
        load: () => import("./progress.tsx"),
    },
    {
        id: "slider",
        title: "Slider",
        description:
            "A price range and a stepped rating, then the disabled and vertical sliders, and one row of palettes.",
        level: "display",
        order: 7,
        features: ["Slider.Thumb", "range", "orientation", "palette-blue"],
        docs: "/docs/display/slider",
        layout: "flow",
        height: 398,
        load: () => import("./slider.tsx"),
    },
    {
        id: "chart",
        title: "Chart",
        description:
            "A line, a bar and a donut chart, coloured by the palette class on each chart's wrapper.",
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
        height: 1048,
        load: () => import("./chart.tsx"),
    },
    // ─── Special ────────────────────────────────────────────────────────────
    {
        id: "dockable",
        title: "Dockable",
        description:
            "A docking layout in one line: Template.Simple renders the model's tabsets, splitters and borders. Drag, resize, close, maximize, overflow and pop out.",
        level: "special",
        order: 1,
        features: [
            "Dockable.Template.Simple",
            "createModel",
            "drag and drop",
            "TabOverflowMenu",
            "MaximizeTrigger",
            "PopoutTrigger",
            "overlay border",
        ],
        docs: "/docs/special/dockable",
        layout: "fill",
        height: 560,
        load: () => import("./dockable.tsx"),
    },
    {
        id: "dockable-custom-template",
        title: "Dockable: your own template",
        description:
            "An editor's workbench written once from the same parts — tab icons, a border of tool panels, no maximize — and used as a one-liner, as Template.Simple is.",
        level: "special",
        order: 2,
        features: [
            "Dockable.Root",
            "Dockable.Borders",
            "Dockable.TabSet",
            "Dockable.TabClose",
            "Dockable.TabOverflowMenu",
            "template",
        ],
        docs: "/docs/special/dockable",
        layout: "fill",
        height: 520,
        load: () => import("./dockable-custom-template.tsx"),
    },
    {
        id: "splitter",
        title: "Splitter",
        description:
            "A split view in one line: Template.Simple puts a separator with a grip between the panels it is given. Nested groups, size limits and collapsible panels; resize by pointer or keyboard.",
        level: "special",
        order: 3,
        features: [
            "Splitter.Template.Simple",
            "Splitter.Panel",
            "nested groups",
            "collapsible",
            "keyboard resize",
        ],
        docs: "/docs/special/splitter",
        layout: "fill",
        height: 360,
        load: () => import("./splitter.tsx"),
    },
    {
        id: "splitter-ide",
        title: "Splitter: an editor layout",
        description:
            "Composed from the parts: a sidebar that collapses to a rail of icons, a nested editor and terminal, and a name for every separator.",
        level: "special",
        order: 4,
        features: [
            "Splitter.Group",
            "Splitter.Separator",
            "Splitter.Grip",
            "collapsedSize",
            "split.expanded",
        ],
        docs: "/docs/special/splitter",
        layout: "fill",
        height: 360,
        load: () => import("./splitter-ide.tsx"),
    },
    {
        id: "tree",
        title: "Tree",
        description:
            "A tree in one line: Template.Simple renders the items, their toggles and children, and the UI of each feature the model has — here multiple selection, type-ahead and drag and drop.",
        level: "special",
        order: 5,
        features: [
            "Tree.Template.Simple",
            "selection",
            "type-ahead",
            "drag and drop",
            "keyboard drag",
        ],
        docs: "/docs/special/tree",
        layout: "flow",
        height: 360,
        load: () => import("./tree.tsx"),
    },
    {
        id: "tree-file-explorer",
        title: "Tree: a file explorer",
        description:
            "Composed from the parts: an icon per kind, a file's size as its description, multiple selection, drag and drop, rename by F2 or double click, and announcements in the app's words.",
        level: "special",
        order: 6,
        features: [
            "Tree.Root",
            "Tree.Item",
            "Tree.Rename",
            "Tree.DropIndicator",
            "announce",
        ],
        docs: "/docs/special/tree",
        layout: "flow",
        height: 420,
        load: () => import("./tree-file-explorer.tsx"),
    },
    {
        id: "grid-layout",
        title: "Grid Layout",
        description:
            "A dashboard in one line: Template.Simple renders each item as a card with a drag handle, its title, your content and a resize handle on every side. Drag, resize and compact; the keyboard moves and resizes too.",
        level: "special",
        order: 7,
        features: [
            "GridLayout.Template.Simple",
            "drag and resize",
            "compaction",
            "keyboard",
            "grid background",
        ],
        docs: "/docs/special/grid-layout",
        layout: "flow",
        height: 380,
        load: () => import("./grid-layout.tsx"),
    },
    {
        id: "grid-layout-dashboard-builder",
        title: "Grid Layout: a dashboard builder",
        description:
            "Composed from the parts: a sidebar of widgets to drag in, a remove button in each card's header, a corner resize handle and announcements in the app's own words.",
        level: "special",
        order: 8,
        features: [
            "GridLayout.DragSource",
            "GridLayout.DragPreview",
            "GridLayout.Header",
            "gridLayoutRef",
            "announce",
        ],
        docs: "/docs/special/grid-layout",
        layout: "fill",
        height: 440,
        load: () => import("./grid-layout-dashboard-builder.tsx"),
    },
    {
        id: "data-grid",
        title: "Data Grid",
        description:
            "A data grid in one line: Template.Simple renders the header, the virtualized rows and the piece of each feature installed: sort arrows, a check box column and the pages below. The keys move the active cell.",
        level: "special",
        order: 9,
        features: [
            "DataGrid.Template.Simple",
            "sorting",
            "row selection",
            "pagination",
            "keyboard",
        ],
        docs: "/docs/special/data-grid",
        layout: "flow",
        height: 470,
        load: () => import("./data-grid.tsx"),
    },
    {
        id: "data-grid-people-directory",
        title: "Data Grid: a people directory",
        description:
            "Composed from the parts: a toolbar outside the grid, the name and office pinned, a filter under each column, every column resizable, and the title and email edited in place with a refused value.",
        level: "special",
        order: 10,
        features: [
            "DataGrid.HeaderFilter",
            "DataGrid.ColumnResizer",
            "DataGrid.CellEditor",
            "pinned columns",
            "useLocalRows",
        ],
        docs: "/docs/special/data-grid",
        layout: "fill",
        height: 480,
        load: () => import("./data-grid-people-directory.tsx"),
    },
];

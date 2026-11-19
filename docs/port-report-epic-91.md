# Port Report — Epic #91: Tree, the Third Special Component

## Summary

Two issues, one Epic: Tree (`@fragiola/tree-react`, published at 0.1.0) arrives in the
registry as the third **styled layer over a published package**, under the special
component rules S1–S8. None of them had to change. It is the first special item that
composes other registry items inside the package's parts (Checkbox, Field + Input,
Clickable), and none of those changed either.

1. **Issue #89**: the `tree` family, the styled parts (the package's `Root`, `Items`,
   `Item`, `ItemContent`, `Group`, `Toggle`, `LiveRegion`, `DropIndicator` and
   `VirtualItems`, plus `Label`, `Checkbox`, `Rename`, `Loading`, `LoadError`, `Retry`
   and `Empty`), the `tree` item pinned to `^0.1.0`, the release-age exclusion, a
   pinned-class test and seven dev scenarios.
2. **Issue #90**: `Tree.Template.Simple`, two public examples (`tree`,
   `tree-file-explorer`), a drag in `check:embeds`, the docs page, the sidebar entry, the
   Special overview row, a template scenario, the architecture update and this report.

## Baseline vs result

The baseline is the tree repository's `file-explorer` example
(`../tree/examples/react/src/examples/file-explorer/`): a file tree with icons per kind,
sizes, selection, indentation guides and a theme-driven look.

| | `file-explorer` | Fragiola |
|---|---|---|
| Styled layer | `styles.ts`, 42 lines, for one page | 1 family: `tree.tsx`, 116 code lines, 19 `tv()` (a member per part and state), for every page |
| Row style | 1 `row` string, copied in the `styles.ts` of all 20 of the repo's styled examples | 1 member (`tree.row`) |
| Shape tokens | 19 distinct `--tr-*` in this example (24 across the repo), set by 5 theme files (688 lines) | 0: the spacing scale, `rounded-md`, `h-8`, the six roles |
| Features with a look | selection only | selection, checks, rename, drag and drop, loading, load errors, empty, virtualization |
| Palettes | `palette-raised` on the root, `palette-blue` on folder icons | the one in scope; none declared, `danger` for a load error |
| `!important` | 0 | 0 |
| Markup for a tree | 96 lines (`index.tsx`) | `Template.Simple`: 4 props, features read from the model |

**The comparison is unfair in one direction, and this report says so.** The repo's
examples copy their styles on purpose: each is a self-contained page meant to be read and
copied, and its five themes show that the parts take any look (indentation guides, a
selection marker, a `+`/`-` toggle). The number that matters is the one a reader of this
library gets: **one** source of style for every tree, and a tree whose features bring their
own UI.

**What did not shrink:** `parts.tsx` is 326 code lines. Nine wrappers keep the generic
type, the function `className` and `render`, and seven parts are new UI the package leaves
to the app (a check box on Checkbox, rename on Field + Input, status rows, Retry, Empty).
The template is 122.

## Reuse (S4)

| Value | Shared with | Note |
|---|---|---|
| `h-8`, `rounded-md`, `gap-2`, `text-sm`, `select-none`, `[&_svg:not([class*='size-'])]:size-icon` | `menu.navItem` (Sidebar.MenuButton) | a tree in a sidebar lines up with its menu; pinned on both sides by a test |
| secondary text at rest (`accent/85`), lit to `contrast` | `menu.navItem`, `menu.item` | the settled secondary-text value |
| `soft` fill + `contrast` for the current row | `menu.navItem`'s `data-active` | here `data-selected` |
| `outline-2 outline-palette-ring` focus | `menu.navItem` | on the item's row, `[:focus-visible>&]`: the item takes DOM focus, the row is drawn |
| `opacity-50` when disabled | `menu.navItem`, `menu.item` | |
| the check box | `ui/checkbox.tsx` | composed, unchanged; the tree adds the mixed fill Checkbox does not paint |
| the rename frame | `Field.Row` + `Input` | composed, unchanged (rule 3), two steps shorter (`h-6`) |
| the load error | `palette-danger`, as `Text.Error` | |
| the `inside` box: `rounded-md`, `border-2`, `border-palette-ring` | `dock.dropIndicator` | pinned on both sides by a test; Dockable's also fills `ring/15` and moves with a transition, a tree's frames a row it must not hide; `before` / `after` are a 2px line instead |

**Not shared, and why:**

- **The hover.** `navItem` hovers to the full `soft` fill, the same as its current page:
  one page is current. A tree selects any number of rows, and a selected row must still
  read as selected while its neighbour is hovered, so the hover is `soft/50` and never
  lights a selected or a disabled row (`not-data-*:`).
- **`menu.item`'s `highlighted:`.** It lights `:focus` and `[data-selected]` alike: in a
  menu, focus is the lit item. In a tree, focus and selection are different things and
  both show.
- **`pointer-events-none` when disabled.** A disabled tree item stays focusable (the
  APG), so a press must still reach it.
- **The padding.** `navItem`'s `px-2` becomes `pe-2` and a start padding that adds the
  depth.

## The `tree` family

| member | part | reads |
|---|---|---|
| `root` | `Root` | `data-dragging`, `data-keyboard-dragging`, `data-dragging-from-other-tree`; names `group/tree` |
| `item` | `Item` | (its outline is off; the ring is on its row) |
| `row` | `ItemContent` | `--tree-depth`, `data-selected`, `data-focused`, `data-disabled`, `data-dragging`, `data-drop-target`, `:hover`, the item's `:focus-visible`; names `group/tree-row` |
| `toggle` | `Toggle` | `data-expanded`, `data-leaf`, the direction |
| `label` | `Label` | `data-renaming` through `group/tree-row` |
| `group` | `Group` | |
| `dropIndicator` | `DropIndicator` | `data-drop-position` |
| `liveRegion` | `LiveRegion` | |
| `checkbox`, `checkboxDash` | `Checkbox` | `data-indeterminate` (Checkbox paints `data-checked`) |
| `rename`, `renameFrame`, `renameInput` | `Rename` | (`data-invalid` on Field.Root turns it danger) |
| `loading`, `loadError`, `statusMark`, `retry` | `Loading`, `LoadError`, `Retry` | `data-loading`, `data-load-error` of their own item (`[[data-loading]>&]`) |
| `empty` | `Empty` | `data-empty` through `group/tree` |

Zero variants, no surface palette, no geometry on the drop indicator beyond margins:
`tests/tree.test.ts` pins it, with every state the package documents.

## Decisions

- **Family name `tree`** (the Epic's recommendation). Its file is `families/tree.tsx`,
  without JSX: `ui/tree.tsx` shares its basename, and the shadcn CLI resolves
  `@/components/families/tree` to the component otherwise (the smoke caught it; the same
  reason as `field.tsx`).
- **The template reads the installed features from the model** (`model.get("features")`,
  the Epic's recommendation): drag and drop or foreign drop → the indicator; checkboxes →
  a box; rename → the field; async children → the status rows; virtualization → flat rows.
- **Depth is `--tree-depth`, not `data-depth`.** They are the same number; CSS can only
  multiply the custom property. Four spacing steps a level: the toggle's width, and the
  package's default `indentation` (16px) at the default density.
- **The drop indicator keeps the engine's geometry (S5).** The engine places it in pixels
  from `dragAndDrop({ indentation, indicatorInset })`; the family draws it and pulls the
  `inside` box back to the row's own indentation with a margin (`-ms-3`, except for an
  empty tree's), which composes with the inline insets. Under another density the line drifts by a few pixels per level: the
  options are pixels, and a model's features are fixed when it is created.
- **The check box never takes focus.** Checkbox's root is rendered without its tab stop
  (`render` drops `tabIndex`), hidden from assistive technology and marked
  `data-tree-no-drag`, as the package's checkboxes guide asks: a press lands on the item,
  which says `aria-checked`.
- **The status rows show for their own item only** (`[[data-loading]>&]`), never for a
  loading ancestor: a parent loaded again (`load-children`) is a loading ancestor of
  whatever it still shows.
- **The loading mark pulses instead of spinning.** `animate-pulse` follows the motion
  axis; a spin would need a new token.
- **`data-focused` lights the row's text.** It marks the roving tab stop while the tree
  has no focus; the ring stays the DOM focus's.
- **A keyboard drag outlines the tree** (dashed `ring`), as does a drag from another tree
  of the group: the tree the arrows act on.
- **Palette swaps are surface-tier**, as for the Sidebar: the rows' resting text is
  secondary text, legible only on a neutral surface.
- **English defaults** ("Loading…", "Could not load.", "Retry", "No items", "Rename …",
  "Retry loading …") as Splitter's "Resize"; `children` and `aria-label` replace them.
- **`check:embeds` drags a row** in both examples: the AC asked for a drag in the file
  explorer, and the check lives where every example already runs in a real frame.

## Verification

- `pnpm check`, `pnpm typecheck`, `pnpm test` (the compile guard covers `tree.tsx`;
  `tree.test.ts` pins the family and the template), `pnpm build`.
- `pnpm registry:build`: `dist/r/tree.json` depends on `@fragiola/tree-react@^0.1.0`;
  `pnpm registry:smoke` passes in all four scaffolds.
- `pnpm site:export --base /ui`: valid (contract v1.3), 45 pages, 36 examples;
  `check:embeds`: every example passes in the frame, and the tree examples' drag lands.
- Playwright, on the scenarios: light and dark; surface-tier palettes on the root and on
  an outer element; compact, default and spacious density (rows 25.6 / 32 / 38.4px,
  indentation 19.2 / 24 / 28.8px a level); `dir="rtl"` (indented from the right, the
  chevron pointing left and turning down); radius flat and full, text large, motion none;
  the keyboard (arrows, Home, End, `*`, type-ahead, Enter, Space, Shift and Ctrl
  selection, Ctrl+A); tri-state checks (a press on a box checks without selecting and
  focuses the item, cascade and mixed, Space with `space: "check"`, a disabled item);
  pointer drag (before / after line at the icon, inside box from the row's indentation, the grabbing
  cursor, half opacity) and keyboard drag (the dashed outline, the announcements, Enter,
  Escape) in both directions; rename (F2, the name selected, a refused name in danger,
  commit, Escape, focus back to the item, not renamable, double click); async loading
  (the Loading row, `aria-busy`), the load error (danger, the live region) and Retry; a
  virtualized tree of 20 500 rows under each density (End, PageDown, no gap or overlap
  between rows).

## Follow-ups

- **Shared with Grid Layout and Data Grid.** A data grid row that can be selected and
  focused should start from `tree.row`'s values: `h-8`, `soft` + `contrast` when
  selected, `soft/50` hover composed with `not-data-selected:not-data-disabled:`, the
  `ring` outline on the focused row (or cell), `opacity-50` when disabled. Its drop
  indicator, if any, can share `tree.dropIndicator`'s `ring` line.
- **A pixel option against a density.** Tree's `indentation` and `indicatorInset` are
  pixels. A package option in spacing steps (or one read from the DOM) would let the drop
  line follow the density; that is a change for `../tree`, out of this Epic.

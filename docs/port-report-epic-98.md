# Port Report — Epic #98: Data Grid, the Fifth Special Component

## Summary

Three issues, one Epic: Data Grid (`@fragiola/data-grid-react`, published at 0.1.0)
arrives in the registry as the fifth **styled layer over a published package**, under the
special component rules S1–S8. None of them had to change. With it, every published
Fragiola library has its special item.

1. **Issue #95**: the `sheet` family, the styled core parts (the package's `Root`, `Grid`,
   `Header`, `HeaderRows`, `HeaderRow`, `HeaderCells`, `HeaderCell`, `Body`, `Rows`, `Row`,
   `Cells`, `Cell` and `Empty`, plus a header cell's `HeaderLabel` and `HeaderTitle`), row
   heights from the spacing scale through the engine, the `data-grid` item pinned to
   `^0.1.0`, the release-age exclusion, a pinned-class test and the parts scenario.
2. **Issue #96**: a piece per common feature, each rendering nothing without its feature —
   `SortIndicator`, `ColumnResizer`, `SelectCell` / `SelectAllCell`, `HeaderFilter`,
   `CellEditor`, `Pagination` (pinning needs none: the cells carry it) — built on the
   registry's `checkbox`, `field` + `input`, `select` and `pagination`, and a scenario
   composing all seven by hand, right to left and compact.
3. **Issue #97**: `DataGrid.Template.Simple`, the scenarios built on it (one per feature,
   all seven and none, 10k rows under three densities, the core states, the axes matrix),
   two public examples (`data-grid`, `data-grid-people-directory`) with an interaction each
   in `check:embeds`, the docs page, the sidebar entry, the Special overview row (the "not
   styled yet" sentence is gone: no published library is left), the architecture update
   and this report.

## Baseline vs result

The baseline is the data-grid repository's `common-features` example
(`../data-grid/examples/react/src/examples/common-features/`): React Data Grid's "common
features" in one grid — a selection column, columns pinned at both ends, sortable and
resizable columns, cells edited in place, summary rows — under a theme-driven look.

| | `common-features` | Fragiola |
|---|---|---|
| Styled layer | `styles.ts`, 126 lines, for one page (`header-filters` and `pinned-columns` bring 73 and 95 more) | 1 family: `sheet.ts`, 147 code lines, 25 `tv()` (a member per part and feature piece), for every grid |
| Shape tokens | 20 distinct `--dg-*` across the repo's styled examples, 22 uses in this one | 0: the spacing scale, `rounded-lg`, the six roles, the elevation and motion axes |
| Feature UI | written in the page: a select-all and a row check box on `Checkbox`, an arrow in a header `render`, a resizer on `useColumnResizer`, four editors | seven pieces, each gated on its feature, on the registry's controls |
| States with a look | active, selected, pinned, editing (by example) | every core state and the seven features' (below) |
| Row height | `rowHeight={38}`, fixed | from the spacing scale, measured, told to the engine |
| `!important` | 0 | 0 |
| Markup for a grid with these features | 480 lines (`index.tsx`, summary rows and an export included) | `Template.Simple`: one element, five props of its own |

**The comparison is unfair in one direction, and this report says so.** The repo's
examples copy their styles on purpose: each is a self-contained page meant to be read and
copied, and its theme tokens show that the parts take any look. The number that matters
is the one a reader of this library gets: **one** source of style for every grid, and a
grid with its common features in one line.

**What did not shrink:** `parts.tsx` is 253 code lines — thirteen wrappers keep `render`,
`ref`, the generic row type and the function `className`, and the Root adds the density
probe and the overflow attributes. The seven pieces are 509 together (the pagination's
page list and page size, the filter's text and select forms are the largest), and the
template 192.

## Reuse (S4)

| Value | Shared with | Note |
|---|---|---|
| `px-3`, `border-b border-palette-line`, `font-medium text-palette-contrast`, `bg-palette-soft` header, `text-palette-accent/85` body | `ui/table.tsx` | the grid reads as the static table made interactive; pinned on both sides by a test |
| `animate-pulse`, `rounded-md`, `bg-palette-soft` | `ui/skeleton.tsx` | a loading cell's bar |
| `data-selected:bg-palette-soft`, `contrast` text | `tree.row` | a selected row |
| `w-px`, `before:-inset-x-1.5`, `after:-inset-x-px`, `ring` on hover / drag / focus-visible, `cursor-ew-resize`, `select-none` | `split.separator` | the column resizer |
| the mixed box (`ring` fill, `base` mark, a dash) | `tree.checkbox`, `tree.checkboxDash` | "select all"; pinned by a test |
| `field.row` + `Input`, `Field.Root`'s `invalid` | Tree's rename | the cell editor and the text filter (rule 3) |
| `Select.Trigger` | `ui/select.tsx` | the enumerated filter and the page size |
| `Pagination.*` + `Clickable` | `ui/pagination.tsx` | the footer; links rendered as buttons through `render` |
| `focus-visible:outline-2 outline-palette-ring` | every focusable registry part | the active cell (`data-active`), the frame for the grid's own stop |
| `shadow-lg` | `layer.panel` | the pinned edges, from the elevation axis |

**Not shared, and why:**

- **The rows' height.** Table's row is as tall as its padding (`p-3` around `text-sm`);
  a virtualized row must be told its height. Nine spacing steps (36px at the default
  density), told to the engine; the header row is ten, table's `h-10`.
- **The hover.** Table's hover is the full `soft`, which is the selected fill here (and in
  `tree.row`). It is `soft` mixed half into `base`, opaque, not tree's `soft/50`: a pinned
  cell inherits its row's fill and must hide the cells scrolling under it.
- **The header rule.** Table draws it on the row (`[&_tr]:border-b`). A column spanning
  header rows would be crossed by it: here each header cell draws its own.
- **The frame.** Table leaves its border to the container; a grid is its own scroll
  container, so it has a `line` border and `rounded-lg`.
- **The resizer's rest.** `split.separator` is a visible rule; a header has a resizer per
  column, so it shows only while the header is hovered (`line`), and in `ring` while
  held or focused.

## The `sheet` family

| member | part | reads |
|---|---|---|
| `root` | `Root` | names `group/sheet`; the grid's focus (`has-[>[data-grid-part=grid]:focus-visible]`); `data-overflow-start` / `-end` for the pinned edges |
| `probe` | the Root's probe | ten spacing steps square, measured |
| `grid` | `Grid` | its ring is the frame's |
| `header`, `headerRow` | `Header`, `HeaderRow` | names `group/sheet-header-row` (a row holding filters aligns its labels at the top) |
| `headerCell` | `HeaderCell` | `data-active`, `data-interacting`, `data-group`, `data-sortable`, `data-pinned`, `data-pinned-edge`; names `group/sheet-header` |
| `headerLabel`, `headerTitle` | `HeaderLabel`, `HeaderTitle` | a group's centring, "select all"'s |
| `row` | `Row` | `data-active`, `data-selected`, hover; names `group/sheet-row` |
| `cell` | `Cell` | `data-active`, `data-interacting`, `data-editing`, `data-loading`, `data-pinned`, `data-pinned-edge`, its row's `data-selected` |
| `empty` | `Empty` | |
| `sortIndicator`, `sortPriority` | `SortIndicator` | `data-sort`, its header's hover |
| `columnResizer` | `ColumnResizer` | `data-edge`, `data-resizing`, focus, its header's hover |
| `checkbox`, `checkboxDash` | `SelectCell`, `SelectAllCell` | `data-indeterminate` |
| `filter`, `filterFrame`, `filterControl` | `HeaderFilter` | |
| `editor`, `editorFrame`, `editorControl` | `CellEditor` | Field's `data-invalid` |
| `pagination`, `paginationStatus`, `pageSize` | `Pagination` | |

`data-resizable` and `data-filtered` need no member (the resizer renders only on a
resizable column; the filter shows its value). Zero variants, no palette, no geometry on
the parts the engine places, no `outline-none` on a cell: `tests/sheet.test.ts` pins it.

## Decisions

- **Family name `sheet`** (the Epic's recommendation): `grid` would be ambiguous beside
  Grid Layout's `tile` (whose report had offered `grid`). Its file is `families/sheet.ts`;
  no ui file shares the basename, so the shadcn CLI's rewrite has nothing to confuse it
  with (the smoke confirms it in all four scaffolds).
- **Feature pieces are separate exported parts** (the Epic's recommendation), which the
  template composes, over props on the template. One file per feature under
  `ui/data-grid/features/`, kebab-case.
- **Installed features are read from the model.** The package keeps its list to itself
  (`view.features` is `@internal`), but a `get` of a key no installed feature has reads
  `undefined` and never throws, and each common feature answers one of its own keys with
  a value (`sort-columns`, `column-widths`, `pinned-column-keys`, `selected-row-keys`,
  `column-filters`, `editing-cell`, `page-info`). `features/installed.ts` asks those. The
  Epic's stop condition (no feature detection) was not reached.
- **The template's columns read the `features` list.** Columns exist before the model (they
  are a Root prop): the check box column and the default editor are added from the same
  `features` list the Root installs, by name; every piece inside still reads the model.
- **Density through the engine.** A probe ten spacing steps square inside the Root is
  measured before the first paint and observed (`ResizeObserver`): a `data-density`
  anywhere above the grid resizes it, and the Root tells the engine `rowHeight` (nine
  steps) and `headerRowHeight` (ten, seventeen with `filtering()`). A consumer's
  `rowHeight` — a number, a function or `"auto"` — wins. Measured at 28.8 / 36 / 43.2px
  (compact / default / spacious), 10k rows contiguous at five scroll positions each.
- **The header filter is in the header cell**, under the name (the package's
  `header-filters` shape), not a separate row: the package lays out its own header rows
  from the column groups. Hence the taller header row with `filtering()`.
- **The pinned edges' shadow needs the scroll.** The package writes no scroll state, so
  the styled Root writes `data-overflow-start` / `data-overflow-end` (content hidden past
  that edge, `scrollLeft` read by magnitude for RTL) from its scroll and from a
  `ResizeObserver` on the frame and the grid (a resize changes it). The shadow is
  `shadow-lg`, clipped to the edge's outer side with `ltr:` / `rtl:` `clip-path` pairs;
  each row is a layer of its own (a `transform`), so it reads row by row.
- **Opaque row fills, inherited by pinned cells** (see Not shared).
- **The active cell's ring shows with focus** (`data-active` + `focus-within`): a click is
  not `:focus-visible` on a cell, and a spreadsheet's active cell is outlined after a
  click. Dashed while its controls have the keys (`data-interacting`), none while edited
  (`not-data-editing:`, so two variants never fight over the outline).
- **No `outline-none` on a cell** (Tailwind 4 would kill the ring). The grid element has
  it: it is as large as the dataset, so its ring is drawn on the frame.
- **A check box column is centred without padding** (`has-[...]:px-0`): its 44px stays
  narrow enough at every density.
- **The editor refuses with `invalid`.** `CellEditor` takes an `invalid` flag: Field turns
  danger and the editor prevents Enter and Tab (its handler runs before the grid's, the
  package's contract), so those keys never commit a refused draft; Escape still cancels.
  A press or focus outside the cell still commits (the package's rule), so the app checks
  the value where `onCellEdit` writes it, as the people directory does (the review's
  finding). It spreads the edit's `editorProps` on its Field (the package's editor
  attribute).
- **A header cell with a filter is named by its title** (`aria-labelledby` on its
  `HeaderTitle`): a `columnheader`'s name is computed from its content, which would take
  the filter's text in. Template.Simple and the people directory do it.
- **The template's pages take the palette around it.** They render after the Root, so the
  one `className` (the Root's) does not reach them; a palette class on a container tints
  both. Documented rather than adding a wrapper part.
- **Pagination outside the scroll container.** The Root is the scroll container; a footer
  inside it would scroll. `Pagination` takes the Root's `gridRef`, and the template
  renders it after the Root (its one fragment), creating a ref unless given one. Its
  links are `Pagination.Link` rendered as buttons through `render`; Previous and Next are
  disabled at the ends.
- **Enumerated filters through `meta`.** A column's `meta.filterOptions` makes its filter a
  select (rows equal to the choice: a list value, `useLocalRows`'s "one of"; a choice is
  a value compared as it is — a number column takes numbers — or `{ value, label }`), and
  `meta.filterable: false` removes it. `HeaderFilter` also takes `options` directly.
- **Template.Simple has five props**: `aria-label`, `aria-labelledby` (the grid's name: it
  goes on `Grid`, not on the Root), `empty`, `pageSizes` and `className`. Everything else
  is Root's.
- **Scenarios split by issue**: the parts scenario is #95's, the hand-composed features
  scenario #96's; the scenarios built on Template.Simple (each feature, large, states,
  matrix) landed with it (#97), as Grid Layout's did.
- **`check:embeds` uses both examples**: a header sorted and a page turned in
  `data-grid`, a name typed into a filter in `data-grid-people-directory`.

## Package limits

- **Pixel geometry against the density axis — the third package in a row.** Rows follow
  the density (the Root measures it), but column widths, `minWidth` and `maxWidth`, and a
  resizer's 10px / 50px steps are pixels. Tree's `indentation` (Epic #91) and Grid
  Layout's `rowHeight`, `gap` and `padding` (Epic #94) are the same limit.
- **One header row height.** `headerRowHeight` is a single number, so with `filtering()` a
  column group's header row is as tall as the columns' (a name above a filter).
- **No scroll state on the root.** The pinned edges' shadow needs the styled Root to read
  the scroll itself. A `data-scrolled-start` / `-end` from the package would remove that
  code.
- **Feature detection by probing keys.** It works by the documented `get` contract, but a
  public `model.get("features")` (as Tree has) would say it directly.

## Verification

- `pnpm check`, `pnpm typecheck`, `pnpm test` (the compile guard covers `sheet.ts`;
  `sheet.test.ts` pins the family, the pieces' gates and the template), `pnpm build`.
- `pnpm registry:build`: `dist/r/data-grid.json` depends on
  `@fragiola/data-grid-react@^0.1.0` and lists `checkbox`, `field`, `input`, `select`,
  `pagination` and `icon-size`; `pnpm registry:smoke` passes in all four scaffolds.
- `pnpm site:export --base /ui`: valid against the contract; `check:embeds`: every example
  passes in the frame, and the grid examples' sort, page and filter answer.
- Playwright, on the scenarios and examples: the keys (click a cell, arrows, the active
  cell's inset ring, the row tint, PageDown / Ctrl+End across 10k rows); sorting (a click
  → `aria-sort` ascending, again → descending, Ctrl+click → `data-sort-priority` 2 and the
  priority shown); resizing (a pointer drag 240 → 300px with `data-resizing`, a keyboard
  arrow +10px, F2 reaching the header's controls; the pinned-at-end column's resizer on
  its start edge); pinning (the pinned cells stay put while scrolling both ways, LTR and
  RTL, opaque, `data-overflow-*` set, the edge shadow); selection (a row, Shift+click
  range skipping a disabled row, "select all" mixed → checked → cleared, Shift+Space);
  filtering (typing narrows 2 000 → 111 rows, a select to 17, cleared); editing (a double
  click, typing to start, a refused draft danger with Enter and Tab kept, a commit, Escape
  cancelling, the template's default editor, Enter moving down); pagination (Page 2,
  Previous / Next disabled at the ends, the page size); each piece absent without its
  feature, and every piece absent in the no-feature template; 10k rows under compact,
  default and spacious density (28.8 / 36 / 43.2px rows, no gap or overlap at five scroll
  positions); light and dark; a surface-ring palette on the root; RTL; radius flat and
  full, text large, elevation flat and raised, motion none; no console errors or warnings.

## Follow-ups

- **For the advanced-features Epic.** Range and cell selection (`data-selected-cell`,
  `data-range-edge`), the fill handle (`data-fill-target`, `data-filling`), the clipboard,
  row grouping and tree data (`data-group-row`, `data-group-expanded`, `data-depth`, the
  group toggle), collapsible column groups (`data-collapsible`, `data-collapsed`),
  master-detail (`data-expanded`, `RowDetail`), row and column reordering
  (`data-dragging`, `data-drop-target`, the row drag handle) and summary rows
  (`data-summary`, `Summary*`) render with the core look. Start from: a range's edge in
  `ring` (the active cell's ring values), a fill handle as `tile.resizeHandle`'s corner dot,
  drop targets as `tile.placeholder` / `dock.dropIndicator`'s `ring` line, a group toggle
  as `tree.toggle`'s chevron (its `ltr:` / `rtl:` pair), summary rows on the header's
  `soft`. Each piece gated on its feature through `features/installed.ts` (add a key per
  feature: `cell-selection`, `column-order`, `expanded-row-keys`…). Summary rows need a
  `Summary` part beside `Header` in the template, and the opaque fills the pinned cells
  inherit.
- **A pixel option against a density** (here the column widths; Tree's `indentation`, Grid
  Layout's `rowHeight` / `gap` / `padding`). Three packages now: an ecosystem-wide answer
  — options in spacing steps, or read from a CSS custom property, as this Root reads the
  spacing scale for the rows — is a proposal for the guidelines, out of this Epic.
- **A scroll state and a public feature list** in `../data-grid` would remove the Root's
  overflow code and the key probing (see Package limits).

# Port Report — Epic #94: Grid Layout, the Fourth Special Component

## Summary

Two issues, one Epic: Grid Layout (`@fragiola/grid-layout-react`, published at 0.1.0)
arrives in the registry as the fourth **styled layer over a published package**, under
the special component rules S1–S8. None of them had to change.

1. **Issue #92**: the `tile` family, the styled parts (the package's `Root`, `Cells`,
   `Items`, `Item`, `DragHandle`, `ResizeHandle`, `Placeholder`, `DragSource` and
   `DragPreview`, plus a card's `Header`, `Title` and `Content`), the `grid-layout` item
   pinned to `^0.1.0`, the release-age exclusion, a pinned-class test and two dev
   scenarios (the parts by hand, drag from outside).
2. **Issue #93**: `GridLayout.Template.Simple`, three scenarios on it (the template,
   responsive breakpoints, the axes / palette / RTL matrix), two public examples
   (`grid-layout`, `grid-layout-dashboard-builder`), a drag in `check:embeds` for each,
   the docs page, the sidebar entry, the Special overview row, the architecture update and
   this report.

## Baseline vs result

The baseline is the grid-layout repository's `dashboard-builder` and
`analytics-dashboard` examples (`../grid-layout/examples/react/src/examples/`): a widget
sidebar with drag sources, a trash, cards with a header, and a dashboard of KPI, chart and
table cards, under a theme-driven look.

| | `dashboard-builder` + `analytics-dashboard` | Fragiola |
|---|---|---|
| Styled layer | two `styles.ts`, 244 lines, one per page | 1 family: `tile.ts`, 142 code lines, 12 `tv()` (a member per part, and the refused drop), for every page |
| Card style | an `item` copied in the `styles.ts` of the repo's styled examples (46 of 50 define one) | 1 member (`tile.item`) |
| Shape tokens | 21 distinct `--gl-*` in these two examples (the repo's whole set), set by the examples' theme stylesheet | 0: the spacing scale, `rounded-lg`, `rounded-pill`, the six roles, the elevation and motion axes |
| States with a look | dragging, outside, dropping, static (by example) | every state the package documents (below) |
| Palettes | `palette-surface` frame, `palette-raised` cards, `palette-danger` trash | `raised` cards and preview, `danger` for a refused drop, the rest from the palette in scope |
| `!important` | 0 | 0 |
| Markup for a dashboard | 229 lines (`dashboard-builder/index.tsx`) | `Template.Simple`: 4 props |

**The comparison is unfair in one direction, and this report says so.** The repo's
examples copy their styles on purpose: each is a self-contained page meant to be read and
copied, and its theme tokens show that the parts take any look (bento tiles, a home
screen, a photo collage). The number that matters is the one a reader of this library
gets: **one** source of style for every dashboard, and a dashboard in one line.

**What did not shrink:** `parts.tsx` is 163 code lines. Nine wrappers keep `render`,
`ref` and the function `className`, two of them add the refused member from their state,
and three are new UI the package leaves to the app (a card's header, title and content).
The template is 67.

## Reuse (S4)

| Value | Shared with | Note |
|---|---|---|
| `palette-raised`, `bg-palette-base`, `text-palette-contrast`, `rounded-lg`, `border border-palette-line` | `layer.panel` (Dialog, AlertDialog, Drawer) | a card is the raised tier, as a dialog is; pinned on both sides by a test |
| `shadow-lg` while held | `layer.panel` | the overlay shadow, from the elevation axis |
| `border-2`, `border-palette-ring`, `bg-palette-ring/15`, `duration-150` | `dock.dropIndicator` | the placeholder; pinned on both sides by a test |
| `rounded-pill` mark | `split.grip` | a resize handle's mark |
| `cursor-ew-resize`, `cursor-ns-resize` | `split.separator`, `dock.splitter` | the side handles' cursors |
| `ring/40` at rest, full `ring` on hover or pull | `dock.splitter`'s hover hint | a resize handle's mark |
| transparent, `soft` on hover, `size-icon` | Clickable's `icon` fill | the drag handle (it cannot be a Clickable, see Decisions) |
| `focus-visible:outline-2 outline-palette-ring` | every focusable registry part | item, drag handle, drag source |
| `text-palette-accent/85` | the settled secondary text | the drag handle at rest |
| `palette-danger` | `Text.Error`, `tree.loadError` | a refused drop |

**Not shared, and why:**

- **The card's resting shadow.** `layer.panel` is `shadow-lg` at rest: one dialog over a
  page. A dashboard shows a dozen cards at once, so they rest at `shadow-sm` and take the
  panel's `shadow-lg` only while held.
- **The placeholder's radius and border style.** `dock.dropIndicator` is `rounded-md` and
  solid: it frames part of a tabset. The placeholder stands where a card will be, so it
  takes the card's `rounded-lg`, and is dashed, the Epic's "ring-tinted dashed box"; a new
  item coming in (`data-kind=drop`) is solid, since it is the item itself.
- **The placeholder's transition.** `dock.dropIndicator` transitions `left`, `top`,
  `width` and `height`; the engine places the placeholder with a `transform`, so it
  transitions `transform`, `width` and `height`.
- **The resize mark's size.** `split.grip` is `h-1.5 w-6`; a mark on a card's edge is a
  step thinner (`h-1 w-6`), and a dot (`size-1.5`) on a corner.
- **`split.separator`'s 1px rule.** A card's edge is its border already; a resize handle
  draws only its mark.

## The `tile` family

| member | part | reads |
|---|---|---|
| `root` | `Root` | `data-dropping`, `data-drop-refused`, `data-dragging`, `data-resizing`; names `group/tile` |
| `cells` | `Cells` | the root's `data-dragging`, `data-resizing`, `data-grabbed`, `data-dropping`, `data-outside` |
| `item` | `Item` | `data-dragging`, `data-resizing`, `data-grabbed`, `data-pressing`, `data-outside`, `data-static`, `data-draggable`, a drag handle inside it; names `group/tile-item` |
| `header`, `title`, `content` | `Header`, `Title`, `Content` | |
| `dragHandle` | `DragHandle` | `data-draggable`, `data-dragging`, `data-grabbed` |
| `resizeHandle` | `ResizeHandle` | `data-side`, `data-resizing`, its item's hover, focus and `data-grabbed`, the direction |
| `placeholder` | `Placeholder` | `data-kind` |
| `dragSource` | `DragSource` | `data-dragging`, `data-grabbed`, `data-disabled` |
| `dragPreview` | `DragPreview` | `data-over`, `data-drop-refused` |
| `refused` | `Root`, `DragPreview` | `state.dropRefused`, `state.refused` |

`data-resizable` needs no member: the package renders an item's resize handles only while
it is resizable. `data-breakpoint` names a breakpoint and `data-x` / `data-y` place a
cell: neither is a look. Zero variants, palettes only on the cards and the refused drop,
no geometry on the parts the engine places: `tests/tile.test.ts` pins it, with every
state the package documents.

## Decisions

- **Family name `tile`** (the Epic's recommendation): `grid` is Data Grid's. Its file is
  `families/tile.ts`; no ui file shares the basename, so the shadcn CLI's rewrite has
  nothing to confuse it with (the smoke confirms it in all four scaffolds).
- **Cards on `palette-raised`** (the Epic's design intent). The alternative, `dock`'s and
  `split`'s "paint from the palette in scope", would let a palette class on the root
  re-tint the cards too, but a card on the floor's own palette reads only by its line and
  shadow, and in the dark theme hardly at all. A card is a raised surface, as a dialog is;
  a palette class on an Item replaces `raised` (cn knows the palette group). The cost: a
  surface-ring swap on the root reaches the placeholder and the drop outline, not a
  card's focus ring. Template.Simple's one className goes to the root, so its cards are
  always raised.
- **A refused drop reads its state in React.** `palette-danger` is a plain class, and
  Tailwind cannot put it behind `data-drop-refused:` (palettes/danger.css). `Root` and
  `DragPreview` add the `refused` member from `state.dropRefused` / `state.refused`,
  after the consumer's `className`: cn keeps the last palette, so a palette class on the
  root (the palette channel) would otherwise swallow the danger. Over a refused drop the root's outline and dots turn
  danger, the package removes the placeholder, and the preview card stays visible in
  danger instead of fading.
- **Dots during a gesture only** (the Epic's recommendation: dots rather than lines). A
  `line` dot at the centre of each cell (`after:size-1`, from the spacing scale), shown
  while a pointer moves or resizes, the keyboard holds an item, an item comes in or a drop
  is refused (a native drag `onExternalDrag` refuses has no gesture), and hidden while the
  held item is off the grid. A dashboard at rest shows no grid.
- **Three extra parts: Header, Title, Content.** Template.Simple must render a card with a
  drag handle and a title without a style of its own, so those pieces are parts, as Tree's
  Label is. The drag handle sits in the header; actions go beside the title.
- **The drag handle is not a Clickable.** A button is exempt from dragging (the package's
  `DRAG_EXEMPT`), so the handle stays the package's `div` (its tab stop) and takes
  Clickable's `icon` fill values. It shows a grip (`lucide-react`'s `GripVertical`) unless
  given children, and is named "Move" unless named.
- **The lift snaps in.** Transitions are off while a pointer holds an item, so the
  `scale` lift and the touch press-in do not ease: the package's guide trades that for a
  held item that never lags the pointer.
- **The package marks a non-draggable handle by the absence of `data-draggable`**, not a
  `data-disabled` (#92 listed `data-disabled` on the handle; the package's
  `state-attributes.mdx` does not): the handle dims with `not-data-draggable:`.
- **The grab cursor on an item's body needs no handle inside**
  (`not-has-data-[grid-layout-part=drag-handle]:`): with a handle, the body does not drag.
- **Resize handles inside the card's edge.** A card clips what overflows it, so the hit
  areas (`h-2` / `w-2` on a side, `size-3` on a corner) lie inside the border. They show
  while the card is hovered, focused or holds focus, or is grabbed by the keyboard (Shift
  + arrows resize it), and while pulled. They take no focus and need no name: the
  keyboard resizes the grabbed item.
- **The diagonal cursors name both directions** (`ltr:` and `rtl:`), as Tree's chevron
  does. Under an RTL subtree of an LTR page both rules match; the `rtl:` one comes later in
  the stylesheet and wins, as for Tree. The reverse case (an LTR grid inside an RTL page)
  gets the mirrored diagonal cursor: a known limit, shared with Tree's chevron.
- **Roles the package leaves out.** The package sets no role, and `aria-label` is
  prohibited on a role-less `div`: `Root` and `Item` default to `role="group"`, and the
  drag handle to `role="button"` with `aria-roledescription="drag handle"` (the package's
  own drag-handle example). A consumer's role wins.
- **A static item has no drag handle in Template.Simple**: the handle would be a dimmed
  tab stop that does nothing; the item itself is then the tab stop.
- **No `outline-none`.** In Tailwind 4 it sets the outline style to none, which the
  focus-visible width never brings back (the `menu` family's note). The playground
  caught it on the drag handle; the test pins it.
- **A lift by `scale`.** The engine writes the held item's `transform`; `scale-102`
  composes with it (the package's transitions guide). A touch that holds an item before
  it drags presses it in (`scale-98`).
- **Template.Simple has four props**: `children` (an item's content, from its layout
  item), `itemTitle` (its name: the header's text, the item's `aria-label`, the handle's
  "Move …"), `resizeHandles` (all eight sides by default) and `className`. Everything else
  is Root's. The drag preview shows a drag source's `data` when it is a string.
- **Scenarios split by issue**: the parts and drag-from-outside scenarios are #92's; the
  matrix and the responsive one are built on Template.Simple and landed with it (#93).
- **`check:embeds` drags in both examples**: a card a third of the grid across by its
  handle in `grid-layout` (moved down, it would compact back up), a widget from the
  sidebar onto the grid in the builder.

## Package limits

- **Pixel geometry against the density axis.** `rowHeight`, `gap` and `padding` are
  pixels (S5 keeps the engine's geometry). Under `compact` or `spacious` the cards' header,
  padding, handles and dots follow `--spacing`, but the rows and the gaps between cards do
  not: a compact density in a 56px row leaves more room for content, a spacious one less.
  A package option in spacing steps, or one read from the DOM, would close it; that is a
  change for `../grid-layout`, out of this Epic.
- **`dir` on the root only when given.** The root writes `dir` only from its prop, so the
  family reads the direction with Tailwind's `ltr:` / `rtl:`, which match an ancestor's
  `dir` too (see Decisions).

## Verification

- `pnpm check`, `pnpm typecheck`, `pnpm test` (the compile guard covers `tile.ts`;
  `tile.test.ts` pins the family and the template), `pnpm build`.
- `pnpm registry:build`: `dist/r/grid-layout.json` depends on
  `@fragiola/grid-layout-react@^0.1.0`; `pnpm registry:smoke` passes in all four
  scaffolds.
- `pnpm site:export --base /ui`: valid against the contract; `check:embeds`: every example
  passes in the frame, and the grid examples' drags land.
- Playwright, on the scenarios: light and dark; a surface-ring palette on the root (the
  placeholder's ring follows it); compact, default and spacious density (the header 28.8 /
  36 / 43.2px); `dir="rtl"` (the first column on the right, the `end` handle on the left
  edge, the diagonal cursor mirrored); radius flat and full, text large, elevation raised,
  motion none (0s) and default (0.2s); pointer drag by the handle (the root's
  `data-dragging`, the dots, a dashed `move` placeholder, the lift, no transition, the
  grabbing cursor, the item moved and the others compacted); resize from a corner (the
  `resize` placeholder, the pulled handle shown, the item grown); the keyboard (Tab to the
  handle and its ring, Space grabs, the `keyboard` placeholder, the handles and dots
  shown, arrows move, Shift + arrows resize, Space drops); static, fixed-size and locked
  items; drag sources (the preview off the grid, the dashed drop outline, a solid `drop`
  placeholder, the preview fading, the item added), a refused drop (danger outline, dots
  and preview, no placeholder, nothing added), a disabled source, a keyboard drop; an item
  dragged off the grid (it fades, the dots hide, it goes back); breakpoints from the
  grid's own width (lg → md → sm); no console errors.

## Follow-ups

- **For Data Grid (#98).** Its family takes the name `grid`, now free. A data grid's
  column resize can share `tile.resizeHandle`'s logical sides, `ring/40` → `ring` mark and
  `ltr:` / `rtl:` cursor pairs, or `split.separator`'s 1px rule; a column drag's drop
  target can share `tile.placeholder` / `dock.dropIndicator`'s `ring` values. A refused
  drop, if any, needs the same `refused` member read from the part's state: a palette
  takes no variant. Avoid `outline-none` on a focusable cell (Tailwind 4). Rows that can be
  selected and focused should start from `tree.row`'s values (the Tree report's
  follow-up).
- **A pixel option against a density** (here `rowHeight`, `gap`, `padding`; Tree's
  `indentation`). A third package with the same limit suggests an ecosystem-wide answer:
  options in spacing steps, or read from a CSS custom property. A proposal for the
  guidelines, out of this Epic.

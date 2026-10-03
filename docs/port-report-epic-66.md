# Port Report — Epic #66: Dockable, the First Special Component

## Summary

Five issues, one Epic: Dockable (`@fragiola/dockable-react`, published at 0.1.0) arrives in
the registry as a **styled layer over a published package**. One command installs the
package and writes its primitives already dressed, plus one ready template. It opens a
new docs and gallery section, **Special**, where later special components will go.

1. **Issue #67**: the `dock` family, the core styled parts, the `dockable` item and the
   `special` level.
2. **Issue #68**: tab actions, the overflow menu, borders and popouts. The item ships
   `public/popout.html`, and the build guard gains a narrow `~/public/` exception.
3. **Issue #69**: `Dockable.Template.Simple`, under the template rules
   `Input.Template.Simple` set.
4. **Issue #70**: two public examples, five dev scenarios and the docs page.
5. **Issue #71**: this report and the architecture update.

## Baseline vs result

There is no shadcn component to measure against. The baseline is Dockable's own styled
reference: its examples app, where every example writes the layer by hand
(`../dockable/examples/react/src/examples/*/styles.ts`) on top of five example themes
(`_themes/*.css`).

| | Dockable's examples | Fragiola |
|---|---|---|
| Styled layer | `styles.ts` in **47** examples, 5,449 lines total | 1 family: `dock.ts`, 140 code lines, 18 `tv()` |
| Copies of the tab style | 46 (`export const tab =`) | 1 (`dock.tab`) |
| Copies of the splitter / drop indicator | 46 / 45 | 1 / 1 |
| Shape tokens | 24 distinct `--dk-*`, set by 5 theme files (722 lines) | 0: the spacing scale, the radius tokens, `h-control` |
| Palettes | the 6 roles, redeclared per theme | the 6 roles, from the existing palettes; none added |
| `!important` | 0 | 0 |
| Header buttons (close, maximize, overflow, popout) | hand-written `<button>`s per example | `Clickable` + `DropdownMenu`, gated by `model.can` |
| Ready layout | none: each example re-assembles the tree (hello-layout: 121 lines) | `Template.Simple`: 3 props |

**The comparison is unfair in one direction, and this report says so.** Dockable's
examples copy their styles on purpose: each example is a self-contained page meant to be
read and copied, and the five themes exist to show that the primitives take any look.
The number that matters is the one a reader of this library gets: **one** source of
style for the layout, and a layout in one line.

**What did not shrink:** the parts. `parts.tsx` is 481 code lines, because a styled
wrapper per primitive keeps every generic type parameter, the function form of
`className` and the `render` prop, and the header buttons ask the model before they
render.

## Reuse

| Part | Source | Note |
|---|---|---|
| `TabClose`, `MaximizeTrigger`, `PopoutTrigger` | `Clickable.Button` (icon fill, square) | `xs` in a tab, `sm` in the header: a tab is `h-8`, the height of a `sm` button |
| `TabOverflowTrigger` | `Clickable.Button` (ghost) | shows the count of hidden tabs |
| `TabOverflowMenu` | `DropdownMenu` (`menu` + `popup`) | `TabOverflowTrigger` is its trigger, through `render` |
| icons | `lucide-react`, sized by `iconSize` | `buttonSm` in every button |
| `tab` | values shared with `tabs`' tab | pinned on both sides by a test, not extracted (below) |
| the palette | the root's, `palette-surface` by default | no palette added |

## The `dock` family

Eighteen members, zero variants. Three decisions shaped it.

**One palette.** The whole layout paints from the root's palette. Tabsets stand apart
from the floor by their line and their radius. Dockable's example themes put tabsets on
`palette-raised`, and that would break a surface-ring swap here: a hardcoded palette
redeclares `ring`, and the ring is what marks the active tabset, outlines the drop target
and lights the splitters.

**Structural style wins.** Row, TabSet, Panel and the border frame carry inline position,
geometry, display and flex sizing, so a class there compiles and does nothing. No member
sets those properties on them, and a test asserts it. The one geometry the family
touches is the root row's margin (`data-root:m-1.5`). It is the gutter between the
floor's edge and the outer tabsets, as wide as a splitter. It has to be a margin: the row
is `absolute; inset: 0`, so the root's padding would not move it, but a margin on an
absolutely positioned box with both insets set shrinks it.

**State read where it lives.** The family reads Dockable's `data-*` attributes with
Tailwind's data variants, and the theme gains no custom variant: these states belong to
one family, not to several libraries that mean the same thing (architecture §2). A side
border's tabs turn through a named group, `group/border`, never through
`data-orientation` alone, because a Row carries `data-orientation` too and a tabset's
tabs sit inside rows. A test checks that no unscoped orientation rule reaches a tab.

## Negative results and trade-offs

- **The tab is not extracted into a shared member with `tabs`.** It takes the same
  values: radius, text size and weight, secondary text at rest, a soft fill and contrast
  text when current, the ring outline on focus-visible. But the two read different state
  (`data-active` there; `data-selected` and a drag here), and `tabs` is not a family. A
  shared skeleton would have meant refactoring a shipped component for a two-consumer
  family. Instead `tests/dock.test.ts` pins the shared values on both sides, so drift in
  either one fails.
- **A palette on one tabset does not reach its panels.** Dockable portals every panel
  into the root, so its content survives a move to another tabset or window. The tabset
  is not the panel's ancestor. The docs say so, and say to give the class to the tabset's
  panels too. The family header claimed otherwise until review caught it.
- **The overflow menu cannot open inside a popout window.** This is the Epic's first
  risk, and it materialized. `DropdownMenu`'s popup portals into the main document's
  body, so a menu opened from a window's strip appears in the other window. The fix is a
  portal `container` on the `menu` family's Content, which is a public API change of
  `menu`, so it is **left for approval** (stop condition). Instead of disabling the
  trigger and leaving tabs unreachable, the styled `TabList` defaults `overflow` to false
  in a window. Every tab stays and the strip scrolls (`scrollingTabList`: no scrollbar;
  the wheel, a trackpad and the arrow keys reach every tab). An explicit `overflow` wins.
- **Border tabs in `Template.Simple` have no close button.** Borders hold tool panels:
  clicking a tab opens and closes its panel. Rotated, the close button sat awkwardly
  beside the label.

## Found along the way

- **An overlaid border's content must stay transparent.** The engine positions the tab's
  panel *under* it and lets presses through its empty area (`pointer-events: none`). A
  fill there hid the panel. Its splitter takes the floor's fill instead
  (`in-data-overlay:bg-palette-base`), or the tabsets' lines show through it.
- **A border's panel needs its own stacking.** The overlay's `z-30` sits on its
  transparent frame, not on the panel, which lives in the root. The row splitters
  (`z-10`) grabbed the pointer across an open overlay. A border's panel is now `z-15`,
  selected by its layout path (`/border/…`), the package's stable selector.
- **The package's default `popoutURL` is relative** (`"popout.html"`), so it resolves
  against the current route, and a nested route requests `/a/b/popout.html` and gets a
  404. The styled root defaults to `/popout.html`, where the item installs the page.
- **A popout window's floor needs the root's palette again**, because the root is not its
  ancestor in the window's document. The styled root passes its palette class down
  through context, and `Popout` repeats it.
- **`check:embeds` clicks every `[data-slot$="-trigger"]`.** In this repo a `-trigger`
  slot opens a popup. The popout and maximize buttons open none (one opens a window, the
  other maximizes a tabset and hides the rest), so their slots end in `-button`.
- **pnpm 11's minimum release age** held back `@fragiola/dockable-react@0.1.0`, which was
  published the day before. `pnpm-workspace.yaml` excludes the two exact versions, with
  the reason in a comment.
- **The `~/` guard could be climbed out of.** The first version of the exception
  accepted `~/public/../components/x.tsx`. It now refuses `..` and `.` segments and
  backslashes (`tests/targets.test.ts`).
- **Architecture §5 said palettes publish as `registry:lib`;** they are `registry:file`.
  Corrected while updating the section.

## Verification

- `pnpm check`: clean (2 pre-existing infos). `pnpm typecheck`: clean.
- `pnpm test`: 353 tests (registry 237, site 95, playground 17, examples 4). New:
  `dock.test.ts` (9) and `targets.test.ts` (3).
- `pnpm build`, `pnpm registry:build`: 55 items.
- `pnpm registry:smoke`: all four scaffolds (Next/Vite × with/without `src/`), 69
  files each, `public/popout.html` at the project root, no external request.
- `pnpm site:export --base /ui`: 41 pages, 32 examples, 55 items, valid against contract
  v1.2.
- `pnpm --filter examples-react check:embeds`: 32 examples, including the overflow menu
  of `dockable`, which opens and fits its frame.
- In the browser (Playwright on the playground), checked for each scenario:
  - light and dark themes;
  - RTL;
  - compact density;
  - drag and drop;
  - close, including a vetoed tab and a pinned tab;
  - maximize (`aria-pressed`);
  - the overflow menu: select a hidden tab;
  - borders, docked and overlaid;
  - a real popout window, which mirrors `data-theme`, follows a theme switch and docks
    back.

## Follow-ups

- **A portal `container` on `menu`'s Content** (and so `DropdownMenu.Content`) would let
  the overflow menu open inside popout windows. It needs approval as a public API change.
- `Template.Simple`'s accessible names are English defaults. Internationalizing them
  would need a configuration prop or a context; the template has room (3 of 7 props).
- The next special components (Data Grid, Scheduler, Grid Layout) follow the same shape:
  a published package in `dependencies`, a family, the parts and one template.

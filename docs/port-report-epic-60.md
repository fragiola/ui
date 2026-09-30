# Port Report — Epic #60: The Sidebar, Recombined

## Summary

Four issues, one Epic: shadcn's sidebar ported with full API parity. It is built as a
**recombination** of families and components the library already had, not as a new
component with its own styles.

1. **Issue #61**: the shell. Provider, Root, Trigger, Rail, Inset, `useSidebar`. The layout
   is relative to the Provider instead of the viewport, with three collapse modes, three
   variants, both sides, and a mobile Drawer.
2. **Issue #62**: the parts. Two navigation members on the `menu` family; every other part
   is an existing component.
3. **Issue #63**: the public example, six dev scenarios and the docs page. Along the way,
   `layout: "fill"` works for the first time.
4. **Issue #64**: this report and the architecture update.

## Baseline vs result

Measured against `shadcn-ui/apps/v4/registry/bases/base/ui/sidebar.tsx` (the Base UI
flavour) and its styles:

| | shadcn | Fragiola |
|---|---|---|
| Component source | 729 lines (671 code) | 966 lines (722 code, 178 comment) |
| Dedicated CSS classes | 28 `.cn-sidebar-*` | 0 |
| Dedicated CSS | 111 lines × 8 styles | 0 |
| Dedicated tokens | 8 `--sidebar-*` | 0 (`palette-raised`) |
| Sidebar-token uses | 44 per style (36 CSS + 8 TSX) | 14 role reads, 5 distinct |
| `!important` | 3 (`size-8!`, `p-2!`, `p-0!`) | 0 |
| New family style | — | 2 members on `menu` (`navItem`, `navSubItem`) |
| Examples | 14 | 1 public + 6 dev scenarios |

**The component source did not shrink**, and this report does not claim it did. The
TypeScript is about the same size: Biome's 4-space formatting, the container-relative
layout (a threshold observer, the gutter and frame arithmetic) and the comments that
record each decision account for the rest.

What went away is the **style shadcn keeps beside the component**: 28 classes and 8
tokens in each of 8 styles. The sidebar's items, labels, buttons, badges and loading rows
no longer have a look of their own. They are the menu item, the menu label, Clickable,
Badge and Skeleton. When those change, the sidebar changes with them.

## Reuse

| Part | Source | Note |
|---|---|---|
| `MenuButton`, `MenuSubButton` | `menu.navItem`, `menu.navSubItem` | new members, see below |
| `GroupLabel` | `menu.label` | unchanged |
| `Trigger`, `GroupAction`, `MenuAction` | `Clickable.Button` (icon, square) | 20px is a local measure, not a new size |
| `MenuBadge` | `Badge` | unchanged: a counter is a badge |
| `MenuSkeleton` | `Skeleton` | unchanged |
| `Separator` | `Separator` | inset by a wrapper, not a margin |
| `Input` | `Field.Row` + `Input` | the row is the body (Rule 3) |
| icon-mode tooltips | `Tooltip` | `Content` gained placement props (below) |
| mobile | `Drawer` | `showClose={false}`, sr-only title |
| collapsible groups and sub-menus | Base UI `Collapsible` + `Collapsible.Panel` | see negative results |

## The navigation members

A navigation item is the menu family's row pointing at pages. It differs in **how it is
lit**:

- **Popup list:** `highlighted:` = `:focus` / `[data-highlighted]` / `[data-selected]`. Focus
  follows the pointer inside a menu, so focus is the lit item.
- **Navigation:** hover, `data-active` (the current page) and a `focus-visible` ring. A
  clicked link keeps focus, and if focus lit it, it would read as a second current page.

Extending `item` would have meant cancelling its `highlighted:`. Instead, the shared row
moved into a private `itemSkeleton`, and `item` and `navItem` both extend it.
`tests/menu.test.ts` pins `item`, `selectableItem` and `subTrigger` to exactly the classes
they had, so dropdown, context, select and combobox did not change.

`outline-none` stays on `item` only. In Tailwind v4 it sets `--tw-outline-style: none`,
which `focus-visible:outline-2` then reads, so it would swallow the nav ring.

## Drift resolved

- **Three `!important`s removed.** shadcn needed them because its size variants are
  `@apply`'d classes defined later in the stylesheet. Here they are plain utilities, and
  the icon-mode `group-data-[collapsible=icon]/sidebar:size-8` is a variant utility, which
  Tailwind emits after `h-12`.
- **Viewport → container.** shadcn is `fixed` to the viewport, with a spacer div and a
  viewport media query. Here the Provider is a size container and the column is `sticky`
  inside it. In a docs iframe or a playground stage, shadcn's picks the wrong mode and
  escapes the frame; this one does neither.
- **Sheet → Drawer**, the component that already replaces `sheet`.
- **Physical → logical.** `side` is `start` / `end`. The borders, the sub-menu line, the
  badge and action slots, the rail and the tooltip side (`inline-end`) are logical. The
  Drawer's physical edge is resolved from Base UI's direction.
- **Cookie removed.** Controlled / uncontrolled state only; the docs give cookie and
  localStorage recipes. The review caught that an *uncontrolled* Provider given
  `onOpenChange` (the cookie recipe) never toggled: shadcn's `setOpen` only calls the
  callback when one is given. Fixed.
- **Random skeleton width → deterministic.** shadcn's `Math.random()` in `useState`
  mismatches between server and client; here it is a hash of `useId`.
- **Separator overflow.** `w-auto` next to the Separator's
  `data-[orientation=horizontal]:w-full` loses (the variant wins), so the margin overflows.
  Here the inset is a wrapper's padding.
- **Off canvas reached by Tab.** shadcn's collapsed column is off screen but still
  focusable. Here it turns `invisible` once the slide has finished. It is not `inert`,
  because the Rail renders inside it and `inert` also removes an element from
  hit-testing.
- **Ctrl/⌘+B while typing.** It is ignored in fields and editable regions, where it
  belongs to the field.

## Negative results and trade-offs

- **The styled Collapsible does not compose with a sidebar part.** `Collapsible.Root`
  draws a bordered box, and `Collapsible.Trigger` is `disclosure.trigger` (a full-width
  padded row, `justify-between`, `font-medium`). Rendered onto a `MenuButton`, `cn` resolves
  the padding and colour, but `justify-between` and `font-medium` survive and would have to
  be cancelled. The documented pattern is Base UI's `Collapsible` Root and Trigger for
  behaviour, the sidebar part as the trigger, and `Collapsible.Panel` (`disclosure.panel`,
  which has no border) for the animation. `examples-react` now lists `@base-ui/react`
  (the workspace's `^1.7.0`), as it lists `lucide-react`.
- **Chromatic sidebars.** A chromatic palette paints the column, but its items are not
  legible. Their resting text is secondary text (`accent/85`), guaranteed only on
  surface-tier palettes, and their lit state is contrast text on `soft`. Dropdown menus
  have the same limit. Palette swaps on the sidebar are documented as surface-tier.
- **The sidebar Input keeps the field height** (`h-control`, 2.25rem), not shadcn's h-8,
  so a search lines up with every other field.
- **The Rail's cursor is `ew-resize` in every state.** A per-side, per-state,
  per-direction matrix of `w`/`e` cursors bought nothing.
- **`h-svh` is the viewport's scrollport.** In a host shorter than the viewport (the
  playground's stage, under its toolbar) the column is taller than the host. A column
  under a fixed header, or inside a box that scrolls, sets its height through
  `className`; the docs say so.
- **Every Provider listens for Ctrl/⌘+B**, as in shadcn. A page with several shells
  toggles them all.

## A public API change: `Tooltip.Content`

Changing another component's API was a stop condition in the Epic. `Tooltip.Content`
hardcoded its Positioner (top, 4px), while Popover, Select and the menus' Content all
take `side`, `align`, `sideOffset` and `alignOffset`. The icon rail's tooltips must sit
beside the icon, not above it over the next one. The user approved the additive change;
`sideOffset` keeps its default of 4, and existing tooltips are unchanged.

## Found along the way

- **`layout: "fill"` never worked.** The contract has always had it, but no example used
  it. Both stages padded and centred every example, and `check:embeds` read a content
  height only from `resize`, which a `fill` example never sends. Now a `fill` example
  takes the frame edge to edge, and `check:embeds` handles it: 30/30 pass, and the
  sidebar's popups fit from 260px.
- **The compile guard only saw palette utilities.** It now checks every class a registry
  source writes, and that every named group, peer or container a variant reads is
  declared (`@2xl/sidbar:` is valid CSS that matches nothing). The existing registry
  passed unchanged.

## Follow-ups

- **`palette-raised` is undeclared.** `popup`, `layer` and their consumers paint
  `palette-raised` but declare only `@fragiola/theme`, which ships `global.css` alone.
  The sidebar declares `@fragiola/palette-raised`; the others do not yet.
- **Chromatic menus.** Legible menu-family text on chromatic palettes would need the
  resting text to be `contrast` on `base` and `accent` on `soft`, a change to every menu
  consumer.
- **The playground's own sidebar** (`apps/playground/src/sidebar.tsx`) could be built
  from `Sidebar`.
- **`fill` examples in the playground** are sized to the window's `svh`, which is taller
  than the stage by the toolbar.

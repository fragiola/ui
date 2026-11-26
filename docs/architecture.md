# Fragiola UI — Architecture

## Where this comes from

The architecture was validated in a proof of concept before this project existed:
**[fragiola/validation](https://github.com/maurodesouza/fragiola-validation)**. That
spike ported a subset of components specifically to find where the contract would
break, and porting here began once it held.

It held on roughly **a tenth of the component surface**. When a rule below looks
arbitrary, the POC is where its reasoning was paid for — and §6 lists what it never
touched.

---

## The problem

shadcn/ui is the baseline, and three things about it don't scale. Each was measured
in the POC.

**1. Theming is rigid.** 41 fixed global tokens. Swapping a theme means redefining
~20 of them at once — background, foreground, card, popover, border, primary. There
is no way to tint one area's accent while keeping its surface neutral, and no way to
scope a color to a subtree.

**2. Styles are duplicated.** 422 `cn-*` classes, where components sharing a visual
skeleton have the CSS pasted rather than shared. Six `*-item` classes ~85% identical;
`destructive` appears **132 times**. The copies drift: one sibling was missing its
close animation, another had a padding nobody chose.

**3. Components are duplicated.** Not just `dropdown-menu` vs `context-menu` (~250
identical wrapper lines). Three different ways to write an input, with two different
input components. A `Button` re-wrapped per context. `title` and `description`
redeclared in dialog, drawer, sheet, card and alert — 17 distinct classes for the
same two ideas.

The three fixes below map one to one.

---

## 1. Color: composable palettes

A **palette** is a set of six roles applied by class. Components read roles, never
colors.

| role | what it is |
|---|---|
| `base` | the color of this palette — background or fill |
| `soft` | subtle background — alert, badge, hover, selected, a field's addon |
| `line` | stroke |
| `contrast` | content on `base` |
| `accent` | content on a foreign background or on `soft` |
| `ring` | interaction highlight — focus, active |

The class **declares** the six custom properties and paints nothing; components paint
explicitly with `bg-palette-base`, `text-palette-contrast`, and so on.

**Why this scales where 41 tokens don't:** a palette is scoped by class, so any
subtree can carry its own. `palette-danger` on a button tints that button;
`palette-raised` on a card changes the whole card's surface. Adding a color is a new
palette, not a new token everywhere — `destructive` went from 132 occurrences to 10.

### The rules that keep it closed

**The number of palettes is free; the number of roles is not.** If something doesn't
fit, create another palette. Two background levels on a surface are two palettes, not
a seventh role.

**A token that is always derived and never overridden is a derivation, not a role.**
Hover on a painted background is computed from `base` in `@theme`, with an escape
hatch. Apply this test before accepting any new role.

**Every palette declares all six.** Custom properties inherit, so a palette that
omits a role picks it up from whatever ancestor declared it — silently, across
unrelated scopes. "Optional token" does not exist here.

**Never mix palettes.** A palette that borrows neutrals from one place and color from
another exists only to fit one case, and the next case will ask for another
exception. The tell: a role with no coherent source.

### The neutral surfaces

`surface` is the floor and `raised` a card, a popup or a dialog a step above it. A
frame around a page of cards (the Create page) is `raised`, and the cards and the
ground under them share `surface`: the cards stand apart by their line and shadow.
A third neutral for that ground (`palette-canvas`, Epic #127) was tried and removed
(Epic #133): between two neighbours this close it read as a muddy step, not a tone.
Both are achromatic: their chart series step lightness, not hue (`global.css`).

### Surface-ring palettes

"The number of palettes is free; the number of roles is not" extends sideways as
well as upwards. A **surface-ring** palette (`surface-blue`, `surface-purple`,
`surface-green`, `surface-orange`, `surface-rose`) is a neutral surface
byte-identical to `surface` in five of six roles — the only difference is
`--palette-ring`, which is a literal chromatic value taken from the
corresponding chromatic palette's `base`. It exists so a field's frame can
stay neutral (a field is a surface, not a coloured element — Rule 3) while its
focus ring states the theme's colour. The surface-ring tier is a direct
application of the rule: the need is real (theme a field's focus), the answer
is a new palette, not a seventh role.

### The documentation site is an instance of the contract

The docs site (built on Fumadocs) maps every Fumadocs chrome token (`--color-fd-*`)
onto a Fragiola role in `@theme inline`. The sidebar, header, search, code blocks
and page chrome are all painted through the six roles. This is not a detail — the
site being an instance of the contract is the cheapest ongoing test the project
has: an unpainted surface in the chrome is immediately visible.

### Where this reaches its limit

Chart series colors are **not** palettes. No role describes "the third series", and
status colors are reserved — reusing `danger` as series 4 breaks its meaning. They
live outside the contract, in their own ordered set, and their ordering is what
guarantees colorblind separation.

Charts are also the one place where color leaves CSS: canvas cannot resolve
`var(--palette-base)`, so values are read from the DOM and passed as strings.

---

## 2. Style families

Components sharing a visual skeleton share a **family** — one source of style,
consumed by all of them.

```
popup       the floating box       dropdown, context, select, combobox, popover, tooltip
menu        the option list        dropdown, context, select, combobox, sidebar
field       the input control      input, textarea, select trigger
layer       backdrop + panel       dialog, alert-dialog, drawer
disclosure  expand/collapse        accordion, collapsible
dock        the docking layout     dockable
split       the split view         splitter
tree        the tree view          tree
tile        the dashboard grid     grid-layout
sheet       the data grid          data-grid
```

Families are **orthogonal**, not a hierarchy: `select` is `field` + `popup` + `menu`.
A new component is a recombination.

The sidebar is the largest one so far: its items are `menu`'s navigation members
(`navItem`, `navSubItem`), the same row as a dropdown item but lit by hover and
`data-active` instead of focus. Everything else in it is `Clickable`, `Badge`, `Skeleton`,
`Separator`, `Field`, `Tooltip` and `Drawer`, and it adds no stylesheet and no token.

`handle` is the resize handle the split views share: `target`, the element a pointer
grabs (cursors, `z-10`, the rule as its `::after` — `ring` on hover, drag and focus,
widening into a 3px focus bar), `mark`, the decoration on a bar, neutral at rest and
`ring` on interaction, drawn by the `data-handle` axis (§4), and `edgeMark`, the same
mark on a card's edge, with a 40% floor at rest and kept under `ide`. Splitter's
separator and Dockable's splitter extend `target`; Splitter's grip and Dockable's
splitter mark are `mark`, Grid Layout's resize mark is `edgeMark`. What stays each
consumer's is geometry: Splitter's 1px rule, painted in `line` at rest, with a 13px hit
area; Dockable's 6px gap, whose rule stays transparent at rest because the bordered
tabsets already draw the edge (a 1px seam under `ide`), with a hit area of at least 9px
(a `::before` overlay that reaches 1.5px into each tabset by default, 4px under `ide`); Grid Layout's handles centred
on a card's border, which the card no longer clips. `tests/handle.test.ts` fails when a file other
than the family spells the mark.

`split` is the second family over a published package (Splitter, §5): group, panel,
separator, grip, and two members for a panel's content (`expanded`, `collapsed`). Unlike
`dock` it declares **no** palette: groups nest, and a default palette on each would be
redeclared by a nested group and swallow a swap on the outer one, so the parts paint from
the palette in scope. Its separator is `ui/separator.tsx`'s 1px `line` rule with an
invisible hit area from the spacing scale; its look is the `handle` family's, shared
with `dock.splitter` (`families/split.ts`).

`tree` is the third (Tree, §5): root, item, row, toggle, label, group, the drop
indicator and the live region, plus members for what the package leaves to the app — a
check box, a rename field, the loading / load-error / empty rows. Items nest, so like
`split` it declares no surface palette; its one palette is semantic (`loadError` is
`palette-danger`). Its row is `menu.navItem`'s (the Sidebar's menu button): the same
height, radius, gap, text, icon size, secondary text at rest and focus ring, pinned on
both sides by a test; its hover is `soft/50` because a tree selects many rows. It is the
first special item to **compose other registry items** inside the package's parts: the
check box is `Checkbox` (hidden from assistive technology, never focused, as the
package's contract asks) and rename is `Field.Row` + `Input` (rule 3: the frame is the
row). Neither changed. Its family file is `families/tree.tsx`, without JSX, for the
same reason as `field.tsx`: `ui/tree.tsx` shares its basename.

`tile` is the fourth (Grid Layout, §5): root, cells, item, drag handle, resize handle,
placeholder, drag source and drag preview, plus a card's header, title and content. It
is named `tile`, not `grid`, which would be ambiguous beside Data Grid's. Its items do not nest,
so it is the first package family since `dock` to **declare a surface palette on a
part**: an item is a card on `palette-raised` with `layer.panel`'s values (line, radius,
fill, text, `shadow-lg` while held), as a dialog is; the root, cells and placeholder
paint from the palette in scope, so a palette class on the root tints the dots, the
placeholder and the drop outline, and one on an item replaces `raised`. The placeholder
is `dock.dropIndicator`'s box, dashed, and a resize handle's mark is the `handle` family's
(Splitter's grip) with `split.separator`'s cursors. The engine places every item, cell and the placeholder
with an inline `transform`, so a held item lifts with the separate `scale` property and
no member sets geometry on them. A refused drop is `palette-danger`, which a variant
cannot switch (a palette is a plain class): `Root` and `DragPreview` add the `refused`
member from their state, the one place a special layer reads state in React for a look.

`sheet` is the fifth (Data Grid, §5): root, grid, header, header row, header cell, a
header cell's label and title, row, cell and empty, plus members for the seven common
features' pieces (sort indicator, column resizer, check boxes, header filter, cell
editor, pagination). It is named `sheet`, not `grid`, which would be ambiguous beside
Grid Layout's `tile`. Rows nest no rows, but a grid sits in any surface, so like `split`
and `tree` it declares **no** palette. It is the registry's static `Table` made
interactive, and shares its cell padding, its `line` row rule, its header type and fill
and its body text (pinned on both sides by a test); `Table` itself is unchanged. Its
selected row is `tree.row`'s (`soft`, `contrast` text), its resizer `split.separator`'s
rule, its "select all" `tree.checkbox`'s mixed box, its loading cell `Skeleton`'s bar. A
pinned cell inherits its row's fill (`bg-inherit`), so every row fill is opaque — the
hover is `soft` mixed half into `base`, not `soft/50`. The engine places every row and
cell, and holds the pinned ones sticky: the family sets no geometry and no `overflow` on
them, only the pinned cells' stacking, which the package leaves to the app. Its pieces
**compose more registry items** than Tree's — `Checkbox`, `Field` + `Input`, `Select`,
`Pagination` — and each renders only when the grid's model has its feature installed.

`dock` dresses a headless package of its own (Dockable, see §5) instead of the base's primitives:
one member per part — tabset, header, tab, panel, splitter, drop indicator, border —
reading the package's `data-*` state with Tailwind's data variants. It paints the
whole layout from **one** palette, the root's, so a palette class on the root
re-tints every part: tabsets stand apart from the floor by their line and radius,
never by a second palette, which would redeclare `ring` and swallow a surface-ring
swap. It has no tokens: Dockable's own examples size the layout with ~25 `--dk-*`
custom properties, and here the spacing scale, the radius tokens and `h-control`
do it. Its tab takes the values of `tabs`' tab without sharing a member — the two
read different state — and a test pins the shared values on both sides.

### Families are shared `tv()`, with zero variants

Variation becomes a **named member**:

```ts
export const menu = {
  item:           tv({ base: "…" }),
  selectableItem: tv({ extend: item, base: "pe-8 ps-1.5" }),  // has an indicator
}
```

As a CSS override, `pe-8` is silent — you cannot tell intent from drift. As a named
member it documents itself, and drift becomes impossible by construction.

**A variant is only justified when two components need different values and both are
right.** If one side is arbitrary, unify.

### Normalize state before sharing

Libraries disagree on what "the active item" is — `:focus`, `[data-highlighted]`,
`[data-selected]`. While three selectors mean one thing, shared style cannot be
written once. Normalize in CSS, in one place:

```css
@custom-variant highlighted (&:is(:focus, [data-highlighted], [data-selected]));
```

A new library is one more selector here. This is cheaper than a React translation
layer per component.

The rule is for state that means *the same thing* across libraries. Dockable's states
(`data-selected`, `data-active` on the tabset, `data-dragging`, `data-drop-kind`) are
its own, read by one family, so `dock` reads them directly and the theme gains no
variant. Splitter's (`data-dragging`, `data-collapsed`, `data-collapsible`) are the
same case for `split`, Tree's (`data-selected`, `data-focused`, `data-expanded`,
`data-renaming`, `data-load-error`, …) for `tree` — a tree's `data-selected` lights a
row while focus is elsewhere, so it is not the `highlighted` variant — and Grid
Layout's (`data-dragging`, `data-grabbed`, `data-dropping`, `data-drop-refused`,
`data-static`, `data-side`, `data-kind`, …) for `tile`, and Data Grid's (`data-active`,
`data-interacting`, `data-editing`, `data-loading`, `data-pinned`, `data-sort`, …) for
`sheet`.

### One visual language, one foundation family

Sharing a skeleton inside a family is not enough. Families that never share a member
still have to answer the same visual questions: what a control box looks like, how
focus is drawn, what "on" and "selected" are. Before the visual-language pass each
family answered them in its own words, and the registry read as several designs. The
answers are written down in **[`visual-language.md`](visual-language.md)**. They live
in one family, `foundation`, whose members (`focus`, `focusInset`, `fieldFocus`,
`box`, `hover`, `highlighted`, `checked`, `rail`, `knob`, `disabled`, `secondary`)
every other family composes inside its own `tv()`:

```ts
const row = tv({ base: [foundation.box(), foundation.fieldFocus(), "…"] });
```

`tests/foundation.test.ts` fails when a file other than the foundation spells one of
its ideas (a `palette-ring` outline, the `soft` hover, the `highlighted` fill, the
`checked` fill).

---

## 3. Composition: primitives, `render`, factories

**Every component points at existing primitives.** A dialog title is not a new class —
it is the text primitive wearing the dialog's a11y wiring:

```tsx
const DialogTitle = (props) => (
  <DialogPrimitive.Title render={<Text.Heading as="h2" />} {...props} />
)
```

Behavior and accessibility come from the library; appearance comes from the design
system; `render` stitches them. Fusing both into a CSS class is what produces 17
title classes.

**`render`, never `asChild`** — one polymorphism mechanism, matching both bases (§5, "Bases").

### When parts are identical, share the wrapper

Some primitives are literally the same object across components — on both bases,
`ContextMenu.Item === Menu.Item`, with only `Root` and `Trigger` differing. There,
write the wrappers once as a factory and **inject the namespace**:

```tsx
export const ContextMenu = { Root: CM.Root, Trigger: CM.Trigger, ...createMenuParts(CM) }
```

Injecting rather than importing one namespace directly means that if the library ever
diverges, each component inherits the divergence instead of being silently pinned to
the wrong primitive.

### The structural rule that removes duplicate components

**A control never carries its own body.** Border, background, height and focus ring
belong to the field frame, never to the input.

This is what collapses three ways of writing an input into one. shadcn needs a second
border-less input because its `Input` carries a border, which would double inside a
group. With the body owned by the frame, a new control — numeric, multi-select, color
picker — is only its own middle.

### Templates: a composition, not a component

A component with many parts ships one **template**: the parts assembled into the
common case, so a page does not re-assemble them every time —
`Input.Template.Simple`, `Dockable.Template.Simple` (the whole docking layout
from a model and a tab's content), `Splitter.Template.Simple` (a separator with
its grip between the panels it is given; two props), `Tree.Template.Simple` (the
whole tree, with the UI of each feature the model has installed — read from the
model, never from a prop; four props), `GridLayout.Template.Simple` (a whole
dashboard; four props) and `DataGrid.Template.Simple` (a whole grid, with the piece of
each feature installed; five props). The rules are the same for all:

1. no style of its own — nothing beyond the parts and their family members;
2. no appearance props;
3. one `className`, to the main piece — the palette channel;
4. at most seven props, flat (no `*Props` bags); behaviour props are forwarded.

A layout that outgrows the template copies it and edits the parts. Other templates
are examples to copy, never registry code: the registry ships one per component.

### One export per component

`DropdownMenu.Item`, not `DropdownMenuItem`. You remember the component, not its
fifteen part names. This costs tree-shaking, which is acceptable: parts of one menu
are used together, and copy-paste distribution only ships what is installed.

---

## 4. Scales come from Tailwind

Spacing, typography and breakpoints use Tailwind's scales — no parallel system.
They are continuous scales without semantics: `md` says nothing that `4` doesn't, and
a second scale means two live systems. Odd values from a design use arbitrary values
(`p-[3px]`): local, explicit, greppable.

Radius and control height **are** design-system decisions and stay as tokens.

### Six design axes, set per subtree

Spacing, radius, typography, elevation, motion and the resize handle are **axes**: a
`data-*` attribute on any element, inherited by its subtree, with a few named levels.
The default level is the absence of the attribute and keeps the values the library had
before the axes.

| axis | attribute | levels | token |
|---|---|---|---|
| spacing | `data-density` | compact, snug, default, comfortable, spacious | `--spacing` (and `h-control`, 9 steps of it) |
| radius | `data-radius` | flat, subtle, default, rounded, full | `--radius-sm/md/lg/control/pill` |
| typography | `data-text` | small, default, large | `--text-scale` (every `text-*`, and the icon sizes) |
| elevation | `data-elevation` | flat, subtle, default, raised | `--elevation-*` (behind `--shadow-*`) |
| motion | `data-motion` | none, fast, default, expressive | `--motion-scale` (every duration) |
| handle | `data-handle` | line (default), grip, dots, ide | `--handle-rest`, `--handle-mask` (the resize handle's mark), `--handle-seam` (`ide`) |

This is the answer to shadcn's styles (`style-vega.css`, `style-lyra.css`, ...): eight
files of about 1,800 lines, each redefining every component's `cn-*` classes. Each one
bundles spacing, radius, type and focus, and is chosen at install time. Here an axis
**only sets tokens**. A component has no variant, prop or class for any axis (rule 4),
and the axes change independently, at runtime, per subtree. The values of every level
are pinned in `packages/registry/tests/design-axes.test.ts`, and the user-facing page
is `site/docs/architecture/design-axes.mdx`.

**The runtime-token rule.** A token an axis changes must reach its utility as `var()`.
An inlined value cannot be overridden in a subtree, so the axis would silently do
nothing (rule 8: verify by compiling). Tailwind 4.3 inlines more than it seems, so
`global.css` uses three forms:

- **A plain `@theme` token.** Radius uses it: Tailwind emits it on `:root` and
  `rounded-*` reads `var(--radius-*)`. Under `@theme inline`, `rounded-md` compiled to
  `border-radius: 8px`.
- **An `@theme inline` token whose value is an expression over an axis variable.** The
  expression is inlined, so it is computed **where the utility is used**. `h-control`
  is `calc(var(--spacing) * 9)`, `text-sm` is `calc(0.875rem * var(--text-scale, 1))`
  and `duration-200` is `calc(200ms * var(--motion-scale, 1))`; Tailwind's
  `--transition-duration-*` namespace overrides the numeric `duration-*` classes. The
  same expression declared as a custom property on `:root` would be computed once, on
  `:root`, and inherited as a fixed length, so a nested level would never reach it.
  That is also why radius levels set literal values instead of deriving `sm`/`lg` from
  one base.
- **An indirection for shadows.** Tailwind always inlines a shadow's value (it rewrites
  the colours to inject `--tw-shadow-color`), so `--shadow-md` is `var(--elevation-md)`
  and the levels set `--elevation-*`. The cost is that `shadow-<color>` no longer tints
  these shadows; the registry uses none.

**Radius roles.** A corner picks the member for its role:

- `rounded-sm`, `rounded-md` and `rounded-lg` are the scale. Their existing uses were
  kept as they were, so the default renders unchanged.
- `rounded-control` is a standalone control (Clickable, the field box, a navigation
  trigger). It is a pill at `full`.
- `rounded-pill` is a pill by style (Badge, Switch and its thumb, the drawer handle). It
  is square at `flat`.
- `rounded-full` is an intrinsic circle (avatar, radio, slider thumb, track). It never
  changes.

The field box caps `--radius-control` at half the control height, so a textarea never
becomes a stadium. Nested radii have a floor at zero. Dockable's header keeps a fixed
`2.25rem` floor instead of `min-h-control`, because edge docking needs about 30px at any
density.

**The handle axis.** Splitter, Dockable and Grid Layout draw one resize handle (the
`handle` family, §2), and `data-handle` chooses its look: `line` (the rule
alone at rest, a pill on hover, drag and focus); `grip`, the pill shown at rest; `dots`,
three dots; `ide`, the VS Code look (no gap, no mark, a 1px rule that brightens on hover
and thickens into a 3px `ring` bar while dragged or focused). It is the only axis whose
levels are shapes rather than steps, and the only one whose default has a name: `line`
is written out too, so a subtree under another level can return to it (absent still
renders `line`). Like every axis it only sets tokens — `--handle-rest`, the mark's
opacity at rest; `--handle-mask`, an image that cuts the pill into three dots
(`radial-gradient` in a `mask-size` of a third of the mark's length) or `none`; and
`--handle-seam`, 0 or 1 under `ide` — and all reach the classes as `var()` or as
expressions over them: the hovered rule mixes `ring` by `1 - seam` (else the `line`
brightened towards `contrast`), the dragged rule is `1px + 2px × seam`, a bar's mark is
lit to `1 - seam`, and Dockable's gap, gutter, tabset border and radius scale by
`1 - seam` (its splitter keeps `max(1px, …)`, the seam the engine measures, and a 9px
hit area as a `::before` overlay). No React reads the attribute, and a level re-draws
every handle under it without a render. The rule is centred with symmetric insets
(`calc(50% - bar / 2)`), so a 3px bar on a 1px edge stays centred in both directions. The mark lines up
with its bar through two custom variants, `handle-vertical` and `handle-horizontal`, that
read its direct parent's `data-orientation` (or a Grid Layout `data-side`).

**Icons follow the text axis**, not spacing. The `--size-icon*` tokens (`size-icon-xs`,
`size-icon-sm`, `size-icon` and `size-icon-lg`, equal to `size-3`, `size-3.5`, `size-4`
and `size-6` at the default) scale with `--text-scale`. The `--size-*` namespace
generates only `size-*`, never `p-`, `gap-` or `w-`. `cn.ts` registers them, and the
`control` and `pill` radii, with tailwind-merge.

**Motion.** `none` makes every transition and enter/exit animation instant (both bases
unmount on the next frame), and `prefers-reduced-motion: reduce` forces `none`
whatever the attribute says. An element animated by tw-animate-css carries a
`duration-*` so its animation scales too (tw-animate reads `--tw-duration`).

**Portals.** An axis set on a subtree does not reach popups portalled to `<body>`.
Setting it on `<html>` covers everything, as the playground does.

**RTL is an MVP goal.** Logical properties on the inline axis (`ps`/`pe`,
`border-s`/`border-e`, `start`/`end`); the block axis stays physical. Where no logical
utility exists, use the `rtl:` variant — including for directional icons, which are
easy to forget.

**A component may own a container threshold, never a viewport breakpoint.** The
sidebar decides between its column and its Drawer from its Provider's width (42rem,
`@2xl`), not the window's. Breakpoints stay the application's decision, and the
component behaves the same full-page, in an iframe or in any box it is put in.

---

## 5. Distribution: shadcn's registry format

Fragiola publishes a registry in **shadcn's format**, consumed by their CLI:

```json
{ "registries": { "@fragiola": { "url": "https://fragiola.dev/r/{name}.json" } } }
```

```
npx shadcn@latest add @fragiola/dropdown-menu
```

**Why not our own CLI:** theirs already resolves the dependency graph recursively,
deduplicates, installs npm packages and writes files to the right targets. Reusing it
means no CLI to maintain and instant reach — anyone already on shadcn can install
Fragiola today.

`registryDependencies` is what makes installing `dropdown-menu` pull `menu` and
`popup`, and what makes installing `context-menu` afterwards write **one file**. The
style deduplication holds at distribution, not just in source.

The cost: their `type` is a closed enum, so families publish as `registry:lib` and
palettes as `registry:file`. The label is lost, the behavior is not. And the format has **no
versioning, therefore no update** — whoever installs keeps a frozen copy. That is
inherent to copy-paste distribution; if it becomes a real problem, that is when to
consider our own CLI, not before.

### Bases

Like shadcn/ui, which offers its components on Base UI, Radix and React Aria,
Fragiola UI offers them on more than one primitive library: its **bases**
(`packages/registry/bases.ts`). **Fragiola Primitives** (`@fragiola/primitives-react`)
is the default and is served at `r/{name}.json`. **Base UI** (`@base-ui/react`) is
served at `r/base/{name}.json`. The namespace is `@fragiola` on both, and the
registry URL selects the base, the way shadcn's `style` does. Fragiola has one style,
so the base is the registry's only dimension.

- **Only what imports a primitive is per base** (except the primitives-backed files,
  below). Such a file is written once per base at
  `registry/bases/<base>/<its path>` (`registry/bases/primitives/ui/dialog.tsx`).
  Families, styles, palettes, lib, hooks and the special components stay shared, so
  the "duplicated components" answer holds. shadcn copies every component, example
  and block per base; here about 30 files are.
- **One registry.json, every base.** Items name a file by its logical path
  (`registry/ui/dialog.tsx`). The build writes every item once per base, reading the
  base's copy and adding the base's package to the item's `dependencies`. The
  examples, the playground and `tsc` resolve `#/` the same way (the base's copy,
  else the shared file), and `FRAGIOLA_BASE` selects the base.
- **The UI adapts, the base never does.** A base file differs from its twins only in
  primitive wiring: imports, prop and type mapping, and a part rebuilt from the
  base's own parts. Classes, families and `data-slot` names never differ. A base
  library is never changed to match another, which is what lets Radix and React Aria
  join later. Each base's adapter is `lib/base.ts` (the `base` item): one set of names
  (`DirectionProvider`, `CollapsiblePrimitive`, `PrimitiveProps`, `RenderComponentProps`,
  `POSITIONER_DEFAULTS`, `controlText`), one implementation per base.
- **A component only Fragiola Primitives has is primitives-backed.** A component Base UI
  also has is a per-base file pair, as above. One Base UI lacks (a segmented control, a
  password input, ...) is **one shared file that imports `@fragiola/primitives-react` on
  every base**, the way shadcn's Calendar uses react-day-picker on every base, and the build
  adds `@fragiola/primitives-react@0.2.0` to its item on every base
  (`PRIMITIVES_BACKED_DEPENDENCIES`). So every base offers the **same catalog**. These
  files are an explicit list in `bases.ts` (`PRIMITIVES_BACKED`), each with its reason and
  the Fragiola Primitives entry it wraps; the guard refuses any other shared or Base UI
  file that imports the package, and a listed one whose entry Base UI ships (then it is a
  per-base pair). The list's bridge, `lib/primitives-backed.tsx` (the `primitives-backed`
  item), hands them the base's direction — on Base UI, the direction of Base UI's
  `DirectionProvider` (`useProvidedDirection` in each base's adapter) — and types their
  props alike on every base (`PrimitivesProps`). On Base UI, Base UI's `Field` does not
  reach a Fragiola Primitives control: its page says how to name it.
- **A behaviour a base decided differently stays its own**, documented under "Bases"
  on the component's page. Fragiola Primitives follows the APG first: menus and
  selects are non-modal by default, a select's list opens below its trigger, and
  tabs activate on focus.
- **Parity is tested, not promised.** `tests/bases.test.ts` fails when a base lacks
  a file, an export, a namespace or factory member, or a `data-slot` the default base
  has; when a file imports another base's library, or a shared file not on the
  primitives-backed list imports one; and when an item's `#/` imports
  are not shipped by the item or its registry dependencies on some base. Typecheck,
  `registry:smoke` and `check:embeds` run on every base (CI's "Bases" job).

### Special components

Some components are too large to port into copy-paste source: a docking layout, a
data grid, a scheduler. They are published packages, and the registry item ships
**the styled layer over the package**: the package goes into `dependencies`, the
item writes the parts (dressed by a family) and one template. Dockable is the
first (`npx shadcn@latest add @fragiola/dockable` installs `@fragiola/dockable-react`),
Splitter the second (`@fragiola/splitter`, Epic #88), Tree the third
(`@fragiola/tree`, Epic #91), Grid Layout the fourth (`@fragiola/grid-layout`,
Epic #94), Data Grid the fifth (`@fragiola/data-grid`, Epic #98).
The model, the commands and the behaviour stay the package's and are imported from
it; the layer re-exports none of them. In the docs and the gallery they share one
section, **Special**.

**Files at the project root.** Code never targets `~/` (the project root): in a
project with `src/` it would land outside `src/`, where its own `@/` imports do not
look. The one exception is `~/public/` — static files a page fetches by URL, which
Vite and Next serve from the root's `public/` with or without `src/`. Dockable's
popout host page is one. The build refuses every other `~/` target and any `..`
in the path (`scripts/targets.ts`), and the smoke expects the file at the root in
all four scaffolds.

**A pinned range.** The packages are `0.x`, and `0.x` breaks between minors
(Dockable 0.2.0 renamed `enableClose` to `closable`). A bare name in an item's
`dependencies` installs whatever is newest, an API the item, its examples and its
docs were not written for. So an ecosystem package carries its range
(`@fragiola/dockable-react@^0.3.0`), and it is the range this registry builds and
tests against (`packages/registry/package.json`). The build refuses anything else
(`scripts/dependencies.ts`). The shadcn CLI always installs a dependency that has
a range, even when the project already declares it. That is how a user gets the
pinned version, and the smoke asserts that the CLI asks for exactly those ranges.

**The rules every special item follows** (they generalize Dockable's Epic #66):

| # | Rule |
|---|---|
| S1 | One registry item per library, named after it (`dockable`, `splitter`, `tree`, `grid-layout`, `data-grid`), installed with `npx shadcn@latest add @fragiola/<name>`. No CLI of our own (§5). |
| S2 | The item depends on the React adapter only, at a pinned range (above). The adapter re-exports the core. Model APIs are imported from the package and never re-exported by the item. |
| S3 | One export, a namespace named like the library (`Dockable`, `Splitter`, `Tree`, `GridLayout`, `DataGrid`). Its styled parts mirror the adapter's namespace one-to-one and forward `render`, `ref`, handlers and the generic type, with a value or function `className`. Inside, the package's namespace is aliased (`Dockable as DockablePrimitive`). |
| S4 | One style family per library (`dock`, …): a shared `tv()` with zero variants and named members per part and state. State is styled from the library's own `data-*` vocabulary with Tailwind data-variants. Before writing a member, compare it with the closest existing family or component, then share the values or record why they differ. |
| S5 | No new tokens, roles or palettes, and no `!important`. Shape comes from Tailwind scales and the existing radius and control-height tokens, and every class follows the design axes (§4). Parts the engine positions get no geometry: the structural inline style wins. |
| S6 | Exactly one registry template, `<Name>.Template.Simple`, under the template rules (§3): no style of its own, no appearance props, one `className`, at most 7 flat props, behaviour props forwarded. Every other template is an example. |
| S7 | A docs page `special/<name>.mdx` with `<InstallCommand item="<name>" />`, a row in `special/overview.mdx`, public examples, and dev scenarios in `scenarios/special/` covering light/dark, a palette swap, density, `dir="rtl"` and the design axes. |
| S8 | A package younger than pnpm's minimum release age is excluded by exact version in `pnpm-workspace.yaml`, with the reason. The smoke declares the package in its scaffolds, because it runs offline. |

---

## 6. What is not settled

**~38 components remain unconverted.** The initial port (Epic #7) covered nine
components across four style families (popup, menu, field, choice) plus the
chart wrapper. Epic #16 extended the surface with overlay and disclosure:
clickable (the button surface), layer (backdrop + panel, shared by dialog,
alert-dialog and drawer), popup.tooltip (a second popup member), disclosure
(expand/collapse, shared by accordion and collapsible), plus badge and
breadcrumb. The contract held across all of it; see `docs/port-report.md`
and `docs/port-report-epic-16.md` for the full records. Known risks
in the remaining surface:

- **Secondary text.** `muted-foreground` is shadcn's most-used token (44 occurrences)
  and maps to a role Fragiola deliberately lacks. Settled value:
  `text-palette-accent/85`. The architecture initially proposed `accent/70`, but
  OKLCH→WCAG measurement showed 70% fails AA (4.5:1) even on neutral surfaces
  (surface/light/base = 2.85:1). At 85%, `accent` clears AA on every neutral surface
  (surface + raised, base + soft) in both themes. Secondary text appears only on
  neutral backgrounds; chromatic palettes use `contrast` for their text.
  **Standardized** — including
  the placeholder, which used a different value in the POC. The contrast guard in
  `packages/registry/tests/palette-contract.test.ts` asserts accent@85% ≥ 4.5:1 over base and soft
  for every surface-tier palette, in both themes.
- **`sidebar`** — settled in Epic #60. Upstream carries 8 `--sidebar-*` tokens; here it
  maps to the existing `palette-raised`, which is what shadcn's `--sidebar` is in both
  themes. No palette was added: the number of palettes is free, but a palette that
  duplicates another is not a new one. Its palette swaps are surface-tier only, for
  the reason above: its items' resting text is secondary text. See
  `docs/port-report-epic-60.md`.
- **`calendar`** has ~9 states per cell, but they are *state*, already covered.
- **`command`** brings a third state vocabulary, which joins the `highlighted`
  variant.
- **`dockable`** — settled in Epic #66, the first special component (§5): the `dock`
  family, the styled parts, `Template.Simple`, no token and no palette added. One
  limit is open: the overflow menu is a `DropdownMenu`, whose popup portals into the
  main document, so inside a popout window it would open in the other window. A
  window's tab strip keeps every tab and scrolls instead. Restoring the menu there
  needs a portal `container` on the `menu` family's Content — a public API change,
  not taken. See `docs/port-report-epic-66.md`.
- **`splitter`** — settled in Epic #88, the second special component: the `split`
  family, the styled parts plus a `Grip`, `Template.Simple` with two props, no token and
  no palette added (the family declares none, see §2). The S1–S8 rules held unchanged.
  One limit is the package's: a group has no size of its own, so a nested group needs
  `h-full` from its consumer, Template.Simple's included. See
  `docs/port-report-epic-88.md`.
- **`tree`** — settled in Epic #91, the third special component: the `tree` family, the
  package's parts plus Label, Checkbox, Rename, Loading, LoadError, Retry and Empty,
  `Tree.Template.Simple` with four props, no token and no palette added. The S1–S8 rules
  held unchanged. One limit is the package's: the drop indicator is placed in pixels
  (`dragAndDrop({ indentation, indicatorInset })`), so under another density its line
  drifts from the rows by a few pixels per level; S5 keeps the family from moving it. See
  `docs/port-report-epic-91.md`.
- **`grid-layout`** — settled in Epic #94, the fourth special component: the `tile`
  family, the package's parts plus a card's Header, Title and Content,
  `GridLayout.Template.Simple` with four props, no token and no palette added. The S1–S8
  rules held unchanged. One limit is the package's: the row height, the gap and the
  padding are pixel options (`rowHeight`, `gap`, `padding`), so the grid's rhythm does
  not follow the density while the cards' insides do. See `docs/port-report-epic-94.md`.
- **`data-grid`** — settled in Epic #98, the fifth special component: the `sheet`
  family, the package's parts plus a header cell's Label and Title, a piece per common
  feature (sorting, column resizing, column pinning, row selection, filtering, editing,
  pagination), `DataGrid.Template.Simple` with five props, no token and no palette
  added. The S1–S8 rules held unchanged. The rows' heights are the engine's, and the
  styled Root sets them from the spacing scale it measures, so density keeps
  virtualization exact; column widths stay pixel options and do not follow the density.
  The advanced features (ranges, fill, clipboard, grouping, master-detail, reordering,
  summary rows, spans) have no piece yet. See `docs/port-report-epic-98.md`.

- **The visual language** — settled in Epic #107: one answer per visual question
  (`visual-language.md`), held by the `foundation` family that every family composes,
  with a guard test. A neutral action palette joins the set. See
  `docs/port-report-epic-107.md`.

- **The Create page** — settled in Epic #117: the theme builder as a full page at
  fragiola.com/ui/create/ (www contract v1.6), two pages of the embed app with the preview
  in its own document so a design never reaches the customizer. See
  `docs/port-report-epic-117.md`.

**There is no automated visual testing, and that is the largest gap.** The dominant
failure mode in the POC was silent: a class that does not exist produces no build
error, no type error, no crash — it simply does nothing, and type-check and lint both
pass. Three cheap tests close most of it:

1. **Class compilation** — extract every utility used in source, compile the
   stylesheet, assert each generates CSS.
2. **Palette contract** — assert every palette declares all six roles, no
   `!important`, and that the five lists (directory, globals.css, cn.ts, compile
   fixture, registry.json) agree.
3. **Contrast guard** — assert `contrast`/`base` ≥ 4.5:1 for every palette in both
   themes, and accent@85% over base and soft ≥ 4.5:1 for every surface-tier palette.

Screenshot diffing covers the rest, and gets cheaper the earlier it lands.

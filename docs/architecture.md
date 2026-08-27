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
| `soft` | subtle background — alert, badge, hover, field surface |
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

### Tinted surfaces

"The number of palettes is free; the number of roles is not" extends sideways as
well as upwards. A **tinted surface** palette (`surface-blue`, `surface-purple`,
`surface-green`, `surface-orange`, `surface-rose`) is a near-neutral base carrying
a trace of a hue — `base` at L0.99/C0.008, `soft` at L0.95/C0.02. It exists so two
panels on the same page can be recognisably different surfaces without either being
"coloured". The tinted-surface tier is a direct application of the rule: the need
is real (distinguish two surfaces), the answer is a new palette, not a seventh role.

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
menu        the option list        dropdown, context, select, combobox
field       the input control      input, textarea, select trigger
layer       backdrop + panel       dialog, alert-dialog, drawer
disclosure  expand/collapse        accordion, collapsible
```

Families are **orthogonal**, not a hierarchy: `select` is `field` + `popup` + `menu`.
A new component is a recombination.

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

**`render`, never `asChild`** — one polymorphism mechanism, matching Base UI.

### When parts are identical, share the wrapper

Some primitives are literally the same object across components — in Base UI,
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

Density is swappable per subtree, because Tailwind v4's numeric scale is `calc()` over
a custom property:

```css
[data-density="compact"] { --spacing: 0.2rem; }
```

**RTL is an MVP goal.** Logical properties on the inline axis (`ps`/`pe`,
`border-s`/`border-e`, `start`/`end`); the block axis stays physical. Where no logical
utility exists, use the `rtl:` variant — including for directional icons, which are
easy to forget.

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

The cost: their `type` is a closed enum, so families and palettes publish as
`registry:lib`. The label is lost, the behavior is not. And the format has **no
versioning, therefore no update** — whoever installs keeps a frozen copy. That is
inherent to copy-paste distribution; if it becomes a real problem, that is when to
consider our own CLI, not before.

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
  (surface + raised, base + soft) in both themes — worst case 4.58:1
  (surface-green/light/soft). Secondary text appears only on neutral backgrounds;
  chromatic palettes use `contrast` for their text. **Standardized** — including
  the placeholder, which used a different value in the POC. The contrast guard in
  `tests/palette-contract.test.ts` asserts accent@85% ≥ 4.5:1 over base and soft
  for every surface-tier palette, in both themes.
- **`sidebar`** carries its own token set upstream; it should map to its own palette.
- **`calendar`** has ~9 states per cell, but they are *state*, already covered.
- **`command`** brings a third state vocabulary, which joins the `highlighted`
  variant.

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

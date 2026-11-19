# Fragiola UI

A copy-paste component library (shadcn-style distribution: the CLI ships source
files, there is no `@fragiola/ui` package to install). Built on Base UI primitives
and Tailwind v4.

Fragiola exists because of three specific problems with shadcn/ui, each measured:

| problem | shadcn | Fragiola |
|---|---|---|
| Rigid theming | 41 fixed global tokens; `.theme-*` swaps ~20 at once | 6 roles × N composable palettes, scoped to any subtree |
| Duplicated styles | 422 `cn-*` classes; `destructive` appears 132× | shared style families; `palette-danger` appears 10× |
| Duplicated components | ~250 identical wrapper lines between dropdown/context menu | one factory; 3 ways to write an input reduced to 1 |

Distribution reuses shadcn's registry format and CLI — see architecture §8.

## Read before working

**`docs/architecture.md`** — the three problems this project answers and the three
decisions that answer them, plus what is still unsettled. Short; read it once in full.

**`docs/visual-language.md`** — how every component looks: the control box, focus,
the states, type, icons and motion. Before styling anything, compose the
`foundation` family's member for the idea instead of writing its classes
(`tests/foundation.test.ts` enforces it).

## Non-negotiable rules

These are deliberately tight. Do not "fix" them.

1. **The palette contract is 6 roles.** `base`, `soft`, `line`, `contrast`,
   `accent`, `ring`. If something doesn't fit, **create another palette** — the
   number of palettes is free, the number of roles is not. A token that is always
   derived and never overridden is a *derivation*, not a role.
2. **Every palette declares all 6 roles**, no exceptions. Custom properties inherit:
   a palette that omits a role inherits it from the ancestor and leaks across
   scopes. "Optional token" does not exist in an inheritance-based system.
3. **A control never carries its own body.** Border, background, height and focus
   ring live on the field frame, never on the input. This is what allows a single
   input instead of three.
4. **Style families have zero variants.** Variation becomes a named member, not a
   variant. If two components of a family need different values and both are right,
   that is a variant — otherwise unify.
5. **`render`, never `asChild`.** One polymorphism mechanism, matching Base UI.
6. **Logical properties on the inline axis** (`ps`/`pe`, `border-s`/`border-e`,
   `start`/`end`). RTL is an MVP goal. The block axis stays physical.
7. **No `!important`.** If you need it, there is an architectural problem — report
   it instead of working around it.
8. **Verify by compiling, not by reading.** A class that does not exist fails
   silently: no build error, no type error, no visible crash — it simply does
   nothing. This was the dominant failure mode in the POC.
9. **A design axis only sets tokens, and its tokens reach utilities as `var()`.**
   Spacing, radius, typography, elevation and motion are `data-*` attributes
   (architecture §4). No component gets a variant or a prop for one. A token
   an axis changes must compile to `var()` or to an expression over an axis
   variable, never to an inlined value. `tests/design-axes.test.ts` pins it.

## Secondary text

The most-used token in the shadcn baseline (`muted-foreground`, 44 occurrences)
maps to a role Fragiola deliberately lacks. The settled value is
**`text-palette-accent/85`**.

The architecture proposed `accent/70`, but OKLCH→WCAG measurement showed 70%
fails AA (4.5:1) even on neutral surfaces (surface/light/base = 2.85:1). At 85%,
`accent` clears AA on every neutral surface (surface + raised, base + soft) in
both themes. Secondary text realistically appears only on neutral backgrounds;
chromatic palettes use `contrast` for their text, not a muted variant. The
contrast guard in `packages/registry/tests/palette-contract.test.ts` asserts accent@85% ≥ 4.5:1
over base and soft for every surface-tier palette, in both themes.

Apply this value uniformly, including to placeholders.

## Playground

`pnpm dev` serves `apps/playground`: the registry read in place, with hot reload,
a theme / direction / design-axes toolbar and the source beside the stage. It shows
two things, which are not interchangeable:

- **Examples** live in `examples/react/src/examples` and are listed in its
  `index.ts`. They are public: the docs embed them (fragiola/www `CONTRACT.md`
  §5), `site:export` ships them, and readers copy them verbatim.
- **Scenarios** live in `apps/playground/src/scenarios/<level>/<id>.tsx`. They
  are dev-only (edge cases, full variant matrices, animation comparisons) and
  never shipped. A file is all it takes: `<level>` is a level of
  `examples/gallery.ts`, `<id>` is kebab-case, and the module has **only a
  default export** (anything else costs Fast Refresh);
  `tests/scenarios.test.ts` enforces it.

**The Create page** (`examples/react/create.html`, served full-page at
fragiola.com/ui/create, contract v1.6) is the theme builder. It is not an
example: two pages of the embed app, code in `examples/react/src/create/`
(folders by responsibility). `create.html` is the docs-style shell and the
customizer; `create-preview.html` is the sample, in an iframe inside the inset
panel. The customizer posts the design (`design/design.ts`) and only the
preview applies it to its own `<html>` (`design/apply-design.ts`), so an axis
never reaches the customizer. A sample card goes in `preview/cards/<group>.tsx`
and in a column of `preview/canvas.tsx`; it reads `useTone()` for the design's
classes and draws charts with `PreviewChart`. `pnpm --filter examples-react
check:create` hosts it as fragiola.com does and checks the scroll, the overflow
and the isolation. `scenarios/atoms/theme-builder-edges.tsx` shows the palette
generator on the hues where it is hardest.

When a scenario becomes something readers should see, it becomes an example,
with its entry in `examples/react/src/examples/index.ts`. A scenario is never
linked from the docs.

**A modal example covers the site's page.** On fragiola.com a Dialog, an
AlertDialog or a Drawer opened in an example (the Sidebar's mobile Drawer too)
is promoted over the whole page, not kept inside the example's frame
(fragiola/www `CONTRACT.md` v1.3 §5.4). `examples/react/src/host/overlay-promotion.ts`
holds the trigger's click until the frame covers the site's viewport, pins the
stage where it was, and lets the frame go back once the exit animation has
ended. It keys off the registry's `data-slot` names, so neither the components
nor the examples know about it. Popups that are not modal (menus, popovers,
selects, tooltips) still open inside the frame: their example's `height` floor
gives them room. `check:embeds` checks both.

## Verification commands

| command | does |
|---|---|
| `pnpm install` | install dependencies |
| `pnpm dev` | the playground (`apps/playground`): every example and scenario, live |
| `pnpm check` | Biome lint + format + assist (non-mutating) |
| `pnpm check:fix` | Biome check with auto-fix |
| `pnpm typecheck` | `pnpm -r typecheck` (TypeScript, no emit) |
| `pnpm test` | `pnpm -r test` (guard tests) |
| `pnpm build` | `pnpm -r build` (production build) |
| `pnpm registry:build` | build the registry JSON files (`packages/registry/dist/r`) |
| `pnpm registry:smoke` | install every registry item with the real shadcn CLI |
| `pnpm site:export --base /ui --out <dir>` | the export fragiola.com builds from, validated against its contract (v1.3, fragiola/www `CONTRACT.md`) |
| `pnpm site:dev --base /ui --port <n>` | the examples app with hot reload, for fragiola.com's dev server |
| `pnpm --filter examples-react check:embeds` | every example in a real iframe, as a v1.2 host shows it, and every modal example promoted by a v1.3 host (needs `playwright install chromium`) |

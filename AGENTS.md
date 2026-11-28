# Fragiola UI

A copy-paste component library (shadcn-style distribution: the CLI ships source
files, there is no `@fragiola/ui` package to install). Built on headless
primitives and Tailwind v4, on two **bases** as shadcn/ui offers several:
Fragiola Primitives (`@fragiola/primitives-react`, the default) and Base UI
(architecture §5, "Bases").

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
5. **`render`, never `asChild`.** One polymorphism mechanism, matching both bases.
6. **Logical properties on the inline axis** (`ps`/`pe`, `border-s`/`border-e`,
   `start`/`end`). RTL is an MVP goal. The block axis stays physical.
7. **No `!important`.** If you need it, there is an architectural problem — report
   it instead of working around it.
8. **Verify by compiling, not by reading.** A class that does not exist fails
   silently: no build error, no type error, no visible crash — it simply does
   nothing. This was the dominant failure mode in the POC.
9. **A design axis only sets tokens, and its tokens reach utilities as `var()`.**
   Spacing, radius, typography, elevation, motion and the resize handle's mark are `data-*` attributes
   (architecture §4). No component gets a variant or a prop for one. A token
   an axis changes must compile to `var()` or to an expression over an axis
   variable, never to an inlined value. `tests/design-axes.test.ts` pins it.

## Bases

`packages/registry/bases.ts` lists the bases; the default one is served at `r/`,
the others at `r/<base>/`. Do not "fix" these:

- **Only a file that imports a primitive library is per base** (except a
  primitives-backed file, below), at
  `registry/bases/<base>/<its path>`, and it exists on **every** base. Everything
  else stays shared. Code reaches a base file through `#/` (never a relative
  import across the boundary), which resolves to the selected base's copy, else
  the shared file.
- **A component Base UI lacks is primitives-backed**: one shared file that imports
  `@fragiola/primitives-react` on every base (as shadcn's Calendar uses
  react-day-picker on every base), on the explicit `PRIMITIVES_BACKED` list in
  `bases.ts` with its reason and its Fragiola Primitives entry. Its item gets
  `@fragiola/primitives-react@0.3.0` on every base (the build) and registry-depends on
  `@fragiola/primitives-backed` (`lib/primitives-backed.tsx`: the base's direction,
  `PrimitivesProps`, `renderMarked`). A component Base UI also has is a per-base pair. Every base
  offers the same catalog; the guard refuses any other shared or Base UI file that
  imports Fragiola Primitives, and a listed file whose entry Base UI ships.
- **The UI adapts; a base library is never changed** to match another. A base file
  differs from its twins only in primitive wiring. Its exports, namespace and
  factory members, classes and `data-slot` names are identical
  (`tests/bases.test.ts`). The base's adapter is `lib/base.ts` (`PrimitiveProps`,
  `controlText`, `POSITIONER_DEFAULTS`, ...).
- **A behaviour a base decided differently is kept** and written under "Bases" on
  the component's docs page. A type or a missing part is adapted in the wrapper.
- `registry.json` never lists a base's package: the build adds it per base.
- `FRAGIOLA_BASE=<base>` selects the base for `pnpm dev`, the examples build,
  `check:embeds` (which hosts the app where a v1.8 host does:
  `/ui/embed/react/` for the default base, `/ui/embed/react/<base>/` for
  another) and `check:create`. The playground also switches it from its
  toolbar. `pnpm typecheck` checks every base.
- **The export declares the bases** (fragiola/www `CONTRACT.md` v1.8 §2,
  §5.6, §7): `project.json` `bases` comes from `bases.ts`; `site:export` builds
  the examples app once per base (`embed/react/`, `embed/react/<base>/`) and
  the registry once per base (`r/`, `r/<base>/`), and `validateBases` checks
  that every base has the same items and examples. `site:dev` runs one Vite
  server per base behind a proxy on its port, each at its base's path, so
  fragiola.com's dev server switches base too.

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
never reaches the customizer. The shell has no header: the panel on the frame holds the links, Randomize and
Reset, the controls and Get code, and the inset keeps the docs' 0.5rem margin
and 0.75rem radius. The frame is `palette-raised`; the inset, the preview's canvas
and its cards share `palette-surface`, the cards bordered: two tones. A sample card goes in `preview/cards/<group>.tsx`
and in `CARDS` (`preview/canvas.tsx`), which deals cards into the shortest
column by measured height; it reads `useTone()` for the design's classes and
draws charts with `PreviewChart`. The special components lead the canvas, in
`preview/band/special.tsx`, shown bare: each panel is the component edge to edge,
with no title or description. The preview's stage (`[data-stage]`) is its
scroller, and a modal opened in it covers the whole page: the preview speaks
the embed half of overlay promotion, `shell/preview-promotion.ts` the host
half. `pnpm --filter examples-react
check:create` hosts it as fragiola.com does and checks the scroll, the overflow,
the isolation, the two tones, the band (nothing clipped, the data grid at full width
with its pager in view), the inset and the panel's order. `scenarios/atoms/theme-builder-edges.tsx` shows the palette
generator on the hues where it is hardest.

When a scenario becomes something readers should see, it becomes an example,
with its entry in `examples/react/src/examples/index.ts`. A scenario is never
linked from the docs.

**Two examples are fragiola.com's home page.** `component-showcase` is the
landing's showcase (`site/docs/index.mdx`, right after the Hero), and www's
home slide for Fragiola UI is derived from it: real components in Create's
first design, within a showcase's height at a landing's width (`check:embeds`
holds it under 640px at 1152px). `palettes` is the landing's palette section
and www embeds it by id: six preset colours on the "Invite your team" card,
plus a hue that becomes `my-palette-1`, `my-palette-2`, … (and their surface
twins) with the registry's generator (`lib/colour/palette`, the one Create
uses, never a copy). The code beside the card is only the class swap: the
card's components in render order, each with its palette class, never the
palette's CSS; at 1152px card and panel stand side by side at the same height,
neither scrolling (`check:embeds` holds it). Keep both ids.

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
| `pnpm typecheck` | `pnpm -r typecheck` (TypeScript, no emit, once per base) |
| `pnpm test` | `pnpm -r test` (guard tests) |
| `pnpm build` | `pnpm -r build` (production build) |
| `pnpm registry:build` | build the registry JSON files of every base (`packages/registry/dist/r`, `dist/r/<base>`) |
| `pnpm registry:smoke` | install every registry item of every base with the real shadcn CLI |
| `pnpm site:export --base /ui --out <dir>` | the export fragiola.com builds from, every base included, validated against its contract (v1.8, fragiola/www `CONTRACT.md`) |
| `pnpm site:dev --base /ui --port <n>` | the examples app of every base with hot reload, for fragiola.com's dev server (a proxy on `<n>`, one Vite server per base on the next ports) |
| `pnpm --filter examples-react check:embeds` | every example in a real iframe, as a v1.2 host shows it, and every modal example promoted by a v1.3 host (needs `playwright install chromium` locally; CI runs it in Playwright's image, see `.github/workflows/ci.yml`) |

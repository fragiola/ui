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

## Secondary text

The most-used token in the shadcn baseline (`muted-foreground`, 44 occurrences)
maps to a role Fragiola deliberately lacks. The settled value is
**`text-palette-accent/85`**.

The architecture proposed `accent/70`, but OKLCH→WCAG measurement showed 70%
fails AA (4.5:1) even on neutral surfaces (surface/light/base = 2.85:1). At 85%,
`accent` clears AA on every neutral surface (surface + raised, base + soft) in
both themes — worst case 4.71:1. Secondary text realistically appears only on
neutral backgrounds; chromatic palettes use `contrast` for their text, not a
muted variant. The palette-contract guard test checks the neutral surface
palettes.

Apply this value uniformly, including to placeholders.

## Verification commands

| command | does |
|---|---|
| `pnpm install` | install dependencies |
| `pnpm check` | Biome lint + format + assist (non-mutating) |
| `pnpm check:fix` | Biome check with auto-fix |
| `pnpm typecheck` | `pnpm -r typecheck` (TypeScript, no emit) |
| `pnpm test` | `pnpm -r test` (guard tests) |
| `pnpm build` | `pnpm -r build` (production build) |
| `pnpm registry:build` | build the registry JSON files |

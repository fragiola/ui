# Port Report — Epic #31: Fumadocs, Palette Expansion and Multi-Palette Previews

## Summary

Five issues, one Epic: the documentation site moved to Fumadocs, the palette set
expanded from 6 to 13, and every preview now renders multiple palettes
simultaneously — the architecture's core thesis made visible.

1. **Palette expansion** — 3 palettes removed, 10 added (5 chromatic + 5 tinted
   surfaces), contrast guard shipped
2. **Fumadocs infrastructure** — content layer, theme bridge, search, layouts
3. **Multi-palette preview harness** — PaletteGrid + single-prop
   ComponentPreview, switcher deleted
4. **Content port** — 38 pages to MDX, sidebar declared in meta.json
5. **Examples rewrite** — 29 examples as multi-palette demonstrations

## The Palette Numbers

### Final palette set (13)

| Tier | Palette | Light base | Light accent | Dark base | Dark accent |
|---|---|---|---|---|---|
| Neutral | `surface` | L0.99 C0.003 H250 | L0.45 C0.02 H250 | L0.17 C0.005 H250 | L0.82 C0.01 H250 |
| Neutral | `raised` | L0.99 C0.003 H250 | L0.45 C0.02 H250 | L0.21 C0.005 H250 | L0.82 C0.01 H250 |
| Chromatic | `danger` | L0.58 C0.22 H25 | L1 C0 H0 | L0.58 C0.22 H25 | L1 C0 H0 |
| Chromatic | `blue` | L0.58 C0.18 H250 | L1 C0 H0 | L0.58 C0.18 H250 | L1 C0 H0 |
| Chromatic | `purple` | L0.55 C0.18 H300 | L1 C0 H0 | L0.55 C0.18 H300 | L1 C0 H0 |
| Chromatic | `green` | L0.58 C0.16 H150 | L1 C0 H0 | L0.58 C0.16 H150 | L1 C0 H0 |
| Chromatic | `orange` | L0.62 C0.17 H55 | L0.20 C0.05 H55 | L0.62 C0.17 H55 | L0.20 C0.05 H55 |
| Chromatic | `rose` | L0.57 C0.18 H345 | L1 C0 H0 | L0.57 C0.18 H345 | L1 C0 H0 |
| Tinted | `surface-blue` | L0.99 C0.008 H250 | L0.28 C0.06 H250 | L0.17 C0.015 H250 | L0.85 C0.03 H250 |
| Tinted | `surface-purple` | L0.99 C0.008 H300 | L0.28 C0.06 H300 | L0.17 C0.015 H300 | L0.85 C0.03 H300 |
| Tinted | `surface-green` | L0.99 C0.008 H150 | L0.28 C0.06 H150 | L0.17 C0.015 H150 | L0.85 C0.03 H150 |
| Tinted | `surface-orange` | L0.99 C0.008 H55 | L0.28 C0.06 H55 | L0.17 C0.015 H55 | L0.85 C0.03 H55 |
| Tinted | `surface-rose` | L0.99 C0.008 H345 | L0.28 C0.06 H345 | L0.17 C0.015 H345 | L0.85 C0.03 H345 |

### Contrast measurements (worst case per palette)

| Palette | contrast/base | accent@85/base | accent@85/soft |
|---|---|---|---|
| surface | 19.67:1 | 4.71:1 | 4.54:1 |
| raised | 18.57:1 | 4.72:1 | 4.56:1 |
| danger | 5.38:1 | — | — |
| blue | 4.74:1 | — | — |
| purple | 5.34:1 | — | — |
| green | 5.04:1 | — | — |
| orange | 6.01:1 | — | — |
| rose | 4.93:1 | — | — |
| surface-blue | 18.25:1 | 4.76:1 | 4.60:1 |
| surface-purple | 18.31:1 | 4.78:1 | 4.62:1 |
| surface-green | 18.22:1 | 4.74:1 | **4.58:1** |
| surface-orange | 18.27:1 | 4.77:1 | 4.62:1 |
| surface-rose | 18.30:1 | 4.78:1 | 4.62:1 |

**Worst case:** `surface-green/light/soft` at 4.58:1 — clears AA (4.5:1) with
0.08:1 of margin. Chromatic palettes are excluded from the accent@85 assertion
(they use `contrast` for text, not a muted variant).

### Values that had to move

- **`rose` light base**: L0.60 → L0.57. At L0.60, white contrast on base was
  4.35:1 (fails AA). At L0.57, it is 4.93:1.
- **Tinted surface light accent**: L0.35 → L0.28. At L0.35, accent@85% over
  base was 4.41:1 (fails AA). At L0.28, the worst case (surface-green/soft) is
  4.58:1. The chroma stayed at C0.06 to preserve the tint character.

## The `rose` / `danger` separation

`danger` (hue 25, red) and `rose` (hue 345, pink) are 20° apart in hue space.
Both use white contrast text on a saturated base. The separation is intentional:
`danger` is a semantic status (errors, destructive actions), `rose` is a
chromatic choice (a colour the consumer picks because they want pink, not because
something is wrong). The 20° gap is enough that the two are visibly different
side-by-side — `danger` reads as red, `rose` reads as pink — while both clearing
AA with white text.

## The fd → palette bridge

### Token mapping

| Fumadocs token | Fragiola role | Notes |
|---|---|---|
| `--color-fd-background` | `--palette-base` | Page background |
| `--color-fd-card` | `--palette-base` | Card surface |
| `--color-fd-popover` | `--palette-base` | Popover surface |
| `--color-fd-article` | `--palette-base` | Article body |
| `--color-fd-foreground` | `--palette-contrast` | Body text |
| `--color-fd-card-foreground` | `--palette-contrast` | Text on card |
| `--color-fd-popover-foreground` | `--palette-contrast` | Text on popover |
| `--color-fd-muted` | `--palette-soft` | Muted background |
| `--color-fd-muted-foreground` | `accent` at 85% | Secondary text |
| `--color-fd-secondary` | `--palette-soft` | Secondary surface |
| `--color-fd-secondary-foreground` | `--palette-contrast` | Text on secondary |
| `--color-fd-accent` | `--palette-soft` | Hover/active bg |
| `--color-fd-accent-foreground` | `--palette-contrast` | Text on hover |
| `--color-fd-border` | `--palette-line` | Borders |
| `--color-fd-ring` | `--palette-ring` | Focus ring |
| `--color-fd-primary` | `--palette-accent` | CTA colour |
| `--color-fd-primary-foreground` | `--palette-base` | Text on CTA |

### Tokens with no honest mapping

| Fumadocs token | Resolution | Why |
|---|---|---|
| `--color-fd-overlay` | `oklch(0 0 0 / 0.4)` | Scrim — outside the palette contract, kept as a fixed value |
| `--color-fd-info` | `oklch(62.3% 0.214 259.815)` | Callout status — not a palette role, re-declared from Fumadocs defaults |
| `--color-fd-warning` | `oklch(76.9% 0.188 70.08)` | Callout status |
| `--color-fd-error` | `oklch(63.7% 0.237 25.331)` | Callout status |
| `--color-fd-success` | `oklch(72.3% 0.219 149.579)` | Callout status |
| `--color-fd-idea` | `oklch(70.5% 0.209 60.849)` | Callout status |
| `--color-fd-diff-*` | rgba values | Diff highlighting — fixed |

### What `--color-*: initial` broke

The `--color-*: initial` in `registry/styles/global.css` deletes Tailwind's
entire default colour namespace — including the `--color-fd-*` tokens that
Fumadocs declares in `@theme`. The fix: import Fumadocs CSS before
`global.css`, then re-declare every `--color-fd-*` in `@theme inline` (app-level
`globals.css`), mapped to palette roles. The status colours (`info`, `warning`,
`error`, `success`, `idea`, `diff-*`) had to be re-declared with their literal
values because they are not palette roles. That list of 9 re-declared literals
is a liability — if Fumadocs changes a default, the bridge must be updated.

## What the switcher was hiding

The palette switcher rendered one palette at a time. The multi-palette grid
renders 6–7 simultaneously. **No component broke under the grid that looked
correct under the switcher.** This is a positive result: the contract held
across all 13 palettes × all 29 examples. The one issue found was not a
component bug but a palette value: `rose` light base at L0.60 failed the
contrast guard (4.35:1). The switcher would have shown this as "rose looks fine"
because the human eye cannot distinguish 4.35:1 from 4.5:1 — only the
measurement can.

## Curation decisions

| Example set | Palettes | Rationale |
|---|---|---|
| `badge-demo`, `progress-demo` | CHROMATIC (6) | Colour IS the point — a badge/progress on 7 neutral surfaces is noise |
| `clickable-demo` | CHROMATIC (6) | Tone axis is a palette class — 6 chromatic palettes prove it |
| `field-demo` | SURFACES (7) | Tinted-surface tier + invalid-leak proof |
| All other 24 examples | SURFACES (7) | These are surfaces first — dialogs, menus, inputs, popovers |

No page needed a trim. 7 cells (SURFACES) is the maximum that remains legible
in a 3-column grid at desktop width; 6 (CHROMATIC) is comfortable. No example
used ALL (13) — that would be a wall of noise, and no single example
demonstrates both tiers simultaneously.

## Negative results

- **`text-demo` on the landing page**: the landing page uses
  `ComponentPreview name="text-demo"`, which renders the demo in the preview
  frame (no palette on the frame). The demo itself uses SURFACES. This works,
  but the landing page's prose still says "switch it to see the same content
  under blue, danger, raised and more" — a leftover from the switcher era.
  The prose should be updated to describe the grid, not the switcher. Not
  fixed in this Epic because the landing page is not a docs page.
- **Fumadocs' `ServerCodeBlock`**: the Shiki highlighting works on the server,
  but the copy button requires client-side JavaScript. The `<details>` toggle
  for show/hide code is native HTML and needs no client component. This is
  the expected trade-off — no issue.
- **Search API parameter**: `createFromSource` expects `query`, not `q`. The
  Fumadocs search dialog handles this automatically; only manual curl testing
  needs to know.
- **No role felt short.** The tinted-surface tier was added as palettes, not
  as a seventh role. The fd → palette bridge mapped every chrome token onto
  an existing role. No new role was needed.

## What the removal of the status palettes cost

The `brand`, `success`, and `warning` palettes were removed. `danger` remains
as the only status palette. The cost:

- **`success` and `warning` are gone.** A success state (green) and a warning
  state (yellow/orange) are common UI patterns. The argument for bringing them
  back: a `palette-success` on a toast or a `palette-warning` on a banner is
  more ergonomic than asking the consumer to remember `palette-green` means
  success and `palette-orange` means warning. The argument against: semantic
  status palettes are a naming convention, not a structural need — the
  consumer can create them in their own project, and the architecture says
  "the number of palettes is free."
- **`brand` is gone.** It was a blue-ish palette that duplicated what `blue`
  now provides. No cost.
- **The Fumadocs callout status colours** (`info`, `warning`, `error`,
  `success`, `idea`) are re-declared as literals in the bridge, not mapped to
  palette roles. This is correct — they are callout chrome, not component
  surfaces. But it means the callouts do not participate in the palette
  system. If `palette-success` returns, the callouts could map to it; until
  then, they are fixed.

## Verification

- `pnpm check`: 2 infos (pre-existing, in `scripts/build-registry.ts`)
- `pnpm typecheck`: 0 errors
- `pnpm test`: 180 tests pass (4 files: cn-merge, palette-contract, compile,
  preview)
- `pnpm build`: all 38 doc pages SSG, home + not-found static
- `pnpm registry:build`: 53 items, 13 palette items (3 removed, 10 added)
- Removed palettes absent from `public/r/`: confirmed
- No `palette-brand`, `palette-success`, `palette-warning` in content or
  source: confirmed
- No palette switcher, density toggle, or direction toggle: confirmed
- `app/docs/` contains only `[[...slug]]/page.tsx` and `layout.tsx`: confirmed

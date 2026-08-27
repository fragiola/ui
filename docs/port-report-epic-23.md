# Port Report — Epic #23: Navigation, Measurement and Data Display

## Summary

Ten components ported across four implementation issues, proving the three
architectural claims hold for a second batch of surfaces:

1. **Composable palettes** — every visual class is a role, never a colour literal
2. **Style families** — one new family (`track`), zero variants; the navigation family question answered negatively
3. **Control/body separation** — `slider` is a field control with no box of its own; `combobox` is the second recombination test

## Components Ported

| # | Component | Families | Files | Issue |
|---|-----------|----------|-------|-------|
| 1 | Slider | track, field, text | 1 + 1 family | #24 |
| 2 | Progress | track, text | 1 | #24 |
| 3 | Tabs | (none — layout + roles) | 1 | #25 |
| 4 | Navigation Menu | popup, text | 1 | #25 |
| 5 | Pagination | clickable | 1 | #25 |
| 6 | Combobox | field, popup, menu, clickable, text | 1 | #26 |
| 7 | Table | (none — semantic HTML + roles) | 1 | #27 |
| 8 | Avatar | (none — roles + layout) | 1 | #27 |
| 9 | Skeleton | (none — roles + animate-pulse) | 1 | #27 |
| 10 | Separator | (none — roles + primitive ARIA) | 1 | #27 |

**Total new files:** 25 (10 components, 1 family, 10 demos, 10 docs pages, 1 port report)
**Total registry items:** 46 (was 35, added 11 — track family + 10 components)

## Style Families Created

| Family | Members | Variants | Used by |
|--------|---------|----------|---------|
| track | rail, fill | 0 | Slider, Progress |

All families have **zero variants**, per rule 4. Orientation is
`data-orientation` from the primitive, not a style axis.

## The track family question (Issue #24)

**Question:** do slider and progress share a family?

**Answer:** yes — `track` (rail + fill, zero variants). The rail is the
background track; the fill is the indicator. These are the two things slider
and progress genuinely share. The thumb, the interaction and the indeterminate
state live in the components.

**Installing slider after progress writes exactly one file** — `slider.tsx`
itself. The `track` family is already installed.

### Drift resolved

- `bg-palette-line` for the rail (stroke role), `bg-palette-base` for the fill
  (the palette's colour). No colour literals.
- `rounded-full` for both rail and fill — the pill shape.
- The fill's geometry comes from the primitive's inline styles (logical
  properties — `inset-inline-start` + `width` for horizontal, `bottom` +
  `height` for vertical). The family carries only the visual treatment.
- `absolute` is safe on `fill`: the slider primitive sets `position` inline
  (relative for horizontal, absolute for vertical), overriding the class;
  progress does not set position, so the class applies.
- `inset-block-0` is NOT on `fill`: the slider's vertical indicator is
  anchored from `bottom` (set inline by the primitive). A `top: 0` from the
  family would over-constrain the box and silently flip the fill to grow
  from the top. Progress adds `inset-block-0` itself (pure layout).

## The navigation family question (Issue #25)

**Question:** do tabs, navigation-menu and pagination share a family?

**Answer:** no. The overlap is thinner than it first looks.

- **Tabs and navigation-menu** share state normalisation (the `highlighted`
  custom variant) but differ in cursor (`cursor-pointer` on tabs, not on
  nav-menu triggers), rounding (tabs have `-mb-px` + `rounded-b-none` to
  overlap the list's border; nav-menu triggers are fully rounded), and
  state-specific treatments (tabs have `data-[active]`; nav-menu has
  `data-[popup-open]` + a rotating chevron). A family would need variants
  for all three — violating rule 4.
- **Pagination** is `Clickable` in a `<nav>`. It shares nothing structural
  with tabs or navigation-menu. The current page is a fill strategy
  (`variant="outline"`), not a colour.

**The negative result is the finding.** Forcing a family here would have
produced variants — the exact thing rule 4 forbids. The `highlighted` custom
variant in `global.css` already normalises the one thing they genuinely share.

### Navigation-menu popup

The popup is `popup.content` — the second consumer of that family outside
menus (after popover). The viewport's size transition uses the primitive's
`--popup-width` / `--popup-height` CSS variables; no new popup member was
needed, and no `!important`.

### Tabs indicator

The indicator uses the primitive's CSS variables (`--active-tab-*`) via
Tailwind v4's shorthand `(--var-name)` syntax. The older `[var(--var-name)]`
syntax breaks `tailwind-merge` inside `cn()` during SSR, silently breaking
the `TabsListContext` — documented in the indicator's header comment. This
was the dominant silent-failure mode in this component.

### Pagination RTL

The previous/next chevrons invert under RTL via `rtl:rotate-180`. There is no
logical utility for icon direction, so `rtl:` is the correct tool. This is
the most likely silent failure: if misspelled, the chevron points the wrong
way in RTL with no error.

## The combobox recombination test (Issue #26)

**Claim:** combobox can be built solely from existing families.

**Result:** confirmed. Combobox is `field` + `popup` + `menu`, and it
declares no new style. Every visual class comes from a family:

| Part | Source |
|------|--------|
| InputGroup | `field.row()` + layout |
| Input | `field-control` marker + layout |
| Trigger / Clear | `Clickable.Button` |
| Content | `popup.content()` |
| Item | `menu.selectableItem()` |
| ItemIndicator | `menu.itemIndicator()` |
| GroupLabel | `menu.label()` |
| Separator | `menu.separator()` |

The input is a field control — the thesis test of the control/body rule
applied to a text input that is also a trigger. The box comes from
`field.row`; the input carries the `field-control` marker so the row's
outline fires on focus.

The chip (`Combobox.Chip`) uses `bg-palette-soft` + `text-palette-contrast` —
a role combination, not a new style. The chip is too specific to multiselect
to justify a family member.

## Display components (Issue #27)

Four components with no new families — just palette roles and layout:

- **Table:** semantic HTML with `border-palette-line` for the grid,
  `bg-palette-soft` for the header and hover, `text-palette-contrast` for
  header text, `text-palette-accent/85` for body text.
- **Avatar:** Base UI primitive for the loading-status state machine. The
  fallback is centred text on `bg-palette-soft`. Size is controlled by the
  consumer.
- **Skeleton:** `bg-palette-soft` + `animate-pulse` (Tailwind's built-in,
  which respects `prefers-reduced-motion` automatically).
- **Separator:** Base UI primitive for ARIA. No family — the `menu` family
  separator carries menu spacing. This separator is generic:
  `bg-palette-line` + orientation from the primitive.

## Rule compliance

| Rule | Status |
|------|--------|
| 1. 6 roles | ✓ — every visual class is a role (base, soft, line, contrast, accent, ring) |
| 2. All 6 roles declared | ✓ — no new palettes created |
| 3. Control never carries its own body | ✓ — slider and combobox input are field controls |
| 4. Style families have zero variants | ✓ — track has 0 variants |
| 5. `render`, never `asChild` | ✓ — 0 occurrences of `asChild` |
| 6. Logical properties on the inline axis | ✓ — `ps`/`pe`, `border-s`/`border-e`, `start`/`end`; `left`/`right` only for animation directions and popup side positioning |
| 7. No `!important` | ✓ — 0 occurrences |
| 8. Verify by compiling | ✓ — all tests, typecheck, lint, build pass |

## Verification

| command | result |
|---------|--------|
| `pnpm typecheck` | ✓ 0 errors |
| `pnpm check` | ✓ 0 errors (2 pre-existing infos in build-registry.ts) |
| `pnpm test` | ✓ 50 tests passed (palette-contract + compile) |
| `pnpm registry:build` | ✓ 46 items built |
| `pnpm build` | ✓ 40 pages prerendered, 0 errors |

## What was NOT done

- **No new palettes.** The 6 core palettes (surface, raised, brand, success,
  warning, danger) cover every tone in this batch. Tone arrives as a palette
  class from outside (e.g. `className="palette-warning"` on Progress), not as
  a prop.
- **No page-computation logic in Pagination.** Which pages to render is the
  consumer's decision; the docs show one way in a demo, not in the component.
- **No combobox chips in the demo.** The Chips/Chip/ChipRemove parts are
  implemented and exported, but the multiselect demo uses the input-only
  pattern. A chips demo would require a controlled selection state, which is
  the consumer's responsibility.

# Port Report — Epic #7: Initial Component Port

## Summary

Nine components ported from the validation POC to the UI project, proving
the three architectural claims:

1. **Composable palettes** — 6 roles × N palettes, scoped to any subtree
2. **Style families** — shared style skeletons, zero variants
3. **Control/body separation** — one input instead of three

## Components Ported

| # | Component | Families | Files | Issue |
|---|-----------|----------|-------|-------|
| 1 | Dropdown Menu | popup, menu | 4 | #8 |
| 2 | Context Menu | popup, menu | 1 | #8 |
| 3 | Field | field | 2 | #9 |
| 4 | Input / Textarea / Numeric | field | 6 | #9 |
| 5 | Checkbox | choice | 1 | #10 |
| 6 | Radio + RadioGroup | choice | 1 | #10 |
| 7 | Switch | choice | 1 | #10 |
| 8 | Select | field + popup + menu | 1 | #11 |
| 9 | Chart | (none — theme tokens) | 2 | #12 |

**Total new files:** 25 (families, components, hooks, examples, docs pages)
**Total registry items:** 23 (was 11, added 12)

## Style Families Created

| Family | Members | Variants | Used by |
|--------|---------|----------|---------|
| popup | content | 0 | dropdown-menu, context-menu, select |
| menu | item, selectableItem, label, separator, shortcut, subTrigger, itemIndicator | 0 | dropdown-menu, context-menu, select |
| field | root, choiceRoot, row, body, control, addon, inset, label, description, error | 0 | Field, Input, Textarea, Numeric, Select |
| choice | root, control, indicator, label, description | 0 | Checkbox, Radio, Switch |

All families have **zero variants**, per rule 4. Variation that was needed
became a named member (e.g., `selectableItem` extends `item` with `pe-8
ps-1.5` for the indicator space).

## Drift Resolved

### popup family
- `min-w-32` (dropdown) vs `min-w-36` (context/select/combobox/menubar) →
  unified to `min-w-36`
- menubar missing `data-closed:*` → included (was a bug)
- padding: `p-1` (menu lists) vs `p-2.5` (popover block) vs none (select) →
  `p-2` always; select does not duplicate padding
- `bg-popover text-popover-foreground` → `palette-raised bg-palette-base
  text-palette-contrast`
- `ring-foreground/10 ring-1` → `border border-palette-line`
- `cn-menu-translucent` (glassmorphism) NOT included — required `!important`
  (forbidden by rule 7) and is cross-cutting decoration, not popup structure

### menu family
- `gap-1.5` (dropdown/context/menubar/select) vs `gap-2` (combobox) →
  unified to `gap-2`
- `data-disabled:opacity-50` (only menubar) → applied to ALL via base
- `data-[variant=destructive]`: 6 declarations + dark theme block → palette
  class (`className="palette-danger"`), base uses `highlighted:bg-palette-soft`
  / `text-palette-accent` which resolve against whichever palette is active
- `focus:*:[svg]:text-accent-foreground` (context) vs
  `not-data-[variant=destructive]:focus:**:text-accent-foreground` (dropdown)
  → eliminated: palette redefines tokens, inheritance does the rest
- `text-muted-foreground` (label/shortcut/separator) →
  `text-palette-accent/85` (the settled secondary-text value)
- `bg-border` (separator) → `bg-palette-line`
- item-indicator: some without `flex/size-4` → standardized with all
- label: `px-2 py-1.5` (combobox) vs `px-1.5 py-1` (others) → `px-1.5 py-1.5`
- label: `font-medium` (dropdown/context) vs none (combobox/select) →
  `font-medium` (distinguishes label from item)

### field family
- The box was on `body` with `addon` having its own border → moved to `row`:
  a single box wraps body and addons, `overflow-hidden` clips corners, no
  child declares radius, focus ring wraps the entire field
- This eliminated both `!important`s (`!rounded-l-none` / `!rounded-r-none`)
  that the reference project needed to join two bordered boxes
- `gap-xs`/`px-sm` (named spacing scale) → eliminated; Tailwind's numeric
  scale is used directly (architecture.md §4)
- `aria-invalid:palette-danger` does NOT work → `data-invalid` on Field.Root
  activates `palette-danger` via the themes' `[data-invalid]` applier
- `basis-px` (not `flex-1`) on body: `flex-1` is `flex: 1 1 0%` (basis zero),
  which with a block addon (`basis-full`) summed to 100% and did not wrap;
  `basis-px` (1px) makes the sum exceed 100%, forcing the block addon to
  its own line

### choice family
- `peer-peer-[data-state=checked]:border-input` (radio) → eliminated;
  palette handles it via `data-checked:bg-palette-base`
- `focus-visible:ring-*` → `field-focus:outline-2
  field-focus:outline-palette-ring` (the project's focus convention)
- `text-primary-foreground` (indicator icon) → `text-palette-contrast`
- `data-[state=checked]:bg-primary` → `data-checked:bg-palette-base`
- dark theme blocks → eliminated (palette handles both themes)

## Architectural Claims Proven

### 1. Composable palettes
- Destructive tone on menu items: `className="palette-danger"` — no prop, no
  variant, no dark theme block. The `highlighted:bg-palette-soft` and
  `text-palette-accent` rules resolve against whichever palette is active.
- Invalid state on fields: `data-invalid` on Field.Root activates
  `palette-danger` via the themes' `[data-invalid]` applier — the whole
  subtree (row, body, addon, control) becomes danger with no extra class.
- Chart re-colours on palette switch: the `useThemeTokens` hook re-reads on
  theme change, and the chart tokens are derived from `--palette-base`.

### 2. Style families
- Dropdown Menu and Context Menu share the same `menu` source via
  `createMenuParts(P)` — a factory that takes a Base UI namespace and
  returns 13 styled wrappers. Each component declares only Root, Trigger,
  Content and SubContent.
- Checkbox, Radio and Switch share the `choice` family — 5 members, zero
  variants. Each component overrides only what differs (Radio adds
  `rounded-full`, Switch adds `w-9 h-5 rounded-full` and a thumb translate).
- Installing `context-menu` after `dropdown-menu` writes exactly one file.
  Installing `select` after `dropdown-menu` and `field` writes exactly one
  file. The shared families are already on disk.

### 3. Control/body separation
- One input component (`Input`) used bare, in a group with addons, and with
  an inset icon — no second borderless input anywhere.
- `Numeric` is a control written from scratch with no box styling — no
  border, background, height, focus ring, invalid state or theme. All of
  that lives on the `field.row` that wraps it.
- `Textarea` reuses the same `field.control` — the box grows with content
  without a size variant.
- `Select.Trigger` is a `field.row` + layout — the same box, the same focus
  ring, the same invalid state as a text input.

## Stop Conditions Encountered

None. No contract changes, no new families or roles, no `!important`, no
Base UI reimplementation, no new runtime dependencies beyond what the
validation POC already used (`@base-ui/react`, `lucide-react`, `echarts`,
`echarts-for-react`).

## Verification

| check | result |
|-------|--------|
| `pnpm check` | 0 errors, 2 infos (suggestions, not errors) |
| `pnpm typecheck` | 0 errors |
| `pnpm test` | 50/50 passed |
| `pnpm build` | compiled successfully, 14 static pages |
| `pnpm registry:build` | 23 items built |

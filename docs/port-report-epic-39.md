# Port Report — Epic #39: The Palette Goes on the Element

## Summary

Four issues, one Epic: the `surface-*` tier was redefined from "tinted surfaces"
to "neutral surfaces with a chromatic focus ring," and all 28 examples were
rewritten to follow a single principle — **the palette class goes on the
element itself, not on a wrapping context.** The preview harness that wrapped
examples in palette cells was retired; examples are now self-contained
published source.

1. **Issue #40** — `surface-*` redefined: neutral surface + chromatic ring
2. **Issue #41** — Field-family examples (5): field, input, choice, select, combobox
3. **Issue #42** — Colour-axis examples (4): clickable, badge, progress, slider
4. **Issue #43** — Neutral examples (19) + preview harness retired + this report

## The Principle

Before: a `PaletteGrid` wrapper rendered the example once per palette, each
occurrence inside a cell carrying `palette-${name}`. The example itself was
palette-agnostic — it read roles from an inherited context.

After: each example declares its own floor (`palette-surface`) and applies
palette classes directly to the elements that carry colour. The example is
self-contained — copy it, paste it, it works. No import of docs-site chrome.

The one exception is the `surface-*` tier: a field is a surface, not a coloured
element, so field-family examples use `palette-surface-*` — neutral frames whose
only chromatic expression is the focus ring.

## Issue #40: surface-* Redefinition

### What changed

The `surface-*` palettes were "tinted surfaces" — every role carried a faint
hue. They are now "neutral surfaces with a chromatic focus ring":

| Role | Before | After |
|---|---|---|
| `base` | tinted (L0.99 C0.008 H) | neutral (identical to `surface`) |
| `soft` | tinted (L0.95 C0.02 H) | neutral (identical to `surface`) |
| `line` | tinted (L0.90 C0.03 H) | neutral (identical to `surface`) |
| `contrast` | tinted (L0.28 C0.06 H) | neutral (identical to `surface`) |
| `accent` | tinted (L0.28 C0.06 H) | neutral (identical to `surface`) |
| `ring` | tinted (L0.55 C0.18 H) | **chromatic** (from corresponding chromatic palette) |

The ring is the only role that differs from `surface`. It adopts the literal
chromatic value from the corresponding chromatic palette's `base` role — so
`surface-blue` has the same ring as `blue`.

### Why

A field is a surface, not a coloured element. The old tinted surfaces leaked
colour into every role, making fields look like they belonged to a palette
they didn't. The redefinition makes the frame neutral and reserves the
chromatic expression for the focus ring — the one moment the field states its
theme.

### Guard tests

New guard tests in `tests/palette-contract.test.ts` assert that every
`surface-*` palette's `base`, `soft`, `line`, `contrast`, and `accent` roles
are identical to the `surface` palette's corresponding roles, in both themes.
The `ring` role is asserted to be chromatic (different from `surface`).

### Files modified

- `apps/www/registry/styles/palettes/surface-{blue,purple,green,orange,rose}.css`
- `apps/www/tests/palette-contract.test.ts` — new guard tests
- `apps/www/tests/palette-utils.ts` — helpers for the new guards
- `apps/www/registry.json` — registry metadata updated
- `apps/www/content/docs/architecture/palettes.mdx` — docs updated
- `apps/www/content/docs/architecture/theming.mdx` — docs updated
- `docs/architecture.md` — stale "tinted surfaces" claims removed
- `AGENTS.md` — stale contrast worst-case (4.58:1) updated

## Issues #41 + #42: Field-family and Colour-axis Examples

### Pattern

Every example follows the same structure:

```tsx
export default function FooDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            <Row label="palettes">
                {CHROMATIC.map((palette) => (
                    <Foo className={`palette-${palette}`} ... />
                ))}
            </Row>
            <Row label="states">...</Row>
        </div>
    );
}
```

- The floor is `palette-surface` — a neutral surface that belongs to no palette.
- Each element carries its own `palette-*` class.
- A `Row` helper labels each axis (variants, states, palettes).
- The `CHROMATIC` / `SURFACE_RING` arrays are literal in the example — no
  import of docs-site chrome.

### Field-family examples (#41)

| Example | Floor | Palette class on | Axes shown |
|---|---|---|---|
| field | `palette-surface` | `Field.Root` (`palette-surface-*`) | palettes, states (default/invalid/disabled/required) |
| input | `palette-surface` | `Field.Root` (`palette-surface-*`) | palettes, composition (bare/addon/inset), template, states |
| choice | `palette-surface` | `Field.ChoiceRoot` (`palette-surface-*`) | palettes, checkbox states, radio group, switch states |
| select | `palette-surface` | `Field.Root` (`palette-surface-*`) | palettes, groups, states (disabled/invalid) |
| combobox | `palette-surface` | `Field.Root` (`palette-surface-*`) | palettes, grouped, multiselect, states |

The `Combobox.Label` console warning was fixed: `Field.Label` is used instead,
since `Combobox.Input` is the form control (not `Combobox.Trigger`).

### Colour-axis examples (#42)

| Example | Floor | Palette class on | Axes shown |
|---|---|---|---|
| clickable | `palette-surface` | `Clickable.Button` (`palette-*`) | variants (solid/ghost/outline/icon), sizes, with icon, as link |
| badge | `palette-surface` | `Badge` (`palette-*`) | variants (soft/solid/outline), with icon |
| progress | `palette-surface` | `Progress.Root` (`palette-*`) | palettes, value (0/mid/100), indeterminate |
| slider | `palette-surface` | `Slider.Root` (`palette-*`) | palettes, range, steps, disabled, vertical, in field |

### Badge variant names

The Badge `tv()` defines `soft` / `solid` / `outline` (not `default` / `solid` /
`outline`). The `soft` variant is the default. The examples use the correct
names.

## Issue #43: Neutral Examples + Preview Harness Retirement

### Neutral examples (19)

| Example | Floor | Axes shown |
|---|---|---|
| accordion | `palette-surface` | multiple open, single open, disabled item |
| alert-dialog | `palette-surface` | destructive confirm, non-destructive |
| avatar | `palette-surface` | with image, fallback, broken image, sizes |
| breadcrumb | `palette-surface` | basic, with ellipsis, custom separator |
| chart | `palette-surface` | line, bar, pie (donut) |
| collapsible | `palette-surface` | default closed, default open, disabled |
| context-menu | `palette-surface` | basic + submenu, destructive item |
| dialog | `palette-surface` | form dialog, scrolling body |
| drawer | `palette-surface` | right, left, bottom + snap points |
| dropdown-menu | `palette-surface` | basic + grouped label, destructive, advanced |
| navigation-menu | `palette-surface` | morphing popup, plain link |
| pagination | `palette-surface` | basic, with ellipsis, previous disabled |
| popover | `palette-surface` | with form, no close button |
| separator | `palette-surface` | horizontal, between content, vertical |
| skeleton | `palette-surface` | card, avatar + text, table rows |
| table | `palette-surface` | caption, header, body, footer |
| tabs | `palette-surface` | horizontal, disabled tab, vertical |
| text | `palette-surface` | headings, paragraph + inline, label + error + link, worn heading, secondary text, Text.Clickable |
| tooltip | `palette-surface` | provider coordinates delay |

### Broken examples fixed

**dropdown-menu-demo.tsx** — `MenuGroupContext is missing` error. The
`DropdownMenu.Label` part wraps `MenuPrimitive.GroupLabel`, which requires a
`MenuGroupContext` from Base UI. The label was used directly inside
`DropdownMenu.Content` without a wrapping `DropdownMenu.Group`. Fixed by
wrapping the label and its items in a `DropdownMenu.Group`.

**chart-demo.tsx** — `Can't get DOM width or height` error. The Chart wrapper
div has `w-full` only; ECharts reads `height: 100%` from its parent, which
collapsed to zero inside the PaletteGrid's `flex-1` cell. Fixed by adding
`className="h-full"` to each `Chart` so the wrapper div inherits the parent's
`h-72`. (The example is now on a `palette-surface` floor, not in a PaletteGrid,
but the `h-full` is still needed since the Chart wrapper has no height of its
own.)

### Preview harness retired

Deleted:
- `apps/www/components/preview/palette-grid.tsx` — the `PaletteGrid` component
- `apps/www/lib/palette-sets.ts` — the `CHROMATIC`, `SURFACES`, `ALL` constants

Updated:
- `apps/www/components/preview/index.ts` — removed `PaletteGrid` export
- `apps/www/components/mdx.tsx` — removed `PaletteGrid` from MDX registry
- `apps/www/tests/preview.test.ts` — removed "palette sets agreement" test
  (the palette-contract test already asserts directory/set agreement); kept
  the example resolution guard

`ComponentPreview` is NOT retired — it is the server component that renders
examples on doc pages. It is still used by every component page.

### Test count

| Before | After | Delta |
|---|---|---|
| 180 | 249 | +69 |

The +69 comes from:
- +70 new guard tests for the `surface-*` redefinition (Issue #40)
- -1 removed "palette sets agreement" test (Issue #43)

## Verification

All verification commands pass:

| command | result |
|---|---|
| `pnpm check` | clean |
| `pnpm typecheck` | clean |
| `pnpm test` | 249 passed (4 files) |
| `pnpm build` | clean (42 static pages) |
| `pnpm registry:build` | clean (53 items) |

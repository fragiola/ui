# Port Report — Epic #16: Overlay and disclosure surfaces

## Summary

Epic #16 extended the Fragiola component surface with overlay and disclosure
layers: clickable elements (the button surface), layers (dialog,
alert-dialog, drawer), popups (tooltip, popover), disclosure (accordion,
collapsible), and general-purpose components (badge, breadcrumb).

**11 new components, 3 new style families, 1 new atom.** The palette
contract (6 roles), the zero-variant rule, and the `render` composition
mechanism held across all of it.

## What was built

### Issue #17 — clickable atom + text docs page

- **`clickable`** atom (`registry/atoms/clickable/index.tsx`): Button, Link,
  ExternalLink under one namespace. Three orthogonal axes (variant:
  solid/ghost/outline/icon, size: sm/md, shape: auto/square), none of which
  is colour. Tone arrives as a palette class; there is no
  `variant="destructive"` and no `tone` prop. `md` equals `h-control` so a
  button sits flush next to a field. Link is a plain `<a>` stitched to a
  router through `render`; ExternalLink is a separate export for its
  outbound defaults.
- **`text` docs page**: documents what Text is for (the target every
  component points at through `render`), the secondary-text value
  (`text-palette-accent/85`), and `Text.Clickable` vs `Clickable.Button`.

### Issue #18 — layer family + dialog, alert-dialog, drawer

- **`layer`** family (`registry/families/layer.ts`): backdrop, panel, header,
  body, footer, title, description. Zero variants. The backdrop uses
  `bg-scrim` (outside the palette contract — a scrim is not a role). The
  panel is `palette-raised`. title/description carry no typography (Text
  through `render`).
- **`createLayerParts`** factory (`registry/families/layer/parts.tsx`): takes
  a Base UI overlay namespace (Dialog or AlertDialog) and returns the styled
  wrappers. AlertDialog reuses Dialog's Backdrop, Popup, Title, Description,
  Close, Portal, Viewport at runtime (7/9 parts identical). Installing
  alert-dialog after dialog writes exactly one file.
- **`dialog`** (`registry/ui/dialog.tsx`): a modal layer — centred panel over
  scrim. Declares only Root, Trigger, Portal and the centring transform.
- **`alert-dialog`** (`registry/ui/alert-dialog.tsx`): the proof that `layer`
  is a family. Declares only what genuinely differs: the namespace,
  `showClose={false}`, the action/cancel pair.
- **`drawer`** (`registry/ui/drawer.tsx`): an edge-anchored layer with real
  swipe and snap-point support. Consumes `layer` directly but is not built
  from the factory — it has its own Viewport, Handle and a transform-based
  positioning model. The inline edges invert under RTL. This is why `sheet`
  does not exist: an edge-anchored dialog and a drawer are the same
  component.

### Issue #19 — popup generalisation + tooltip, popover

- **`popup`** family gained a second member: `tooltip`. `content` is the
  menu/popover floating box (raised surface, border, shadow, zoom). `tooltip`
  is a transient text label (inverted palette — `bg-palette-accent
  text-palette-base` — no border, no shadow, compact padding, fade-only).
  Two members, not two variants: a menu list and a text label are genuinely
  different things.
- **`tooltip`** (`registry/ui/tooltip.tsx`): composes `popup.tooltip` and
  wraps Portal + Positioner + Popup. Provider coordinates delay between
  siblings.
- **`popover`** (`registry/ui/popover.tsx`): composes `popup.content` (the
  same floating box dropdown-menu uses) and adds Title, Description and
  Close through `render`. Uses `popup.content`, not `layer.panel` — a
  popover is positioned by a positioner; a dialog panel is not.

### Issue #20 — disclosure family + accordion, collapsible

- **`disclosure`** family (`registry/families/disclosure.ts`): trigger,
  panel, content. Zero variants. trigger is the toggle button (`group` for
  chevron rotation, w-full, justify-between, logical padding). panel is the
  animated container (overflow-hidden, data-starting-style/data-ending-style
  fade). content is the inner padded content (p-4 pt-0).
- **`accordion`** (`registry/ui/accordion.tsx`): a group of expand/collapse
  items with coordination. Declares only Root, Item, Header.
- **`collapsible`** (`registry/ui/collapsible.tsx`): a single expand/collapse
  section. Both share the same trigger, panel, content — the only difference
  is coordination (behaviour, not style).

### Issue #21 — badge, breadcrumb

- **`badge`** atom (`registry/atoms/badge/index.tsx`): one axis (variant:
  soft/solid/outline), none of which is colour. Tone arrives as a palette
  class — the same discipline as Clickable.
- **`breadcrumb`** (`registry/ui/breadcrumb.tsx`): a navigation trail.
  Semantic nav + ordered list. No variants — visual differences are
  composition. Ellipsis for collapsed items.

## Decisions recorded

### `bg-scrim` is outside the palette contract

A scrim is not a role — it is an absence of one. `--color-scrim` is declared
in `global.css`, deliberately outside the 6-role contract. Do not invent a
palette for it and do not add a seventh role.

### `layer.panel` and `popup.content` are separate

The overlap (raised surface, border, radius, shadow) is checked, not
assumed. A popup is positioned by a floating-ui positioner and sized by
`--available-height`; a panel is not. Unifying them would couple a modal
surface to a positioner it does not use. They stay separate.

### `sheet` does not exist

An edge-anchored dialog and a drawer are the same component, and the
behaviour library ships a real Drawer with swipe, snap points and a
viewport. Two items would be exactly the duplication this project removes.

### `popup.tooltip` is a member, not a variant

`content` and `tooltip` are genuinely different things — a menu list and a
text label. The zero-variant rule says variation becomes a named member;
this is that rule applied.

### The disclosure trigger is not a Clickable variant

The trigger is a disclosure-specific layout (w-full, justify-between,
chevron rotation) that the behaviour primitive wears directly. The primitive
already provides button semantics (aria-expanded, aria-controls); composing
through Clickable.Button would add a layer without adding anything the
trigger needs.

### The drawer is not built from `createLayerParts`

It has its own Viewport, Handle and a transform-based positioning model that
the dialog does not share. A factory for one component would be padding.

## Verification

All verification commands pass:
- `pnpm check` — Biome lint + format (only 2 pre-existing `useTemplate` infos
  in `build-registry.ts`)
- `pnpm typecheck` — TypeScript, no emit
- `pnpm test` — 50 guard tests (palette-contract + compile)
- `pnpm build` — Next.js production build (30 static pages)
- `pnpm registry:build` — 35 registry items

Tailwind class compilation verified for all new classes: `bg-scrim`,
`palette-raised`, `group-data-[panel-open]:rotate-180`,
`data-[panel-open]`, `data-starting-style`, `data-ending-style`,
`slide-in-from-*`, `slide-out-to-*`, `rounded-s-none`, `rounded-e-none`,
`h-control`, `bg-palette-base-hover`, `max-h-(--available-height)`,
`origin-(--transform-origin)`, `max-w-72`.

# Port Report — Epic #88: Splitter, the Second Special Component

## Summary

Two issues, one Epic: Splitter (`@fragiola/splitter-react`, published at 0.1.0) arrives
in the registry as the second **styled layer over a published package**, under the
special component rules S1–S8 that Epic #85 generalized from Dockable. It is the first
item to follow them from the start, and none of them had to change.

1. **Issue #86**: the `split` family, the styled `Group`, `Panel` and `Separator` plus a
   `Grip`, the `splitter` item pinned to `^0.1.0`, the release-age exclusion, a
   pinned-class test and three dev scenarios.
2. **Issue #87**: `Splitter.Template.Simple`, two public examples, the docs page, the
   Special overview row, a template scenario, the architecture update and this report.

## Baseline vs result

The baseline is the splitter repository's `styling-showcase` example
(`../splitter/examples/react/src/examples/styling-showcase/`), the one example that
styles every state: a wide hit area with a line and a grip, the cursor from
`data-orientation`, hover, drag and focus colours, the group dimmed while dragging.

| | `styling-showcase` | Fragiola |
|---|---|---|
| Styled layer | `styles.ts`, 76 lines, for one page | 1 family: `split.ts`, 55 code lines, 6 `tv()`, for every page |
| Separator style | 13 lines (`separator`), copied in 25 of the repo's examples' `styles.ts` | 1 member (`split.separator`) |
| Grip | a `GripVertical` icon in a bordered pill, written per separator | `Splitter.Grip`, put in each separator by the template |
| Shape tokens | 18 distinct `--sp-*` in this example (20 across the repo), set by 5 theme files (661 lines) | 0: the spacing scale, `rounded-pill`, the six roles |
| Palettes | `palette-surface` plus one chromatic palette per panel | the one in scope; none declared, none added |
| `!important` | 0 | 0 |
| Markup for a nested split view | 79 lines (`index.tsx`), a separator and its grip written per pair | `Template.Simple`: 2 props, separators generated |

**The comparison is unfair in one direction, and this report says so.** The repo's
examples copy their styles on purpose: each is a self-contained page meant to be read
and copied, and its five themes show that the primitives take any look. The number that
matters is the one a reader of this library gets: **one** source of style for every
split view, and a split view whose separators the template writes.

**What did not shrink:** nothing much was there to shrink. `parts.tsx` is 70 code lines
(three wrappers keeping the generic type, the function `className` and `render`, plus
the Grip), and the template 41.

## Reuse (S4)

| Value | Shared with | Note |
|---|---|---|
| the rule: `bg-palette-line`, `w-px` / `h-px` by `data-orientation` | `ui/separator.tsx` | same semantics: `vertical` is a vertical rule; pinned on both sides by a test |
| `cursor-ew-resize` / `cursor-ns-resize`, `ring` on drag and on focus, `z-10` | `dock.splitter` | pinned on both sides by a test |
| the grip's shape: `h-1.5`, `rounded-pill` | the drawer's handle (`ui/drawer.tsx`) | `rounded-pill` follows the radius axis; `rounded-full` would not |
| `text-sm`, `text-palette-contrast` on `bg-palette-base` | `dock.root` | the panel's text follows the typography axis set on a subtree |

**Not shared, and why:**

- **The hover.** `dock.splitter` hints with `ring/40` on a 2px bar that is invisible at
  rest, because Dockable's splitter is a 6px transparent gap between bordered tabsets.
  Two panels of a split view touch, so the rule is visible at rest (`line`), and a
  `ring/40` over it would barely change a 1px rule: hover turns it to full `ring` and
  shows the grip.
- **The thickness.** Dockable's engine measures a 6px splitter. Splitter's measures the
  element, so the element is the 1px rule and the hit area is its `::before`, outside the
  measured box: 6px on each side at the default density (`-inset-x-1.5`), 4.8px under
  compact, 7.2px under spacious. The focus bar is its `::after`, 3px.
- **The palette.** `dock.root` declares `palette-surface` because one root owns the
  layout. Groups nest: a declared palette on every group would be redeclared by a nested
  group and swallow a swap on the outer one. `split` declares none, so a palette class on
  any group re-tints it and every group inside.

## The `split` family

| member | part | reads |
|---|---|---|
| `group` | `Group` | `data-dragging` (no text selection); names `group/splitter` |
| `panel` | `Panel` | `data-collapsed` (the `soft` fill) |
| `separator` | `Separator` | `data-orientation`, `data-dragging`, `data-disabled`, `:hover`, `:focus-visible`; names `group/separator` |
| `grip` | `Grip` | the separator's state, through `group/separator` only |
| `expanded` | a panel's content | `in-data-collapsed:hidden` |
| `collapsed` | a panel's content | `not-in-data-collapsed:hidden` |

Zero variants. No member sets what the primitives set inline (the group's flex
direction, a panel's flex size and overflow, a separator's flex-grow and touch-action):
`tests/split.test.ts` pins it.

## Decisions

- **Family name `split`** (the Epic's recommendation): it names the visual (a split
  view) as `dock` does, not the package.
- **The grip is a child the template renders**, not a member of the separator (the
  Epic's recommendation): a bare `Splitter.Separator` stays a plain rule, and `Grip` is
  one more part, as Dockable added `TabSetHeader` and `TabLabel`.
- **`collapsible` and a disabled panel have no look of their own.** What they allow
  shows on the separator (its cursor, Enter). `collapsed` steps the panel to `soft`, and
  two members let its content follow it.
- **A disabled separator keeps its rule** and loses its resize cursor, its hover and
  the grip, instead of a `cursor-not-allowed` the package's guide suggests: the cursor
  comes from `not-data-disabled:data-[orientation=…]:`, so no two variants of equal
  specificity fight over it.
- **The default name is "Resize"**, as Dockable's splitter. A page with several
  separators names each by composing the parts; the template has no per-separator name
  prop, which would be configuration the parts already offer.
- **No size on the group.** The package says a group's size is the consumer's, and the
  Epic forbids geometry on Group and Panel, so a nested group needs `h-full`, inside
  Template.Simple too. The docs page and the examples say it.

## Verification

- `pnpm check`, `pnpm typecheck`, `pnpm test` (the compile guard covers `split.ts`;
  `split.test.ts` pins the family), `pnpm build`.
- `pnpm registry:build`: `dist/r/splitter.json` depends on `@fragiola/splitter-react@^0.1.0`;
  `pnpm registry:smoke` passes in all four scaffolds and the CLI asks for exactly that range.
- `pnpm site:export --base /ui`: valid (contract v1.3), 34 examples;
  `check:embeds`: every example passes in the frame.
- Playwright, on the scenarios and the examples: light and dark; a surface-ring and a
  chromatic palette on the group (rule, ring, grip and panels re-tinted, nested group
  included); compact and spacious density (hit area 4.8px / 7.2px per side, a hover 4px
  from a compact rule still lands); `dir="rtl"` (the first panel on the right, ArrowLeft
  grows it); radius, text and motion on a frame (`motion none`: 0s transitions); pointer
  drag (`data-dragging` on the separator and its group), arrows, Enter to collapse and
  expand (the rail at 48px, its labels hidden, the `soft` fill), a drag past the minimum
  collapses; a disabled group (no cursor, no hover, out of the tab order); a conditional
  panel in Template.Simple adds and removes its separator.

## Follow-ups

- **Shared with the next special Epics.** The separator's values (a 1px `line` rule, a
  `::before` hit area of `-inset-x-1.5`, `ring` on hover, drag and focus, a 3px focus
  bar on `::after`, `ew-resize` / `ns-resize`) are what a Data Grid column resizer would
  want. If it lands, compare it with `split.separator` first (S4) and share the values.
- **A layout's palette and nesting.** `dock` declares its palette on its one root;
  `split` declares none because it nests. A Tree or a Grid Layout with nested parts
  should follow `split`.

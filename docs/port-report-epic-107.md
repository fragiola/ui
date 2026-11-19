# Port Report — Epic #107: One Visual Language

## Summary

The registry held together as an architecture, with palettes, families and axes, but not
as a design. Each family answered the same visual questions in its own words, and the
components read as several design systems. This Epic writes the answers down
(`docs/visual-language.md`), gives them one home (the `foundation` family) and brings
every component and example to them.

1. **Issue #104** created the foundation and a neutral action palette, and brought the
   controls to them:
   - **`families/foundation.ts`**: focus, `focusInset`, `fieldFocus`, `focusNested`,
     `box`, `hover`, `highlighted`, `checked`, `rail`, `knob`, `disabled` and
     `secondary`.
   - **`palette-neutral`**: the default action palette.
   - **The controls** compose them: field, choice (now actually used by checkbox, radio
     and switch), track, clickable, select, combobox, slider.
   - **Review and guard**: the dev-only coherence sheet, and `tests/foundation.test.ts`.
2. **Issue #105** brought everything else to the language:
   - **New variants** `current` and `selected` (global.css), and new foundation members
     `current`, `selected`, `hoverRow`, `panel` and `overlay`.
   - **Covered**: menus, popups, layers, disclosure, tabs, pagination, breadcrumb,
     navigation menu, sidebar, table, and the `dock`, `sheet`, `tree` and `tile`
     families.
   - **The guard's pending list is empty.**
3. **Issue #106** brought the examples and the docs to one standard:
   - **Examples**: one standard (a realistic use in the default look, then one `palettes`
     row), applied to every example.
   - **Landing**: the interactive "one class" demonstration.
   - **Docs**: the "No colour variants" callout on the nine component pages where colour
     matters, and the foundation in Style families.
   - **Registry fixes** found by the restyle: error text colour, the mixed checkbox's
     dash, the disabled slider, underlined links.

## What was divergent, and what it became

| question | before | after |
|---|---|---|
| control surface | field row filled `soft`; select, accordion and outline button outlined | one `box`: `line` stroke, transparent, value in `accent` |
| focus ring | offset 0 (field), outline-1 offset-1 (choices), offset 2 (tile), none drawn (menus that reset the outline) | one 2px `ring`: outside, or inset for items in a list |
| "on" | checkbox `ring`, progress and slider `base` (white on a neutral floor) | `ring` everywhere |
| switch off | `soft` track, invisible on white | `line` rail |
| current item | tabs `soft` + bottom border, pagination outline, sidebar `soft` + weight | `current`: `soft`, `contrast`, `font-medium` |
| selected row | tree `soft`, grid `soft`, table `soft`, each hover different | `selected`, and `hoverRow` (half `soft`, opaque) |
| overlay | popup `shadow-md`, layer `shadow-lg`, layer motion 300ms | `overlay`: one edge, `shadow-lg`; layers 200ms |
| accordion | a stack of outlined boxes | one `panel` with dividers |
| placeholder | `accent/60` (against AGENTS.md) | `accent/85` |
| default action | blue everywhere | `palette-neutral` |

## Decisions recorded

- **Outlined, not filled.** A transparent box reads as part of any floor, and it keeps
  the invalid state working by inheritance: under `palette-danger`, `soft` would have
  been a red block. `soft` now means a state, or a recessed adornment (an addon, a table
  header).
- **A neutral palette, not a role.** Rule 1: the number of palettes is free. Its six
  roles pass the contrast guard in both themes.
- **No outline reset in the foundation.** In Tailwind 4, `outline-none` sets the outline
  style that `focus-visible:outline-2` inherits, so the ring never showed. The menu
  tests already pinned this for `menu.item`.
- **What the guard leaves to review.** A library's own focus target, its drag-and-drop
  outlines and its conditional hovers are its own vocabulary (architecture.md §2). They
  keep the ring's values by review.
- **The one-class demo has two tiers and one name.** A solid element takes
  `palette-<colour>`, and a control on the floor takes `palette-surface-<colour>`. Both
  are a class swap, and nothing in a component changes.

## Not done

- A disabled switch's track is faint in dark (`line` at 50% opacity). This is acceptable
  for now, and noted for the Theme Builder Epic's review of the axes.
- The special examples render on the host's floor, with no `palette-surface` root of
  their own, as before.
- There is still no automated visual test. The coherence sheet is a review surface, not
  a snapshot.

# Port Report — Epic #111: Theme Builder

## Summary

Developers can now see a design before they build it. Fragiola's counterpart to
shadcn's `/create` is a public example, `theme-builder`. A customizer sits beside a
sample of the registry's components:
- **Colour**: a preset or any hue, with chroma and neutral tint.
- **Axes**: the five design axes at every level.
- **Preview**: light/dark and LTR/RTL.

It hands back the CSS and the attributes that reproduce the design.

1. **Issue #108: `generatePalette` and `serializePalette`**, a new registry helper,
   `colour` (`lib/colour/`, no colour library).
   - From one hue it builds the palette pair a colour needs: `palette-<name>` and its
     surface twin.
   - The pair covers both themes and all six roles, and is checked against the rules
     the contrast guard enforces.
   - The guard now imports the same maths (`lib/colour/contrast.ts`), so a generated
     palette and a shipped one are measured identically.
2. **Issue #109: the `theme-builder` example and the `theme-builder-edges` scenario.**
3. **Issue #110: the docs.**
   - A new page, `getting-started/theme-builder`, with its sidebar entry.
   - Links from design-axes (which no longer says there is no control), palettes,
     theming and the landing.
   - The AGENTS.md Playground note.

## Decisions recorded

- **The generator is a registry item, not a module beside the example.** An example is
  one file (the manifest refuses relative imports), and the Epic's plan put the
  builder's parts in their own folder. The repository rule wins. The palette logic
  ships as `@fragiola/colour`, imported through `#/`, which makes it useful at runtime
  too. The example stays one file.
- **Chroma is not clamped to sRGB.** The shipped palettes are not either
  (`oklch(0.55 0.2 250)` is outside it), and clamping made a generated blue visibly
  duller than the shipped one. Chroma is capped at the template's level times
  `vivid`.
- **Warm hues (45–115) take dark text on a light base**, the way `palette-orange` is
  built. In OKLCH, L 0.55 always clears AA with white, so a "yellow" there is olive.
- **Axes on `<html>`, restored on unmount.** Menus and dialogs portal to `<body>`, and
  only `<html>` reaches them. The customizer itself follows the axes, as it is built
  from the same components.
- **The builder's scheme toggle writes the same attributes the host's theme messages
  write**, so the last one wins.
- **Compact controls.** In the 720px docs column the options are selects, laid out in
  a two-column grid, and the copy panel follows the sample.
- **The validator stays on contract v1.3.** The page uses no v1.4 feature.

## Not done

- No share URL, presets, shuffle or undo (out of scope).
- The builder is limited to the docs column on a page. Fullscreen in the gallery is
  the wide view. A full-width route would need a www contract change.

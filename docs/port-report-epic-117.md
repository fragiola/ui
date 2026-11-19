# Port Report — Epic #117: Create

## Summary

The theme builder is now what shadcn's `/create` is: a dedicated full page, served at
fragiola.com/ui/create/ (www contract v1.6, fragiola/www Epic #66). It lives outside the
docs and is drawn in the docs' own style:
- a frame, with the customizer on it where the docs sidebar sits;
- an inset panel holding the preview;
- the scroll inside the inset, on both axes. The page itself never scrolls.

1. **Issue #114: the Create app.**
   - Two pages of the embed app: `create.html` (the shell, the customizer and Get code) and
     `create-preview.html` (the sample), with code in `examples/react/src/create/`.
   - **Isolation:** the preview is a separate document. The customizer posts the design
     (`fragiola:create:design`), and only the preview applies it to its own `<html>`. An
     axis, the preview's scheme or its direction never reach the customizer, and
     `check:create` proves it.
   - **Export:** `project.json` declares `create`, and the ui validator moves to v1.6
     (`create` shape, framework and file, plus the `/create` link).
2. **Issue #115: the preview.** 67 cards (charts, forms, data, status, navigation,
   overlays, settings and the rest) on 10 columns of 380px. The canvas is about
   4,000 × 3,000 px, so it overflows a 3,840 × 2,160 viewport on both axes.
3. **Issue #116: the docs.** The `theme-builder` example and the
   `getting-started/theme-builder` page are removed, and every link points to `/create`.
   The landing gets a "Create your theme" action. The runtime helper is documented in
   `palettes.mdx`.

## Decisions recorded

- **The preview is an iframe.** An axis is a `data-*` on `<html>`, and only `<html>`
  reaches portalled popups. So a separate document is the only way a design reaches the
  preview's menus and dialogs without touching the customizer. It is also shadcn's model.
- **The Create pages are app files, not examples.** The one-file rule of examples does not
  bind them, so they are split by responsibility (`design`, `shell`, `customizer`,
  `output`, `preview`).
- **Cards are grouped by domain, one file per group.** `cards/charts.tsx`, `forms.tsx` and
  the rest hold 67 components, one per file group rather than one per file (the Issue's
  suggestion). Each group shares its local helpers.
- **Charts are keyed by the design's version.** The registry's chart wrapper re-reads the
  palette only on a `data-theme` change, and a generated palette changes its CSS, not that
  attribute. The preview remounts the charts instead of changing the registry.
- **Isolation is tested by fingerprint.** `check:create` compares every computed style of
  the header and the customizer before and after extreme axes, the dark scheme and RTL.
  Only the five pickers' own state may differ.
- **The ui validator lists v1.6**, and does not check the v1.4 and v1.5 fields (sidebar
  icons, adapters), which this project does not use.

## Not done

- Shareable URLs and presets (out of scope).
- The chart wrapper still does not follow a palette's CSS changing in place. That would be
  a registry change: observing the palette's `<style>`, or a `version` prop.

## Addendum — Epic #122: Create polish

The review of the first Create page found six problems. Each was fixed:

1. **The inset was not visible.** The frame's `color-mix` read
   `var(--color-palette-soft)`. Tailwind declares that variable once on `:root`, where no
   palette is applied, so it resolved to nothing and the frame was transparent. The row
   hover (`hoverRow`) and the data grid's active row were dropped the same way. Arbitrary
   values now read `--palette-*`, and a guard test refuses `var(--color-palette-…)`.
2. **The bottom of the canvas was empty.** Fixed column lists ended at different heights.
   The masonry now deals every card into the shortest column by measured height, and
   `check:create` keeps the spread under 400px.
3. **The special components were missing, and modals opened inside the iframe.**
   - A band of wide panels (Dockable, Data Grid, Grid Layout, Tree with Splitter) now
     leads the canvas.
   - Modals cover the whole page. The preview speaks the embed half of overlay promotion
     (§5.4), and the Create page is its host. The stage became the preview's scroller, so
     pinning it keeps the scroll and the canvas does not move.
4. **The preview opened light.** It now opens in the host's scheme and follows it until
   the reader picks one.
5. **The cards were the same colour as the floor.** In light the canvas is `soft` and the
   cards `base` with a shadow; in dark the canvas is `base` and the cards are raised.
6. **Neutral charts were pale blue.** The series derivation forces a chroma of 0.14, so
   the achromatic palettes (neutral, surface, raised) now declare grey series and ramps.

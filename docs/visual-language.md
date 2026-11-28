# Fragiola UI — Visual language

`architecture.md` says how the registry is built: palettes, families, composition and
axes. This page says how the components **look**: one answer to each visual question
that every component gives in the same way.

Before it existed, each family answered these questions in its own words, and each
answer was defensible on its own:

- the field was a filled `soft` box, while the select trigger and the outline button
  were outlined;
- the field drew its focus ring at offset 0, checkbox, radio and switch at offset 1
  with a 1px outline, and the slider's thumb at 2px;
- a checked box was filled with `ring` and a progress bar with `base`;
- the switch's off track was `soft`, invisible on a white floor.

Together they read as several design systems.

The answers live in one family, **`families/foundation.ts`**. Every other family
composes its members instead of restating them, and `tests/foundation.test.ts` fails
when one writes a foundation idea itself. Changing an answer means changing it there,
and it changes everywhere.

## Surfaces

| tier | what | treatment |
|---|---|---|
| floor | the page, the app shell's content | `palette-surface`, `bg-palette-base` |
| panel | a container on the floor: an accordion, a collapsible, a data grid, a dock panel | the floor's `bg-palette-base`, a `line` border, `rounded-lg` (`panel`) |
| raised | a card that stands on the floor: a Card, a tile, the inset sidebar | `palette-raised`, `bg-palette-base`, a `line` border, `rounded-lg`, `shadow-sm` (`raised`) |
| overlay | a popup, a menu, a popover, a dialog, a drawer | `palette-raised`, `bg-palette-base`, a `line` border, `rounded-lg`, `shadow-lg` (`overlay`; the elevation axis scales it) |

A frame with cards inside it — the Create page — is two tones, never three and never
`soft` as a fill: the frame is `palette-raised`, a step above the floor; inside it the
canvas and the cards share `palette-surface`, and a card stands apart by its `line`
border and its shadow, not by a colour of its own. A third neutral between them read
as a muddy grey in both schemes, and was removed (`palette-canvas`, Epic #133).

A container never paints with `soft`. `soft` is a **state** (hover, highlighted,
selected) or a recessed adornment inside a control: a field's addon, a table's header,
inline code.

## The control box (`foundation.box`)

Every control is the same box: a `line` stroke on a **transparent** background, with
its value in `accent`. That covers:

- the field row;
- the select and combobox triggers;
- an outline button;
- an unchecked checkbox and radio;
- an alert: its colour is the palette class on it, so `palette-danger` makes it a red stroke
  with red text, as an invalid field;
- a slot of an OTP field: each slot is one character's box, so the field's box sits on the
  slot's input itself (`field.row` with the `field-control` marker), the one input that is its
  own box, as a checkbox's mark is.

It has the height `h-control`, the radius `rounded-control` (capped at half the height
for the field) and inner padding `px-3`.

- **Transparent, not `soft`.** A box sits on whatever floor it is on (a page, a raised
  card) and reads as part of it. `soft` stays free to mean a state.
- **Value in `accent`, not `contrast`.** The invalid state arrives by palette
  inheritance (`[data-invalid]` applies `palette-danger`), and `danger`'s `contrast`
  is the white meant for a red fill. With `accent` and a transparent box, an invalid
  field is a red stroke with red text, never a red block.
- **Placeholders are secondary text**, `accent/85`, like every other secondary text
  (AGENTS.md).

## Focus

One ring: `outline-2` in `palette-ring`.

| member | where | drawn |
|---|---|---|
| `focus` | a standalone focusable: button, link, trigger, tab | 2px outside (`outline-offset-2`) |
| `focusInset` | an item inside a container that packs or clips it: menu item, list row, tree row, grid cell | 2px inside (`-outline-offset-2`) |
| `fieldFocus` | a box whose control is inside it, or is itself: the field row, a select trigger, checkbox, radio, switch | outside, fired by the `.field-control` marker |
| `focusNested` | a box whose focusable is a nested native input it does not render: the slider thumb | outside |

The ring is drawn outside because `ring` contrasts with what is behind the element
(architecture.md §1), and so it never covers the element's own border.

## States

| state | treatment | member |
|---|---|---|
| hover (a transparent interactive thing) | `bg-palette-soft` | `hover` |
| highlighted (the item the pointer or keyboard is on, in a list) | `bg-palette-soft`, text `contrast` | `highlighted` |
| current (where you are in a set: the active tab, the current page, the active sidebar or navigation link, a pressed toggle, the checked segment of a segmented control) | `bg-palette-soft`, text `contrast`, `font-medium` | `current` |
| selected (what the user chose: tree rows, grid and table rows, a dockable tabset's shown tab) | `bg-palette-soft`, text `contrast` (no weight: a row does not reflow) | `selected` |
| hover on a row of a selectable list (tree, grid, table) | half of `soft`, mixed opaque over the row's `base`, never on a selected row | `hoverRow` |
| checked / on (checkbox, radio, switch, slider fill, progress fill), and mixed (an indeterminate checkbox, with a dash) | `bg-palette-ring`, content in `base` | `checked` |
| off ground (a track's rail, a switch's track) | `bg-palette-line` | `rail` |
| what slides (switch thumb, slider thumb) | `bg-palette-base`, `shadow-sm` | `knob` |
| disabled | `opacity-50`, `cursor-not-allowed` | `disabled` |
| invalid | `palette-danger` by inheritance, nothing else | none (global.css) |

`current` and `selected` are custom variants (global.css), like `highlighted`: each
library spells these states its own way (`data-active`, `aria-current`, `aria-pressed`,
`data-selected`, `data-state="selected"`), and the variant reads them all, so every set is lit the same
way.

**A calendar speaks the same states.** The chosen date (and a range's start and end) is
`checked`, the `ring` box; today is `current`; an unavailable date, one out of bounds or outside
the shown month is `disabled` (unavailable is also struck through); a range's middle is one
`soft` band joined to its ends; a preset matching the value is `selected`. The date fields'
focused segment is `highlighted`, and an empty segment is secondary text, as every placeholder.

**A colour control speaks them too.** Its ground (an area, a wheel's ring, a slider's track, a
swatch) is the colour being picked, the one place a component paints something that is not a
palette role: the primitive's CSS variable. Its thumb is the `knob` with that colour inside and a
`contrast` hairline, readable over white, black and saturated colours; a slider's or a wheel's
thumb is the focusable (`focus`), the area's holds its inputs (`focusNested`). A chosen swatch is
`checked`, a `ring` frame around it.

**A chip speaks them too.** A Combobox's chip, a Tags Input's tag and a Tag Group's tag are one
chip (`families/chip.ts`): a `soft` adornment with the badge's type, the standalone ring when it
takes the focus. A chosen tag is `checked` (the `ring` fill), and a Rating's filled star is "on"
(`ring`) over an empty one in `line`, as a track over its rail. A drop target's drag-over is the libraries' drop outline (dashed,
`ring`), and a rejected file is `palette-danger` by its class, as an invalid field: a red stroke
with red text.

**"On" is `ring`.** On a neutral palette it is the dark neutral, on a `surface-*`
palette that palette's colour, and on a chromatic palette its deeper tone. The checked
box, the selected radio, the switch, the slider's fill and the progress bar are one
colour on every palette.

A tab's underline is `ring` too: it marks "on" on every palette.

**What the guard does not cover.** A library's own focus target (the data grid's
focused cell, the tree's `[:focus-visible>&]` row), its drag-and-drop outlines (dashed,
`ring`) and conditional hovers (`data-draggable:hover:`) are its own vocabulary
(architecture.md §2). They keep the same values (2px, `ring`) by review.

## Colour by class

There are no colour variants anywhere. A component takes the colour of the palette
class it carries or inherits. The default action palette is **`palette-neutral`**: a
near-black solid in light, a near-white one in dark, with no hue. A brand is another
palette: write one, and swap the class. Nothing in the component changes.

## Type

| role | size | weight | colour |
|---|---|---|---|
| body, a control's value | `text-sm` | normal | `contrast` on a floor, `accent` in a box |
| label (a field's name, a choice's name) | `text-sm` | `font-medium` | `accent` |
| secondary (description, caption, placeholder) | `text-sm` / `text-xs` | normal | `accent/85` (`secondary`) |
| heading (dialog title, card title, `Text.Heading`) | `text-lg` and up | `font-semibold` | `contrast` |
| badge, keyboard hint | `text-xs` | `font-medium` | by the badge's fill |
| link (`Text.Link`, `Text.Clickable`) | inherits | normal | `contrast`, underlined in `line` (`underline-offset-4`), the underline taking the text's colour on hover |
| error (`Text.Error`, `Field.Error`) | `text-xs` | normal | `palette-danger`'s `accent` |

Every size follows the typography axis (`--text-scale`).

## Icons

Icons follow the text axis. `size-icon` is the default beside `text-sm`, `size-icon-sm`
goes in a dense row, `size-icon-xs` in a badge or a check mark, and `size-icon-lg` is
for a standalone illustration. A secondary icon (a chevron, a search glass) is
`accent/85`.

## The resize handle (`handle`)

Every split view resizes from the same handle: Splitter's separator, Dockable's
splitter and Grid Layout's resize handles compose the `handle` family. The bar shows
the `ring` rule on hover, drag and focus (3px on focus); its mark is a pill — the
drawer handle's shape, shorter — centred on the rule, neutral (`accent`) at rest and
`ring` on hover, drag and focus, never on a disabled handle. The `data-handle` axis
chooses the look:

| level | at rest | on interaction |
|---|---|---|
| `line` (default) | the rule alone | the `ring` rule and the pill |
| `grip` | a faint pill (`accent` at 50%) | the pill in `ring` |
| `dots` | three dots (`accent` at 70%) | the dots in `ring` |
| `ide` | a 1px `line` seam, no gap, no mark | hover: the rule brightens (`line` towards `contrast`); drag and focus: a 3px `ring` bar over the edge |

Geometry stays each component's: Splitter's rule is a 1px `line` at rest; Dockable's
6px gap between bordered tabsets has no rule at rest, and under `ide` closes to a 1px
seam between frameless tabsets; a dashboard card's resize marks sit on its border,
keep a 40% floor while the card is hovered, and stay at every level (a card's edge has
no rule to stand in for them).

## Motion

| kind | duration |
|---|---|
| a state change (colour, border, a thumb sliding) | `duration-150` |
| a popup or menu entering and leaving | `duration-150` |
| a layer (dialog, drawer) entering and leaving | `duration-200` |
| expand and collapse (accordion, collapsible, a sidebar group) | `duration-200` |

Every duration follows the motion axis (`--motion-scale`).

A keyframe exit (`data-closed:animate-out`) holds its last frame with
`data-closed:fill-mode-forwards`, so a popup never shows again between the end of its
exit and its unmount, whatever the base (`tests/popup.test.ts`, `check:embeds`). A
starting/ending-style transition needs nothing: it keeps its ending style until
unmount (`families/layer.ts`).

## Examples

The examples are where a reader first sees the design, and they copy them verbatim. So
they follow one standard, and they show the language rather than a matrix of it.

1. **Open with a realistic use in the default look.** The example's root carries
   `palette-surface` and paints the floor (`bg-palette-base text-palette-contrast`).
   It draws no frame of its own: the docs frame is the frame. The content is something
   an app would show (a sign-in form, a settings row, an invoice list), not
   `Option 1, Option 2`. Primary actions carry `palette-neutral`, fields and choices
   carry no palette class, and nothing is coloured that an app would not colour.
2. **Show colour once, and the same way everywhere.** A component whose colour matters
   (button, badge, choices, slider, progress, tabs, …) ends with one row captioned
   `palettes`: the same element repeated, with only its `palette-*` class changed. For
   surface-tier controls (fields, choices, select, combobox) the classes are the
   `surface-*` palettes, which change only the ring and the "on" colour. Those rows sit
   last, after the realistic use. No other row changes colour.
3. **Keep the states a reader needs to use the component** (disabled, invalid, a
   loading or empty state), compact and after the realistic use. Full matrices (every
   size × every palette × every state) are review material: they live in the
   playground's scenarios, and the coherence sheet already covers them.
4. **Caption a row the same way everywhere:** `font-mono text-xs text-palette-accent/85`,
   lower case.

The docs page of a component with a `palettes` row carries the same callout under its
example, "No colour variants": the colour is the palette class, a new colour is a new
palette, and nothing in the component changes.

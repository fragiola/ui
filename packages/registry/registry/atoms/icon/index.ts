// Icon sizes by context.
//
// The problem this solves: in a real application you lose time hunting for
// another icon of the same context just to find out which size to use there.
// Size becomes a lookup, not archaeology.
//
// ─── IN MOST CASES YOU DO NOT NEED THIS ───────────────────────────────────────
// Each context already defines the icon size via CSS, through
// `[&_svg:not([class*='size-'])]:size-icon*`:
//
//   <Clickable.Button><XIcon /></Clickable.Button>              → size-icon, alone
//   <Field.Addon><SearchIcon /></Field.Addon>                   → size-icon, alone
//   <DropdownMenu.Item><CopyIcon /></DropdownMenu.Item>         → size-icon, alone
//
// The `:not([class*='size-'])` makes the default apply only when nobody
// specified a size — so passing a size class still works as an override.
//
// Use this object when you need the EXPLICIT size: a loose icon outside a
// known context, or when you deliberately want to escape the default.
//
// ─── WHY THE TEXT AXIS ────────────────────────────────────────────────────────
// `size-icon-xs` / `-sm` / `size-icon` / `-lg` (global.css) are 0.75, 0.875, 1
// and 1.5rem times `--text-scale`: icons follow `data-text`, not
// `data-density`. An icon sits beside a label and keeps its proportion to it;
// a spacing-based `size-4` would shrink in a compact subtree next to text
// that did not.
//
// ─── WHY A CLASS AND NOT A NUMBER ─────────────────────────────────────────────
// `size-icon` instead of `16`: a number requires inline `width`/`height` or a
// prop that each icon library names differently, and it does not go through
// tailwind-merge — so `cn(iconSize.addon, "size-6")` would not resolve the
// conflict. As a class, the override works (cn.ts registers the `icon` sizes
// with tailwind-merge) and the value still comes from a token.

export const iconSize = {
    /** Inside a field addon or inset. */
    addon: "size-icon",
    /** Inside a `size="md"` button (the default). */
    button: "size-icon",
    /** Inside a `size="sm"` button. */
    buttonSm: "size-icon-sm",
    /** Menu item, dropdown, select, combobox. */
    menuItem: "size-icon",
    /** Check/radio indicator inside a menu item. */
    indicator: "size-icon",
    /** A loose icon in a content block — empty state, alert. */
    standalone: "size-icon-lg",
} as const;

export type IconSize = keyof typeof iconSize;

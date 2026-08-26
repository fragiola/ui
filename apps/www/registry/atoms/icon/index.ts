// Icon sizes by context.
//
// The problem this solves: in a real application you lose time hunting for
// another icon of the same context just to find out which size to use there.
// Size becomes a lookup, not archaeology.
//
// ─── IN MOST CASES YOU DO NOT NEED THIS ───────────────────────────────────────
// Each context already defines the icon size via CSS, through
// `[&_svg:not([class*='size-'])]:size-N`:
//
//   <Clickable.Button size="sm"><XIcon /></Clickable.Button>   → size-3.5, alone
//   <Field.Addon><SearchIcon /></Field.Addon>                   → size-4, alone
//   <DropdownMenu.Item><CopyIcon /></DropdownMenu.Item>         → size-4, alone
//
// The `:not([class*='size-'])` makes the default apply only when nobody
// specified a size — so passing a size class still works as an override.
//
// Use this object when you need the EXPLICIT size: a loose icon outside a
// known context, or when you deliberately want to escape the default.
//
// ─── WHY A CLASS AND NOT A NUMBER ─────────────────────────────────────────────
// `size-4` instead of `16`: a number requires inline `width`/`height` or a
// prop that each icon library names differently, and it does not go through
// tailwind-merge — so `cn(iconSize.addon, "size-6")` would not resolve the
// conflict. As a class, the override works and the value still comes from
// Tailwind's scale.

export const iconSize = {
    /** Inside a field addon or inset. */
    addon: "size-4",
    /** Inside a `size="md"` button (the default). */
    button: "size-4",
    /** Inside a `size="sm"` button. */
    buttonSm: "size-3.5",
    /** Menu item, dropdown, select, combobox. */
    menuItem: "size-4",
    /** Check/radio indicator inside a menu item. */
    indicator: "size-4",
    /** A loose icon in a content block — empty state, alert. */
    standalone: "size-6",
} as const;

export type IconSize = keyof typeof iconSize;

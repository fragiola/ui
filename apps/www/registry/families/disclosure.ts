// Family `disclosure` — the expand/collapse pattern. Two members: trigger
// and panel. Zero variants. Shared by accordion and collapsible — two
// components with the same skeleton and different coordination.
//
// ─── TRIGGER ────────────────────────────────────────────────────────────────
// The toggle button. `group` enables chevron rotation on a child element
// (`group-data-[panel-open]:rotate-180` on the svg). Full-width, flex,
// justify-between, logical padding (ps-4 pe-3), hover on the soft palette,
// focus ring on the ring palette. `data-[disabled]` zeroes pointer events
// and opacity — the same pattern as Clickable's disabled variant.
//
// The trigger is NOT a Clickable.Button variant: it is a disclosure-specific
// layout (w-full, justify-between, chevron rotation) that the behaviour
// primitive (Accordion.Trigger / Collapsible.Trigger) wears directly. The
// primitive already provides the button semantics (aria-expanded,
// aria-controls); composing through Clickable.Button would add a layer
// without adding anything the trigger needs.
//
// ─── PANEL ──────────────────────────────────────────────────────────────────
// The animated container. `overflow-hidden` clips the content during the
// expand/collapse. Both accordion and collapsible panels emit
// `data-starting-style` / `data-ending-style` (transition status) and
// `data-open` / `data-closed` (open state). The animation uses the
// transition markers for precise enter/leave.
//
// ─── CONTENT ────────────────────────────────────────────────────────────────
// The inner padded content. `p-4 pt-0` — the top padding is zero because the
// trigger already provides the visual top boundary; the content starts
// immediately below it.
//
// ─── ZERO VARIANTS ──────────────────────────────────────────────────────────
// An accordion item and a collapsible section have the same trigger, the
// same panel, the same content. The only difference is coordination (one
// open at a time vs any number) — which is behaviour from the primitive, not
// a style variant. If a variant appeared, it would mean one of them is
// wrong; unify.

import { tv } from "tailwind-variants";

const trigger = tv({
    base: `
        group flex w-full items-center justify-between
        rounded-md ps-4 pe-3 py-3
        text-sm font-medium text-palette-contrast
        hover:bg-palette-soft
        focus-visible:outline-2 focus-visible:outline-palette-ring
        data-[disabled]:pointer-events-none data-[disabled]:opacity-50
    `,
});

const panel = tv({
    base: `
        overflow-hidden
        data-starting-style:animate-in data-starting-style:fade-in-0
        data-ending-style:animate-out data-ending-style:fade-out-0
    `,
});

const content = tv({
    base: "p-4 pt-0",
});

export const disclosure = { trigger, panel, content };

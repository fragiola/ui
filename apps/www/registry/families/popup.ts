// Family `popup` — the floating box (content).
// Origin: .cn-dropdown-menu-content, .cn-context-menu-content,
// .cn-popover-content, .cn-select-content, .cn-combobox-content in shadcn's
// style-nova.css (removed from the project after conversion).
//
// Decisions in docs/architecture.md §2 (orthogonal families) and style
// families (tv with zero variants). Drift resolved — recorded in the port
// report:
//  - min-w-32 (dropdown) vs min-w-36 (context/select/combobox/menubar)
//    → unified to min-w-36 (always — the width variant was eliminated)
//  - menubar missing data-closed:* → included (was a bug — did not animate
//    on close)
//  - padding: p-1 (menu lists) vs p-2.5 (popover block) vs none (select)
//    → p-2 always (the padding variant was eliminated); select does not
//    duplicate padding — the inner group p-1 was removed.
//  - Colour conversions: bg-popover text-popover-foreground →
//    palette-raised bg-palette-base text-palette-contrast;
//    ring-foreground/10 ring-1 → border border-palette-line
//  - cn-menu-translucent (glassmorphism) NOT included — it required
//    !important (forbidden by the rules) and is cross-cutting decoration,
//    not popup structure. See the port report.
//
// Zero variants: popup.content is tv({ base }) with no variants. p-2 and
// min-w-36 are always applied.
//
// Namespace object: a single `popup` export with the `content` member.

import { tv } from "tailwind-variants";

const content = tv({
    base: `
        palette-raised bg-palette-base text-palette-contrast
        rounded-lg border border-palette-line shadow-md
        min-w-36 p-2
        max-h-(--available-height) origin-(--transform-origin)
        overflow-x-hidden overflow-y-auto
        data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95
        data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95
        data-[side=bottom]:slide-in-from-top-2
        data-[side=left]:slide-in-from-right-2
        data-[side=right]:slide-in-from-left-2
        data-[side=top]:slide-in-from-bottom-2
        data-[side=inline-start]:slide-in-from-right-2
        rtl:data-[side=inline-start]:slide-in-from-left-2
        data-[side=inline-end]:slide-in-from-left-2
        rtl:data-[side=inline-end]:slide-in-from-right-2
        duration-100
    `,
});

export const popup = { content };

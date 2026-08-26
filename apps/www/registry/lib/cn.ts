import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// NOTE: the palette list is hardcoded on purpose. tailwind-merge needs to know
// which classes form a single "palette" group so that `cn("palette-brand",
// "palette-danger")` resolves to one (the last) rather than both. The cost of
// correct merge behaviour is that adding a palette means adding it here too.
// This list is the six core palettes only; feature palettes join it when they
// ship.
const customTwMerge = extendTailwindMerge<"palette">({
    extend: {
        classGroups: {
            palette: [
                {
                    palette: [
                        "surface",
                        "raised",
                        "brand",
                        "success",
                        "warning",
                        "danger",
                    ],
                },
            ],
        },
    },
});

export function cn(...inputs: ClassValue[]) {
    return customTwMerge(clsx(inputs));
}

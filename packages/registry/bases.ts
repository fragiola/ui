import { existsSync } from "node:fs";
import path from "node:path";

// The bases: the primitive libraries the registry's components are built on,
// as shadcn/ui offers Base UI, Radix and React Aria (docs/architecture.md,
// "Bases"). Fragiola has one style, so the base is the registry's only
// dimension.
//
// A file that imports a primitive library is authored once per base, at
// `registry/bases/<base>/<its path>` (`registry/bases/base/ui/dialog.tsx`).
// Every other file is shared and stays at `registry/<its path>`. Sources,
// registry.json and the built items name a file by its logical path
// (`registry/ui/dialog.tsx`); `resolveBaseFile` finds the base's copy.
//
// The UI adapts to each base: a base file differs from its twins only in the
// primitive wiring (imports, prop and type mapping), never in classes,
// families or `data-slot` names, and the base library is never changed to
// match another (tests/bases.test.ts holds the parity).
//
// Runs with Node's own type stripping (the build, the smoke): erasable
// syntax only.

export type Base = {
    /** The base's name: its folder under registry/bases/ and its registry path. */
    name: string;
    title: string;
    /**
     * The npm packages an item gets when one of its files is base-dependent,
     * written as an item's `dependencies` entry (an ecosystem package carries
     * its range, scripts/dependencies.ts).
     */
    dependencies: string[];
    /** The default base is served at the registry's root (`r/`). */
    default?: true;
};

export const BASES: Base[] = [
    {
        name: "primitives",
        title: "Fragiola Primitives",
        dependencies: ["@fragiola/primitives-react@0.2.0"],
        default: true,
    },
    {
        name: "base",
        title: "Base UI",
        dependencies: ["@base-ui/react"],
    },
];

export const DEFAULT_BASE: Base = BASES.find((base) => base.default) as Base;

/** Where every base's sources live, relative to the registry package. */
export const BASES_DIR = "registry/bases";

export function findBase(name: string): Base {
    const base = BASES.find((candidate) => candidate.name === name);
    if (!base) {
        throw new Error(
            `Unknown base "${name}". Bases: ${BASES.map((b) => b.name).join(", ")}.`,
        );
    }
    return base;
}

/** The base selected by FRAGIOLA_BASE, or the default one. */
export function baseFromEnv(env: Record<string, string | undefined>): Base {
    const name = env.FRAGIOLA_BASE;
    return name ? findBase(name) : DEFAULT_BASE;
}

/** Where a base's output lands under the registry's output: the default at the root. */
export function baseOutputDir(base: Base): string {
    return base.default ? "" : base.name;
}

/**
 * A logical path (`registry/ui/dialog.tsx`, relative to the registry package)
 * to the file the base builds from: its own copy when it has one, else the
 * shared file.
 */
export function resolveBaseFile(
    root: string,
    base: Base,
    logicalPath: string,
): string {
    const own = baseFilePath(root, base, logicalPath);
    return existsSync(own) ? own : path.join(root, logicalPath);
}

/** The base's own copy of a logical path, whether or not it exists. */
export function baseFilePath(
    root: string,
    base: Base,
    logicalPath: string,
): string {
    const rest = path.relative("registry", logicalPath);
    return path.join(root, BASES_DIR, base.name, rest);
}

// ─── Primitives-backed shared files ─────────────────────────────────────────
// A component Base UI also has is a per-base file pair (above). A component
// only Fragiola Primitives has is ONE shared file that imports
// `@fragiola/primitives-react` on every base, the way shadcn's Calendar uses
// react-day-picker on every base, so every base offers the same catalog.
// Its item gets `PRIMITIVES_BACKED_DEPENDENCIES` on every base (the build).
//
// The list is explicit and only these files may import the package outside
// the primitives base (tests/bases.test.ts). A component entry names the
// Fragiola Primitives entry it wraps (`segmented-control`), and the guard
// refuses it when Base UI ships an entry of that name: then the component is
// a per-base pair, not an exception.

export type PrimitivesBackedFile = {
    /** The shared file's logical path (`registry/ui/segmented-control.tsx`). */
    file: string;
    /** The `@fragiola/primitives-react/<entry>` it wraps; none for the bridge. */
    entry?: string;
    /** Why it is shared and primitives-backed. */
    reason: string;
};

export const PRIMITIVES_BACKED: PrimitivesBackedFile[] = [
    {
        file: "registry/lib/primitives-backed.tsx",
        reason: "the bridge: carries the base's reading direction into the primitives-backed components, and types their props alike on every base",
    },
    {
        file: "registry/ui/segmented-control.tsx",
        entry: "segmented-control",
        reason: "Base UI has no segmented control",
    },
    {
        file: "registry/ui/password-input.tsx",
        entry: "password-input",
        reason: "Base UI has no password input",
    },
    {
        file: "registry/ui/search-field.tsx",
        entry: "search-field",
        reason: "Base UI has no search field",
    },
    {
        file: "registry/ui/calendar.tsx",
        entry: "calendar",
        reason: "Base UI has no calendar",
    },
    {
        file: "registry/ui/range-calendar.tsx",
        entry: "range-calendar",
        reason: "Base UI has no range calendar",
    },
    {
        file: "registry/ui/multiple-calendar.tsx",
        entry: "multiple-calendar",
        reason: "Base UI has no multiple-date calendar",
    },
    {
        file: "registry/ui/month-calendar.tsx",
        entry: "month-calendar",
        reason: "Base UI has no month calendar",
    },
    {
        file: "registry/ui/year-calendar.tsx",
        entry: "year-calendar",
        reason: "Base UI has no year calendar",
    },
    {
        file: "registry/ui/month-range-calendar.tsx",
        entry: "month-range-calendar",
        reason: "Base UI has no month range calendar",
    },
    {
        file: "registry/ui/year-range-calendar.tsx",
        entry: "year-range-calendar",
        reason: "Base UI has no year range calendar",
    },
    {
        file: "registry/ui/calendar-preset.tsx",
        entry: "calendar-preset",
        reason: "Base UI has no calendar presets",
    },
    {
        file: "registry/ui/calendar-view.tsx",
        entry: "calendar-view",
        reason: "Base UI has no calendar views",
    },
    {
        file: "registry/ui/date-field.tsx",
        entry: "date-field",
        reason: "Base UI has no date field",
    },
    {
        file: "registry/ui/date-range-field.tsx",
        entry: "date-range-field",
        reason: "Base UI has no date range field",
    },
    {
        file: "registry/ui/time-field.tsx",
        entry: "time-field",
        reason: "Base UI has no time field",
    },
    {
        file: "registry/ui/time-range-field.tsx",
        entry: "time-range-field",
        reason: "Base UI has no time range field",
    },
    {
        file: "registry/ui/date-picker.tsx",
        entry: "date-picker",
        reason: "Base UI has no date picker",
    },
    {
        file: "registry/ui/date-picker-input.tsx",
        entry: "date-picker-input",
        reason: "Base UI has no typed date picker",
    },
    {
        file: "registry/ui/date-range-picker.tsx",
        entry: "date-range-picker",
        reason: "Base UI has no date range picker",
    },
    {
        file: "registry/ui/date-range-picker-input.tsx",
        entry: "date-range-picker-input",
        reason: "Base UI has no typed date range picker",
    },
    {
        file: "registry/ui/month-picker.tsx",
        entry: "month-picker",
        reason: "Base UI has no month picker",
    },
    {
        file: "registry/ui/month-range-picker.tsx",
        entry: "month-range-picker",
        reason: "Base UI has no month range picker",
    },
    {
        file: "registry/ui/year-picker.tsx",
        entry: "year-picker",
        reason: "Base UI has no year picker",
    },
    {
        file: "registry/ui/year-range-picker.tsx",
        entry: "year-range-picker",
        reason: "Base UI has no year range picker",
    },
    {
        file: "registry/ui/command.tsx",
        entry: "command",
        reason: "Base UI has no command palette",
    },
    {
        file: "registry/ui/command-virtual.tsx",
        entry: "command-virtual",
        reason: "Base UI has no command palette, nor a virtual one",
    },
    {
        file: "registry/ui/listbox.tsx",
        entry: "listbox",
        reason: "Base UI has no listbox",
    },
    {
        file: "registry/ui/listbox-virtual.tsx",
        entry: "listbox-virtual",
        reason: "Base UI has no listbox, nor a virtual one",
    },
    {
        file: "registry/ui/cascade-select.tsx",
        entry: "cascade-select",
        reason: "Base UI has no cascade select",
    },
    {
        file: "registry/ui/select-virtual.tsx",
        entry: "select-virtual",
        reason: "Base UI's Select has no virtual list: a virtual select is Fragiola Primitives' Select on every base, beside the base's own",
    },
    {
        file: "registry/ui/combobox-virtual.tsx",
        entry: "combobox-virtual",
        reason: "Base UI's Combobox virtualizes only through an external virtualizer (`virtualized`): a virtual combobox is Fragiola Primitives' Combobox on every base, beside the base's own",
    },
    {
        file: "registry/ui/autocomplete-virtual.tsx",
        entry: "autocomplete-virtual",
        reason: "Base UI's Autocomplete virtualizes only through an external virtualizer (`virtualized`): a virtual autocomplete is Fragiola Primitives' Autocomplete on every base, beside the base's own",
    },
    {
        file: "registry/ui/steps.tsx",
        entry: "steps",
        reason: "Base UI has no steps",
    },
    {
        file: "registry/ui/carousel.tsx",
        entry: "carousel",
        reason: "Base UI has no carousel",
    },
    {
        file: "registry/ui/link.tsx",
        entry: "link",
        reason: "Base UI has no link with current and disabled states",
    },
    {
        file: "registry/ui/color-area.tsx",
        entry: "color-area",
        reason: "Base UI has no color area",
    },
    {
        file: "registry/ui/color-wheel.tsx",
        entry: "color-wheel",
        reason: "Base UI has no color wheel",
    },
    {
        file: "registry/ui/color-slider.tsx",
        entry: "color-slider",
        reason: "Base UI has no color slider: its Slider edits a number, not a color's channel",
    },
    {
        file: "registry/ui/color-field.tsx",
        entry: "color-field",
        reason: "Base UI has no color field",
    },
    {
        file: "registry/ui/color-swatch.tsx",
        entry: "color-swatch",
        reason: "Base UI has no color swatch",
    },
    {
        file: "registry/ui/color-swatch-picker.tsx",
        entry: "color-swatch-picker",
        reason: "Base UI has no color swatch picker",
    },
    {
        file: "registry/ui/color-picker.tsx",
        entry: "color-picker",
        reason: "Base UI has no color picker",
    },
    {
        file: "registry/ui/color-picker-popover.tsx",
        entry: "color-picker-popover",
        reason: "Base UI has no color picker: its popup is Fragiola Primitives' opt-in popover entry",
    },
    {
        file: "registry/ui/tags-input.tsx",
        entry: "tags-input",
        reason: "Base UI has no tags input",
    },
    {
        file: "registry/ui/tag-group.tsx",
        entry: "tag-group",
        reason: "Base UI has no tag group",
    },
    {
        file: "registry/ui/editable.tsx",
        entry: "editable",
        reason: "Base UI has no editable (inline edit)",
    },
    {
        file: "registry/ui/rating.tsx",
        entry: "rating",
        reason: "Base UI has no rating",
    },
];

/** What a primitives-backed item depends on, on every base. */
export const PRIMITIVES_BACKED_DEPENDENCIES: string[] =
    findBase("primitives").dependencies;

/** Whether a logical path is a primitives-backed shared file. */
export function isPrimitivesBacked(logicalPath: string): boolean {
    return PRIMITIVES_BACKED.some((entry) => entry.file === logicalPath);
}

/** Every package any base brings (the build swaps them per base). */
export const BASE_PACKAGES: Set<string> = new Set(
    BASES.flatMap((base) =>
        base.dependencies.map((dep) => {
            const at = dep.indexOf("@", dep.startsWith("@") ? 1 : 0);
            return at > 0 ? dep.slice(0, at) : dep;
        }),
    ),
);

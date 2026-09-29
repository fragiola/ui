import { Clickable } from "#/components/atoms/clickable";
import { LEVELS, THEMES } from "../../../examples/gallery.ts";
import type { Entry } from "./catalog";
import { DENSITIES, DIRECTIONS, type View } from "./view";

type ToolbarProps = {
    view: View;
    entry: Entry | undefined;
    onChange: (view: View) => void;
};

const DIRECTION_LABELS = { ltr: "LTR", rtl: "RTL" } as const;
const DENSITY_LABELS = {
    default: "Default",
    compact: "Compact",
    spacious: "Spacious",
} as const;

export function Toolbar({ view, entry, onChange }: ToolbarProps) {
    const level = LEVELS.find((l) => l.id === entry?.level);
    return (
        <header className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-palette-line px-4 py-2">
            <div className="me-auto flex min-w-0 items-baseline gap-2">
                <span className="truncate text-sm font-semibold">
                    {entry?.title ?? "Playground"}
                </span>
                {entry && level && (
                    <span className="text-xs text-palette-accent/85">
                        {entry.kind} · {level.title}
                    </span>
                )}
            </div>
            <Choice
                label="Theme"
                options={THEMES.map((t) => ({ value: t.name, label: t.title }))}
                value={view.theme}
                onChange={(theme) => onChange({ ...view, theme })}
            />
            <Choice
                label="Direction"
                options={DIRECTIONS.map((d) => ({
                    value: d,
                    label: DIRECTION_LABELS[d],
                }))}
                value={view.dir}
                onChange={(dir) => onChange({ ...view, dir })}
            />
            <Choice
                label="Density"
                options={DENSITIES.map((d) => ({
                    value: d,
                    label: DENSITY_LABELS[d],
                }))}
                value={view.density}
                onChange={(density) => onChange({ ...view, density })}
            />
            <Clickable.Button
                variant="outline"
                size="sm"
                aria-pressed={view.code}
                className={PRESSED}
                onClick={() => onChange({ ...view, code: !view.code })}
            >
                Source
            </Clickable.Button>
        </header>
    );
}

const PRESSED =
    "aria-pressed:bg-palette-soft aria-pressed:text-palette-contrast";

type ChoiceProps<T extends string> = {
    label: string;
    options: { value: T; label: string }[];
    value: T;
    onChange: (value: T) => void;
};

// One of a few values, as a group of toggle buttons: every option in view,
// one click to switch — the point of a toolbar you flip while watching.
function Choice<T extends string>({
    label,
    options,
    value,
    onChange,
}: ChoiceProps<T>) {
    return (
        <fieldset className="flex items-center gap-1">
            <legend className="sr-only">{label}</legend>
            <span aria-hidden className="me-1 text-xs text-palette-accent/85">
                {label}
            </span>
            {options.map((option) => (
                <Clickable.Button
                    key={option.value}
                    variant="ghost"
                    size="sm"
                    aria-pressed={option.value === value}
                    className={PRESSED}
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </Clickable.Button>
            ))}
        </fieldset>
    );
}

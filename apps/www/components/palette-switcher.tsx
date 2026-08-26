"use client";

export type PreviewPalette =
    | "surface"
    | "raised"
    | "brand"
    | "success"
    | "warning"
    | "danger";

const palettes: PreviewPalette[] = [
    "surface",
    "raised",
    "brand",
    "success",
    "warning",
    "danger",
];

type PaletteSwitcherProps = {
    active: PreviewPalette;
    onChange: (p: PreviewPalette) => void;
};

export function PaletteSwitcher({ active, onChange }: PaletteSwitcherProps) {
    return (
        <div className="flex items-center gap-1">
            {palettes.map((p) => (
                <button
                    key={p}
                    type="button"
                    onClick={() => onChange(p)}
                    className={`px-2 py-1 text-xs rounded-sm border transition-colors ${
                        active === p
                            ? "border-palette-ring text-palette-contrast font-semibold"
                            : "border-palette-line text-palette-accent/85 hover:text-palette-contrast"
                    }`}
                >
                    {p}
                </button>
            ))}
        </div>
    );
}

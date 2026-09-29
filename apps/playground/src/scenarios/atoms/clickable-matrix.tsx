import { PlusIcon } from "lucide-react";
import { Clickable } from "#/components/atoms/clickable";

// Every variant × size × shape of the button surface, in every palette a
// button can wear, plus disabled. The docs example names the axes; this is
// the full grid, for spotting the one cell that drifted.

const PALETTES = [
    "surface",
    "raised",
    "blue",
    "purple",
    "green",
    "orange",
    "rose",
    "danger",
] as const;

const VARIANTS = ["solid", "outline", "ghost", "icon"] as const;
const SIZES = ["xs", "sm", "md"] as const;

export default function ClickableMatrix() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            {PALETTES.map((palette) => (
                <div key={palette} className="flex flex-col gap-2">
                    <span className="font-mono text-xs text-palette-accent/85">
                        palette-{palette}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                        {VARIANTS.flatMap((variant) =>
                            SIZES.map((size) => (
                                <Clickable.Button
                                    key={`${variant}-${size}`}
                                    className={`palette-${palette}`}
                                    variant={variant}
                                    size={size}
                                >
                                    {variant} {size}
                                </Clickable.Button>
                            )),
                        )}
                        {SIZES.map((size) => (
                            <Clickable.Button
                                key={`square-${size}`}
                                className={`palette-${palette}`}
                                variant="icon"
                                size={size}
                                shape="square"
                                aria-label={`Add, ${size}`}
                            >
                                <PlusIcon />
                            </Clickable.Button>
                        ))}
                        {VARIANTS.map((variant) => (
                            <Clickable.Button
                                key={`disabled-${variant}`}
                                className={`palette-${palette}`}
                                variant={variant}
                                disabled
                            >
                                {variant} disabled
                            </Clickable.Button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

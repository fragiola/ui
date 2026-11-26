import { field } from "#/components/families/field";
import { Combobox } from "#/components/ui/combobox";
import { TagGroup } from "#/components/ui/tag-group";
import { TagsInput } from "#/components/ui/tags-input";

// One chip, three components (Epic #172): a Combobox's chosen items, a Tags
// Input's tags and a Tag Group's tags side by side, on the neutral surface
// and each surface-ring palette. They compose the chip family, so they must
// read as the same chip; only a chosen Tag Group tag is `checked`. Focus a
// chip (Backspace in the tags input, Tab into the tag group) to compare the
// rings, and double-click a keyword to see the in-place edit.

const PALETTES = [
    "surface",
    "surface-blue",
    "surface-purple",
    "surface-green",
    "surface-orange",
    "surface-rose",
] as const;

const FRAMEWORKS = ["React", "Vue", "Svelte"];

export default function Chips() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            {PALETTES.map((palette) => (
                <div
                    key={palette}
                    className={`palette-${palette} flex flex-wrap items-center gap-6`}
                >
                    <span className="w-28 font-mono text-xs text-palette-accent/85">
                        palette-{palette}
                    </span>
                    <Combobox.Root
                        multiple
                        items={FRAMEWORKS}
                        defaultValue={["React", "Vue"]}
                    >
                        <Combobox.Chips
                            className={`${field.row()} w-64 flex-row items-center gap-1.5 px-3 py-2`}
                        >
                            <Combobox.Value>
                                {(values: string[]) => (
                                    <>
                                        {values.map((value) => (
                                            <Combobox.Chip key={value}>
                                                {value}
                                                <Combobox.ChipRemove
                                                    aria-label={`Remove ${value}`}
                                                />
                                            </Combobox.Chip>
                                        ))}
                                        <Combobox.Input
                                            aria-label={`Frameworks, ${palette}`}
                                        />
                                    </>
                                )}
                            </Combobox.Value>
                        </Combobox.Chips>
                    </Combobox.Root>
                    <TagsInput.Template.Simple
                        aria-label={`Keywords, ${palette}`}
                        defaultValue={["React", "Vue"]}
                        editable
                        className="w-64"
                    />
                    <TagGroup.Template.Simple
                        aria-label={`Topics, ${palette}`}
                        selectionMode="single"
                        defaultValue={["Vue"]}
                        tags={["React", "Vue"]}
                        onRemove={() => {}}
                    />
                </div>
            ))}
        </div>
    );
}

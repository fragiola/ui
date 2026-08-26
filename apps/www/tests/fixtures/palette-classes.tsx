// Test fixture: uses every palette utility class and custom variant so that
// Tailwind v4 generates them in the compiled CSS. This file is scanned by
// @source in the compile test's input CSS.

export function PaletteClassFixture() {
    return (
        <div>
            {/* All six roles × bg/text/border */}
            <div className="bg-palette-base bg-palette-soft bg-palette-line bg-palette-contrast bg-palette-accent bg-palette-ring" />
            <div className="text-palette-base text-palette-soft text-palette-line text-palette-contrast text-palette-accent text-palette-ring" />
            <div className="border-palette-base border-palette-soft border-palette-line border-palette-contrast border-palette-accent border-palette-ring" />

            {/* Secondary text */}
            <div className="text-palette-accent/85" />
            <div className="text-palette-accent/70" />

            {/* Custom variants */}
            <div className="highlighted:bg-palette-soft highlighted:text-palette-contrast" />
            <div className="field-focus:border-palette-ring field-focus:ring-palette-ring" />

            {/* Palette class declarations */}
            <div className="palette-surface palette-raised palette-brand palette-success palette-warning palette-danger" />

            {/* Derived tokens */}
            <div className="bg-palette-base-hover" />

            {/* Height control */}
            <div className="h-control" />

            {/* Radius */}
            <div className="rounded-sm" />
        </div>
    );
}

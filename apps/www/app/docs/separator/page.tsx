import { InstallCommand } from "@/components/install-command";
import { ComponentPreview } from "@/components/preview";

export default function SeparatorPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Separator
                </h1>
                <p className="text-sm text-palette-accent/85">
                    A visual divider. Uses Base UI's primitive for the ARIA. No
                    family — the <code>menu</code> family has a separator
                    member, but that one carries the menu's spacing. This
                    separator is generic: <code>bg-palette-line</code> (a role)
                    + orientation from the primitive.
                </p>
            </div>
            <InstallCommand name="separator" />
            <ComponentPreview name="separator-demo" />
        </div>
    );
}

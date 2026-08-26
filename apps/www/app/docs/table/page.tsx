import TableDemo from "#/examples/table-demo";
import { ComponentPreviewServer } from "@/components/component-preview-server";
import { InstallCommand } from "@/components/install-command";

export default function TablePage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Table
                </h1>
                <p className="text-sm text-palette-accent/85">
                    Semantic HTML with palette roles. No primitive, no family.
                    The grid is <code>border-palette-line</code>; the header and
                    hover are <code>bg-palette-soft</code>; header text is{" "}
                    <code>text-palette-contrast</code>; body text is{" "}
                    <code>text-palette-accent/85</code>.
                </p>
            </div>
            <InstallCommand name="table" />
            <ComponentPreviewServer name="table-demo">
                <TableDemo />
            </ComponentPreviewServer>
        </div>
    );
}

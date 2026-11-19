import { useState } from "react";
import { Splitter } from "#/components/ui/splitter";

// Splitter.Template.Simple — a separator with its grip between the panels
// it is given. Above: three panels, one rendered conditionally (the button
// toggles it; the separators follow), and a nested template. Below: the
// same template under a surface-ring and a chromatic palette, passed as its
// one className. The panels take generated ids: three layouts share the
// page, and a panel id is its DOM id. Theme, direction and the axes come from the toolbar.
export default function SplitterTemplateSimple() {
    const [preview, setPreview] = useState(true);
    return (
        <div className="flex w-[48rem] max-w-full flex-col gap-4">
            <button
                type="button"
                className="self-start rounded-md border border-palette-line px-3 py-1"
                onClick={() => setPreview((shown) => !shown)}
            >
                {preview ? "Hide" : "Show"} the preview
            </button>
            <Layout
                preview={preview}
                className="h-64 rounded-lg border border-palette-line"
            />
            <div className="grid grid-cols-2 gap-4">
                <Layout className="h-40 rounded-lg border border-palette-line palette-surface-blue" />
                <Layout className="h-40 rounded-lg border border-palette-line palette-green" />
            </div>
        </div>
    );
}

function Layout({
    preview = false,
    className,
}: {
    preview?: boolean;
    className: string;
}) {
    return (
        <Splitter.Template.Simple className={`overflow-hidden ${className}`}>
            <Splitter.Panel defaultSize="25%" minSize="15%" collapsible>
                <p className="p-3">Files</p>
            </Splitter.Panel>
            <Splitter.Panel minSize="30%">
                <Splitter.Template.Simple
                    orientation="vertical"
                    className="h-full"
                >
                    <Splitter.Panel>
                        <p className="p-3">Editor</p>
                    </Splitter.Panel>
                    <Splitter.Panel defaultSize="35%" collapsible>
                        <p className="p-3">Terminal</p>
                    </Splitter.Panel>
                </Splitter.Template.Simple>
            </Splitter.Panel>
            {preview && (
                <Splitter.Panel defaultSize="25%" minSize="15%">
                    <p className="p-3">Preview</p>
                </Splitter.Panel>
            )}
        </Splitter.Template.Simple>
    );
}

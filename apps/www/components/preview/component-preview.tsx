import { readFile } from "node:fs/promises";
import path from "node:path";
import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc";

// ComponentPreview — a single-prop server component that resolves both the
// module and its source from the example name.
//
//   <ComponentPreview name="clickable-demo" />
//
// The frame is painted from roles and carries no palette of its own, so it
// does not compete with the palettes inside it. The code panel uses
// Fumadocs' Shiki-highlighted ServerCodeBlock (server-side highlighting,
// built-in copy button). The panel is collapsed by default via <details>.
//
// The dynamic import uses a template literal so the bundler can statically
// analyse the examples directory. If a bundler cannot resolve it, a generated
// map is the fallback — but Turbopack handles this pattern.

type ComponentPreviewProps = {
    name: string;
};

export async function ComponentPreview({ name }: ComponentPreviewProps) {
    // Resolve the module from the name.
    const mod = await import(`@/examples/${name}`);
    const Demo = mod.default;

    // Read the source from the same name.
    const filePath = path.join(process.cwd(), "examples", `${name}.tsx`);
    let source = "";
    try {
        source = await readFile(filePath, "utf-8");
    } catch {
        source = `// Could not read source for example "${name}"`;
    }

    return (
        <div className="my-6 rounded-md border border-palette-line overflow-hidden bg-palette-base">
            {/* Preview surface — no palette on the frame, the example
                brings its own. */}
            <div className="p-8 flex items-center justify-center min-h-32">
                <Demo />
            </div>
            {/* Collapsed-by-default code panel. <details> avoids a client
                component for the toggle — the only interactivity is
                show/hide, which the platform provides natively. */}
            <details className="border-t border-palette-line">
                <summary className="cursor-pointer select-none px-4 py-2 text-xs text-palette-accent/85 hover:text-palette-contrast transition-colors">
                    Show code
                </summary>
                <div className="border-t border-palette-line">
                    <ServerCodeBlock
                        code={source}
                        lang="tsx"
                        codeblock={{ allowCopy: true }}
                    />
                </div>
            </details>
        </div>
    );
}

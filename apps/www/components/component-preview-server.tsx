import { readFile } from "node:fs/promises";
import path from "node:path";
import { ComponentPreview } from "@/components/component-preview";

type ComponentPreviewServerProps = {
    /** Name of the example file under registry/examples/ (without extension). */
    name: string;
    /** The rendered demo element. */
    children: React.ReactNode;
};

export async function ComponentPreviewServer({
    name,
    children,
}: ComponentPreviewServerProps) {
    const filePath = path.join(
        process.cwd(),
        "registry",
        "examples",
        `${name}.tsx`,
    );
    let source = "";
    try {
        source = await readFile(filePath, "utf-8");
    } catch {
        source = `// Could not read source for example "${name}"`;
    }

    return <ComponentPreview source={source}>{children}</ComponentPreview>;
}

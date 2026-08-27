import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { InstallCommand } from "@/components/install-command";

// The MDX component registry. Pages use these without importing — 38 files
// each importing three components is the navItems problem in another shape.
//
// InstallCommand is registered here so component pages can write
// <InstallCommand name="clickable" /> from frontmatter-driven MDX. The
// preview component (ComponentPreview) is registered in the next Issue; for
// now the placeholder keeps the registration point stable.

export function getMDXComponents(components?: MDXComponents) {
    return {
        ...defaultMdxComponents,
        InstallCommand,
        ...components,
    } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { InstallCommand } from "@/components/install-command";
import { ComponentPreview } from "@/components/preview";

// The MDX component registry. Pages use these without importing — 38 files
// each importing three components is the navItems problem in another shape.
//
// ComponentPreview: single-prop server component, resolves the demo module
//   and source from the name.
// InstallCommand: the shadcn CLI command for a registry item.

export function getMDXComponents(components?: MDXComponents) {
    return {
        ...defaultMdxComponents,
        InstallCommand,
        ComponentPreview,
        ...components,
    } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

import { getMDXComponents } from "@/components/mdx";

// Next.js convention: useMDXComponents is called by the MDX runtime to
// resolve components. Delegates to the Fumadocs-aware registry in
// components/mdx.tsx.

export function useMDXComponents() {
    return getMDXComponents();
}

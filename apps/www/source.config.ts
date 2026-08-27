import { defineConfig, defineDocs } from "fumadocs-mdx/config";

// Content source: the docs tree under content/docs. The frontmatter schema is
// extended with two fields the component pages need — `registry` (the registry
// item name, so a page can render its install command from frontmatter) and
// `demo` (the default example name for the page's primary preview). Adding
// them now avoids re-touching 38 files later.

export const docs = defineDocs({
    dir: "content/docs",
});

export default defineConfig({
    mdxOptions: {
        providerImportSource: "@/components/mdx",
    },
});

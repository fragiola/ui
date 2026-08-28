import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

// Shared options for the docs and home layouts: nav title, header links and
// the GitHub link. Anything both layouts need lives here so it is declared
// once — both HomeLayout and DocsLayout spread baseOptions(), so `links` is
// declared here and never passed again at a call site.

/** The repository. Declared once; the footer links to the same place. */
export const GITHUB_URL = "https://github.com/fragiola/ui";

export function baseOptions(): Pick<
    BaseLayoutProps,
    "nav" | "githubUrl" | "links"
> {
    return {
        nav: {
            title: "Fragiola UI",
            // The wordmark returns home. GitHub has its own slot in the
            // navbar (githubUrl) and does not need to steal this one.
            url: "/",
        },
        links: [
            {
                text: "Documentation",
                url: "/docs",
                // Stays active for every page under /docs.
                active: "nested-url",
            },
        ],
        githubUrl: GITHUB_URL,
    };
}

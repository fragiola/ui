import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

// Shared options for the docs and home layouts: nav title and GitHub link.
// Anything both layouts need lives here so it is declared once.

export function baseOptions(): Pick<BaseLayoutProps, "nav" | "githubUrl"> {
    return {
        nav: {
            title: "Fragiola UI",
            url: "https://github.com/fragiola/ui",
        },
        githubUrl: "https://github.com/fragiola/ui",
    };
}

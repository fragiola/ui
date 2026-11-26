import { CONTRACT, type ProjectJson } from "./validate.ts";

// <out>/project.json (contract §2).
export const PROJECT: ProjectJson = {
    contract: CONTRACT,
    slug: "ui",
    title: "Fragiola UI",
    description:
        "A copy-paste component library on Fragiola Primitives (or Base UI) and Tailwind v4. Six colour roles, any number of palettes.",
    frameworks: ["react"],
    defaultFramework: "react",
    registry: { namespace: "@fragiola" },
    repository: "https://github.com/fragiola/ui",
    // v1.2: topics for the landing's structured data only, never shown.
    keywords: [
        "react components",
        "design system",
        "shadcn registry",
        "fragiola primitives",
        "base ui",
        "tailwind css",
        "theming",
    ],
    // v1.6: the theme builder, full-page at /ui/create/
    // (examples/react/create.html).
    create: {
        title: "Create",
        description:
            "Build your theme: pick a colour and the five design axes, see dozens of components follow live, then copy the CSS.",
        framework: "react",
    },
};

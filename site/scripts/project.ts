import { CONTRACT, type ProjectJson } from "./validate.ts";

// <out>/project.json (contract §2).
export const PROJECT: ProjectJson = {
    contract: CONTRACT,
    slug: "ui",
    title: "Fragiola UI",
    description:
        "A copy-paste component library built on Base UI and Tailwind v4. Six colour roles, any number of palettes.",
    frameworks: ["react"],
    defaultFramework: "react",
    registry: { namespace: "@fragiola" },
    repository: "https://github.com/fragiola/ui",
    // v1.2: topics for the landing's structured data only, never shown.
    keywords: [
        "react components",
        "design system",
        "shadcn registry",
        "base ui",
        "tailwind css",
        "theming",
    ],
};
